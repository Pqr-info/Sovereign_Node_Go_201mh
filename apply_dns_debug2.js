import { CloudflareDNSAdmin } from './cloudflare_dns_admin.js';

async function main() {
  const zoneId = '04d095057fffbe139111f2cd16f9387e'; // pqr.info
  const existing = await CloudflareDNSAdmin.listDnsRecords(zoneId);
  console.log('List OK?', existing.ok);
  console.log(existing);
}
main();
