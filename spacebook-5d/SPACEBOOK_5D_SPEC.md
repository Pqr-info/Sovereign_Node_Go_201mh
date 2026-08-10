# SpaceBook 5D & Sovereign-27: Architecture & Phased Spec

**Chief Architect**: Qwen Coder Next
**Core Engine**: Deterministic 5D State Machine (LLM-in-the-Loop Bypass)
**Storage Layers**: L3 (Valkey/Redis - Volatile Telemetry) & L6 (Substrate 27 / SQLite - Cryptographic Consensus)

---

## Part I: Foundation & Resonance (Phases 1-4)
*The scaffolding of the geospatial mesh and initial resource acquisition.*

### Phase 1: Telemetry Heartbeat & Mesh Initialization
- **Mechanic**: Agents (users/nodes) ping the L3 Redis layer with geospatial coordinates (lat/lng) and phase frequencies.
- **State Transition**: `OFFLINE` -> `ACTIVE_NODE`
- **Architecture**: Ephemeral key-value storage (`mesh:active_nodes`) with 60-second TTLs to ensure only live nodes contribute to network physics.

### Phase 2: Mesh Cohesion Topology (MCF)
- **Mechanic**: The system continually calculates the Mesh Cohesion Factor (MCF), a density and harmony metric based on the number of overlapping active nodes.
- **State Transition**: Dynamically impacts global state difficulty (0.0 to 1.0 MCF).
- **Architecture**: A localized mesh density graph that influences all subsequent probability curves in the deterministic engine.

### Phase 3: Frequency Tuning & Anomaly Extraction
- **Mechanic**: Agents lock onto spawned anomalies (Admin or System generated) using resonance frequencies. 
- **State Transition**: `ACTIVE_NODE` -> `FLUX_HARVESTED` (Success) or `RECOVERY` (Decoherence).
- **Architecture**: The deterministic state machine hashes the payload, MCF, and agent ID to simulate LLM logic. Successful tuning extracts **Starlight Flux**, logged directly to the L6 Cryptographic Substrate.

### Phase 4: Astral Node Synthesis
- **Mechanic**: Agents spend massive amounts of accumulated Starlight Flux to instantiate permanent "Astral Nodes" at physical coordinates.
- **State Transition**: `FLUX_HARVESTED` -> `NODE_ACTIVE` or `RIFT_OPENED`.
- **Architecture**: Requires an MCF threshold. Fails if the network lacks cohesion, causing Flux to burn out. Successful synthesis permanently alters the geospatial layer, recorded as `ASTRAL_NODE_SYNTHESIS` in L6.

---

## Part II: Reputation & Dimensional Depth (Phases 5-8)
*Advanced mechanics unlocking hidden mechanics and group dynamics.*

### Phase 5: Agent Trust Index (ATI) Evaluation
- **Mechanic**: Every action run through the deterministic engine shifts the Agent's Trust Index (ATI). Successful stabilization builds trust; decoherence reduces it.
- **State Transition**: `UNVERIFIED` -> `TRUSTED_AGENT` -> `SOVEREIGN_CANDIDATE`.
- **Architecture**: ATI is derived securely via state machine outputs and cached in L3 while permanently audited in L6, preventing brute-force exploitation of the mechanics.

### Phase 6: Dynamic Discovery & Hidden Layers
- **Mechanic**: High ATI agents can scan the mesh for hidden dimensional frequencies that lower-trust agents cannot perceive.
- **State Transition**: `TRUSTED_AGENT` -> `ELEVATED_SENSE`.
- **Architecture**: Deterministic evaluation checks the agent's ATI against the target sector's resonance signature. Yields high-value lore artifacts and rare anomaly spawns.

### Phase 7: Faction & Guild Consensus
- **Mechanic**: Astral Nodes in close proximity can be linked to form Harmonic Clusters. 
- **State Transition**: `NODE_ACTIVE` -> `HARMONIC_CLUSTER`.
- **Architecture**: Multi-agent state evaluation. Requires synchronized L6 commits from multiple distinct agent IDs within a short temporal window.

### Phase 8: Dimensional Rift Mitigation
- **Mechanic**: Failed Astral Node syntheses leave behind Rifts (negative MCF impact zones). Agents must collaborate to tune inverse frequencies to seal them.
- **State Transition**: `RIFT_OPENED` -> `RIFT_SEALED`.
- **Architecture**: An anti-state mechanic where Rifts actively degrade surrounding ATI and MCF until sufficient Flux is spent to resolve the block.

---

## Part III: The Sovereign Orchestration (Phases 9-13)
*The endgame of the 5D state machine, resulting in network transcendence.*

### Phase 9: Cross-Node Synchronization
- **Mechanic**: Harmonic Clusters route data across sectors, enabling global operations without physical proximity.
- **State Transition**: `HARMONIC_CLUSTER` -> `GLOBAL_RESONANCE`.
- **Architecture**: The state machine evaluates the shortest path across the L3 topology, allowing remote anomaly extractions.

### Phase 10: Sovereign Core Awakening
- **Mechanic**: Triggered only when the global MCF reaches 0.95 and multiple agents reach the ATI cap.
- **State Transition**: `GLOBAL_RESONANCE` -> `CORE_AWAKENED`.
- **Architecture**: A highly guarded L6 genesis event for the endgame loop. It shifts the deterministic state machine into "Hardmode," halving extraction yields and doubling Rift probabilities.

### Phase 11: Substrate Mutation
- **Mechanic**: The physical rules of the Spacebook 5D app change. New telemetry inputs (like localized altitude or multi-device sensor fusion) are required for extraction.
- **State Transition**: `CORE_AWAKENED` -> `MUTATED_STATE`.
- **Architecture**: Qwen Coder Next's engine shifts the hash seeds for the deterministic roll, requiring completely new frequency inputs from the frontend clients.

### Phase 12: LLM-in-the-Loop Transcendence
- **Mechanic**: The deterministic state machine assumes autonomous governance over anomaly spawns, acting as a simulated Game Master entirely driven by node density and ATI distributions.
- **State Transition**: `MUTATED_STATE` -> `AUTONOMOUS_GOVERNANCE`.
- **Architecture**: Replaces Admin Control Panel spawns with localized procedural generation, scaling difficulty based on the real-time MCF data.

### Phase 13: Sovereign-27 Orchestration (Final Consensus)
- **Mechanic**: The ultimate synchronization event. Agents lock their maxed Astral Nodes to the Sovereign Core in a synchronized global heartbeat.
- **State Transition**: `AUTONOMOUS_GOVERNANCE` -> `TRANSCENDED`.
- **Architecture**: Yields a `SOVEREIGN_ORCHESTRATION` block on the L6 Substrate. Transcended agents have their ATI and Flux permanently etched into the genesis block of a newly branched Substrate, resetting the 5D gamification loop but retaining their immutable Sovereign credentials.
