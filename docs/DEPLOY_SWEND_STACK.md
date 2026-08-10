# SWEND Stack & Client Suite Deployment Guide
A complete jumpstart for the pqr.info repository
1. Purpose
This repository provides a full, readytodeploy SWEND stack including:
the core daemon (Go)
multiOS client installers (Windows, WSL, Linux, Android)
MCP server stubs for agent integration
a complete internal Wiki
a singlecommand bootstrap path for future automation
This is the jumpstart for engineers evaluating SWEND as a universal execution substrate.
2. Repository Location
Local path:
Code
C:\Users\theal\pqr.info
Remote origin (to be authenticated manually):
Code
git@github.com:Pqr-info/pqr.info.git
Note: GitHub CLI (gh) is not authenticated and SSH keys are not yet accepted. The final git push must be run manually after authentication.
3. Repository Structure
Code
pqr.info/
├── cmd/
│   └── swend/
│       └── main.go
├── clients/
│   ├── windows/
│   │   └── install_swend.ps1
│   ├── wsl/
│   │   └── install_swend.sh
│   ├── linux/
│   │   ├── install_swend.sh
│   │   └── swend.service
│   └── android/
│       └── SwendClientStub.kt
├── mcp/
│   ├── swend_mcp_server.py
│   ├── mcp_config.json
│   └── example_agent_tool.py
├── docs/
│   ├── WIKI_ARCHITECTURE.md
│   ├── WIKI_PROTOCOL.md
│   ├── WIKI_TROUBLESHOOTING.md
│   └── DEPLOY_SWEND_STACK.md   ← this document
├── go.mod
└── README.md
Each component is designed to be immediately understandable and modifiable by a systems engineer.
4. Core Components
4.1 SWEND Daemon (Go)
cmd/swend/main.go
Implements:
node identity generation
orchestrator handshake
RPC server
task leasing loop
telemetry streaming
local CockroachDB interactions
optional TUI commands
go.mod
Includes:
gRPC
protobuf
CockroachDB client
crossplatform syscall helpers
5. MultiOS Client Installers
5.1 Windows
clients/windows/install_swend.ps1
Downloads Go (if missing)
Compiles SWEND
Registers it as a Windows Service
Handles elevation and firewall rules
5.2 WSL
clients/wsl/install_swend.sh
Detects correct WSL IP
Avoids Docker loopbacks
Compiles SWEND inside WSL
Runs SWEND as a background job
5.3 Linux
clients/linux/install_swend.sh clients/linux/swend.service
Installs dependencies
Compiles SWEND
Installs systemd unit
Enables + starts service
5.4 Android
clients/android/SwendClientStub.kt
Kotlin stub for interacting with SWEND
Demonstrates mobile → SWEND → orchestrator flow
Mirrors Quantasonastyle client behavior
6. MCP Integration
6.1 MCP Server Stub
mcp/swend_mcp_server.py
Exposes tools for:
node enumeration
portproxy inspection
ledger block queries
ticket verification
remote execution passthrough
6.2 MCP Config
mcp/mcp_config.json
Defines:
tool names
argument schemas
execution modes
environment bindings
6.3 Example Agent Tool
mcp/example_agent_tool.py
Demonstrates:
connecting to the MCP server
invoking SWEND tools
consuming results
building multistep workflows
7. Internal Wiki
7.1 Architecture