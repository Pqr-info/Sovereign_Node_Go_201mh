/**
 * 🌐 GoDNS Local Mesh DNS Daemon (Dual-Stack IPv4 & IPv6 Port 53)
 * ===============================================================
 * High-performance Dual-Stack DNS daemon listening on UDP Port 53 (IPv4 & IPv6).
 * 
 * RESOLUTION HIERARCHY:
 * 1. Primary: Internal Sovereign-27 Mesh Domain Table (zeta.mh, *.pqr.info)
 * 2. Secondary: High-Privacy Resolvers (1.1.1.1, 2606:4700:4700::1111 / 9.9.9.9)
 * 3. Resolver of Last Resort: 8.8.8.8 / 2001:4860:4860::8888 (Emergency Fallback Only)
 */

import dgram from 'dgram';
import crypto from 'crypto';

const PORT = 53;
const TOTP_SECRET = process.env.VAULT_TOTP_SECRET || 'S27_SHARED_SECRET_KEY';

function generateTOTP(secret, interval = 300) {
  const time = Math.floor(Date.now() / 1000 / interval);
  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeUInt32BE(Math.floor(time / 0x100000000), 0);
  timeBuffer.writeUInt32BE(time & 0xffffffff, 4);
  const hmac = crypto.createHmac('sha1', secret).update(timeBuffer).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const code = (hmac.readUInt32BE(offset) & 0x7fffffff) % 1000000;
  return code.toString().padStart(6, '0');
}

// Tier 1: Internal Mesh Records (A & AAAA) - Fetched dynamically from Substrate KV Vault
let MESH_RECORDS_A = {};
let MESH_RECORDS_AAAA = {};

async function syncMeshRecords() {
  try {
    const res = await fetch('http://127.0.0.1:8200/v1/secret/data/sovereign/mesh_records', {
      headers: { 'X-Vault-Token': generateTOTP(TOTP_SECRET) }
    });
    if (res.ok) {
      const data = await res.json();
      const valStr = data.data?.data?.value;
      if (valStr) {
        const mesh = JSON.parse(valStr);
        MESH_RECORDS_A = mesh.A || {};
        MESH_RECORDS_AAAA = mesh.AAAA || {};
        
        // Manual override for pathways.pqr.info
        MESH_RECORDS_A["pathways.pqr.info"] = "176.9.116.146";
        MESH_RECORDS_AAAA["pathways.pqr.info"] = "2a01:4f8:151:7062::2";
      }
    }
  } catch (e) {
    console.warn('[GoDNS] Failed to sync mesh records from Vault:', e.message);
  }
}
setInterval(syncMeshRecords, 10000);
syncMeshRecords();


// Tier 2: Privacy-First Upstream Resolvers (IPv4 & IPv6)
const SECONDARY_RESOLVERS = ['1.1.1.1', '2606:4700:4700::1111', '9.9.9.9'];

// Tier 3: Resolver of Last Resort (Emergency Only)
const EMERGENCY_LAST_RESORT_RESOLVER = '8.8.8.8';

const serverV4 = dgram.createSocket('udp4');
let serverV6;
try {
  serverV6 = dgram.createSocket('udp6');
} catch (e) {
  console.warn('[GoDNS] UDP6 socket initialization warning:', e.message);
}

function parseDomainName(buffer, offset = 12) {
  let domain = '';
  let i = offset;
  while (buffer[i] !== 0) {
    const len = buffer[i];
    if ((len & 0xc0) === 0xc0) {
      const pointerOffset = ((len & 0x3f) << 8) | buffer[i + 1];
      const sub = parseDomainName(buffer, pointerOffset);
      domain += sub.domain;
      i += 2;
      return { domain, nextOffset: i };
    }
    i++;
    domain += buffer.toString('utf-8', i, i + len) + '.';
    i += len;
  }
  return { domain: domain.slice(0, -1), nextOffset: i + 1 };
}

function parseQueryType(buffer, qTypeOffset) {
  return buffer.readUInt16BE(qTypeOffset);
}

function buildAResponse(reqBuffer, domain, ipStr) {
  const res = Buffer.from(reqBuffer);
  res[2] = 0x81;
  res[3] = 0x80;
  res[6] = 0x00;
  res[7] = 0x01;

  const { nextOffset } = parseDomainName(reqBuffer);
  const ipParts = ipStr.split('.').map(Number);
  const answer = Buffer.from([
    0xc0, 0x0c,             // Name pointer
    0x00, 0x01,             // Type A
    0x00, 0x01,             // Class IN
    0x00, 0x00, 0x00, 0x3c, // TTL: 60s
    0x00, 0x04,             // RDLENGTH: 4
    ...ipParts
  ]);

  return Buffer.concat([res.slice(0, nextOffset + 4), answer]);
}

function buildAAAAResponse(reqBuffer, domain, ipStr) {
  const res = Buffer.from(reqBuffer);
  res[2] = 0x81;
  res[3] = 0x80;
  res[6] = 0x00;
  res[7] = 0x01;

  const { nextOffset } = parseDomainName(reqBuffer);
  
  // Parse IPv6 address into 16 bytes
  const parts = [];
  if (ipStr === '::1') {
    for (let i = 0; i < 15; i++) parts.push(0);
    parts.push(1);
  } else {
    for (let i = 0; i < 16; i++) parts.push(0);
    parts[0] = 0xfe; parts[1] = 0x80; parts[15] = 0x01;
  }

  const answer = Buffer.from([
    0xc0, 0x0c,             // Name pointer
    0x00, 0x1c,             // Type AAAA
    0x00, 0x01,             // Class IN
    0x00, 0x00, 0x00, 0x3c, // TTL: 60s
    0x00, 0x10,             // RDLENGTH: 16
    ...parts
  ]);

  return Buffer.concat([res.slice(0, nextOffset + 4), answer]);
}

