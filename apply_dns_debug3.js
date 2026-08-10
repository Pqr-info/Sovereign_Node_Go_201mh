import { CloudflareDNSAdmin } from './cloudflare_dns_admin.js';
import fs from 'fs';

async function main() {
  const zoneId = '04d095057fffbe139111f2cd16f9387e'; // pqr.info
  
  const record = { type: 'A', name: 'zeta.mh.pqr.info', content: '176.9.116.146', proxied: false, ttl: 120 };
  
  const res = await CloudflareDNSAdmin.upsertDnsRecord(zoneId, record);
  console.log('Upsert res:', JSON.stringify(res, null, 2));
}
main();
