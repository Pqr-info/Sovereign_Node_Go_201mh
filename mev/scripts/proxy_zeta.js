import { CloudflareDNSAdmin } from '../../cloudflare_dns_admin.js';

async function run() {
  const zoneId = '04d095057fffbe139111f2cd16f9387e'; // pqr.info
  
  const existing = await CloudflareDNSAdmin.listDnsRecords(zoneId);
  const match = existing.records.find(r => r.name === 'zeta.pqr.info');
  if (match) {
    console.log("Deleting record...", match.id);
    const res = await CloudflareDNSAdmin.deleteDnsRecord(zoneId, match.id);
    console.log("Result:", JSON.stringify(res, null, 2));
  } else {
    console.log("Record not found.");
  }
}

run();