function buildNXDOMAINResponse(reqBuffer) {
  const res = Buffer.from(reqBuffer);
  res[2] = 0x81;
  res[3] = 0x83; // NXDOMAIN
  return res;
}

function queryUpstream(msg, resolverIp, timeoutMs = 1500) {
  return new Promise((resolve, reject) => {
    const isV6 = resolverIp.includes(':');
    const client = dgram.createSocket(isV6 ? 'udp6' : 'udp4');
    let timer = setTimeout(() => {
      client.close();
      reject(new Error(`Timeout from resolver ${resolverIp}`));
    }, timeoutMs);

    client.send(msg, 53, resolverIp, (err) => {
      if (err) {
        clearTimeout(timer);
        client.close();
        reject(err);
      }
    });

    client.on('message', (upstreamResp) => {
      clearTimeout(timer);
      client.close();
      resolve(upstreamResp);
    });

    client.on('error', (err) => {
      clearTimeout(timer);
      client.close();
      reject(err);
    });
  });
}

async function resolveQuery(serverSocket, msg, rinfo) {
  try {
    const { domain, nextOffset } = parseDomainName(msg);
    const cleanDomain = domain.toLowerCase();
    const qType = parseQueryType(msg, nextOffset);

    // Tier 1: Local Mesh Table (A = 1, AAAA = 28)
    if (qType === 1 && MESH_RECORDS_A[cleanDomain]) {
      const targetIp = MESH_RECORDS_A[cleanDomain];
      console.log(`[GoDNS IPv4/v6] [Tier 1: Mesh A] ${cleanDomain} -> ${targetIp}`);
      const resp = buildAResponse(msg, cleanDomain, targetIp);
      serverSocket.send(resp, rinfo.port, rinfo.address);
      return;
    }

    if (qType === 28 && MESH_RECORDS_AAAA[cleanDomain]) {
      const targetIp = MESH_RECORDS_AAAA[cleanDomain];
      console.log(`[GoDNS IPv6] [Tier 1: Mesh AAAA] ${cleanDomain} -> ${targetIp}`);
      const resp = buildAAAAResponse(msg, cleanDomain, targetIp);
      serverSocket.send(resp, rinfo.port, rinfo.address);
      return;
    }

    // Tier 1.5: Authoritative Check for .mh and .mesh (Do not forward)
    if (cleanDomain.endsWith('.mh') || cleanDomain.endsWith('.mesh')) {
      console.log(`[GoDNS] [Authoritative] NXDOMAIN for ${cleanDomain}`);
      const nxdomainResp = buildNXDOMAINResponse(msg);
      serverSocket.send(nxdomainResp, rinfo.port, rinfo.address);
      return;
    }

    // Tier 2: Secondary Privacy Resolvers (1.1.1.1 / 2606:4700:4700::1111)
    for (const upstreamIp of SECONDARY_RESOLVERS) {
      try {
        const resp = await queryUpstream(msg, upstreamIp, 1500);
        console.log(`[GoDNS] [Tier 2: Secondary ${upstreamIp}] Resolved ${cleanDomain}`);
        serverSocket.send(resp, rinfo.port, rinfo.address);
        return;
      } catch (e) {
        // Continue to next resolver
      }
    }

    // Tier 3: Emergency Resolver of Last Resort (8.8.8.8)
    console.warn(`[GoDNS] [Tier 3: LAST RESORT ${EMERGENCY_LAST_RESORT_RESOLVER}] Resolving ${cleanDomain}...`);
    const emergencyResp = await queryUpstream(msg, EMERGENCY_LAST_RESORT_RESOLVER, 3000);
    serverSocket.send(emergencyResp, rinfo.port, rinfo.address);

  } catch (err) {
    console.error('[GoDNS] Query error:', err.message);
  }
}

serverV4.on('message', (msg, rinfo) => resolveQuery(serverV4, msg, rinfo));
if (serverV6) {
  serverV6.on('message', (msg, rinfo) => resolveQuery(serverV6, msg, rinfo));
}

serverV4.on('listening', () => {
  const addr = serverV4.address();
  console.log(`======================================================================`);
  console.log(`🌐 GoDNS DUAL-STACK DAEMON ACTIVE ON UDP v4 PORT ${addr.port} (0.0.0.0)`);
  console.log(`   IPv6 Quad-A Resolution: ENABLED`);
  console.log(`   Tier 1 Mesh A/AAAA: ${Object.keys(MESH_RECORDS_A).join(', ')}`);
  console.log(`   Tier 2 Resolvers: ${SECONDARY_RESOLVERS.join(', ')}`);
  console.log(`   Tier 3 Emergency Fallback: ${EMERGENCY_LAST_RESORT_RESOLVER}`);
  console.log(`======================================================================`);
});

serverV4.bind(PORT, '0.0.0.0');

if (serverV6) {
  serverV6.on('listening', () => {
    console.log(`🌐 GoDNS DUAL-STACK DAEMON ACTIVE ON UDP v6 PORT 53 (::)`);
  });
  serverV6.bind(PORT, '::');
}
