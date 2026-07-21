# )
HostSide Watchdog for the SWEND Sovereign Mesh
The Sentinel is a Windowsresident guardian agent responsible for ensuring that the SWEND Sovereign Mesh remains operational even when containerized components fail. It provides hostlevel resilience, autorecovery, and agentdriven orchestration across the entire stack.
🛰️ Core Functions
1. Engine Monitoring
Continuously checks whether the Docker Engine is responsive. If Docker becomes unresponsive, the Sentinel initiates corrective action.
2. Health Verification
Polls the SWEND REST 2.0 API:
Code
/REST/2.0/health
If the API becomes unreachable, the Sentinel escalates to recovery mode.
3. AutoRecovery
Automatically restarts the swend-server container or the entire stack when:
the health endpoint fails
the Docker Engine stalls
the Mesh becomes unreachable
This ensures continuous sovereign uptime.
4. AgentDriven Signal Handling
The Sentinel listens for “trigger files” created by agents inside containers. These triggers instruct the host to perform privileged operations such as:
full rebuilds
stack resets
targeted container restarts
This enables containertohost orchestration without exposing host privileges.
🚀 Deployment
Start the Sentinel from a Windows PowerShell terminal:
powershell
.\SENTINEL.ps1
Recommended deployment modes:
Visible terminal for realtime monitoring
Scheduled Task for background, persistent operation
The Sentinel should run continuously to maintain sovereign resilience.
🧬 InterProcess Communication (Agent → Host)
Agents inside Docker containers communicate with the host Sentinel via the shared:
Code
signals/
directory.
This directory acts as a unidirectional signaling bus for privileged hostside actions.
Triggering a Full Rebuild
Inside Container
bash
touch /app/signals/RESTART_TRIGGER
Sentinel Reaction
Detects the trigger file
Logs the request
Executes:
Code
docker-compose up -d --build
Clears the trigger file
This enables autonomous, agentinitiated stack regeneration.
📋 Monitoring & Logging
All Sentinel observations, health checks, and recovery actions are logged to:
Code
C:\Users\theal\pqr-info-swarm\sentinel.log
This provides:
full forensic traceability
historical uptime analysis
debugging context for Meshlevel anomalies
Status
🟢 Active Role: HostSide Watchdog System: SWEND Sovereign Mesh