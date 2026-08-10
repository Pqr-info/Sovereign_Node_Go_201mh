const runTest = async () => {
  console.log("Requesting Fallback Plan from ADER...");
  const query = `
    query GetFallbackPlan($ticketId: ID!, $startX: Int!, $startY: Int!, $startZ: Int!) {
      fallbackPlan(ticketId: $ticketId, startX: $startX, startY: $startY, startZ: $startZ) {
        startX
        startY
        startZ
        resolutionPaths {
          x
          y
          z
          confidence
        }
        bestSuccessPath {
          id
          title
          totalSteps
          reusabilityScore
          steps(orderBy: "createdAt_ASC") {
            ... on Action {
              __typename
              id
              command
            }
            ... on Result {
              __typename
              id
              outcome
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch('http://localhost:4076/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { ticketId: "S27-TKT-0234", startX: 24, startY: 30, startZ: 0 }
      })
    });
    
    const data = await res.json();
    console.log("Fallback Plan Result:");
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Test failed:", e.message);
  }
};

runTest();
