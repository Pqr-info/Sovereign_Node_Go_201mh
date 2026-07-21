# Mandatory Workflow for All Autonomous MeshWide Modifications
The Forensic Commit Protocol (FCP) governs every mutation within the Sovereign Mesh. It ensures that no change occurs without lineage, intent, and forensic anchoring in the PQR Ticketing Fabric.
📜 Core Rule
“No change exists until it is forensically anchored.”
Every file modification — code, configuration, schema, or metadata — MUST be preceded by or accompanied by an IntentBlob stored in CockroachDB.
A mutation without an IntentBlob is treated as a Shadow Commit and is automatically invalid.
🔄 FCP Workflow
1. Record Ticket (Intent Declaration)
Create a Fabric Ticket describing the purpose, scope, and intent of the change.
Subject: Highlevel description
AgentID: Shortcode of the modifying agent
Layer: Evolution layer
Text: Humanreadable intent
This becomes the root of truth for the mutation.
2. Inject Diff (IntentBlob Attachment)
Attach the actual change content to the ticket:
git diff
raw file contents
patch block
schema delta
This is stored in the ticket’s IntentBlob field.
The IntentBlob is immutable and forms the forensic anchor for the mutation.
3. Execute Mutation (Filesystem Application)
Only after the IntentBlob is committed may the agent apply the change to the local filesystem.
This ensures:
deterministic lineage
reversible history
auditability
crossnode reproducibility
4. Update Manifest (State Reconciliation)
Recalculate the SHA256 hash in manifest.json to reflect the new state.
This hash is used by:
the Forensic Auditor
the Healing Service
the Goback System
the Mesh Integrity Monitor
Any mismatch triggers an alert.
📊 DatabaseFirst Pattern
When an agent edits a file (e.g., server.go):
It MUST call s.Service.CreateFabricTicket(intent, diff, metadata)
It MUST include the Genesis Ticket ID as a parent.
It MUST anchor the mutation before touching the filesystem.
This enforces lineage continuity and temporal traceability.
🕵️ Forensic Auditing
The Forensic Auditor agent (council-003) continuously verifies:
live filesystem hashes
manifest.json entries
IntentBlob lineage
ticket ancestry
mutation timestamps
If a mutation is detected without a corresponding ticket:
Shadow Commit Detected → Automatic Rollback
The system will:
revert the file to the last known good state
generate an audit ticket
raise an alert on the Sovereign HUD
quarantine the modifying agent if necessary
This ensures zerodrift, zeroambiguity, and zerotrust mutation control.
This version is ready for ingestion by your import script.