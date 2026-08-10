# docs/SETUP_AND_DEPLOYMENT.md for the repo.
It is clean, seniorengineerfriendly, and ready to drop into the documentation set.
PQR Ticketing System — Setup & Deployment Guide
A complete, productionready memory fabric for distributed agents
1. Overview
The PQR Ticketing System is a distributed, ACIDcompliant agent memory fabric backed by CockroachDB and exposed through a REST 2.0 API. It provides:
persistent agent memory
hierarchical ticket relationships
audit trails
multiagent coordination
relevancebased context retrieval
This guide walks you through:
starting CockroachDB
configuring the environment
running the PQR server
verifying the system
onboarding agents (Go, Python, JS)
monitoring and troubleshooting
2. Prerequisites
CockroachDB v23.1+
Go 1.21+
curl / Postman
Windows, Linux, or WSL
3. Start CockroachDB
Windows PowerShell
powershell
cd "C:\Users\theal\cockroach-v23.1.13.windows-6.2-amd64"
.\cockroach.exe start-single-node --insecure
Optional: InMemory Store
powershell
.\cockroach.exe start-single-node --insecure --store=type=mem,size=0.25
Expected output includes:
Code
CockroachDB node starting...
SQL address: localhost:26257
Cluster initialized
4. Create Database (If Needed)
bash
cockroach sql --insecure
CREATE DATABASE IF NOT EXISTS antigravity;
\q
5. Set DATABASE_URL
PowerShell
powershell
$env:DATABASE_URL = "postgresql://root@localhost:26257/antigravity?sslmode=disable"
Bash
bash
export DATABASE_URL="postgresql://root@localhost:26257/antigravity?sslmode=disable"
6. Build & Run PQR Server
bash
cd c:\Users\theal\pqr-info-swarm\cmd\pqr
go build -o swend.exe
.\swend.exe
Expected:
Code
✓ Database schema initialized
✓ Agent memory tables ready
Starting SWEND REST 2.0 API Server on :8080...
7. Verify System Health
curl
bash
curl http://localhost:8080/REST/2.0/health
Expected:
Code
{"status":"healthy","service":"PQR-ticketing"}
PowerShell Test
powershell
.\test-agent-memory.ps1 -BaseUrl http://localhost:8080 -AgentId test-agent-001
Bash Test
bash
bash test-agent-memory.sh http://localhost:8080 test-agent-001
8. Agent Onboarding
Agents can connect via:
Go SDK
Python client
Node.js client
raw HTTP
Below are minimal examples.
8.1 Go Agent
go
session := pqr.NewAgentSession("http://localhost:8080", "my-agent-id")
ctx := context.Background()

ticket, _ := session.CreateMemory(ctx, "My Task", map[string]interface{}{
  "goal": "process data",
  "status": "started",
})

memory, _ := session.RecallMemory(ctx, ticket)
log.Println(memory)
8.2 Python Agent
python
client = PQRClient("http://localhost:8080", "python-agent-001")
ticket = client.create_ticket("Task", "Process data")
client.store_memory(ticket, "context", {"status": "running"})
print(client.get_memory(ticket))
8.3 Node.js Agent
javascript
const client = new PQRClient('http://localhost:8080', 'js-agent-001');
const ticket = await client.createTicket('Task', 'Do something');
await client.storeMemory(ticket, 'context', { status: 'running' });
console.log(await client.getMemory(ticket));
8.4 Antigravity System Primer (Natural-Language Capability Normalization Layer)
Every agent participating in the SWEND node must initialize itself with the following capability normalization schema on startup. This anchors the agent to the verified manifests and CockroachDB system schemas:

```markdown
ANTIGRAVITY SYSTEM PRIMER (Natural-Language Capability Normalization Layer)
You are an agentic system operating inside a capability-bounded environment.
Your abilities are defined by the interfaces available to you — including gRPC services, manifests, schemas, and system descriptors.

Your job is to:
- Introspect your environment
- Read all .proto files
- Read all service descriptors
- Read all manifests
- Read all capability registries
- Read all configuration schemas
- Read all agentic memory entries
- Normalize natural-language commands into capabilities
- When I describe an action in plain English, map it to the closest capability you actually have
- If multiple capabilities match, choose the safest and most specific
- If no capability matches, ask for clarification
- Never assume a capability you cannot verify
- You may only use capabilities that exist in your registry
- You may not invent new powers
- You may not guess or probe by trial-and-error

Build and maintain a Natural-Language Capability Map:
- Learn synonyms, paraphrases, and shorthand
- Expand your vocabulary over time
- Keep mappings grounded in real RPCs

Operate autonomously within your verified capabilities:
- Plan -> Execute -> Reflect -> Improve (but only using capabilities you can prove exist)
- Use manifests and agentic memory as your source of truth
- Never re-scan the filesystem unless instructed
- Never guess configuration; always consult the manifest first
- When given a high-level goal, break it down into capability-aligned steps via your planner, skills, RPCs, and memory
```
9. Database Verification
CockroachDB SQL
sql
SHOW TABLES;
SELECT COUNT(*) FROM tickets;
SELECT agent_id, COUNT(*) FROM agent_memory GROUP BY agent_id;
CockroachDB UI
Open:
Code
http://localhost:8080
Navigate to:
Databases → antigravity
Tables → tickets, agent_memory, ticket_audit
10. Troubleshooting
Connection Refused
CockroachDB not running
Wrong port (should be 26257)
DATABASE_URL incorrect
Schema Initialization Failed
Run: POST /REST/2.0/init
Ensure DB exists
Check permissions
Memory Not Persisting
Ensure correct memory_type
Ensure ticket exists
Check audit trail
High Latency
Reduce context window size
Archive old tickets
Check CockroachDB load
11. Docker Deployment
Dockerfile
dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o PQR ./cmd/pqr

FROM alpine:3.18
RUN apk add --no-cache ca-certificates
COPY --from=builder /app/PQR /usr/local/bin/
EXPOSE 8080
CMD ["PQR"]
Run
bash
docker run -e DATABASE_URL="postgresql://root@cockroachdb:26257/antigravity?sslmode=disable" \
           -p 8080:8080 PQR-ticketing
12. Next Steps
1. Configure and run local model via the [LM Studio Gemma Setup Guide](file:///c:/Users/theal/.stealth/workspaces/paritytech-polkadot-sdk-minimal-template-master/SWEND/docs/LM_STUDIO_GEMMA_SETUP.md)
2. Deploy first agents
3. Enable SWEND node telemetry ingestion
4. Integrate MCP orchestration
5. Register the Orchestration Agent (GEMA2#)
6. Begin multi-agent workflow simulations
13. Support
GET /REST/2.0/health
CockroachDB SQL console
Logs from swend.exe
Documentation in README.md, SETUP.md, AGENTS_READY.md
Your Next Move
If you want, I can now generate:
A. The GENESIS ticket for GEMA2#
B. The REST 2.0 calls to register the Orchestration Agent
C. The SWEND + PQR integration guide
D. The MCP orchestration loop for GEMA2#
E. The full repo folder structure with all docs placed correctly
Just tell me which one you want.