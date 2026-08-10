import { CloudflareDNSAdmin } from './cloudflare_dns_admin.js';

async function main() {
  const zoneId = '04d095057fffbe139111f2cd16f9387e'; // pqr.info
  
  const records = [
    { type: 'A', name: 'zeta.mh.pqr.info', content: '176.9.116.146', proxied: false, ttl: 120 }
  ];

  for (const record of records) {
    console.log('Upserting', record.name);
    const res = await CloudflareDNSAdmin.upsertDnsRecord(zoneId, record);
    console.log(JSON.stringify(res, null, 2));
  }
}
main();
