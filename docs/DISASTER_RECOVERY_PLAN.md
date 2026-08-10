# 🚨 PQR Sovereign Mesh: Disaster Recovery & Business Continuity Plan

This document establishes the official emergency procedures, recovery scripts, and strategic failover guidelines for the PQR Sovereign Swarm infrastructure (comprising Vault, Nginx Gateway, CockroachDB, Substrate node, and the Go application servers).

---

## 🧭 Swarm Infrastructure Overview
The Sovereign Mesh is deployed via Docker Compose with the following service mappings:
- **Load Balancer / Gateway (Nginx)**: Port `3196` (HTTP) and Port `443` (HTTPS)
- **Database (CockroachDB)**: Port `5196` (PostgreSQL Client Access) and Port `8088` (Admin Console UI)
- **Identity Vault (HashiCorp Vault)**: Port `8200`
- **Application Node (pqr-server)**: Port `8196` (Internal mesh endpoint)
- **Substrate Node (substrate-node)**: Port `9944` (RPC/WS) and Port `9933` (RPC HTTP)
- **Time Machine (time-machine-go)**: Port `8081` (Internal Time Machine API)
- **Cloudflare Tunnel (tunnel)**: Secures remote routing to `https://pqr.info`

---

## 1. 🔑 Detailed Break-Glass Emergency Access Procedures

When the Nginx Gateway, Cloudflare Tunnel, or management HUD becomes unresponsive, operators must invoke the **Emergency Bridge** to run diagnostic and healing payloads directly.

### 1.1. Network Access Points
- **Direct Application Port**: `http://localhost:8196/REST/2.0/emergency/bridge`
- **Nginx Local Proxy**: `http://localhost:3196/REST/2.0/emergency/bridge`
- **External Tunnel Endpoint**: `https://pqr.info/REST/2.0/emergency/bridge`

### 1.2. Authentication Protocol
The Emergency Bridge bypasses standard SAML SSO and is authenticated via the `X-Gemini-Key` header.
- **Master Key**: `AIzaSyCqMMdPm1s6MuXy06yiWUlIQ0CJ1C-rPWk`
- **Vault Location**: `secret/data/pqr` (mapped to environment variable `GEMINI_API_KEY`)

> [!IMPORTANT]
> When accessing the endpoint externally via the Cloudflare Tunnel, you must also pass the Cloudflare Access Service Token headers. Requests failing to present these credentials will be blocked at the Cloudflare edge.
> - **CF-Access-Client-Id**: `c98ca7026f54305b05cd24975a3ce6d2.access`
> - **CF-Access-Client-Secret**: `ebf3177d992adb0c3db7b088fb5b9e3d83e96649fb9bc5b86a25301af5c8e744`

### 1.3. Emergency Commands & Payloads

#### Command A: `GET_SYSTEM_HEALTH`
Queries the application nodes to verify internal component states. If the Vault connection is broken, the status responds with `AUTH_DEGRADED`.

- **Request Payload**:
  ```json
  {
    "command": "GET_SYSTEM_HEALTH"
  }
  ```
- **Shell Invoke**:
  ```bash
  curl -X POST https://pqr.info/REST/2.0/emergency/bridge \
    -H "X-Gemini-Key: AIzaSyCqMMdPm1s6MuXy06yiWUlIQ0CJ1C-rPWk" \
    -H "CF-Access-Client-Id: c98ca7026f54305b05cd24975a3ce6d2.access" \
    -H "CF-Access-Client-Secret: ebf3177d992adb0c3db7b088fb5b9e3d83e96649fb9bc5b86a25301af5c8e744" \
    -H "Content-Type: application/json" \
    -d '{"command": "GET_SYSTEM_HEALTH"}'
  ```

#### Command B: `LIST_RECENT_TICKETS`
Directly retrieves the last 10 log and diagnostic entries from the database, bypassing the front-end rendering engines.

- **Request Payload**:
  ```json
  {
    "command": "LIST_RECENT_TICKETS"
  }
  ```
- **Shell Invoke**:
  ```bash
  curl -X POST http://localhost:3196/REST/2.0/emergency/bridge \
    -H "X-Gemini-Key: AIzaSyCqMMdPm1s6MuXy06yiWUlIQ0CJ1C-rPWk" \
    -H "Content-Type: application/json" \
    -d '{"command": "LIST_RECENT_TICKETS"}'
  ```

