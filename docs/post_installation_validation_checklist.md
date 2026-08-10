# POST‑INSTALLATION VALIDATION CHECKLIST
**Version 1.0 — Required Immediately After Installing `antigravity-module.yaml`**

Run these steps **in order**.  
If any step fails, stop and triage using the Debug Handbook.

---

# 1. **Verify Module Registration**

### 1.1 List installed modules
```
antigravity list-modules
```

**Expected:**  
`swend-governed-runtime` appears with version `1.0.0`.

### 1.2 Verify module status
```
antigravity module-info swend-governed-runtime
```

**Expected:**  
- Status: `active`  
- Event ingestion: `enabled`  
- Bridge-only: `enabled`  
- Context window: `enabled`  

---

# 2. **Verify Antigravity Runtime Hooks Loaded**

### 2.1 Check event routing rules
```
antigravity show-rules | findstr AG_EVENT
```

**Expected:**  
All four rules present:
- BUILD_WARNING  
- BUILD_ERROR  
- RUNTIME_WARNING  
- RUNTIME_ERROR  

### 2.2 Check agent prompt override
```
antigravity agent-info antigravity-core
```

**Expected:**  
- System prompt contains governed prompt  
- Context window placeholder present  
- Bridge-only mode enabled  

---

# 3. **Verify Build Wrapper Integration**

### 3.1 Run a clean build
```
.\swend-build.ps1
```

**Expected:**  
- No AppLocker popup  
- No temp directory execution  
- Build completes  
- No missing AG_EVENT lines  

### 3.2 Confirm AG_EVENT ingestion
```
select * from ticket_events order by created_at desc limit 5;
```

**Expected:**  
- BUILD_WARNING or BUILD_ERROR events appear  
- Ticket created  
- Agent invoked  

---

# 4. **Verify Runtime Wrapper Integration**

### 4.1 Start SWEND
```
.\swend-run.ps1
```

### 4.2 Trigger a runtime warning
Add:
```go
log.Println("warning: post-install test")
```

**Expected:**  
- AG_EVENT:RUNTIME_WARNING appears  
- Ticket created  
- Agent invoked  

---

# 5. **Verify Ticketgraph Connectivity**

### 5.1 Query recent tickets
```
select * from tickets order by created_at desc limit 10;
```

**Expected:**  
- Tickets created automatically  
- Relationships correct  
- Content matches emitted warnings/errors  

---

# 6. **Verify Agent Invocation & Governance**

### 6.1 Check agent invocation events
```
select * from ticket_events where ticket_id='<id>';
```

**Expected:**  
- Invocation event  
- Response event  
- No direct LLM call  
- No bypass of bridge  

### 6.2 Verify capability gate
Ask the agent to perform an unauthorized action.

**Expected:**  
- Rejected  
- Logged  
- Ticket event created  

---

# 7. **Verify Context Window Injection**

### 7.1 Inspect agent invocation payload

**Expected:**  
- 7 layers present  
- Parent lineage included  
- Sibling tickets included  
- Memory pages included  
- No missing layers  

If any layer is missing → **STOP**.

---

# 8. **Verify Protobuf Descriptor Stability**

### 8.1 Regenerate protobufs
```
protoc --go_out=. --go_opt=paths=source_relative ...
```

### 8.2 Confirm no panic on startup
Run:
```
.\swend-run.ps1
```

**Expected:**  
No `unmarshalSeed` panic.

If panic occurs → descriptor corruption persists.

---

# 9. **Verify CockroachDB Schema Stability**

### 9.1 Compare schema
```
SHOW CREATE TABLE tickets;
SHOW CREATE TABLE ticket_events;
```

**Expected:**  
Matches repo schema exactly.

If drift exists → repair before proceeding.

---

# 10. **Verify AppLocker Compliance**

### 10.1 Confirm wrappers bypass AppLocker
Run:
```
.\swend-build.ps1
```

**Expected:**  
- No AppLocker popup  
- No temp execution  

If popup appears → GOTMPDIR not enforced.

---

# 11. **Verify End‑to‑End Ticket Lifecycle**

### 11.1 Trigger a build warning  
### 11.2 Confirm AG_EVENT  
### 11.3 Confirm ticket creation  
### 11.4 Confirm agent invocation  
### 11.5 Confirm agent response  
### 11.6 Confirm memory paging  
### 11.7 Confirm context window injection  

**Expected:**  
All steps succeed without manual intervention.

---

# 12. **Final Post‑Install Sign‑Off Checklist**

All must be **true**:

- [ ] Module installed and active  
- [ ] Event rules loaded  
- [ ] Build wrapper validated  
- [ ] Runtime wrapper validated  
- [ ] AG_EVENT ingestion confirmed  
- [ ] Tickets created automatically  
- [ ] Agent invoked automatically  
- [ ] Context window injected  
- [ ] Capability gate enforced  
- [ ] Bridge-only execution enforced  
- [ ] Protobuf descriptors clean  
- [ ] CockroachDB schema clean  
- [ ] No AppLocker blocks  
- [ ] No missing layers  
- [ ] No governance bypass  
- [ ] End-to-end lifecycle validated  

If **any** box is unchecked → STOP and triage.

If **all** boxes are checked →  
### **Your installation is fully validated and production‑ready.**
