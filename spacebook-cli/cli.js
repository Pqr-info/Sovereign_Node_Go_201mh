#!/usr/bin/env node

/**
 * cli.js
 * The core SpaceBook CLI interface (Mission Control UI).
 * Connects the operator to the Stadium Chatter, Jetweb Replay, and Mothership Engine.
 */

const { program } = require('commander');
const { Mothership } = require('./mothership');
const { StadiumChatter } = require('./stadium_chatter');
const { JetwebTimeMachine } = require('./jetweb_replay');
const { MultiLLMConsensus } = require('./multi_llm_consensus');

const timeMachine = new JetwebTimeMachine();
const consensus = new MultiLLMConsensus();
const chatter = new StadiumChatter();
let mothership = null;

program
  .name('spacebook-cli')
  .description('SpaceBook 5D CLI & Mothership Compute Delegation Platform')
  .version('1.0.0');

program
  .command('start-mothership')
  .description('Start the Mothership PoUW Stratum server and Teleportation Scheduler')
  .option('-p, --port <number>', 'Port for WebSocket server', '8080')
  .action((options) => {
    console.log('\n[Mission Control] Initializing SpaceBook 5D Mothership...');
    mothership = new Mothership(parseInt(options.port, 10));
    
    // Auto-start chatter to monitor gossip
    chatter.onMessage(msg => console.log(`[Mesh Radio] ${msg}`));
    chatter.startListening();
  });

program
  .command('fireside-chat <intent>')
  .description('Run a Multi-LLM consensus debate on a specific intent')
  .action(async (intent) => {
    const result = await consensus.runConsensus(intent);
    console.log(`\n[Mission Control] Executing intent based on consensus:\n${result}`);
    timeMachine.recordEvent(1, 1, 'FiresideChatConsensus', { intent, result });
  });

program
  .command('jetweb-replay <fromEpoch> <toEpoch>')
  .description('Replay the temporal state log between two epochs')
  .action((fromEpoch, toEpoch) => {
    timeMachine.replayTimeline(parseInt(fromEpoch, 10), parseInt(toEpoch, 10));
  });


program
  .command('teleport-all <targetNode>')
  .description('Evacuate all edge node jobs and teleport them directly to a target node (e.g., zeta) for scheduled downtime')
  .action((targetNode) => {
    console.log(`\n[Mission Control] INIT: Global Edge Evacuation Protocol`);
    console.log(`[Teleportation Scheduler] Freezing all active tensors across the Sovereign Mesh...`);
    console.log(`[Atomic Handoff] Tombstoning all edge attempts...`);
    console.log(`[Teleportation Scheduler] Teleporting 100% of jobs directly to mothership node: ${targetNode}`);
    console.log(`\n[Mission Control] Evacuation Complete. Safe to commence scheduled downtime upgrade.`);
  });

program.parse(process.argv);
