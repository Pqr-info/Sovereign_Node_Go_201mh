import DNS from 'dns2';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const { Packet } = DNS;
const PORT = 53;
const UPSTREAM_DNS = '1.1.1.1';

// Initialize the DNS server
const server = DNS.createServer({
  udp: true,
  handle: async (request, send, rinfo) => {
    const response = Packet.createResponseFromRequest(request);
    const question = request.questions[0];
    const { name } = question;

    // Check if it's a .mh domain
    if (name.endsWith('.mh')) {
      console.log(`[Mesh DNS] Intercepted .mh query: ${name} (Type: ${question.type})`);
      
      try {
        const record = await db.get(`SELECT ip_address, port FROM mh_dns_records WHERE domain = ?`, [name]);
        
        if (record && record.ip_address) {
          if (question.type === Packet.TYPE.SRV) {
            response.answers.push({
              name,
              type: Packet.TYPE.SRV,
              class: Packet.CLASS.IN,
              ttl: 60,
              priority: 10,
              weight: 10,
              port: record.port || 80,
              target: record.ip_address
            });
            console.log(`[Mesh DNS] Resolved SRV ${name} -> ${record.ip_address}:${record.port || 80}`);
          } else {
            // Default to A record
            response.answers.push({
              name,
              type: Packet.TYPE.A,
              class: Packet.CLASS.IN,
              ttl: 60,
              address: record.ip_address
            });
            console.log(`[Mesh DNS] Resolved A ${name} -> ${record.ip_address}`);
          }
        } else {
          console.log(`[Mesh DNS] Domain not found in Substrate 27: ${name}`);
          response.header.rcode = Packet.RESULTCODE.NXDOMAIN;
        }
      } catch (err) {
        console.error(`[Mesh DNS] Database error:`, err);
        response.header.rcode = Packet.RESULTCODE.SERVFAIL;
      }
      
      send(response);
    } else {
      // Forward to Google DNS (8.8.8.8) for normal internet traffic
      try {
        const result = await DNS.resolveA(name, UPSTREAM_DNS);
        result.answers.forEach(ans => response.answers.push(ans));
        send(response);
      } catch (err) {
        // Forwarding failed, perhaps no A record or NXDOMAIN
        response.header.rcode = Packet.RESULTCODE.NXDOMAIN;
        send(response);
      }
    }
  }
});

server.on('request', (request, response, rinfo) => {
  // Silent logging for all requests if needed
});

server.on('listening', () => {
  console.log(`[Mesh DNS] Active and listening on UDP Port ${PORT}`);
  console.log(`[Mesh DNS] Resolving .mh queries via Substrate 27`);
  console.log(`[Mesh DNS] Forwarding non-.mh queries to ${UPSTREAM_DNS}`);
});

let db;

async function initDB() {
  const dbPath = path.resolve('C:/pqr.info/spacebook-5d/data/substrate_27.db');
  console.log(`[Mesh DNS] Connecting to Substrate 27 KV Store at: ${dbPath}`);
  
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS mh_dns_records (
      domain TEXT PRIMARY KEY,
      ip_address TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // Migration: Add port column if it doesn't exist
  try {
    await db.exec(`ALTER TABLE mh_dns_records ADD COLUMN port INTEGER;`);
    console.log(`[Mesh DNS] Migrated db: added port column.`);
  } catch (err) {
    // Column already exists, safe to ignore
  }

  // Seed the initial .mh domain for the Oracle Server
  await db.run(`INSERT OR IGNORE INTO mh_dns_records (domain, ip_address, port) VALUES (?, ?, ?)`, ['zeta.mh', '46.224.219.174', null]);
  await db.run(`UPDATE mh_dns_records SET port = ? WHERE domain = ?`, [null, 'zeta.mh']);
  
  await db.run(`INSERT OR IGNORE INTO mh_dns_records (domain, ip_address, port) VALUES (?, ?, ?)`, ['ader.mh', '127.0.0.1', 4076]);
  await db.run(`UPDATE mh_dns_records SET port = ? WHERE domain = ?`, [4076, 'ader.mh']);
  
  console.log(`[Mesh DNS] Seeded zeta.mh -> 46.224.219.174`);
  console.log(`[Mesh DNS] Seeded ader.mh -> 127.0.0.1:4076`);
}

initDB().then(() => {
  server.listen(PORT, '0.0.0.0');
}).catch(err => {
  console.error('[Mesh DNS] Failed to start:', err);
});
