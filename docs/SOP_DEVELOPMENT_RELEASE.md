# Sovereign Swarm Standard Operating Procedure (SOP) & Development/Release Governance

This document establishes the standard operating procedures, environment parity guidelines, coding policies, and verification checklists for the PQR Ticketing and Swarm Memory system. These protocols are designed to prevent typical operational failures, such as compilation mismatches, database timeouts, configuration drift, and database scan crashes.

---

## 1. Executive Summary & Core Failure Diagnostics

During system development and release phases, the PQR system is subject to specific host-container boundaries. Below is the diagnostic analysis of the four primary failure vectors:

| Failure Vector | Root Cause | Impact | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Windows Compilation Constraints** | OS-specific Go API imports (e.g., `golang.org/x/sys/windows` vs `golang.org/x/sys/unix`) called without appropriate build tag separation. | Compilation failures when building cross-platform code on Windows hosts or inside Linux containers. | Segregate platform-specific logic using `//go:build` tags. Enforce automated compilation tests on both platforms. |
| **Database Liveness Timeout** | Database drivers initialize lazily via `sql.Open`. The application proceeds to schema migration before the database container is listening. | Migrations fail on startup with `dial tcp: connection refused`, putting containers into crash loops. | Implement a blocking database connection check loop using `db.PingContext` with retries and exponential backoff. |
| **Vault Configuration Mismatch** | Environment variable names do not match (`PQR_VAULT_TOKEN` vs `VAULT_TOKEN`) and Vault running in `network_mode: "host"` cannot resolve inside the Docker bridge network. | Secret manager fails to initialize with a blank token, or containerized servers timeout trying to reach `http://vault:8200`. | Explicitly map resolved tokens to the environment before initializing clients. Direct containerized services to the host gateway IP. |
| **SQL NULL Scan Failures** | Scanning nullable database columns (e.g. `assigned_to`, `resolution`) directly into non-nullable variables (e.g., Go `string` fields). | Runtime panic or error `converting NULL to string is unsupported`, crashing user/agent query paths (e.g. `GetContext`). | Force usage of `COALESCE` in SQL queries or scan into `sql.NullString` types with validation checks. |

---

## 2. Mandatory Environment Parity Guidelines

To maintain parity between development workstations (Windows Host) and production-like deployment environments (Docker/WSL), developers must adhere to the following environment rules.

