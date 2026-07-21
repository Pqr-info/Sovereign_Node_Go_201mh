# System Architecture Wiki for the Swarm Execution Node Daemon
The SWEND (Swarm Execution Node Daemon) is the unified execution runtime deployed across all validator nodes in the Sovereign Mesh. It coordinates task execution, synchronizes system state, and provides an intelligent sandbox for multiagent processes.
1. System Topology Overview
SWEND operates as a distributed execution fabric under the direction of a central Coordinator (Mothership). Nodes communicate over two planes:
gRPC Control Plane — authoritative commands, schema updates, state transitions
iPN Gossip Bus — highspeed, peertopeer vitality and deliberation exchange
All nodes persist state into a CockroachDB cluster, ensuring ACIDcompliant consensus and historical replay.
mermaid
graph TD
    A[Mothership / Coordinator] -->|gRPC Control Plane| B(SWEND Node 1)
    A -->|gRPC Control Plane| C(SWEND Node 2)
    A -->|gRPC Control Plane| D(SWEND Node 3)
    B <--->|iPN Gossip Bus| C
    C <--->|iPN Gossip Bus| D
    B <--->|iPN Gossip Bus| D
    B -->|Schema/State| E[(CockroachDB Cluster)]
    C -->|Schema/State| E
    D -->|Schema/State| E
This topology provides:
deterministic state replication
highspeed deliberation
multinode redundancy
sovereigngrade failover
2. Core Subsystems
2.1. Ouroboros Watchdog Sentinel
The Ouroboros Sentinel is the internal watchdog daemon embedded within every SWEND instance. Its responsibilities include:
Failure Detection Monitors gRPC services, HTTP APIs, and local bridges for flatlines.
RADIUS Audit Queries RADIUS to classify and audit the failure event.
Jetweb Time Machine Logging Records state deviation for historical replay and forensic reconstruction.
Resurrection Loop Immediately restarts the failed process unit using the local resurrection engine.
This ensures continuous uptime and selfhealing execution.
2.2. Relational Memory Layer
SWEND organizes agent memory as relational tickets stored in CockroachDB rather than a keyvalue store.
Benefits
ACIDcompliant consensus for all agent decisions
Dynamic parentchild linkage to prevent history drift
Full historical replay for diagnostics, governance, and lineage reconstruction
This transforms the Ticketing Fabric into a relational knowledge graph with deterministic evolution.
2.3. Starbirth Synchronization
Starbirth regulates validator cluster size and ensures the Mesh never drops below the 7node validator floor.
Starbirth Workflow
Detects when active nodes < 7
Invokes the Capicant Provisioner
Dynamically deploys external VPS nodes (GCP, Hetzner, AWS)
Configures them via automated SSH/gRPC
Redistributes computing rewards across active participants
Starbirth ensures validator quorum, economic fairness, and sovereign continuity even during node attrition.

2.4. Sovereign UI Asset Extraction Layer (Autonomous Bridge)
The Autonomous Bridge dashboard ("Sovereign V10.0") is hosted as an independent static web asset inside the monorepo framework:
- Extraction Source: Decoded from JSON field inside `s25_manifest.json` (UTF-16LE).
- Extracted Asset Location: `web/autonomous_bridge.html` (UTF-8).
- Production Ingress: Served directly by the local Nginx container gateway (port `3196`) mounting `./web` into the HTTP root directory.
This separation facilitates front-end readability, decouples UI templates from raw database manifests, and supports high-performance static rendering.

This version is fully polished and ready for ingestion by your import script.