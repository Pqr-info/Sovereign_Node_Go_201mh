const runTest = async () => {
  const tickets = [
    { ticketId: "mesh_ticket_001", agentId: "zeta-node", urgency: 45, contextDepth: 12, label: "Quantum Decoherence", description: "Agent lost state during 5D traversal." },
    { ticketId: "mesh_ticket_002", agentId: "ouroboros", urgency: 22, contextDepth: 38, label: "Substrate Desync", description: "Substrate block mismatch." },
    { ticketId: "mesh_ticket_003", agentId: "spacebook-agent", urgency: 5, contextDepth: 5, label: "Minor Anomaly", description: "Harmless temporal flux." }
  ];

  for (const t of tickets) {
    console.log(`Ingesting ticket: ${t.ticketId} with Urgency: ${t.urgency}, ContextDepth: ${t.contextDepth}`);
    try {
      const res = await fetch('http://localhost:4075/api/mesh/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(t)
      });
      const data = await res.json();
      console.log(`Response:`, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error(`Error ingesting ${t.ticketId}:`, e.message);
    }
  }
};

runTest();
