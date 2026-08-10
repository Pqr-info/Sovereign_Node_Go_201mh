export async function requestFallbackPlan(ticketId, x, y, z) {
  const query = `
    query FallbackPlan($ticketId: ID!, $x: Int!, $y: Int!, $z: Int!) {
      fallbackPlan(ticketId: $ticketId, startX: $x, startY: $y, startZ: $z) {
        resolutionPaths {
          x y z confidence
        }
        bestSuccessPath {
          id
          title
          steps {
            __typename
            ... on Observation { extractedSignal }
            ... on Hypothesis { statement plausibility }
            ... on Action { command }
            ... on Result { outcome }
          }
        }
      }
    }
  `;

  // Native fetch in Node 24 (no need for node-fetch)
  const resp = await fetch("http://localhost:4076/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: { ticketId, x, y, z }
    })
  });

  const json = await resp.json();
  return json.data.fallbackPlan;
}
