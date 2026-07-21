# Diagnostic and Recovery Procedures for the SWEND Sovereign Mesh
This guide provides solutions to the most common operational issues encountered when running the SWEND stack across Windows, WSL, and Linux environments. Each section includes rootcause analysis and deterministic recovery steps.
1. Network Bridging & Port Proxy Issues
1.1. ConnectEx Refused Errors (Ports 1233 / 1111)
Symptom Windows clients report:
Code
dial tcp 127.0.0.1:1111: connectex: No connection could be made because the target machine actively refused it.
Root Cause One of the following:
Missing or stale Windows→WSL portproxy rule
Incorrect WSL IP mapping
SWEND daemon not running inside WSL
WSL networking subsystem restarted or reassigned IPs
Resolution Steps
1. Verify SWEND is running inside WSL
bash
ps aux | grep swend
2. Inspect Windows portproxy rules (Admin PowerShell/CMD)
powershell
netsh interface portproxy show all
3. Rebuild the Windows↔WSL bridge
Run the automated resolver script:
powershell
powershell -ExecutionPolicy Bypass -File C:\Users\theal\quantasona-mesh\sovereign-27\bridge_wsl_windows.ps1
This script:
Detects the current WSL IP
Rewrites portproxy rules
Reestablishes the SWEND control plane bridge
2. Database Connection Errors
2.1. “pq: relation ‘x’ does not exist” or DB Unreachable
Symptom During schema verification, SWEND logs:
Code
db connection failed: dial tcp 127.0.0.1:26257: connect: connection refused
Root Cause
CockroachDB container is offline
CockroachDB service failed to start
Schema migrations are incomplete or out of sync
WSL/Docker networking reset
Resolution Steps
1. Verify CockroachDB is running
bash
docker ps | grep cockroach
Or via native binary:
bash
cockroach node status --insecure
2. Reinitialize schema if tables are missing
bash
swend install
# or
swend genesis
These commands rebuild:
system tables
ticketing schema
lineage indices
relational memory structures
3. Vault Key & Token Expirations
3.1. “vault identity verification failed” Warnings
Symptom SWEND logs:
Code
[WARNING] vault identity verification failed (proceeding without vault)
Root Cause
SWEND_VAULT_TOKEN expired
Vault dev server restarted
Token lease invalidated
Local environment lost its Vault session
Resolution Steps
1. Refresh local credentials
Run the secret sweep script:
powershell
powershell -File .\sweep_secrets.ps1
This regenerates:
Vault tokens
SAML cert references
Cloudflare Access credentials
Local environment bindings
2. Verify Vault status
bash
vault status
Check for:
active seal state
token TTL
leadership status
storage backend health
This version is fully polished and ready for ingestion by your import script.