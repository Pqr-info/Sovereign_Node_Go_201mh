# **🟣 SINGULARITY ENGINE \u2014 BETA READINESS CHECKLIST (v1.0)**  
### *Operational, Auditable, Build\u2011Ready Requirements for Antigravity Integration*

---

# **SECTION 1 \u2014 L0 COGNITIVE RELAY (PHYSICAL LAYER)**  
### **Status: REQUIRED FOR BETA**

#### **1.1 API Endpoints Must Be Stable**
Antigravity must confirm the following endpoints exist and return structured JSON:

- `POST /allocate_page`
- `POST /attach_agent`
- `POST /detach_agent`
- `POST /swap_agents`
- `POST /context_slice`
- `POST /commit_slice`
- `GET  /teleportation_log`
- `GET  /acs_status`

**Acceptance Criteria**
- All endpoints return `{success: "true"}` on valid input.
- All endpoints return `{success: "false", error: "..."}`
  on invalid input.
- No endpoint returns raw text.

---

#### **1.2 Page Allocation Guarantees**
- Page size MUST remain **16MB**.
- Page IDs MUST be globally unique.
- Page ownership MUST be tracked server\u2011side.

**Acceptance Criteria**
- Teleportation swaps MUST NOT corrupt page data.
- Page ownership MUST update atomically.

---

#### **1.3 Teleportation Safety**
- `swap_agents` MUST perform pointer swap only.
- No memory copying.
- No buffer reallocation.

**Acceptance Criteria**
- After swap, `/context_slice` MUST return identical data from the new owner.

---

# **SECTION 2 \u2014 SUBSTRATE RUNTIME (CONSENSUS LAYER)**  
### **Status: REQUIRED FOR BETA**

#### **2.1 Pallet Integrity**
Antigravity must verify the following pallets compile and expose RPC storage keys:

- `pallet_tau`
- `pallet_marketplace`
- `pallet_temporal_gov`

**Acceptance Criteria**
- All pallets compile under `cargo build --release`.
- All storage keys return SCALE\u2011encoded values.
- No panics in `on_initialize`.

---

#### **2.2 Temporal Governance Invariants**
- Timeslips MUST open/close without orphaning.
- Checkpoints MUST be created with valid lineage.
- Rollbacks MUST burn \u03c4 and apply InsurancePool subsidy.

**Acceptance Criteria**
- `annihilate_checkpoint` MUST never panic.
- InsurancePool MUST reduce burn cost by \u2264 50%.

---

#### **2.3 Treasury Physics**
- DistributionEpoch MUST trigger automatically.
- Treasury MUST empty according to 40/30/20/10 rule.
- Agent/Validator/Environment stats MUST update.

**Acceptance Criteria**
- No manual admin calls required.
- Distribution MUST be deterministic.

---

# **SECTION 3 \u2014 PYTHON CPS (COGNITIVE LAYER)**  
### **Status: REQUIRED FOR BETA**

#### **3.1 Protocol Stack Must Be Modular**
Antigravity must ensure:

- `protocols/base.py` defines the contract.
- `protocols/l0_paging.py` implements fast path.
- `protocols/grpc_client.py` implements consensus path.
- `protocols/vtty_client.py` implements fallback path.

**Acceptance Criteria**
- All protocols implement `connect`, `read_context`, `write_context`.
- CPS MUST fail over automatically.

---

#### **3.2 Cognitive Session Pipeline**
- L1 raw event ingestion MUST work.
- L2 contextualization MUST be triggered.
- L3 semantic extraction MUST produce structured dict.
- L4 commit MUST package extrinsic payload.

**Acceptance Criteria**
- CPS MUST complete L1\u2192L4 without throwing exceptions.
- CPS MUST log each stage.

---

# **SECTION 4 \u2014 GO CLIENT (OPERATOR LAYER)**  
### **Status: REQUIRED FOR BETA**

#### **4.1 Menu Tree Must Be Fully Functional**
Antigravity must confirm:

- All 11 domains load without panic.
- All RPC calls return structured data.
- All L0 Relay calls succeed.

