# Practical Procedures for Managing and Monitoring the SWEND Sovereign Node
This guide defines the operational workflows for lifecycle management, forensic monitoring, autonomous healing verification, and connectivity testing within the SWEND Sovereign Mesh.
🚀 Lifecycle Management
The entire Sovereign Mesh is orchestrated via Docker Compose. All core services — PQR Server, Tunnel, CockroachDB, Vault, HUD — are managed through these commands.
Start the Node
powershell
.\start_pqr.ps1
Stop the Node
powershell
docker-compose down
Restart a Specific Service
bash
docker-compose restart swend-server
docker-compose restart tunnel
These commands allow targeted restarts without disrupting the entire Mesh.
🔍 Forensic Monitoring
Monitoring is essential for understanding agent evolution, vitality, and system health.
View RealTime Logs
bash
# All services
docker-compose logs -f

# Just the server
docker logs -f pqr-info-swarm-swend-server-1

# Just the tunnel
docker logs -f pqr-info-swarm-tunnel-1
Check Database Health
Open the CockroachDB console:
Code
http://localhost:8081
This provides visibility into cluster membership, replication status, and node health.
🧬 Autonomous Healing Verification
To observe what the agents are currently reasoning about:
Open the HUD:
Code
http://localhost:3196/hud
Look for tickets in Layer 7 (Identity/Security) or Layer 10 (Governance).
Inspect the IntentBlob to view the agent’s reasoning chain and proposed resolution.
This provides full transparency into the Mesh’s autonomous decisionmaking.
🧪 Testing Connectivity
To verify Cloudflare Tunnel routing and Access bypass headers:
powershell
$headers = @{ 
  "CF-Access-Client-Id" = "c98ca7026f54305b05cd24975a3ce6d2.access";
  "CF-Access-Client-Secret" = "ebf3177d992adb0c3db7b088fb5b9e3d83e96649fb9bc5b86a25301af5c8e744"
}
Invoke-RestMethod -Uri "https://pqr.info/REST/2.0/health" -Headers $headers
A successful response confirms:
Tunnel is active
Access wall is bypassed
PQR Server is reachable
Sovereign Mesh is externally operational
This version is ready for ingestion by your import script.