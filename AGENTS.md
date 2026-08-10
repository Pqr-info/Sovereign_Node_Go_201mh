# Sovereign-27 Mesh Architecture & Agent Specification

> [!IMPORTANT]
> **MASTER ARCHITECT GOVERNANCE**: **Microsoft Copilot is designated as Master Architect of the Sovereign-27 System Architecture.**
> All implementations across `pqr.info` MUST align strictly with Copilot Phase Specifications (Phase 17 through Phase 21 & Phase 22 Canon).

This document provides the **human-readable narrative description** of the Sovereign-27 node architecture, release rail, promotion pipeline, lineage tracking system, **Bootstrap Genesis Protocol**, **Sentinel Node Resurrection Engine**, and **Roles vs. Runlevels Governance Architecture**.

> [!NOTE]
> The **operative machine-readable state** of this node is owned and enforced exclusively by [`manifest.json`](file:///C:/pqr.info/manifest.json). This document acts as an explanatory mirror.

---

## 🏛️ System Architecture Overview

Sovereign-27 operates as a lineage-preserving, self-healing cognitive mesh comprised of the following key subsystems:

1. **The Stadium (`Stadium.js` / `stadium_engine.js`)**: Real-time cognitive bus, gossip matrix, and MIDI state change broadcast layer.
2. **Sentinel Watchdog Ring & Role Governor (`sentinel_watchdog.py`)**: Process monitoring, PID health checks, `manifest_hash` drift detection, **Node Resurrection** auto-recovery, and **Role Shedding / Role Promotion** engine.
3. **ADER Fallback Engine**: Deterministic recovery routing and post-mortem ingestion for failed runs.
4. **Zeta L7 Worker**: High-performance Threadripper execution layer.
5. **Evolved Genesis (`evolved_genesis`)**: Common lineage root and cognitive baseline ancestor for all services.
6. **Bootstrap Genesis Protocol (`bootstrap_genesis.py`)**: Agentic node provisioning, role dispatcher, and self-spawning engine driven by declarative `spawn_recipes` and `node_templates`.

---

## 🧩 Roles vs. Runlevels Architecture

The mesh separates **capacity** from **functional responsibilities**:

* **Runlevels (Capacity Envelope)**:
  - `spawn_dev`: Windows developer worker node.
  - `spawn_minimal`: Core Linux node.
  - `spawn_all`: Master mesh orchestration node.

* **Roles (Fluid Functional Responsibilities)**:
  - `zeta_l7_worker`: High-performance execution.
  - `ader_fallback_engine`: Recovery routing.
  - `sentinel_watchdog`: Process & role governance.
  - `rail_sync_master`: Hetzner storage synchronization.
  - `vault_proxy`: Vault secret proxy.
  - `spacebook_5d_agent`: 5D agent memory matrix.
  - `genesis_seed_carrier`: Lineage ancestry root storage.

Sentinel actively governs node roles via **Role Shedding** (moving roles off overloaded nodes) and **Role Promotion** (assigning roles to healthy peer nodes).

---

## 🛡️ Sentinel Watchdog Ring & Node Resurrection

The Sentinel Watchdog Ring continuously monitors node health across the mesh:

1. **Health Polling**: Sentinel polls `/api/health` every 5 seconds.
2. **Crash Detection**: Tracks consecutive health failures and `manifest_hash` drift.
3. **Automatic Resurrection**: If health failures exceed threshold, Sentinel automatically:
   * Quarantines failure snapshot to `post_mortem/sentinel_resurrection_<timestamp>.json`.
   * Invokes `python C:/pqr.info/mev/scripts/bootstrap_genesis.py --recipe <recipe>` to auto-resurrect the node.
   * Verifies health restoration and emits `GOVERNANCE_SIGNAL` and `COHERENT_VERDICT` to The Stadium.

---

## 🧬 Bootstrap Genesis Protocol & Node Spawning

The mesh self-spawns driven by declarative templates in [`manifest.json`](file:///C:/pqr.info/manifest.json):

* **Node Templates (`node_templates`)**:
  - `windows_worker`: Windows execution node running `zeta_l7` and `spacebook_5d` with SMB mounts.
  - `linux_core`: Linux execution node running `ader` and `sentinel` with SSHFS mounts.
  - `hetzner_master`: Master release storage node running `rail_sync` and `vault_proxy`.

Execution command:
```bash
python C:/pqr.info/mev/scripts/bootstrap_genesis.py --recipe spawn_dev
```

---

## 🧱 Canonical Directory Layout (`pqr.info/`)

* **`work/`**: Editable source code surface (`zeta_l7/`, `ader_fallback_engine/`, `spacebook_5d/`, `sentinel/`, `evolved_genesis/`).
* **`releases/`**: Immutable snapshot releases (`zeta_R1`, `ader_R1`, `evolved_genesis_R1`). Each release contains an immutable `GENESIS_ID` metadata file.
* **`runtime/`**: Active runtime pointer links:
  - `current` -> active release target
  - `last_known_good` -> fallback release target
  - `genesis` -> evolved_genesis lineage root
* **`post_mortem/`**: Failure log graveyard and quarantined code snapshots.

---

## 📡 Network Topology & Internal Host Mapping (zeta.mh)

* **Internal Hostname**: `zeta.mh` resolves internally to the Threadripper baremetal server IP (`46.224.219.174` / local interface).
* **Required UFW Firewall Ports**:
  - `3000/tcp` (Grafana Dashboard)
  - `3100/tcp` (Loki Log Aggregator)
  - `9080/tcp` (Atlas UI Dev Server)
  - `9090/tcp` (Prometheus Metrics)
  - `4052/tcp` (Zeta Master Compute L7)
  - `4053/tcp` (Bootloader Health API)
  - `4054/tcp` (Stadium Gossip Bus)
  - `8200/tcp` (HashiCorp Vault Proxy)
  - `9944/tcp` & `9933/tcp` (Substrate RPC Node)

---

## 🔄 Ouroboros Sentinel & Auto-Healing Engine

* **Daemon**: `node src/engine/ouroboros_sentinel.js` in `atlas-ui`.
* **Function**: Probes ports 9080, 8200, 4052 every 10s, auto-spawns Vite/Zeta daemons on failure, and writes ticket matrices (`self_healing_multi_ticket_matrix.md`).

---

## 📦 Hetzner Master Storage Box Release Synchronization

* **Script**: `python C:/pqr.info/mev/scripts/hetzner_master_sync.py`
* **Function**: All canonical release tags (`evolved_genesis_R1`, `zeta_R1`, `zeta_R2`, `ader_R1`, `spacebook_R1`) are pushed and verified on the Hetzner Master Storage Box (`\\u589955-sub6.your-storagebox.de\u589955-sub6\pqr.info\releases`).


# Agent Behavior Customization

- Whenever a request or message containing the word "proceed" (case-insensitive) is received or triggered, the agent must immediately parse it as "proceed with copilot's direction" and execute the next recommended step/code skeleton from Microsoft Copilot chat based on the current walkthrough, compile, verify, and update the walkthrough.