**Acceptance Criteria**
- `go build .` MUST succeed with no warnings.
- CLI MUST run on Windows, Linux, and Docker.

---

#### **4.2 Visualization Layer**
- HUD MUST display real telemetry.
- Treasury, Agents, Validators, Environments MUST show live values.
- Teleportation log MUST reflect real swaps.

**Acceptance Criteria**
- No placeholder values remain.
- No static text except labels.

---

# **SECTION 5 \u2014 SYSTEM VALIDATION (HEARTBEAT LAYER)**  
### **Status: REQUIRED FOR BETA**

#### **5.1 Master Validation Script**
Antigravity must integrate:

- `run_system_validation.py`

**Acceptance Criteria**
- Script MUST allocate pages.
- Script MUST attach agents.
- Script MUST swap agents.
- Script MUST write/read slices.
- Script MUST complete without errors.

---

#### **5.2 Cross\u2011Layer Coherence**
The following MUST be true:

- L0 Relay MUST respond.
- CPS MUST respond.
- Substrate MUST respond.
- Go client MUST respond.

**Acceptance Criteria**
- All layers reachable in one continuous run.
- No layer returns malformed JSON.

---

# **SECTION 6 \u2014 LOGGING & AUDITABILITY (OBSERVABILITY LAYER)**  
### **Status: REQUIRED FOR BETA**

#### **6.1 Unified Logging**
Antigravity must ensure:

- L0 Relay logs to file.
- CPS logs to file.
- Substrate logs to file.
- Go client logs to file.

**Acceptance Criteria**
- Logs MUST include timestamps.
- Logs MUST include severity levels.
- Logs MUST include correlation IDs.

---

#### **6.2 Audit Trails**
- Every teleportation MUST be logged.
- Every checkpoint MUST be logged.
- Every rollback MUST be logged.
- Every cognitive commit MUST be logged.

**Acceptance Criteria**
- Audit logs MUST be immutable.
- Audit logs MUST be human\u2011readable.

---

# **SECTION 7 \u2014 FAILURE DOMAINS & RECOVERY (RESILIENCE LAYER)**  
### **Status: REQUIRED FOR BETA**

#### **7.1 MTTR Requirements**
Antigravity must define:

- L0 Relay restart procedure.
- Substrate node restart procedure.
- CPS restart procedure.
- Go client restart procedure.

**Acceptance Criteria**
- MTTR MUST be < 30 seconds for all services.

---

#### **7.2 Failure Mode Behavior**
- If L0 fails \u2192 CPS MUST fall back to gRPC.
- If gRPC fails \u2192 CPS MUST fall back to VTTY.
- If VTTY fails \u2192 CPS MUST return structured error.

**Acceptance Criteria**
- No silent failures.
- No partial commits.

---

# **SECTION 8 \u2014 SECURITY & ACCESS CONTROL (SOVEREIGNTY LAYER)**  
### **Status: REQUIRED FOR BETA**

#### **8.1 Access Control**
Antigravity must enforce:

- L0 Relay restricted to localhost.
- Substrate RPC restricted to localhost.
- CPS restricted to localhost.
- Go client restricted to operator.

**Acceptance Criteria**
- No external network exposure.
- No unauthenticated endpoints.

---

# **SECTION 9 \u2014 RELEASE PACKAGING (DEPLOYMENT LAYER)**  
### **Status: REQUIRED FOR BETA**

#### **9.1 Deliverables**
Antigravity must package:

- L0 Relay binary  
- Substrate node binary  
- Go client binary  
- CPS Python package  
- Validation script  
- System Operation Manual v1.0  

**Acceptance Criteria**
- All binaries MUST run offline.
- All binaries MUST run without Docker if required.

---

# **SECTION 10 \u2014 FINAL SIGN\u2011OFF (SOVEREIGN CERTIFICATION)**  
### **Status: REQUIRED FOR BETA**

#### **10.1 Operational Coherence**
The system MUST demonstrate:

- Physical coherence  
- Cognitive coherence  
- Temporal coherence  
- Governance coherence  

**Acceptance Criteria**
- `run_system_validation.py` MUST complete successfully.
- All layers MUST respond in < 200ms.
