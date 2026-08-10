# QA Test Execution Handbook
SWEND • Antigravity • PQR Integration  
Version 1.0.0

## Purpose
This handbook trains the QA Testing Team to validate the governed SWEND runtime, Antigravity event ingestion, PQR ticket routing, and the 7‑Layer Context Window pipeline.

The QA team is responsible for ensuring:
- Build wrappers work
- Runtime wrappers work
- AG_EVENT lines are emitted
- Antigravity ingests events
- Tickets are created automatically
- The agent is invoked automatically
- The context window is injected
- Capability gating is enforced
- Bridge-only execution is active

---

# 1. Test Environment Setup

## 1.1 Required Files
- `swend-build.ps1`
- `swend-run.ps1`
- `swend.ps1`
- `antigravity-module.yaml`

## 1.2 Required Services
- SWEND server
- PQR database
- Antigravity runtime

---

# 2. Build Wrapper Tests

## 2.1 Trigger a Build Warning
Introduce a harmless unused variable:

```go
var unused = 123
```

Run:

```
.\swend-build.ps1
```

### Expected:
- `AG_EVENT:BUILD_WARNING:` appears
- Antigravity creates a `RelBuildWarning` ticket
- Agent is invoked with the warning text

---

## 2.2 Trigger a Build Error
Introduce a syntax error:

```go
func broken() {
```

Run:

```
.\swend-build.ps1
```

### Expected:
- `AG_EVENT:BUILD_ERROR:` appears
- Antigravity creates a `RelBuildError` ticket
- Agent is invoked with the error text

---

# 3. Runtime Wrapper Tests

## 3.1 Trigger a Runtime Warning
Add:

```go
log.Println("warning: simulated drift")
```

Run:

```
.\swend-run.ps1
```

### Expected:
- `AG_EVENT:RUNTIME_WARNING:` appears
- Ticket created
- Agent invoked

---

## 3.2 Trigger a Runtime Error
Add:

```go
panic("simulated panic")
```

Run:

```
.\swend-run.ps1
```

### Expected:
- `AG_EVENT:RUNTIME_ERROR:` appears
- Ticket created
- Agent invoked

---

# 4. Ticket Routing Tests

## 4.1 Verify Ticket Creation
In PQR:

```
select * from tickets order by created_at desc limit 5;
```

### Expected:
- Tickets for warnings/errors appear
- Relationship matches:
  - `RelBuildWarning`
  - `RelBuildError`
  - `RelRuntimeWarning`
  - `RelRuntimeError`

---

# 5. Agent Invocation Tests

## 5.1 Verify Agent Was Called
Check ticket events:

```
select * from ticket_events where ticket_id = '<id>';
```

### Expected:
- Agent invocation event exists
- Agent response event exists

---

# 6. Context Window Injection Tests

## 6.1 Verify 7-Layer Window
Check agent invocation payload:

### Expected:
- Layers 0 through 6 present
- Parent lineage included
- Sibling tickets included
- Memory pages included

---

# 7. Capability Gate Tests

## 7.1 Attempt an Unauthorized Action
Ask the agent to perform an action not in the manifest.

### Expected:
- Capability gate rejects it
- Ticket event logs the rejection

---

# 8. Bridge-Only Execution Tests

## 8.1 Attempt Direct LLM Invocation
Call the agent bypassing the bridge.

### Expected:
- Execution denied
- Error logged
- Ticket created

---

# 9. QA Sign-Off Checklist

- [ ] Build wrapper validated  
- [ ] Runtime wrapper validated  
- [ ] AG_EVENT lines emitted  
- [ ] Tickets created  
- [ ] Agent invoked  
- [ ] Context window injected  
- [ ] Capability gate enforced  
- [ ] Bridge-only execution confirmed  

**QA approval required before module installation.**
