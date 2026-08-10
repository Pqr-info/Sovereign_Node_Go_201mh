# SpaceBook 5D Production Deployment Manifest

This formal deployment manifest outlines the end-to-end production operations, node classes, scheduling invariants, telemetry, security, and rollout sequencing for the Sovereign Mesh and the Mothership Coordination Hub.

## 1. Architecture Overview
The SpaceBook 5D mesh is a highly decentralized, multi-tiered infrastructure using a stratum-like coordination server (the Mothership) and a mobile-edge computing fabric (the Sovereign Mesh). All state transitions are deterministic and serialized via the 3-byte LPV-5D MIDI specification and atomic Teleportation Handoff protocols over the Cloudflare Zero Trust overlay.

## 2. Node Classes & Topology

### 2.1 Mothership (Stratum Engine)
* **Tier**: Layer-0 Global Coordination.
* **Role**: State-authoritative registry, PoUW Workload Issuer, Teleportation Scheduler.
* **Requirements**: High-throughput, stable network core, Cloudflare Workers/Durable Objects.

### 2.2 Sovereign Edge Nodes (Mobile/Desktop NPU)
* **Tier**: Layer-1 Compute Plane.
* **Classes**:
  * **Temporal-Verifier**: Validates PoUW blocks via redundancy checks.
  * **AR-Render-Relay**: Computes spatial matrices for the SpaceBook 5D UI.
  * **DampenerNode**: Anchors the Drift Arbitration Loop to enforce structural topology.
  * **GossipLeader**: Ingests and routes Stadium Chatter across sub-clusters.
* **Requirements**: Local Valkey memory cache, Adreno/ANE/Tensor/Orin NPU processing, strict thermal and drift management.

## 3. Scheduler Invariants
The Teleportation Scheduler guarantees atomic, strictly deterministic execution bound by the following invariants:
* **Capability Bound**: A Role binds only to a Node where `node.capabilities >= role.requirements`.
* **Idempotency**: All execution states track `attempt_id` to prevent double-execution during edge migration.
* **Atomic Teleportation**: No state is finalized on a target node `N_dst` until `validate_and_unpack` verifies the exact structural checksum and ternary bounds (max density 26). Governed by the **SysEx Matrix Serialization Pipeline** (see [lpv5d_dal_sysex_pipeline.md](lpv5d_dal_sysex_pipeline.md)).
* **Parity Guarantee**: Nodes with `Φ > 0` are instantly isolated until the Drift Arbitration Loop (DAL) re-syncs the tensor. Drift thresholds and state transitions follow the **DAL Blueprint** (see [lpv5d_dal_sysex_pipeline.md](lpv5d_dal_sysex_pipeline.md)).

## 4. Telemetry and Gossip (The Great Chorus)
* **Ingress**: All logs and metric telemetry from edge nodes are submitted in real-time as multiplexed PoUW proofs.
* **Stadium Chatter**: Sub-cluster communication occurs directly between nodes via local gossip networks, piping aggregate performance and cluster health (thermal states, validation times, drift metrics) to the `stadium_chatter.js` listener.
* **JetWeb Time Machine**: The 5D State Spine acts as an append-only log allowing retrospective auditing and replay of all teleportations and state mutations.

## 5. Security Posture
* **Overlay Routing**: All nodes communicate exclusively over the `100.64.x.x` private Cloudflare Zero Trust Mesh. No public endpoints expose raw RPC operations.
* **Anti-Hallucination Guard**: Rust-level hard bounding rejects any tensor updates containing data outside of the Ternary `0, 1, -1` parameters or exceeding the macro-boundary 26 threshold.
* **Proof-of-Useful-Work (PoUW)**: Incentive spoofing is mitigated through probabilistic/deterministic redundancy checks matching edge node output hashes.

## 6. Operational Runbooks

### 6.1 Node Thermal Throttling Response
1. Teleportation Scheduler receives telemetry indicating `node.thermal_headroom < 10%`.
2. Scheduler flags `N_src` as `degrading`.
3. Atomic Handoff protocol initiates (Freeze, Checkpoint, Serialize, Transfer, Unpack, Rebind) transferring the Job to a stable node `N_dst`.
4. Original node `N_src` is tombstoned and blocked from high-intensity computing Roles until thermal clearance.

### 6.2 Parity Lock / Drift Resolution
1. `N_src` detects spatial parity error (`Φ > 0`).
2. Job is locked on `N_src` as the Drift Arbitration Loop enters the `SCAN` state.
3. The DAL triggers the necessary Macro-Rotation Sequence (e.g., MRS-06 for `CRITICAL` state) to clear the valence faults, applying 7-bit SysEx encoding to state boundaries.
4. Tensor is structurally re-verified by Rust `symbolic_physics.rs` before operations resume. For full loop timing and invariants, see [lpv5d_dal_sysex_pipeline.md](lpv5d_dal_sysex_pipeline.md).

## 7. Rollout Sequencing
* **Phase 1 (Alpha):** Mothership deployment on single unified Cloudflare Worker instance. Genesis PoUW Stratum node initialized.
* **Phase 2 (Beta):** Deployment of 10-50 controlled Sovereign Edge Nodes (Mobile/Desktop apps) performing AR-Render and verifications. Teleportation Scheduler stress testing.
* **Phase 3 (RC):** Integration of commercial API allowing third-party workloads.
* **Phase 4 (GA):** Global onboarding. Compute Time/Hash Token (CTHT) economy enabled. Multi-LLM Fireside chat open for distributed consensus queries.
