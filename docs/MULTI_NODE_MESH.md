# HighAvailability Architecture for Distributed Sovereign Nodes
To achieve true failover, redundancy, and sovereigngrade resilience across physical machines (e.g., Alienware and 201.mh), the Sovereign Mesh operates as a multinode distributed organism. Nodes collaborate over the network to maintain continuity, identity, and forensic integrity.
🏗️ Architecture Options
Option A — Shared Genesis (Simplest)
Alienware (Genesis Node)
Runs CockroachDB
Runs Vault
Runs Nginx
Runs PQR Server
201.mh (Worker Node)
Runs PQR Server only
Connects back to Alienware’s DB
Pros
Easiest to configure
Minimal moving parts
Cons
Alienware becomes a single point of failure for the database layer
Option B — Distributed Fabric (Recommended)
Both nodes operate as full peers in the Sovereign Mesh.
Alienware & 201.mh
Run CockroachDB in a multinode cluster
Run PQR Servers
Run Cloudflare Tunnel with the same token
Pros
High availability
Automatic failover
Seamless continuity if either machine goes offline
Global load balancing via Cloudflare Anycast
This is the canonical architecture for sovereigngrade redundancy.
🚀 Setup Instructions (Distributed Fabric)
1. Preparation
Ensure both machines can reach each other over the LAN.
Example IPs:
Alienware → 192.168.1.100
201.mh → 192.168.1.201
2. Configure Alienware (Node 1)
powershell
$env:NODE_ID = "alienware"
$env:JOIN_IPS = "192.168.1.100,192.168.1.201"
.\start_pqr.ps1
3. Configure 201.mh (Node 2)
powershell
$env:NODE_ID = "201.mh"
$env:JOIN_IPS = "192.168.1.100,192.168.1.201"
.\start_pqr.ps1
Both nodes will automatically discover each other and form a CockroachDB cluster.
🧬 Updated Docker Compose for MultiNode
The docker-compose.yml now uses:
Code
${NODE_IP}
for the CockroachDB listener address, enabling nodes to dynamically locate each other during cluster formation.
This ensures:
deterministic node identity
stable cluster membership
crossmachine replication
☁️ Cloudflare Redundancy
Running the Cloudflare Tunnel service on both machines with the same token creates an automatic Anycast failover mesh.
Benefits
Traffic to pqr.info is routed to the closest or healthiest node
Zero downtime during node restarts
Seamless failover during outages
Global routing without exposing local IPs
This transforms the Sovereign Mesh into a globally reachable, selfhealing organism.
📋 Verification Checklist
1. CockroachDB Cluster
Visit:
Code
http://localhost:8081
on either machine.
You should see:
Code
2 Nodes Active
2. API Health
Test:
Code
https://pqr.info/REST/2.0/health
You should receive a valid response even if one machine’s Docker stack is offline.
This confirms:
Cloudflare failover
DB replication
PQR redundancy
Mesh continuity
This version is ready for ingestion by your import script.