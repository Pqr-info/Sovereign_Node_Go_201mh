# Forensic Debugging & Triage Handbook
SWEND • Antigravity • PQR Integration  
Version 1.0.0

## Purpose
This handbook trains the Forensic Debugging Team to diagnose and repair:
- Protobuf descriptor corruption
- CockroachDB schema drift
- Windows AppLocker build blocks
- SWEND runtime failures
- Antigravity event ingestion failures

---

# 1. Protobuf Descriptor Integrity

## 1.1 Root Cause Case Study
A critical panic occurred:

```
panic: proto: unmarshalSeed: slice bounds out of range
```

Cause:
- The package path  
  `github.com/thealanphipps-del/pqr/proto` (38 bytes)  
  was replaced with  
  `github.com/pqr-info/swend/proto` (31 bytes)  
- But the Varint length prefixes were NOT updated.

### Lesson:
**Never modify generated protobuf files without updating varints.**

---

# 2. Binary-Level Integrity Checks

## 2.1 Validate Varint Lengths
Use:

```
xxd -g 1 file.pb.go
```

Check:
- String length prefixes
- FileOptions block length
- DescriptorProto length

## 2.2 Regenerate Protobufs
Always run:

```
protoc --go_out=. --go_opt=paths=source_relative ...
```

Never hand-edit descriptor bytes.

---

# 3. CockroachDB Schema Drift

## 3.1 Detect Drift
Run:

```
SHOW CREATE TABLE tickets;
SHOW CREATE TABLE ticket_events;
```

Compare with schema in repo.

## 3.2 Repair Drift
If mismatched:

```
ALTER TABLE ... ADD COLUMN ...
ALTER TABLE ... DROP COLUMN ...
```

Or replay migrations.

---

# 4. Windows AppLocker Failures

## 4.1 Symptom
Popup:

```
Part of this program has been blocked
```

Cause:
- Go builds temp binaries in `%TEMP%`
- AppLocker blocks execution from temp

## 4.2 Fix
Enforce workspace builds:

```
setx GOTMPDIR "C:\Users\theal\swend\tmp"
```

Use wrappers:
- `swend-build.ps1`
- `swend-run.ps1`

---

# 5. Forensic Logging

## 5.1 Capture Raw Logs
Runtime:

```
runtime.out
runtime.err
```

Build:

```
build.out
build.err
```

## 5.2 Extract AG_EVENT Lines
Search:

```
Select-String -Path *.out,*.err -Pattern "AG_EVENT"
```

---

# 6. Failure Reconstruction

## 6.1 Timeline Reconstruction
Order events by timestamp:

```
select * from ticket_events order by created_at;
```

## 6.2 Identify Root Cause
Look for:
- First error
- First drift event
- First violation
- First panic

---

# 7. Emergency Triage Protocol

## 7.1 When to Escalate
Escalate if:
- Descriptor corruption detected
- Schema drift cannot be repaired
- Agentbridge fails to initialize
- Antigravity stops ingesting events

## 7.2 What to Collect
- runtime.out
- runtime.err
- build.out
- build.err
- AG_EVENT lines
- Ticket IDs
- Stack traces

## 7.3 How to File a Forensic Ticket
Create:

```
RelForensicIncident
Layer: 0
Content: <logs + analysis>
```

Assign to:
`antigravity-core`

---

# 8. Debug Team Sign-Off Checklist

- [ ] Protobuf integrity validated  
- [ ] Varint lengths correct  
- [ ] Schema drift resolved  
- [ ] AppLocker bypass enforced  
- [ ] Runtime logs captured  
- [ ] AG_EVENT lines verified  
- [ ] Root cause identified  
- [ ] Forensic ticket filed  

**Debug approval required before module installation.**
