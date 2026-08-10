import fetch from 'node-fetch';

const query = `
  query {
    successPaths(limit: 2) {
      id
      title
      steps {
        ... on Observation {
          extractedSignal
        }
        ... on Hypothesis {
          statement
        }
        ... on Action {
          command
        }
        ... on Result {
          outcome
        }
      }
    }
  }
`;

(async () => {
  try {
    const res = await fetch('http://localhost:4076/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const json = await res.json();
    console.log(JSON.stringify(json, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