#### Command C: `TRIGGER_HEALING`
Manually injects healing instructions into the `HealingService` queue. This forces the agent framework to execute immediate remedial actions.

- **Request Payload**:
  ```json
  {
    "command": "TRIGGER_HEALING",
    "params": {
      "issue": "FORCE_CERT_ROTATION",
      "logSnippet": "SAML parsing failed. RSA private key mismatch."
    }
  }
  ```
- **Shell Invoke**:
  ```bash
  curl -X POST http://localhost:8196/REST/2.0/emergency/bridge \
    -H "X-Gemini-Key: AIzaSyCqMMdPm1s6MuXy06yiWUlIQ0CJ1C-rPWk" \
    -H "Content-Type: application/json" \
    -d '{"command": "TRIGGER_HEALING", "params": {"issue": "FORCE_CERT_ROTATION", "logSnippet": "Forced manual key rotation due to key compromise."}}'
  ```

### 1.4. Legacy S25 Diagnostic Bridge
If the main Go API routing engine is online but the rest of the application layers are failing, operators can issue commands to the diagnostic shell bridge:
- **Endpoint**: `GET http://localhost:3196/REST/2.0/bridge?cmd=<cmd>`
- **Example**: `curl -X GET "http://localhost:3196/REST/2.0/bridge?cmd=CHECK_DISK_SPACE"`
This triggers `s.Healing.ExecuteDiagnostic` to query the local Swarm AI engine to parse and run diagnostics.

---

## 2. 🛡️ Vault Backup, Restoration, and Dev Mode Failover

