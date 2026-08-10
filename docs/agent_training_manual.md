# Agent Training Manual: Cognitive Patterns & Problem Resolution
*Systematic Troubleshooting & Binary Governance Guidelines*

This manual documents the cognitive patterns and problem resolution heuristics learned during the integration of the SWEND runtime, PQR ticketgraph, and Antigravity laptop modules. All agents operating in this workspace must study and adhere to these patterns.

---

## 1. Pattern 1: Binary-Level Serialization & Metadata Integrity

### Problem Pattern
When performing text refactoring or renaming package paths (e.g., changing module names), search-and-replace scripts often touch generated serialization code (like Protobuf `*.pb.go` files). 

If the string length of the package path changes (e.g. from 38 characters to 31 characters), the serialized byte stream becomes corrupt because:
- The length prefix varint of the string field is not updated.
- The length prefix of the parent message/options block is not updated.

This results in silent binary corruption that manifests at runtime as:
`panic: runtime error: slice bounds out of range [-1:]` or `[-4:]`

### Resolution Pattern
1. **Never Hand-Edit Generated Descriptors**: If a package path changes, the primary resolution is always to regenerate the protobuf descriptors using `protoc` with the updated import paths.
2. **Surgical Binary Patching (Backup Option)**: If hand-editing is the only choice, the agent must recalculate and patch the length prefix bytes of the parent blocks and string fields.
   - For a string length change from $L_1$ to $L_2$, locate the field tag (e.g., `Z` for GoPackagePath) and change the next byte value to $L_2$.
   - Locate the parent options block tag (e.g., `B`) and adjust its length byte value by $L_2 - L_1$.

### Case Study: Forensic Byte Reconstruction (`swarm.pb.go`)
During the renaming of the PQR client packages to SWEND, search-and-replace modified the raw uncompressed descriptor inside `swarm.pb.go`. 
- **Original Path**: `github.com/thealanphipps-del/pqr/proto` (38 bytes)
- **New Path**: `github.com/pqr-info/swend/proto` (31 bytes)
- **Difference**: 7 bytes decrease.

#### The Corrupt Sequence:
The original byte sequence in the uncompressed descriptor was `B(Z&...`
- `B`: Tag representing the message options block.
- `(`: Varint length prefix of value `40` (decimal) for the options block.
- `Z`: Tag representing the Go package path string field.
- `&`: Varint length prefix of value `38` (decimal) for the string field content.

When the package path was replaced without adjusting the prefixes, the Go runtime tried to read 38 bytes from a 31-byte string, overflowing the slice bounds and causing a panic.

#### The Patched Sequence:
We patched the sequence to `B!Z\x1f...`
- `!`: Adjusted options block length of `33` (decimal) ($40 - 7$).
- `\x1f`: Adjusted string field length of `31` (decimal) ($38 - 7$).
This restored serialization structure integrity and eliminated the runtime panic.

---


## 2. Pattern 2: Local Security Policy Compliance (AppLocker)

### Problem Pattern
On managed corporate developer laptops, security policies like Windows AppLocker restrict execution of arbitrary binaries. Go's default compiler environment uses the user's temporary folder (`%TEMP%` or `AppData\Local\Temp`) to build, cache, and test binaries. If AppLocker blocks execution from the temp directory, `go build` or `go test` calls fail with path permission blocks before the process runs.

### Resolution Pattern
1. **Redirect Temp Directories**: Force Go to run builds and caches in a governed local workspace directory by setting the `GOTMPDIR` environment variable.
   ```powershell
   $env:GOTMPDIR = "C:\Users\theal\swend\tmp"
   ```
2. **Compile-to-Target Heuristic**: Never execute `go run` or `go test` directly on managed machines. Instead, compile the binaries to a targeted output directory (`bin/` or a local subfolder) and run the generated executable from the workspace path.

---

## 3. Pattern 3: Namespace Mapping & Client Constructors

### Problem Pattern
During code migrations, submodules are often renamed or refactored (e.g., porting the `pqr` client into the local `swend` namespace). If downstream packages (like daemon entry points or monitoring TUIs) continue to reference the old package name, the compiler throws `undefined` constructor errors.

### Resolution Pattern
1. **Locate Constructor Invocations**: Scan all command entry points (`cmd/`) and UI systems for static constructors (e.g. `pqr.NewClient`).
2. **Map to Active Module**: Update the imports and constructors to point to the active module package (e.g. `swend.NewClient`). Do not leave lingering dependencies on deprecated packages.

---

## 4. Governing Agent Workflow Rules

1. **Verify Binary Integrity First**: Always run local sanity tests on compiled binaries using wrappers (`.\swend-build.ps1` and `.\swend-run.ps1`) to verify Go initialization loops succeed.
2. **Check Transcripts for Truncations**: When analyzing large files or stdout/stderr outputs, verify that the system-level tool responses did not truncate critical details. If a truncation occurred, target specific line numbers or ranges on the next turn.
3. **Log Resolutions in tickets**: All diagnostic discoveries and patches must be documented as ticket events to build a chronological forensic lineage.

---

## 5. System Lineages & Extrapolated Specs

Based on the ingested specification Word documents found in the system, future agents must align their implementation plans with the following design guidelines:

### A. SWEND Node Client Lineage (`forpaul-project`)
- **Daemon Role**: SWEND operates as the client-side background execution daemon orchestrating local database replication (CockroachDB), Filecoin storage archiving, and voice zero-slope spectral anomaly algorithms.
- **Verification Rule**: During peer deployments, ensure WSL environments are synced to match the local Windows registry.

### B. Sovereign Mesh Consensus (`pqr.info - Phase 4`)
- **8-Nearest Neighbor (8-NN) Consensus**: High-dimensional coordinate values are evaluated locally. Transactions are validated only if approved by at least 5 out of the 8 nearest network nodes.
- **NPU Research Co-op**: Deep learning model weights are divided and distributed across client NPUs via LiteRT, using a dynamic load-balancer to delegate sub-tasks without overloading individual devices.

### C. Peer Discovery Engine (`SToE - Substrate`)
- **Multi-Transport Network Discovery**: Peers are automatically discovered across BLE, Bluetooth PAN, Wi-Fi Direct, LAN multicast, and Helium P2P.
- **8-NN Convergence**: These disparate transports are normalized into a unified `PeerEvent` stream that converges to feed the 8-Nearest Neighbors routing tables.


