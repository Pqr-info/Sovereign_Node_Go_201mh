import { recover } from './src/agent_runtime/agent.js';

const runTest = async () => {
  // Create a mock agent state that has hit a dead-end
  const stalledAgent = {
    ticketId: "S27-TKT-9999",
    x: 24,
    y: 30,
    z: 2,
    errorCount: 4,  // This triggers detectDeadEnd
    isStalled: true,
    status: "processing"
  };

  console.log("Initial Agent State:", JSON.stringify(stalledAgent, null, 2));
  
  const recovered = await recover(stalledAgent);
  
  if (recovered) {
    console.log("\nPost-Recovery Agent State:");
    console.log(JSON.stringify(stalledAgent, null, 2));
  }
};

runTest();
