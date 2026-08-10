const fs = require('fs/promises');
const path = require('path');

const MAX_PQR = 'C:\\pqr.info';
const TED_PQR = '\\\\ted\\pqr.info';
const MAX_SHARED_AGENTS = 'C:\\Users\\theal\\.gemini\\config\\plugins\\shared_brain\\agents';
const TED_SHARED_AGENTS = '\\\\ted\\Users\\theal\\.gemini\\config\\plugins\\shared_brain\\agents';
const MAX_CONFIG_PLUGINS = 'C:\\Users\\theal\\.gemini\\config\\plugins';

const EXCLUDE_DIRS = ['node_modules', '.git', '.venv', 'target', 'dist', 'build', '__pycache__'];

async function findAgents(baseDir) {
  const agentsFound = [];
  
  async function search(dir, depth = 0) {
    if (depth > 6) return;
    try {
      const items = await fs.readdir(dir, { withFileTypes: true });
      for (const item of items) {
        if (EXCLUDE_DIRS.includes(item.name)) continue;

        const fullPath = path.join(dir, item.name);

        if (item.name === 'AGENTS.md' || item.name.toLowerCase().includes('agent')) {
          agentsFound.push({ name: `${path.basename(dir)}_${item.name}`, path: fullPath, isDir: item.isDirectory() });
        } else if (item.isDirectory()) {
          if (item.name === 'agents' || item.name === '.agents') {
            try {
              const subItems = await fs.readdir(fullPath, { withFileTypes: true });
              for (const subItem of subItems) {
                const agentPath = path.join(fullPath, subItem.name);
                agentsFound.push({ name: `${path.basename(dir)}_${subItem.name}`, path: agentPath, isDir: subItem.isDirectory() });
              }
            } catch (e) {}
          } else {
            await search(fullPath, depth + 1);
          }
        }
      }
    } catch (err) {}
  }

  await search(baseDir);
  return agentsFound;
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function run() {
  console.log('=== Aggregating Agents into Shared Brain ===');
  await fs.mkdir(MAX_SHARED_AGENTS, { recursive: true });

  console.log('Searching for agents on Max (C:\\pqr.info)...');
  const maxAgents = await findAgents(MAX_PQR);
  const pluginAgents = await findAgents(MAX_CONFIG_PLUGINS);
  const allMax = [...maxAgents, ...pluginAgents];
  console.log(`Found ${allMax.length} agent assets on Max.`);

  console.log('Searching for agents on Ted (\\\\ted\\pqr.info)...');
  const tedAgents = await findAgents(TED_PQR);
  console.log(`Found ${tedAgents.length} agent assets on Ted.`);

  const allAgents = [...allMax, ...tedAgents];

  for (const agent of allAgents) {
    if (agent.path.includes('shared_brain')) continue;

    const destMax = path.join(MAX_SHARED_AGENTS, agent.name);
    const destTed = path.join(TED_SHARED_AGENTS, agent.name);

    console.log(`Syncing Agent Asset [${agent.name}] to Shared Brain...`);
    try {
      if (agent.isDir) {
        await copyDir(agent.path, destMax);
      } else {
        await fs.copyFile(agent.path, destMax);
      }
    } catch (e) { console.error(`Max sync note for ${agent.name}:`, e.message); }

    try {
      if (agent.isDir) {
        await copyDir(agent.path, destTed);
      } else {
        await fs.copyFile(agent.path, destTed);
      }
    } catch (e) { console.error(`Ted sync note for ${agent.name}:`, e.message); }
  }

  console.log('=== Agent Shared Brain Aggregation Complete! ===');
}

run().catch(console.error);
