---
name: cloudflare-dns-administrator
description: Automated DNS Administrator skill to manage pqr.info and all hosted domain DNS records on Cloudflare via API v4.
---

# ☁️ Cloudflare DNS Administrator Skill

This skill equips the Sovereign-27 agent swarm with automated Cloudflare DNS administration capabilities for `pqr.info` and all associated domains.

## Features
- **Zone Discovery:** Enumerates all Cloudflare hosted zones.
- **DNS Record Management:** Lists, creates, updates, and deletes `A`, `AAAA`, `CNAME`, `TXT`, and `MX` records.
- **Auto-Proxy & SSL Shielding:** Enables Cloudflare proxying (`proxied: true`) by default for DDOS protection and SSL acceleration.
- **Safe Credentials Protocol Compliant:** Verifies `CLOUDFLARE_API_TOKEN` without leaking keys into agent context.

## Usage Commands
```bash
# Run DNS Admin CLI to list zones
node C:\pqr.info\cloudflare_dns_admin.js
```