### 2.1. Platform-Specific Build Tags & API Isolation
Any service interacting with system-level resources (disk space, processes, folders) must isolate its platform-specific logic:
*   **Windows Host Logic**: Must be placed in a file prefixed or tagged with `//go:build windows` (such as [monitoring_disk_windows.go](file:///D:/pqr.info/internal/service/monitoring_disk_windows.go)).
*   **Linux/WSL Logic**: Must be placed in a file prefixed or tagged with `//go:build !windows` or `//go:build linux` (such as [monitoring_disk_unix.go](file:///D:/pqr.info/internal/service/monitoring_disk_unix.go)).

> [!WARNING]
> Never mix platform-specific imports (e.g., `golang.org/x/sys/windows` and `golang.org/x/sys/unix`) in a single Go source file. The compiler will reject the file on the opposite platform, blocking local test runs.

### 2.2. Containerized vs. Host Network Mappings
When running the cluster via Docker Compose, services reside in different network contexts:
*   **The Database Console**: Mapped to host port `8088` (`http://localhost:8088`) but listens on container port `8080`.
*   **The CockroachDB Server**: Mapped to host port `5196` (`127.0.0.1:5196`) for host-side tool connections (like DBeaver or Go tests), but uses container port `26257` inside the Docker network.
*   **The Gateway Load Balancer**: Mapped to host port `3196` (`http://localhost:3196`) for routing HTTP requests, and `443` for secure TLS tunnels.
*   **Vault Server**: When run with `network_mode: "host"`, it is exposed on the host's loopback interface (`http://localhost:8200`). Bridge-network containers cannot resolve the hostname `vault`. They must connect using the host network gateway (`http://172.17.0.1:8200` or `http://host.docker.internal:8200`).

### 2.3. WSL2 Mirrored Networking Standard Operating Procedure
In modern development workflows on Windows, WSL2 can be configured to use **Mirrored Networking Mode**. This mode mirrors the Windows network interfaces directly into the Linux guest, meaning that both the Windows host and the WSL2 guest share the same network ports and IP addresses.

#### 2.3.1. WSL2 Configuration (`.wslconfig`)
To enable mirrored networking and proper host loopback resolution, the global WSL configuration file located at [C:/Users/theal/.wslconfig](file:///C:/Users/theal/.wslconfig) must be configured with the following parameters:
```ini
[wsl2]
debugConsole=true
swap=8GB
swapFile=E:\\wsl.swap
networkingMode=mirrored
dnsTunneling=true

[experimental]
hostAddressLoopback=true
bestEffortDnsParsing=true
```
*   `networkingMode=mirrored`: Instructs WSL2 to mirror Windows network interfaces rather than creating a separate NAT bridge network. This allows services running inside WSL2 to be accessed directly on the host using `localhost` or `127.0.0.1`.
*   `hostAddressLoopback=true`: Allows loopback connection from WSL2 back to Windows using any IP address assigned to the host, facilitating seamless host-guest communications.

#### 2.3.2. Local Port Conflicts (e.g., Port 1111 vs. `iphlpsvc`)
Since mirrored networking shares the network interfaces, port conflicts between host services and WSL2 services will occur if both attempt to bind to the same port. A prime example is **Port 1111**, which can conflict with the Windows **IP Helper service (`iphlpsvc`)**.
*   **Root Cause**: `iphlpsvc` manages IPv6 transition technologies (like Teredo) and port proxy configurations (`netsh interface portproxy`). If there is an active port proxy rule binding to port 1111, or if a host system service registers on that port, Windows reserves it. This prevents any service inside WSL2 (such as database nodes or app instances) from binding to port 1111.
*   **Conflict Diagnostics**:
    1.  **Check Port Ownership**: Open an elevated PowerShell window on the Windows Host and run:
        ```powershell
        Get-NetTCPConnection -LocalPort 1111
        # Or alternatively:
        netstat -ano | findstr :1111
        ```
        If the output points to the PID of `svchost.exe` hosting `iphlpsvc`, the IP Helper service is holding the port.
    2.  **Inspect Port Proxy Rules**: Check if a portproxy rule exists:
        ```powershell
        netsh interface portproxy show all
        ```
*   **Resolution and Remediation**:
    1.  **Delete Conflicting Rules**: If there is an active proxy mapping port 1111, delete it:
        ```powershell
        netsh interface portproxy delete v4tov4 listenport=1111 listenaddress=0.0.0.0
        ```
    2.  **Restart IP Helper Service**: To flush active sockets held by the helper service, run:
        ```powershell
        Restart-Service -Name iphlpsvc -Force
        ```
    3.  **WSL Ignored Ports Directive**: If you want WSL2 to ignore port 1111 mirroring entirely, add `ignoredPorts=1111` to the `[wsl2]` section of `C:/Users/theal/.wslconfig`:
        ```ini
        [wsl2]
        ignoredPorts=1111
        ```
    4.  **Restart WSL**: To apply changes, shut down WSL and restart:
        ```powershell
        wsl --shutdown
        ```

#### 2.3.3. WSL-to-Host Loopback Diagnostics
To verify that network loopback communications are functioning properly across the host-container boundary under mirrored networking, perform the following two-way checks:
1.  **Host-to-WSL Loopback Diagnostics**:
    *   *Step A*: In the WSL2 terminal, run a netcat TCP listener on port 1111:
        ```bash
        nc -l 1111
        ```
    *   *Step B*: Open PowerShell on the Windows Host and attempt to connect to it:
        ```powershell
        Test-NetConnection -ComputerName localhost -Port 1111
        ```
    *   *Step C*: Verify that the output shows `TcpTestSucceeded : True` and that keystrokes typed in PowerShell appear in the WSL2 listener.
2.  **WSL-to-Host Loopback Diagnostics**:
    *   *Step A*: In PowerShell on the Windows Host, launch a Python web server listening on port 1111:
        ```powershell
        python -m http.server 1111
        ```
    *   *Step B*: In the WSL2 terminal, attempt to query the host's server:
        ```bash
        curl -I http://localhost:1111
        ```
    *   *Step C*: Verify that WSL receives an HTTP `200 OK` response, confirming that the loopback request successfully bypassed the guest-host boundaries.

### 2.4. Global Environment Management Policy
To prevent API key exposure and configuration drift between development environments, local configurations must follow a strict boundary policy between global secrets and containerized runtimes.

#### 2.4.1. Loading API Keys: `C:/Users/theal/.env` vs. Container Variables
1.  **Global Workspace Boundary**: Global secrets (such as `GEMINI_API_KEY`) must reside only in the host-level environment configuration file at [C:/Users/theal/.env](file:///C:/Users/theal/.env) (and never in the project folder's source-controlled directories).
2.  **Container Isolation Rule**: Containers must **never** mount `C:/Users/theal/.env` directly to their filesystem. Directly mounting files outside the workspace root breaks environment parity, causes filesystem lock failures in Windows/WSL2, and risks credentials leaking to the container image layers.
3.  **Secure Injection Protocol**: To pass host-level credentials to containers safely:
    *   Specify the variables in the `environment` section of `docker-compose.yml` without hardcoded values:
        ```yaml
        services:
          pqr-server:
            environment:
              - GEMINI_API_KEY=${GEMINI_API_KEY}
        ```
    *   Docker Compose will automatically inject the value from the host environment at execution time (which is populated from `C:/Users/theal/.env` during the host session setup).
    *   Verify inside the container that variables are set correctly using `printenv GEMINI_API_KEY` without committing the values to any configuration files.

#### 2.4.2. Secure Cleaning and Decommissioning Procedures
When decommissioning development environments, rotating credentials, or purging local states:
1.  **Anti-Slack Recovery Protocol**: Standard file deletion (e.g. `Remove-Item` or shift-delete) does not erase raw sectors on the disk, making plaintext keys recoverable from slack space.
2.  **Secure Deletion Procedure**:
    *   *Step 1*: Zero out or overwrite the target `.env` file first:
        ```powershell
        Clear-Content -Path "C:\Users\theal\.env" -ErrorAction SilentlyContinue
        ```
    *   *Step 2*: Overwrite the sectors with a dummy value before deletion to prevent slack space recovery:
        ```powershell
        Set-Content -Path "C:\Users\theal\.env" -Value "GEMINI_API_KEY=DECOMMISSIONED_AND_PURGED"
        ```
    *   *Step 3*: Remove the file securely:
        ```powershell
        Remove-Item -Path "C:\Users\theal\.env" -Force
        ```
3.  **Vault Secret Sweeping**:
    *   Before purging local `.env` files, use the helper script [sweep_secrets.ps1](file:///D:/pqr.info/sweep_secrets.ps1) to securely migrate local keys to the encrypted Vault instance.
    *   Run the script from an authorized shell:
        ```powershell
        .\sweep_secrets.ps1
        ```
    *   The script reads `.env`, uploads keys to `http://localhost:8200/v1/secret/data/pqr`, and automatically wipes the local `.env` file afterwards using the secure cleanup protocol.

---

## 3. Policy Rules for Modifying System-Level Go Code

All updates to the PQR Go backend must comply with the following four development policies. Code reviews will reject any pull request violating these rules.

### Policy 1: Safe Nullable Database Scans
Every nullable column defined in CockroachDB (e.g., `resolution`, `resolved_by`, `assigned_to` in the `tickets` table) must be scanned using one of the following two safe methods.

#### Wrong Pattern (Crashes on NULL)
```go
// This will crash if assigned_to is NULL in the database
err := r.db.QueryRowContext(ctx, "SELECT assigned_to FROM tickets WHERE ticket_id = $1", id).Scan(&t.AssignedTo)
```

#### Correct Pattern A (Using SQL COALESCE)
```go
// Guarantees a non-null string is returned to the scanner
err := r.db.QueryRowContext(ctx, "SELECT COALESCE(assigned_to, '') FROM tickets WHERE ticket_id = $1", id).Scan(&t.AssignedTo)
```

#### Correct Pattern B (Using Go sql.NullString)
```go
// Scans into a nullable wrapper and extracts value safely
var ns sql.NullString
err := r.db.QueryRowContext(ctx, "SELECT assigned_to FROM tickets WHERE ticket_id = $1", id).Scan(&ns)
if err == nil && ns.Valid {
    t.AssignedTo = ns.String
} else {
    t.AssignedTo = ""
}
```

### Policy 2: Active Database Liveness Verification
Before attempting schema migrations or launching server handlers, the database repository must verify connectivity by actively pinging the database with a retry limit.

```go
func NewCockroachRepository(connStr string) (*CockroachRepository, error) {
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to open database handle: %w", err)
	}

	// Configure connection pooling limits
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(10)
	db.SetConnMaxLifetime(30 * time.Minute)
	db.SetConnMaxIdleTime(10 * time.Minute)

	// Liveness verification retry loop
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	var pingErr error
	for attempt := 1; attempt <= 12; attempt++ {
		if pingErr = db.PingContext(ctx); pingErr == nil {
			log.Printf("[DB] Successfully connected to CockroachDB (Attempt %d)", attempt)
			break
		}
		log.Printf("[DB] Waiting for database liveness... (Attempt %d/12): %v", attempt, pingErr)
		time.Sleep(5 * time.Second)
	}

	if pingErr != nil {
		db.Close()
		return nil, fmt.Errorf("database failed liveness check after 60s: %w", pingErr)
	}

	return &CockroachRepository{db: db}, nil
}
```

### Policy 3: Explicit Vault Token Propagation
To ensure the Vault client is correctly authenticated when using fallback tokens, developers must explicitly bind the resolved token back to the process environment or pass it to the initialization logic.

```go
token := os.Getenv("PQR_VAULT_TOKEN")
if token == "" {
    token = os.Getenv("VAULT_TOKEN")
    if token == "" {
        token = "pqr-vault-token" // Default fallback
    }
}
// Establish environment sync before client initialization
os.Setenv("VAULT_TOKEN", token)

vaultClient, err := auth.NewVaultSecretManager()
```

### Policy 4: Example Test Quarantine
Integration tests (such as [example_test.go](file:///D:/pqr.info/example_test.go)) that connect to external ports (e.g. `http://localhost:8080`) must not block or fail the primary package unit tests when no server is running. They must dynamically check if the target endpoint is listening and skip the test if unreachable.

```go
func TestExampleAgentUsage(t *testing.T) {
	client := NewClient("http://localhost:8080")
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	healthy, err := client.Health(ctx)
	if err != nil || !healthy {
		t.Skip("Skipping example test: local integration server is not running on port 8080")
	}
    // Proceed with test logic...
}
```

---

## 4. Strict Release Verification Checklist

This checklist must be executed on a clean staging environment prior to pushing a release to the main branch. Each step must pass completely to prevent false positives.

### Step 1: Pre-Build Test suite Verification
Run the Go unit test suite on the host. Ensure that mock tests pass and integration-level example tests are skipped gracefully if the services are not running:
```powershell
# Run from the D:/pqr.info workspace directory
go test -v ./...
```
Verify that:
1. `TestCockpitRESTAndClient` returns `PASS`.
2. `TestExampleAgentUsage` and `TestExampleMultiAgentCoordination` either pass (if external server is running) or skip cleanly instead of failing the command.
3. No compilation errors occur in platform-restricted packages.

### Step 2: Clean Container Build
Ensure no old build caches interfere with the container image compilation:
```powershell
# Rebuild all containers from scratch
docker-compose build --no-cache
```
Verify that:
1. The multi-stage build completes without syntax or compiler errors.
2. The final image size of `pqr-server` is minimized and uses a stable base.

### Step 3: Deployment Liveness Probe (The 60-Second Rule)
Start the cluster and wait for initialization:
```powershell
docker-compose up -d
```
Do **not** run testing scripts immediately. A container can report `Up` initially but crash shortly after due to database timeouts or identity failures. 
*   **Wait 60 seconds** to allow database health checks and replicas to stabilize.
*   Run the verification query:
```powershell
docker ps
```
Verify that:
1. All services (`db`, `vault`, `pqr-server`, `gateway`, `tunnel`) report a status of `Up` and `healthy` (where health checks are configured).
2. The `STATUS` column has not reset to `Restarting (x)` or `Exited (x)`.

### Step 4: Inspect Container Logs for Warnings
Verify that the services are communicating correctly and that there are no connection failures to Vault or CockroachDB:
```powershell
docker-compose logs pqr-server
```
Check that:
*   `✓ Database schema initialized` is printed in the logs.
*   There are **no** `[WARNING] vault identity verification failed` messages.
*   There are **no** `dial tcp: connect: connection refused` warnings during the startup phase.

### Step 5: End-to-End CRUD Path Verification (Loopback Probe)
Perform direct loopback requests to the load balancer (`http://localhost:3196`) to verify the primary database paths (including nullable field scans):

#### 5.1. Create a Ticket (Generate a Nullable State)
```powershell
$ticketPayload = @{
    Title = "Release Probe Ticket"
    Creator = "verification-agent"
    Content = "Testing end-to-end CRUD path"
    Layer = 2
    Metadata = @{ "test" = $true }
} | ConvertTo-Json

$resp = Invoke-RestMethod -Uri "http://localhost:3196/REST/2.0/ticket" -Method Post -Body $ticketPayload -ContentType "application/json"
$ticketId = $resp.id
Write-Host "Created Ticket ID: $ticketId"
```

#### 5.2. Query Agent Context (Verifies SQL Scan on Nullable `assigned_to` and `resolution`)
Store agent memory linked to the new ticket:
```powershell
$memPayload = @{
    memory_type = "context"
    memory_data = @{ "status" = "probing" }
    relevance_score = 0.95
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3196/REST/2.0/agent/verification-agent/memory/$ticketId" -Method Post -Body $memPayload -ContentType "application/json"
```
Retrieve the agent's context. This executes the `GetContext` function, verifying that the nullable `assigned_to` column does not trigger a scan failure:
```powershell
$context = Invoke-RestMethod -Uri "http://localhost:3196/REST/2.0/agent/verification-agent/context" -Method Get
Write-Host "Context tickets retrieved: $($context.Count)"
```
Verify that the response returns HTTP `200 OK` and contains the ticket.

### Step 6: Database Metrics Validation
Inspect the internal metrics table to ensure the database records performance metrics properly.
```powershell
# Retrieve current database performance metrics
Invoke-RestMethod -Uri "http://localhost:3196/REST/2.0/health" -Method Get
```
Open the CockroachDB console at `http://localhost:8088` and verify:
1. Node status is active and healthy.
2. Under Databases -> `antigravity`, all tables exist with correct schemas.
3. Live SQL queries are monitored without active connection timeouts or syntax failures.

---

## 5. Strict Environment Parity Checklists

The following checklists must be run before any release is promoted to production or staging. Each checklist must be manually validated, step-by-step, with no skipped checkpoints.

### 5.1. Local Code Validation Checklist
- [ ] **Platform Build Tag Isolation Audit**:
  * Verify that any file containing imports from `golang.org/x/sys/windows` (e.g., `internal/service/monitoring_disk_windows.go`) contains the `//go:build windows` build tag at the very top.
  * Verify that any file containing imports from `golang.org/x/sys/unix` contains the `//go:build !windows` or `//go:build linux` tag.
- [ ] **Liveness Retry Loop Verification**:
  * Audit repository initializations (e.g., `NewCockroachRepository`). Ensure the connection code contains a blocking liveness check loop (minimum 12 attempts over 60 seconds) calling `db.PingContext`.
- [ ] **Safe SQL Null Scan Check**:
  * Search the database repositories for any `.Scan(...)` calls mapping to fields that can be `NULL` (such as `assigned_to`, `resolved_by`, or `resolution`).
  * Ensure all such query strings use SQL `COALESCE(column, '')` or scan into `sql.NullString` wrappers.
- [ ] **Integration Test Isolation Test**:
  * Run `go test -v ./...` on the host while the local servers are shut down.
  * Verify that all network integration tests (e.g., `TestExampleAgentUsage`) skip dynamically using `t.Skip` instead of failing the test suite.

### 5.2. Container Parity Checklist
- [ ] **Clean Rebuild Verification**:
  * Execute `docker-compose build --no-cache` to verify that the containerized Go compilation succeeds under clean conditions.
- [ ] **The 60-Second Stabilization Audit**:
  * Start the cluster using `docker-compose up -d`.
  * Wait exactly 60 seconds.
  * Run `docker ps` and check the status of `db`, `vault`, `pqr-server`, `gateway`, and `tunnel`. Verify that all are `Up` and `healthy` with no crash-restart loops.
- [ ] **Container Log Review**:
  * Execute `docker-compose logs pqr-server` and verify that:
    1. No `dial tcp: connection refused` warnings are printed.
    2. No `vault identity verification failed` errors exist.
    3. The message `✓ Database schema initialized` is present.
- [ ] **Network Port Mapping Verification**:
  * Run connection checks against key interface ports:
    - Gateway Load Balancer: `curl -I http://localhost:3196/REST/2.0/health` should return `200 OK`.
    - Database Console: Open `http://localhost:8088` and check database status.
    - CockroachDB Host Port: Run `Test-NetConnection -Port 5196 -ComputerName 127.0.0.1` to confirm host access.

### 5.3. Substrate Node Template Verification Checklist
- [ ] **BIP-27 Key Derivation Validation**:
  * Run the key derivation command locally:
    ```powershell
    cmd/substrate27kv/substrate27kv keygen "sample test phrase"
    ```
  * Verify that the derived 128-bit seed, 256-bit seed, public key, and SS58 Address are generated successfully.
  * Verify that the generated SS58 Address begins with the prefix `5` (confirming it is mapped to the generic Substrate network namespace).
- [ ] **SSH Credentials & File Protection Audit**:
  * Confirm that a valid private SSH key exists at `C:/Users/theal/.ssh/id_ed25519` (or `~/.ssh/id_ed25519` inside WSL2).
  * Ensure permissions on the SSH private key are restricted (only readable by the owner account; on Linux/WSL2, permissions must be `0600`).
- [ ] **Remote Node Connection Test**:
  * Verify SSH connectivity to the remote Substrate node IP (`204.168.138.60`):
    ```powershell
    ssh -o StrictHostKeyChecking=no -i C:/Users/theal/.ssh/id_ed25519 root@204.168.138.60 "echo connection_ok"
    ```
  * Verify that the command returns `connection_ok` without prompting for a password.
- [ ] **Remote State Synchronization Verification**:
  * Store a secret key-value pair on the remote node:
    ```powershell
    cmd/substrate27kv/substrate27kv store "sample test phrase" 0xabcd1234 "test_secret_data"
    ```
  * Verify that the store command completes without errors.
  * Query the secret key-value pair:
    ```powershell
    cmd/substrate27kv/substrate27kv get 0xabcd1234
    ```
  * Verify that the returned output matches the decrypted value `test_secret_data` exactly.
  * Revoke the secret key-value pair:
    ```powershell
    cmd/substrate27kv/substrate27kv revoke "sample test phrase" 0xabcd1234
    ```
  * Query the key again to verify that retrieval fails or returns empty, proving complete end-to-end synchronization.
