import { CloudflareDNSAdmin } from './cloudflare_dns_admin.js';

async function main() {
  const zoneId = '04d095057fffbe139111f2cd16f9387e'; // pqr.info
  
  const records = [
    { type: 'A', name: 'zeta.mh.pqr.info', content: '176.9.116.146', proxied: false, ttl: 120 },
    { type: 'A', name: 'zeta.mesh.pqr.info', content: '176.9.116.146', proxied: true, ttl: 1 }, // 1 means auto
    { type: 'A', name: '39.mh.pqr.info', content: '204.168.138.60', proxied: false, ttl: 120 },
    { type: 'A', name: '39.mesh.pqr.info', content: '204.168.138.60', proxied: true, ttl: 1 },
    { type: 'A', name: '38.mh.pqr.info', content: '62.238.2.240', proxied: false, ttl: 120 },
    { type: 'A', name: '38.mesh.pqr.info', content: '62.238.2.240', proxied: true, ttl: 1 }
  ];

  for (const record of records) {
    console.log(`Upserting ${record.name}...`);
    const res = await CloudflareDNSAdmin.upsertDnsRecord(zoneId, record);
    console.log(`Result for ${record.name}:`, res);
  }
}

main().catch(console.error);