### 2.1. Current Configuration Analysis
The Vault instance is defined in [docker-compose.yml](file:///D:/pqr.info/docker-compose.yml) as:
```yaml
  vault:
    image: hashicorp/vault:1.13.3
    restart: always
    network_mode: "host"
    volumes:
      - ./vault/config:/vault/config:ro
      - ./vault/data:/vault/data
    command: server -dev -dev-listen-address=0.0.0.0:8200 -dev-root-token-id=pqr-vault-token
```

> [!CAUTION]
> **CRITICAL SECURITY & PERSISTENCE RISK**
> Vault is currently started with the `-dev` flag. In dev mode:
> 1. Vault stores all secrets in-memory. Data is **never** persisted to `./vault/data`.
> 2. Restarting the Vault container wipes all credentials.
> 3. The [sweep_secrets.ps1](file:///D:/pqr.info/sweep_secrets.ps1) script migrates the `.env` file directly into Vault and **deletes the local `.env` file**.
> 4. If the Vault container restarts after a sweep, all credentials (including `GEMINI_API_KEY` and SAML certificates) are permanently lost, causing a complete cluster start failure.

### 2.2. Dev Mode Backup & Restore Scripts
To mitigate in-memory data loss, regular hot-backups must be exported.

#### Backup Script (PowerShell)
Save this script as `D:/pqr.info/scratch/backup_vault.ps1`:
```powershell
$vaultAddr = "http://localhost:8200"
$vaultToken = "pqr-vault-token"
$backupDir = "D:/pqr.info/vault/backup"
$headers = @{ "X-Vault-Token" = $vaultToken }

if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }

try {
    Write-Host "Exporting SAML Secrets..." -ForegroundColor Cyan
    $saml = Invoke-RestMethod -Uri "$vaultAddr/v1/secret/data/saml" -Headers $headers -ErrorAction Stop
    $samlPayload = @{ data = $saml.data.data } | ConvertTo-Json -Depth 10
    $samlPayload | Out-File -FilePath "$backupDir/vault_saml_backup.json" -Encoding utf8

    Write-Host "Exporting PQR Node Secrets..." -ForegroundColor Cyan
    $pqr = Invoke-RestMethod -Uri "$vaultAddr/v1/secret/data/pqr" -Headers $headers -ErrorAction Stop
    $pqrPayload = @{ data = $pqr.data.data } | ConvertTo-Json -Depth 10
    $pqrPayload | Out-File -FilePath "$backupDir/vault_pqr_backup.json" -Encoding utf8

    Write-Host "✓ Vault backup completed successfully." -ForegroundColor Green
} catch {
    Write-Error "Vault backup failed: $_"
}
```

#### Restoration Script (PowerShell)
Save this script as `D:/pqr.info/scratch/restore_vault.ps1`:
```powershell
$vaultAddr = "http://localhost:8200"
$vaultToken = "pqr-vault-token"
$backupDir = "D:/pqr.info/vault/backup"
$headers = @{ "X-Vault-Token" = $vaultToken }

try {
    Write-Host "Restoring SAML Secrets..." -ForegroundColor Cyan
    $samlContent = Get-Content -Raw -Path "$backupDir/vault_saml_backup.json" -ErrorAction Stop
    $null = Invoke-RestMethod -Uri "$vaultAddr/v1/secret/data/saml" -Method Post -Headers $headers -Body $samlContent -ContentType "application/json" -ErrorAction Stop

    Write-Host "Restoring PQR Node Secrets..." -ForegroundColor Cyan
    $pqrContent = Get-Content -Raw -Path "$backupDir/vault_pqr_backup.json" -ErrorAction Stop
    $null = Invoke-RestMethod -Uri "$vaultAddr/v1/secret/data/pqr" -Method Post -Headers $headers -Body $pqrContent -ContentType "application/json" -ErrorAction Stop

    Write-Host "✓ Vault restoration completed successfully." -ForegroundColor Green
} catch {
    Write-Error "Vault restoration failed: $_"
}
```

#### Backup & Restore Scripts (Bash)
Save as `/app/scratch/backup_vault.sh`:
```bash
#!/bin/bash
set -e
VAULT_ADDR="http://localhost:8200"
VAULT_TOKEN="pqr-vault-token"
BACKUP_DIR="D:/pqr.info/vault/backup"

mkdir -p "$BACKUP_DIR"

echo "Backing up Vault Secrets..."
curl -s -H "X-Vault-Token: $VAULT_TOKEN" "$VAULT_ADDR/v1/secret/data/saml" | jq '.data | {data: .data}' > "$BACKUP_DIR/vault_saml_backup.json"
curl -s -H "X-Vault-Token: $VAULT_TOKEN" "$VAULT_ADDR/v1/secret/data/pqr" | jq '.data | {data: .data}' > "$BACKUP_DIR/vault_pqr_backup.json"
echo "✓ Backups completed."
```

Save as `/app/scratch/restore_vault.sh`:
```bash
#!/bin/bash
set -e
VAULT_ADDR="http://localhost:8200"
VAULT_TOKEN="pqr-vault-token"
BACKUP_DIR="D:/pqr.info/vault/backup"

echo "Restoring Vault Secrets..."
curl -s -X POST -H "X-Vault-Token: $VAULT_TOKEN" -H "Content-Type: application/json" -d @"$BACKUP_DIR/vault_saml_backup.json" "$VAULT_ADDR/v1/secret/data/saml" > /dev/null
curl -s -X POST -H "X-Vault-Token: $VAULT_TOKEN" -H "Content-Type: application/json" -d @"$BACKUP_DIR/vault_pqr_backup.json" "$VAULT_ADDR/v1/secret/data/pqr" > /dev/null
echo "✓ Restoration completed."
```

### 2.3. Failover to Persistent Production Vault Mode
To configure a resilient, file-backed Vault service, execute this failover plan:

1. **Create Configuration**: Define `/vault/config/vault.hcl` on the host:
   ```hcl
   storage "file" {
     path = "/vault/data"
   }
   listener "tcp" {
     address     = "0.0.0.0:8200"
     tls_disable = 1
   }
   ui = true
   disable_mlock = true
   ```
2. **Update Docker Compose**: Modify `docker-compose.yml`:
   ```yaml
     vault:
       image: hashicorp/vault:1.13.3
       restart: always
       network_mode: "host"
       volumes:
         - ./vault/config:/vault/config:ro
         - ./vault/data:/vault/data
       command: server -config=/vault/config/vault.hcl
       cap_add:
         - IPC_LOCK
   ```
3. **Initialize the Server**:
   ```bash
   docker-compose restart vault
   docker exec -it vault vault operator init -key-shares=5 -key-threshold=3 > /vault/data/keys.txt
   ```
4. **Unseal the Vault**: Retrieve the unseal keys from `keys.txt` and run the unseal command 3 times with different keys:
   ```bash
   docker exec -it vault vault operator unseal <UNSEAL_KEY_1>
   docker exec -it vault vault operator unseal <UNSEAL_KEY_2>
   docker exec -it vault vault operator unseal <UNSEAL_KEY_3>
   ```
5. **Set Root Token**: Export the root token generated from the init output and set it in `pqr-server` env as `VAULT_TOKEN`.

---

## 3. 💾 CockroachDB Memory Store Characteristics & Resiliency

### 3.1. Memory Store Analysis
The database is configured in the docker-compose manifest with:
`command: start-single-node --insecure --http-addr=0.0.0.0 --store=type=mem,size=2GiB`

- **Volatile Storage**: `type=mem` configures the CockroachDB storage engine to run entirely in RAM. The volume mount `cockroach_data:/cockroach/cockroach-data` does **not** persist any database tables across restarts.
- **Resource Ceiling**: Capped at `2GiB` RAM usage.
- **Risk Assessment**:
  1. **Memory Exhaustion**: In high-velocity agent swarms, NPU logs and ticket audits will rapidly consume the 2 GiB boundary. Upon reaching capacity, CockroachDB will refuse writes, causing server crash-loops.
  2. **Total Memory Loss**: A container crash, daemon restart, or host reboot completely wipes the database schema and all system data.

### 3.2. Failover to Persistent File Storage
To enable permanent disk storage, modify the command within the `db` service definition in `docker-compose.yml` to:
`command: start-single-node --insecure --http-addr=0.0.0.0 --store=path=/cockroach/cockroach-data`

---

### 3.3. Database Backup and Restoration Scripts

Since the database currently resides in volatile RAM, hot-dumps must be scheduled regularly.

#### Database Backup Script (PowerShell)
Save this script as `D:/pqr.info/scratch/backup_db.ps1`:
```powershell
$backupFile = "D:/pqr.info/db_backup.sql"
Write-Host "Initiating SQL Dump of database 'antigravity'..." -ForegroundColor Cyan

# Use compose project mapping to execute the database dump
docker-compose exec -T db cockroach dump antigravity --insecure > $backupFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database backup saved to $backupFile" -ForegroundColor Green
} else {
    Write-Error "Database backup failed. Verify CockroachDB container is running."
}
```

#### Database Restoration Script (PowerShell)
Save this script as `D:/pqr.info/scratch/restore_db.ps1`:
```powershell
$backupFile = "D:/pqr.info/db_backup.sql"

if (-not (Test-Path $backupFile)) {
    Write-Error "Backup file not found at $backupFile"
    exit 1
}

Write-Host "Re-initializing 'antigravity' database schema..." -ForegroundColor Cyan
# Ensure target database is clean and initialized
docker-compose exec -T db cockroach sql --insecure -e "DROP DATABASE IF EXISTS antigravity; CREATE DATABASE antigravity;"

Write-Host "Injecting SQL schema and records..." -ForegroundColor Cyan
Get-Content $backupFile | docker-compose exec -T db cockroach sql --insecure --database=antigravity

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database successfully restored from backup." -ForegroundColor Green
} else {
    Write-Error "Database restoration failed."
}
```

#### Database Backup Script (Bash)
Save as `/app/scratch/backup_db.sh`:
```bash
#!/bin/bash
set -e
BACKUP_FILE="D:/pqr.info/db_backup.sql"

echo "Dumping antigravity database..."
docker-compose exec -T db cockroach dump antigravity --insecure > "$BACKUP_FILE"
echo "✓ Backup written to $BACKUP_FILE"
```

#### Database Restoration Script (Bash)
Save as `/app/scratch/restore_db.sh`:
```bash
#!/bin/bash
set -e
BACKUP_FILE="D:/pqr.info/db_backup.sql"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found!"
    exit 1
fi

echo "Dropping and recreating database..."
docker-compose exec -T db cockroach sql --insecure -e "DROP DATABASE IF EXISTS antigravity; CREATE DATABASE antigravity;"

echo "Restoring database..."
docker-compose exec -T db cockroach sql --insecure --database=antigravity < "$BACKUP_FILE"
echo "✓ Restoration successful."
```

---

## 4. 🔄 Health Recovery & Restart Sequences

When rebuilding a degraded mesh, services must be brought online in a strict topological order to prevent cascade failures, orphaned sockets, or routing loops.

```mermaid
graph TD
    db[1. CockroachDB - db] -->|Passed Healthcheck| vault[2. HashiCorp Vault - vault]
    vault -->|Verify & Restore Secrets| app[3. Go API Node - pqr-server]
    app -->|Validate Upstream Health| gateway[4. Nginx Load Balancer - gateway]
    gateway -->|Verify SSL & Paths| tunnel[5. Cloudflare Tunnel - tunnel]
```

### 4.1. Step-by-Step Restoration Sequence

#### Step 1: Clean Teardown
To avoid split-brain states and lockfiles, force termination of any running resources:
```bash
docker-compose down --remove-orphans
```

#### Step 2: Database Bootstrap
Start the CockroachDB service first:
```bash
docker-compose up -d db
```
Wait for health verification:
```bash
# Block terminal until healthcheck succeeds
docker-compose ps db --filter "status=running"
docker exec -it $(docker-compose ps -q db) cockroach sql --insecure -e "SELECT 1;"
```

#### Step 3: Identity Vault Startup & Key Injection
Start the Vault container:
```bash
docker-compose up -d vault
```
Because Vault runs in dev-mode, it will lose its keys. Immediately execute the Vault restore script:
```powershell
powershell -File D:/pqr.info/scratch/restore_vault.ps1
```
*Note: If no backup file is present, execute [sweep_secrets.ps1](file:///D:/pqr.info/sweep_secrets.ps1) with a temporary `.env` file.*

#### Step 4: Core Services Initialization
Bring up the application replicas:
```bash
docker-compose up -d --scale pqr-server=3 pqr-server
```
Confirm the internal API nodes are accepting requests:
```bash
curl -f http://localhost:8196/REST/2.0/health
```

#### Step 5: Nginx Load Balancer Validation
Validate the Nginx configuration structure before start:
```bash
docker-compose run --rm gateway nginx -t
```
If valid, launch Nginx:
```bash
docker-compose up -d gateway
```
Test upstream load-balancing routes:
```bash
curl -f http://localhost:3196/REST/2.0/health
curl -k -f https://localhost:443/REST/2.0/health
```

#### Step 6: External Tunnel Activation
Bring the public proxy online:
```bash
docker-compose up -d tunnel
```
Wait for resolution:
```powershell
$headers = @{ 
  "CF-Access-Client-Id" = "c98ca7026f54305b05cd24975a3ce6d2.access";
  "CF-Access-Client-Secret" = "ebf3177d992adb0c3db7b088fb5b9e3d83e96649fb9bc5b86a25301af5c8e744"
}
Invoke-RestMethod -Uri "https://pqr.info/REST/2.0/health" -Headers $headers
```

---

### 4.2. Nginx Proxy Configuration & SSL Verification
The gateway runs using [nginx.conf](file:///D:/pqr.info/nginx/nginx.conf).
- **Internal DNS**: Docker's internal resolver at `127.0.0.11` is configured with a 30s TTL cache.
- **SSL Certificates**: Certificates are mounted from the host at `/etc/nginx/certs` (requiring `origin_ca.pem` and `origin_ca.key`).

#### Certificate Audit Commands
Execute these diagnostic commands on the host to prevent SSL routing failures:
```bash
# Check certificate validity and expiration
openssl x509 -in ./certs/origin_ca.pem -text -noout | grep "Not After"

# Confirm private key corresponds to the certificate
openssl x509 -noout -modulus -in ./certs/origin_ca.pem | openssl md5
openssl rsa -noout -modulus -in ./certs/origin_ca.key | openssl md5
```
Both MD5 hashes **must match exactly**. If they differ, the Nginx container will crash-loop on port 443 bindings. Under such circumstances, invoke the emergency repair directive:
`pqr.emergencyRepair("FORCE_CERT_ROTATION")`.

---

## 5. ⛓️ Substrate Node Failover & Timeslips Recovery

The Sovereign Swarm architecture relies on a local Substrate node (`substrate-node` inside [docker-compose.prod.yml](file:///D:/pqr.info/mev/docker-compose.prod.yml)) compiling the `timeslips` pallet to ledger agent activity, execution rates, costs, and state rollbacks.

### 5.1. Recovering local Substrate Node Templates
If the working directory at `C:/Users/theal/substrate-node-template` becomes corrupted or code validation fails (due to compilation mismatches or corrupted Rust files), operators must perform a full template recovery:

1. **Delete Corrupted Files**:
   ```powershell
   Remove-Item -Recurse -Force "C:/Users/theal/substrate-node-template"
   ```
2. **Decompress Backup Tarball**:
   Use the clean template snapshot `C:/Users/theal/substrate-node-template.tar.gz`:
   ```powershell
   tar -zxvf "C:/Users/theal/substrate-node-template.tar.gz" -C "C:/Users/theal/"
   ```
3. **Compile Substrate Node binary (Native or WSL)**:
   Avoid compilation conflicts on Windows host by building inside the WSL container environment:
   ```bash
   cd /home/user/substrate-node-template
   cargo build --locked --release
   ```
4. **Rebuild the Local Docker Image**:
   If launching in the containerized production stack, build the image using the local Dockerfile:
   ```powershell
   docker build -t substrate-node:latest -f "C:/Users/theal/substrate-node-template/Dockerfile" "C:/Users/theal/substrate-node-template"
   ```

### 5.2. Backing up Substrate Chain State Database
The Substrate chain database stores blocks and pallet storage states (including `Timeslips` and `TimeslipRelations`) on disk.
- **Local host data path**: Mapped through volume mounting to the Docker volume `/data` (symbolically linked internally to `/polkadot/.local/share/polkadot` or hosted within `/var/lib/docker/volumes/mev_substrate_data/_data`).

#### Cold Database Snapshot (Binary Copy)
To prevent write corruption, stop the container before backing up the database files:
```powershell
# Stop the node
docker-compose -f D:/pqr.info/mev/docker-compose.prod.yml stop substrate-node

# Compress the data volume
tar -czvf "D:/pqr.info/backups/substrate_chain_state_$(date +%Y%m%d).tar.gz" -C "/var/lib/docker/volumes/mev_substrate_data/_data" .

# Restart the node
docker-compose -f D:/pqr.info/mev/docker-compose.prod.yml start substrate-node
```

#### Hot State Export (Substrate CLI)
To export the complete chain storage keys and values to JSON without stopping execution:
```bash
docker exec -t substrate-node /usr/local/bin/solochain-template-node export-state --chain dev > "D:/pqr.info/backups/substrate_state_export.json"
```

### 5.3. Restoring the Timeslips Ledger
If a consensus failure occurs, or the chain state database becomes corrupt, apply these restoration protocols:

1. **Wipe Broken Chain**:
   ```bash
   docker exec -it substrate-node /usr/local/bin/solochain-template-node purge-chain --chain dev -y
   ```
2. **Apply Cold Database Restoration**:
   If restoring from a physical volume snapshot:
   ```powershell
   # Stop the service
   docker-compose -f D:/pqr.info/mev/docker-compose.prod.yml stop substrate-node
   
   # Extract the snapshot
   tar -xzvf "D:/pqr.info/backups/substrate_chain_state_XXXXXXXX.tar.gz" -C "/var/lib/docker/volumes/mev_substrate_data/_data"
   
   # Restart the service
   docker-compose -f D:/pqr.info/mev/docker-compose.prod.yml start substrate-node
   ```
3. **Ledger Transaction Replay**:
   If the chain was purged and must be rebuilt, re-execute the ledger events from the CockroachDB transaction history logs. Read logs via SQL client:
   ```sql
   SELECT id, synthetic_id, title, rate, cost, start_time, end_time FROM antigravity.timeslips;
   ```
   Re-submit to the chain using the `substrate27kv` CLI tool:
   ```powershell
   # Syntax: substrate27kv store "<phrase>" <key_id_hex> <secret_text>
   D:/pqr.info/cmd/substrate27kv/substrate27kv.exe store "recovery phrase example..." 0x54696d65736c697073 "timeslip ledger record payload"
   ```

---

## 6. 🐧 WSL Mirrored Networking Recovery

Under Windows Subsystem for Linux (WSL 2) running in **mirrored mode** (`networkingMode=mirrored`), the Linux environment directly mirrors network interfaces from the Windows host rather than operating behind a Network Address Translation (NAT) virtual switch.

### 6.1. WSL Mirrored Mode Setup
The configuration is established in the host file `C:\Users\theal\.wslconfig`:
```ini
[wsl2]
networkingMode=mirrored
dnsTunneling=true
firewall=true
autoProxy=true
```

### 6.2. Loopback Mapping Failure
Due to conflicts in socket binding on Windows and WSL, requests routed through `localhost` or `127.0.0.1` between Windows applications (e.g. `windows_admin_agent.ps1`) and WSL Docker containers (e.g. `db`, `vault`) can fail.

#### Diagnostic Checks
1. Check if ports are listening on the WSL side:
   ```bash
   ss -tlnp | grep -E "5196|8200|9944"
   ```
2. Test connection from host PowerShell:
   ```powershell
   Test-NetConnection -ComputerName 127.0.0.1 -Port 5196
   ```

#### Recovery Actions
* **Action A: Bind to Wildcard Interface**: Ensure Docker configurations and application files listen on `0.0.0.0` instead of `127.0.0.1`.
* **Action B: Use Local Host/WSL Interface IP**:
  Extract the physical host IP interface assigned by Windows (e.g. `192.168.x.x` or `10.x.x.x`) and use it directly instead of `localhost`.
  ```powershell
  # Query local IP from Windows
  (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi" -AddressState Preferred).IPAddress
  ```
* **Action C: Revert to NAT Mode**:
  If loopback routing remains broken:
  1. Open `C:\Users\theal\.wslconfig` and replace the configuration:
     ```ini
     [wsl2]
     networkingMode=NAT
     localhostForwarding=true
     ```
  2. Perform a hard reset of the WSL subsystem from an elevated Command Prompt:
     ```cmd
     wsl --shutdown
     ```

### 6.3. Network Packet Drop Under Mirrored Mode
Operators may experience packet drops, high latency, or aborted TCP connections between WSL container services and host environments due to Checksum Offloading and MTU mismatch limitations.

#### Resolution Steps
1. **Adjust MTU sizes inside WSL**:
   Force the WSL primary ethernet interface (usually `eth0`) to match a conservative MTU (e.g. `1400` bytes) to prevent IP fragmentation issues over secure tunnels:
   ```bash
   sudo ip link set dev eth0 mtu 1400
   ```
2. **Disable Checksum Offloading on Host Network Adapters**:
   Run this command in an Administrator PowerShell console to disable checksum offloading features that cause packet corruption when mirroring:
   ```powershell
   Disable-NetAdapterChecksumOffload -Name "*" -Force
   ```
3. **Configure Windows Defender Firewall Exceptions**:
   Host firewalls often block ingress container traffic under mirrored networking. Apply the following firewall rules:
   ```powershell
   # Open local Swarm, database, vault, and RPC ports in the firewall
   New-NetFirewallRule -DisplayName "Swarm Mesh Ports" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 5196,8088,8200,8196,3196,9944,9933,8080,8081,1234
   ```

---

## 7. 🛠️ Local Admin States & Vault Token Backups

Continuity of local configuration states, management scripts, and vault tokens is required to maintain cluster operations.

### 7.1. Local Vault Token Protection
Clients and admin scripts authenticate with Vault using the token stored on the host filesystem.
- **Token path**: `C:\Users\theal\.vault-token` (Host) and `~/.vault-token` (WSL).

#### Token Backup Script (PowerShell)
This script backs up the local token to `D:/pqr.info/backups/vault/`:
```powershell
$tokenFile = "$env:USERPROFILE\.vault-token"
$backupDir = "D:\pqr.info\backups\vault"
$backupFile = "$backupDir\vault-token.txt"

if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }

if (Test-Path $tokenFile) {
    Copy-Item -Path $tokenFile -Destination $backupFile -Force
    Write-Host "✓ Vault token backed up to $backupFile" -ForegroundColor Green
} elseif ($env:VAULT_TOKEN) {
    $env:VAULT_TOKEN | Out-File -FilePath $backupFile -Encoding utf8
    Write-Host "✓ Active env VAULT_TOKEN backed up to $backupFile" -ForegroundColor Green
} else {
    Write-Warning "No Vault token found on host filesystem or environment variables."
}
```

#### Token Restoration Script (PowerShell)
```powershell
$backupFile = "D:\pqr.info\backups\vault\vault-token.txt"
$tokenFile = "$env:USERPROFILE\.vault-token"

if (Test-Path $backupFile) {
    $tokenValue = (Get-Content -Raw -Path $backupFile).Trim()
    $tokenValue | Out-File -FilePath $tokenFile -Encoding ascii -NoNewline
    [Environment]::SetEnvironmentVariable("VAULT_TOKEN", $tokenValue, "User")
    $env:VAULT_TOKEN = $tokenValue
    Write-Host "✓ Vault token restored to $tokenFile and user environment." -ForegroundColor Green
} else {
    Write-Error "Vault token backup file not found at $backupFile"
}
```

### 7.2. CockroachDB Memory Store Resiliency
Because the primary database is initialized with `type=mem`, all tables (including tickets, timeslips logs, and swarm state records) will be wiped on container exit.

#### Automated Backup Cron (WSL Linux)
To continuously capture the memory DB state, install a cron script inside the WSL machine:
Save as `/etc/cron.d/cockroach_backup`:
```bash
# Backup the memory DB to the host partition hourly
0 * * * * root docker exec -t db cockroach dump antigravity --insecure > /mnt/d/pqr.info/backups/db/antigravity_mem_hourly.sql
```

#### Graceful Teardown Auto-Dump (PowerShell)
Always wrap system teardown procedures with a hot database dump:
```powershell
# Save memory store state
Write-Host "Dumping CockroachDB memory store..." -ForegroundColor Yellow
$dumpFile = "D:\pqr.info\backups\db\antigravity_pre_shutdown_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"
docker exec -T db cockroach dump antigravity --insecure > $dumpFile

# Tear down container services
docker-compose down
Write-Host "✓ Saved $dumpFile and stopped services." -ForegroundColor Green
```

### 7.3. User-Level Admin Script States & Log Recovery
The administrative agent script [windows_admin_agent.ps1](file:///C:/Users/theal/windows_admin_agent.ps1) executes elevated tasks, maintains session configurations, and records audits to `C:\Users\theal\admin_agent.log`.

#### Admin Backup & Verification Script
Save this script as `D:/pqr.info/scratch/backup_admin_agent.ps1`:
```powershell
$agentScript = "C:\Users\theal\windows_admin_agent.ps1"
$agentLog = "C:\Users\theal\admin_agent.log"
$backupDir = "D:\pqr.info\backups\admin"

if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }

# Back up script
if (Test-Path $agentScript) {
    Copy-Item -Path $agentScript -Destination "$backupDir\windows_admin_agent.ps1" -Force
    Write-Host "✓ Administrative agent script backed up." -ForegroundColor Green
}

# Back up log
if (Test-Path $agentLog) {
    Copy-Item -Path $agentLog -Destination "$backupDir\admin_agent.log" -Force
    Write-Host "✓ Agent execution audit log backed up." -ForegroundColor Green
}
```

#### Admin Restoration & Health Validation
In the event of admin configuration corruption:
1. **Restore Script and Log**:
   ```powershell
   Copy-Item -Path "D:\pqr.info\backups\admin\windows_admin_agent.ps1" -Destination "C:\Users\theal\windows_admin_agent.ps1" -Force
   if (-not (Test-Path "C:\Users\theal\admin_agent.log")) {
       New-Item -Path "C:\Users\theal\admin_agent.log" -ItemType File | Out-Null
   }
   ```
2. **Re-Register Elevated Auto-Startup Configuration**:
   Ensure the script loads with elevated credentials on startup:
   ```powershell
   Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" -Name "SovereignAdminAgent" -Value "powershell.exe -NoProfile -ExecutionPolicy Bypass -File C:\Users\theal\windows_admin_agent.ps1"
   ```
3. **Verify API Connection**:
   Check if the LLM backend endpoint port (`1234` for LM Studio) is accessible:
   ```powershell
   $connection = Test-NetConnection -ComputerName 127.0.0.1 -Port 1234 -WarningAction SilentlyContinue
   if ($connection.TcpTestSucceeded) {
       Write-Host "✓ LM Studio API service is ONLINE on port 1234." -ForegroundColor Green
   } else {
       Write-Warning "LM Studio API is OFFLINE. The admin script will execute in OFFLINE mode."
   }
   ```
