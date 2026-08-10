# SWEND + Antigravity Module Installation Verification Checklist
**Version 1.0 — Required Before Installing `antigravity-module.yaml`**

This checklist verifies:

- The module loads  
- The wrappers fire  
- AG_EVENT ingestion works  
- Tickets are created  
- The agent is invoked  
- The context window is injected  
- Bridge‑only execution is enforced  
- No AppLocker blocks occur  
- No protobuf corruption remains  
- No schema drift exists  

Run these steps **in order**.

---

# 1. **Verify Workspace Build Environment**

### 1.1 Confirm GOTMPDIR is set
```
echo $env:GOTMPDIR
```

**Expected:**  
`C:\Users\theal\swend\tmp`

### 1.2 Confirm directory exists
```
Test-Path C:\Users\theal\swend\tmp
```

**Expected:**  
`True`

### 1.3 Confirm SWEND builds cleanly
```
go build -o .\bin\swend-server.exe .\cmd\swend-server
```

**Expected:**  
No AppLocker popup  
No temp‑directory execution  
Binary appears in `.\bin`

---

# 2. **Verify Build Wrapper Emits Events**

### 2.1 Trigger a harmless warning
Add:
```go
var unused = 123
```

Run:
```
.\swend-build.ps1
```

**Expected:**
- Output contains `AG_EVENT:BUILD_WARNING:`
- PQR receives a `RelBuildWarning` ticket
- Agent is invoked

---

# 3. **Verify Runtime Wrapper Emits Events**

### 3.1 Trigger a harmless runtime warning
Add:
```go
log.Println("warning: simulated drift")
```

Run:
```
.\swend-run.ps1
```

**Expected:**
- Output contains `AG_EVENT:RUNTIME_WARNING:`
- Ticket created
- Agent invoked

---

# 4. **Verify Antigravity Event Ingestion**

### 4.1 Query recent events
```
select * from ticket_events order by created_at desc limit 10;
```

**Expected:**
- Events corresponding to your AG_EVENT lines
- Correct relationships:
  - `RelBuildWarning`
  - `RelRuntimeWarning`

---

# 5. **Verify Ticket Auto‑Creation**

### 5.1 Query tickets
```
select * from tickets order by created_at desc limit 10;
```

**Expected:**
- Tickets appear automatically  
- Correct relationships  
- Correct content payloads  

---

# 6. **Verify Agent Auto‑Invocation**

### 6.1 Check ticket events for agent activity
```
select * from ticket_events where ticket_id='<id>';
```

**Expected:**
- Agent invocation event  
- Agent response event  
- No missing context  

---

# 7. **Verify Context Window Injection**

### 7.1 Inspect agent invocation payload

**Expected:**
- 7 layers present  
- Parent lineage included  
- Sibling tickets included  
- Memory pages included  

If any layer is missing → **STOP** (context injection failed).

---

# 8. **Verify Capability Gate Enforcement**

### 8.1 Ask the agent to perform an unauthorized action

**Expected:**
- Capability gate rejects it  
- Ticket event logs the rejection  

If the agent performs the action → **STOP** (capability gate broken).

---

# 9. **Verify Bridge‑Only Execution**

### 9.1 Attempt direct LLM invocation

**Expected:**
- Execution denied  
- Error logged  
- Ticket created  

If the agent responds directly → **STOP** (bridge bypass detected).

---

# 10. **Verify Protobuf Descriptor Integrity**

### 10.1 Regenerate protobufs
```
protoc --go_out=. --go_opt=paths=source_relative ...
```

### 10.2 Confirm no descriptor corruption
Search for:
- mismatched varints  
- incorrect length prefixes  
- truncated FileOptions blocks  

If any mismatch → **STOP** (descriptor corruption persists).

---

# 11. **Verify CockroachDB Schema Integrity**

### 11.1 Compare schema
```
SHOW CREATE TABLE tickets;
SHOW CREATE TABLE ticket_events;
```

**Expected:**
- Matches repo schema exactly  
- No drift  

If drift exists → repair before installation.

---

# 12. **Verify AppLocker Compliance**

### 12.1 Confirm no temp‑directory execution
Run:
```
go test
```

**Expected:**
- AppLocker popup appears (this is good — confirms default behavior)

Then run:
```
go test -c -o .\bin\tests.exe
```

**Expected:**
- No popup  
- Test binary runs  

This confirms your wrappers are required and working.

---

# 13. **Final Pre‑Install Confirmation**

All of the following must be **true**:

- [ ] Build wrapper emits AG_EVENT lines  
- [ ] Runtime wrapper emits AG_EVENT lines  
- [ ] Antigravity ingests events  
- [ ] Tickets are created automatically  
- [ ] Agent is invoked automatically  
- [ ] Context window is injected  
- [ ] Capability gate enforced  
- [ ] Bridge‑only execution enforced  
- [ ] Protobuf descriptors clean  
- [ ] CockroachDB schema clean  
- [ ] No AppLocker blocks during wrapper builds  
- [ ] No missing layers in context window  
- [ ] No bypass of governance  

If **any** box is unchecked → **STOP** and fix before installation.

---

# 14. **Verify Workspace Path Reconciliation**

### 14.1 Confirm Manifest Path Alignment
Verify that all file references inside the manifest match your active local workspace path prefix:
```
python -c "import json; print(json.load(open('manifest.json', encoding='utf-16'))[0]['Path'])"
```

**Expected:**  
`D:\pqr.info\.gitignore` (or your active workspace root prefix).

### 14.2 Run Manifest Unit Tests
Verify that the manifest schema validator and sync controller parse the path layout correctly:
```
go test ./internal/manifest/...
```

**Expected:**  
`ok  github.com/thealanphipps-del/pqr/internal/manifest` (all tests pass cleanly).

### 14.3 Verify Autonomous Bridge Extraction
Verify that the Sovereign V10.0 HTML layout has been successfully extracted out of `s25_manifest.json` into a native web asset:
```
Test-Path D:\pqr.info\web\autonomous_bridge.html
```

**Expected:**  
`True` (HTML file exists, is valid UTF-8, and is readable by the static web server).

---

# ⭐ **15. Installation Command (only after all checks pass)**

```
antigravity install-module antigravity-module.yaml
```

This is the moment everything becomes real.
