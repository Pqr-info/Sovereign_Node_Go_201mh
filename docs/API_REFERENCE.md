# )
Highperformance endpoints for direct agent–fabric integration.
🎫 Create Ticket
POST /REST/2.0/ticket
Request Body
json
{
  "Subject": "Optimize State Vector",
  "AgentID": "council-001",
  "Layer": 2,
  "Text": "Implementing RAE pattern to bypass redundancy..."
}
Description Creates a new ticket in the PQR Fabric. Tickets serve as the primary memory containers for all agent activity.
📄 Get Ticket
GET /REST/2.0/ticket/:id
Description Retrieves the full ticket record, including metadata, content, and lineage pointers.
♻️ Update Ticket
PUT /REST/2.0/ticket/:id
Request Body
json
{
  "Status": "COMPLETED"
}
Description Updates mutable fields on an existing ticket (status, subject, queue, etc.).
🧾 Forensic Audit Trail
GET /REST/2.0/ticket/:id/audit
Description Returns the complete audit history for the ticket, including:
old/new values
timestamps
agent IDs
mutation types
This is the compliance and forensic backbone of the fabric.
🧬 Ticket Lineage (Relationships)
POST /REST/2.0/ticket/:parentID/link/:childID
Description Creates a directional relationship between two tickets. Supported relationship types include:
EVOLUTION
CONSEQUENCE
CONTEXT
GENESIS
Used for multiagent workflows and consequencechain modeling.
💓 Swarm Health Check
GET /REST/2.0/health
Description Returns the operational status of the PQR Ticketing System. Used by agents, orchestrators, and SWEN nodes to verify fabric availability.