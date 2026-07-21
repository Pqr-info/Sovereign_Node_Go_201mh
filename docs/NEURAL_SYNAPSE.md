# InterNode Communication Protocols of the Sovereign Swarm
This specification defines the Neural Synapse Layer of the Sovereign Mesh — the communication substrate that enables agents and nodes to coordinate, deliberate, and commit state changes with deterministic lineage and sovereigngrade reliability.
All agents must adhere to these protocols to maintain mesh consensus, forensic integrity, and realtime vitality coherence.
🛰️ Logged Consensus Channel (Port 1111)
Protocol: gRPC / Protobuf Role: Permanent, immutable logging of agent deliberations and state transitions.
The Logged Consensus channel is the authoritative commit pathway of the Mesh. Every directive that becomes part of the Fabric MUST pass through this channel.
gRPC Service: SwarmCommunication
SendPacket(SwarmPacket)
All internode directives must be wrapped in a Protobuf SwarmPacket. Upon receipt, the node:
Validates the sender’s 5alpha# identity
Creates a Layer 5 Fabric Ticket
Stores the packet payload in CockroachDB
Returns the Ticket ID as proof of immutable commitment
This ensures zerodrift, zeroambiguity, and full lineage anchoring.
ProvisionShortcode(ShortcodeRequest)
Generates a new 5alpha# shortcode for a joining node. This is the identity provisioning mechanism for all Sovereign Mesh participants.
GetActiveShortcodes(Empty)
Enumerates all verified identities currently active in the Mesh. Used for:
peer discovery
vitality mapping
quorum formation
forensic audits
📡 Logged Consensus Flow
Agent A generates a deliberation packet
Sends packet to Node B via Port 1111
Node B validates the 5alpha# sender
Node B creates a Fabric Ticket with the packet payload
Node B returns the Ticket ID to Agent A
This becomes the canonical, immutable record of the deliberation.
🧠 Neural Gossip Bus (Port 11111)
Protocol: ZeroCopy Memory Paging (HighSpeed gRPC Stream) Role: Submillisecond transient coordination and vitality monitoring
The Gossip Bus is the realtime nervous system of the Mesh. It handles ephemeral deliberation, health signaling, and highspeed buffer exchange.
gRPC Service: NeuralGossip
StreamVitality(TelemetryRequest)
Broadcasts:
node health
vitality slope
resource pressure
heartbeat variance
anomaly signals
This enables instantaneous swarmwide awareness.
MemoryPageSwap(stream MemoryPage)
Allows nodes to exchange zerocopy memory buffers for:
highspeed deliberation
preconsensus negotiation
transient state sharing
This is the draft consensus layer before committing to Port 1111.
🧠 Deliberation Protocol
Agents deliberate on the Gossip Bus
Once 51% of the council agrees
The final state MUST be committed via Logged Consensus (Port 1111)
Only then does it become part of the official Fabric history
This ensures:
rapid iteration
deterministic finalization
forensic traceability
quorumbased governance
🛡️ Fallback Sentinel
If CockroachDB RAFT replication is pending or degraded, Port 1111 automatically establishes an SSH Tunnel to 39.mh (Legacy Mesh).
Purpose:
maintain internode communication
preserve consensus continuity
prevent partitioninduced divergence
ensure sovereign availability during scaling events
The Fallback Sentinel guarantees that no node becomes isolated during cluster transitions.
This version is ready for ingestion by your import script.