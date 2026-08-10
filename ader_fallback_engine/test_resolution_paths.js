const runTest = async () => {
  console.log("Requesting Resolution Paths from ADER...");
  const query = `
    query GetPaths($ticketId: ID!, $startX: Int!, $startY: Int!, $startZ: Int!, $maxDepth: Int) {
      resolutionPaths(ticketId: $ticketId, startX: $startX, startY: $startY, startZ: $startZ, maxDepth: $maxDepth) {
        x
        y
        z
        confidence
      }
    }
  `;

  try {
    const res = await fetch('http://localhost:4076/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { ticketId: "mesh_ticket_001", startX: 24, startY: 30, startZ: 0, maxDepth: 4 }
      })
    });
    
    const data = await res.json();
    console.log("Resolution Paths Result:");
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Test failed:", e.message);
  }
};

runTest();
