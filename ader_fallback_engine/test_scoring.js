import fetch from 'node-fetch';

const query = `
  mutation RateSuccessPath($id: ID!, $success: Boolean!) {
    rateSuccessPath(id: $id, success: $success) {
      id
      reusabilityScore
    }
  }
`;

(async () => {
  try {
    // First rate as success
    console.log("Rating path 'dummy_path_1' as SUCCESS...");
    const res1 = await fetch('http://localhost:4076/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { id: "dummy_path_1", success: true } })
    });
    console.log(JSON.stringify(await res1.json(), null, 2));

    // Then rate as failure
    console.log("Rating path 'dummy_path_1' as FAILURE...");
    const res2 = await fetch('http://localhost:4076/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { id: "dummy_path_1", success: false } })
    });
    console.log(JSON.stringify(await res2.json(), null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
