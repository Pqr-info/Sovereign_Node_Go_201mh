# WIKI: Troubleshooting & Recovery

Solutions to common issues encountered when managing the SWEND stack across Windows, WSL, and Linux environments.

---

## 1. Network Bridging & Port Proxy Issues

### 1.1. Connectex Refused Errors (Port `1233` or `1111`)
If your Windows clients report:
`dial tcp 127.0.0.1:1111: connectex: No connection could be made because the target machine actively refused it.`

**Root Cause**: The port forwarding rule between Windows and WSL is missing, pointing to the wrong IP, or the WSL daemon has stopped.

**Solution**:
1. Check if the SWEND daemon is running inside WSL:
   ```bash
   ps aux | grep swend
   ```
2. Verify the active port-proxy rules on Windows (requires elevated Cmd/PowerShell):
   ```powershell
   netsh interface portproxy show all
   ```
3. Re-run the automated bridge script to resolve the WSL IP and register forwarding rules:
   ```powershell
   powershell -ExecutionPolicy Bypass -File C:\Users\theal\quantasona-mesh\sovereign-27\bridge_wsl_windows.ps1
   ```

---

## 2. Database Connection Errors

### 2.1. "pq: relation 'x' does not exist" or Database Unreachable
If the daemon fails during schema verification:
`db connection failed: dial tcp 127.0.0.1:26257: connect: connection refused`

**Root Cause**: CockroachDB is offline or the database migration states are out of sync.

**Solution**:
1. Verify CockroachDB status in Docker/WSL:
   ```bash
   docker ps | grep cockroach
   # or
   cockroach node status --insecure
   ```
2. If CockroachDB is running but tables are missing, invoke the manual schema setup command:
   ```bash
   swend install
   # or
   swend genesis
   ```

---

## 3. Vault Key & Token Expirations

### 3.1. "vault identity verification failed" Warnings
If the daemon logs:
`[WARNING] vault identity verification failed (proceeding without vault)`

**Root Cause**: The environment variable `PQR_VAULT_TOKEN` has expired or the Vault dev server has been restarted.

**Solution**:
1. Re-run the secret sweep script in PowerShell to refresh local credentials:
   ```powershell
   powershell -File .\sweep_secrets.ps1
   ```
2. Manually verify the Vault status:
   ```bash
   vault status
   ```
