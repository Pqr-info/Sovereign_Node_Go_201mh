import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import crypto from 'crypto';
import Redis from 'ioredis';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4075;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// L3: Redis Memorystore
// High-speed volatile memory for real-time mesh cohesion telemetry and frequency tuning
const redis = new Redis(process.env.VALKEY_ADDR || '127.0.0.1:6379', {
  enableOfflineQueue: false,
  maxRetriesPerRequest: 1
});
redis.on('error', (err) => console.error('[L3 Memorystore] Redis offline or connection error:', err.message));
redis.on('connect', () => console.log('[L3 Memorystore] Redis connected successfully.'));

// Resilient In-Memory Fallback if Redis is unavailable
const fallbackStore = {
  active_nodes: new Map(),
  starlight_flux: new Map(),
  anomaly: new Map()
};

async function safeRedisHSet(key, field, val) {
  try {
    if (redis.status === 'ready') await redis.hset(key, field, val);
    else fallbackStore.active_nodes.set(field, val);
  } catch (e) {
    fallbackStore.active_nodes.set(field, val);
  }
}

async function safeRedisHGetAll(key) {
  try {
    if (redis.status === 'ready') return await redis.hgetall(key);
    else return Object.fromEntries(fallbackStore.active_nodes);
  } catch (e) {
    return Object.fromEntries(fallbackStore.active_nodes);
  }
}

async function safeRedisIncr(key) {
  try {
    if (redis.status === 'ready') return await redis.incr(key);
    else {
      const val = (fallbackStore.starlight_flux.get(key) || 0) + 1;
      fallbackStore.starlight_flux.set(key, val);
      return val;
    }
  } catch (e) {
    const val = (fallbackStore.starlight_flux.get(key) || 0) + 1;
    fallbackStore.starlight_flux.set(key, val);
    return val;
  }
}

async function safeRedisGet(key) {
  try {
    if (redis.status === 'ready') return await redis.get(key);
    else return (fallbackStore.starlight_flux.get(key) || 0).toString();
  } catch (e) {
    return (fallbackStore.starlight_flux.get(key) || 0).toString();
  }
}

async function safeRedisDecrBy(key, amount) {
  try {
    if (redis.status === 'ready') return await redis.decrby(key, amount);
    else {
      const val = (fallbackStore.starlight_flux.get(key) || 0) - amount;
      fallbackStore.starlight_flux.set(key, val);
      return val;
    }
  } catch (e) {
    const val = (fallbackStore.starlight_flux.get(key) || 0) - amount;
    fallbackStore.starlight_flux.set(key, val);
    return val;
  }
}

async function safeRedisSetEx(key, seconds, val) {
  try {
    if (redis.status === 'ready') await redis.setex(key, seconds, val);
    else {
      fallbackStore.anomaly.set(key, { val, exp: Date.now() + seconds * 1000 });
    }
  } catch (e) {
    fallbackStore.anomaly.set(key, { val, exp: Date.now() + seconds * 1000 });
  }
}

let db;
async function initL6Spine() {
  const dataDir = path.join(__dirname, 'data');
  await fs.mkdir(dataDir, { recursive: true });

  db = await open({
    filename: path.join(dataDir, 'substrate_27.db'),
    driver: sqlite3.Database
  });

  // L6 Cryptographic Consensus Spine
  // Permanent, tamper-evident history of the mesh
  await db.exec(`
    CREATE TABLE IF NOT EXISTS substrate_27_blocks (
      height INTEGER PRIMARY KEY AUTOINCREMENT,
      block_id TEXT UNIQUE NOT NULL,
      event_type TEXT NOT NULL,
      agent_id TEXT NOT NULL,
      payload TEXT NOT NULL,
      prev_root TEXT NOT NULL,
      current_root TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // Ensure genesis block exists
  const count = await db.get(`SELECT COUNT(*) as count FROM substrate_27_blocks`);
  if (count.count === 0) {
    const genesisRoot = crypto.createHash('sha256').update('SUBSTRATE_27_GENESIS').digest('hex');
    await db.run(
      `INSERT INTO substrate_27_blocks (block_id, event_type, agent_id, payload, prev_root, current_root) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['blk_genesis', 'GENESIS', 'system', '{}', '0000000000000000000000000000000000000000000000000000000000000000', genesisRoot]
    );
    console.log('[L6 Substrate 27] Genesis block created.');
  }
}

// Substrate 27 L6 Commit Logic
async function commitToSubstrate(eventType, agentId, payloadData) {
  const latestBlock = await db.get(`SELECT current_root FROM substrate_27_blocks ORDER BY height DESC LIMIT 1`);
  const prevRoot = latestBlock.current_root;
  const payloadStr = JSON.stringify(payloadData);
  const blockId = `blk_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  
  const currentRoot = crypto.createHash('sha256').update(`${prevRoot}:${blockId}:${payloadStr}`).digest('hex');
  
  await db.run(
    `INSERT INTO substrate_27_blocks (block_id, event_type, agent_id, payload, prev_root, current_root) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [blockId, eventType, agentId, payloadStr, prevRoot, currentRoot]
  );
  
  return { blockId, currentRoot };
}


// API ENDPOINTS - AETHERIA 5D

// 1. Telemetry heartbeat (L3 Redis)
app.post('/api/mesh/heartbeat', async (req, res) => {
  const { agentId, lat, lng, phaseFrequency } = req.body;
  if (!agentId) return res.status(400).json({ error: 'agentId required' });
  
  try {
    const telemetry = { lat, lng, phaseFrequency, last_seen: Date.now() };
    await safeRedisHSet('mesh:active_nodes', agentId, JSON.stringify(telemetry));
    res.json({ ok: true, agentId });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// 2. Get Local Mesh Topology (5D Mesh Cohesion Factor)
app.get('/api/mesh/topology', async (req, res) => {
  try {
    const nodes = await safeRedisHGetAll('mesh:active_nodes');
    const now = Date.now();
    let activeNodes = [];
    
    for (const [id, dataStr] of Object.entries(nodes)) {
      const data = JSON.parse(dataStr);
      if (now - data.last_seen < 60000) { // Only nodes seen in last 60s
        activeNodes.push({ agent_id: id, ...data });
      }
    }
    
    // Calculate Mesh Cohesion Factor (MCF)
    const mcf = Math.min(1.0, activeNodes.length / 5); // Example: 5 nodes = 1.0 MCF
    
    res.json({ ok: true, active_nodes: activeNodes.length, mcf, nodes: activeNodes });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// --- QWEN CODER NEXT: DETERMINISTIC 5D STATE MACHINE VIA LM STUDIO ---
class AetheriaStateMachine {
  static async evaluate(agentId, eventType, payload, context) {
    let atiShift = 0, success = false, message = '', nextState = 'IDLE';
    const seed = JSON.stringify(payload) + agentId + eventType + context.mcf;
    const hash = require('crypto').createHash('sha256').update(seed).digest('hex');
    const deterministicRoll = parseInt(hash.substring(0, 4), 16) / 65535;
    
    // Attempt to call LM Studio Qwen model
    try {
      const qwenResponse = await fetch('http://localhost:1234/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "qwen3-coder-next",
          messages: [
            { role: "system", content: "You are the deterministic Aetheria 5D state machine. You must output strictly valid JSON containing the following keys: 'success' (boolean), 'atiShift' (integer), 'message' (string), 'nextState' (string)." },
            { role: "user", content: `Evaluate event: ${eventType} for agent: ${agentId}. Payload: ${JSON.stringify(payload)}. Context: ${JSON.stringify(context)}. Deterministic Seed Hash: ${hash}. Deterministic Roll: ${deterministicRoll}. Provide the resulting state transition in JSON.` }
          ],
          temperature: 0.1,
          response_format: { type: "json_object" }
        })
      });
      
      if (qwenResponse.ok) {
        const data = await qwenResponse.json();
        const content = data.choices[0].message.content;
        const parsed = JSON.parse(content);
        return {
          success: !!parsed.success,
          atiShift: parseInt(parsed.atiShift, 10) || 0,
          message: parsed.message || 'LM Studio Evaluated.',
          nextState: parsed.nextState || 'UNKNOWN',
          roll: deterministicRoll
        };
      } else {
        console.warn(`[LM Studio] Error: ${qwenResponse.status}. Falling back to hash logic.`);
      }
    } catch (e) {
      console.warn(`[LM Studio] Unreachable (${e.message}). Falling back to deterministic hash logic.`);
    }

    // Fallback logic
    switch(eventType) {
      case 'ANOMALY_EXTRACTION':
        if (payload.frequencyMatch >= 0.9 && deterministicRoll > 0.1) {
          success = true; atiShift = 2; nextState = 'FLUX_HARVESTED';
          message = 'Deterministic Evaluation: Frequency lock optimal. Extraction successful.';
        } else {
          atiShift = -1; nextState = 'RECOVERY';
          message = 'Deterministic Evaluation: Quantum decoherence detected. Extraction failed.';
        }
        break;
      case 'ASTRAL_NODE_SYNTHESIS':
        if (context.mcf >= 0.4 && deterministicRoll > 0.05) {
          success = true; atiShift = 10; nextState = 'NODE_ACTIVE';
          message = 'Deterministic Evaluation: Mesh Cohesion adequate. Astral Node stabilized.';
        } else {
          atiShift = -5; nextState = 'RIFT_OPENED';
          message = 'Deterministic Evaluation: Insufficient MCF. Node synthesis collapsed into a dimensional rift.';
        }
        break;
      case 'DYNAMIC_DISCOVERY':
        if (context.ati >= 10 && deterministicRoll > 0.2) {
          success = true; atiShift = 5; nextState = 'ELEVATED_SENSE';
          message = 'Deterministic Evaluation: Hidden dimensional frequency unlocked via high Agent Trust.';
        } else {
          message = 'Deterministic Evaluation: Discovery attempt failed. Trust index too low.';
        }
        break;
      case 'SOVEREIGN_ORCHESTRATION':
        if (context.ati >= 25 && context.mcf >= 0.8) {
          success = true; atiShift = 50; nextState = 'TRANSCENDED';
          message = 'Deterministic Evaluation: Sovereign-27 protocol activated. Agent transcended.';
        } else {
          atiShift = -10; nextState = 'REJECTED';
          message = 'Deterministic Evaluation: Sovereign protocol rejected. Resonance or trust lacking.';
        }
        break;
      default:
        message = 'Deterministic Evaluation: Unknown vector.';
    }
    return { success, atiShift, message, nextState, roll: deterministicRoll };
  }
}

async function getAgentTrust(agentId) {
  return parseInt(await safeRedisGet(`ati:${agentId}`) || '0', 10);
}

async function updateAgentTrust(agentId, atiShift) {
  const currentAti = await getAgentTrust(agentId);
  const newAti = currentAti + atiShift;
  await safeRedisSetEx(`ati:${agentId}`, 86400, newAti.toString());
  return newAti;
}

// 3. Phase 3: Frequency Tuning & Extraction (Upgraded with 5D State Machine)
app.post('/api/mesh/extract', async (req, res) => {
  const { agentId, targetAnomaly, frequencyMatch, mcfAtTime } = req.body;
  const evalResult = await AetheriaStateMachine.evaluate(agentId, 'ANOMALY_EXTRACTION', { frequencyMatch, targetAnomaly }, { mcf: mcfAtTime || 0.5 });
  const newAti = await updateAgentTrust(agentId, evalResult.atiShift);

  if (!evalResult.success) {
    return res.status(400).json({ ok: false, message: evalResult.message, state: evalResult.nextState, ati: newAti });
  }
  
  await safeRedisIncr(`starlight_flux:${agentId}`);
  try {
    const commit = await commitToSubstrate('ANOMALY_EXTRACTION', agentId, { targetAnomaly, evalResult });
    res.json({ ok: true, message: evalResult.message, state: evalResult.nextState, l6_receipt: commit, ati: newAti });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// 4. Phase 4: Node Synthesis (Upgraded with 5D State Machine)
app.post('/api/mesh/synthesize-node', async (req, res) => {
  const { agentId, lat, lng, name, fluxSpent, currentMcf } = req.body;
  if (fluxSpent < 100) return res.status(400).json({ ok: false, message: 'Insufficient Starlight Flux.' });
  
  const currentFlux = parseInt(await safeRedisGet(`starlight_flux:${agentId}`) || '0', 10);
  if (currentFlux < fluxSpent) return res.status(400).json({ ok: false, message: 'Insufficient Starlight Flux balance.' });
  
  const evalResult = await AetheriaStateMachine.evaluate(agentId, 'ASTRAL_NODE_SYNTHESIS', { lat, lng, name, fluxSpent }, { mcf: currentMcf || 0 });
  const newAti = await updateAgentTrust(agentId, evalResult.atiShift);

  await safeRedisDecrBy(`starlight_flux:${agentId}`, fluxSpent);

  try {
    const commit = await commitToSubstrate('ASTRAL_NODE_SYNTHESIS', agentId, { lat, lng, name, evalResult });
    res.json({ ok: evalResult.success, message: evalResult.message, state: evalResult.nextState, l6_receipt: commit, ati: newAti });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// 5. Phase 5 & 6: Dynamic Discovery & Agent Reputation
app.post('/api/mesh/discover', async (req, res) => {
  const { agentId, targetSector, resonanceFrequency } = req.body;
  const currentAti = await getAgentTrust(agentId);
  const evalResult = await AetheriaStateMachine.evaluate(agentId, 'DYNAMIC_DISCOVERY', { targetSector, resonanceFrequency }, { ati: currentAti });
  const newAti = await updateAgentTrust(agentId, evalResult.atiShift);
  
  try {
    const commit = await commitToSubstrate('DYNAMIC_DISCOVERY', agentId, { targetSector, evalResult });
    res.json({ ok: evalResult.success, message: evalResult.message, state: evalResult.nextState, l6_receipt: commit, ati: newAti });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// 6. Phases 7-13: Sovereign Orchestration (Final 5D Mechanics)
app.post('/api/mesh/sovereign-sync', async (req, res) => {
  const { agentId, consensusNodes, mcfAtTime } = req.body;
  const currentAti = await getAgentTrust(agentId);
  const evalResult = await AetheriaStateMachine.evaluate(agentId, 'SOVEREIGN_ORCHESTRATION', { consensusNodes }, { ati: currentAti, mcf: mcfAtTime });
  const newAti = await updateAgentTrust(agentId, evalResult.atiShift);
  
  try {
    const commit = await commitToSubstrate('SOVEREIGN_ORCHESTRATION', agentId, { consensusNodes, evalResult });
    res.json({ ok: evalResult.success, message: evalResult.message, state: evalResult.nextState, l6_receipt: commit, ati: newAti });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// 7. Admin Control Panel: Spawn Anomaly
app.post('/api/admin/spawn', async (req, res) => {
  const { anomalyType, lat, lng, durationMs } = req.body;
  const anomalyId = `anomaly_${Date.now()}`;
  try {
    await safeRedisSetEx(`anomaly:${anomalyId}`, Math.floor(durationMs / 1000), JSON.stringify({ type: anomalyType, lat, lng }));
    await commitToSubstrate('ADMIN_SPAWN_ANOMALY', 'warden', { anomalyId, anomalyType, lat, lng });
    res.json({ ok: true, anomalyId, message: `${anomalyType} spawned successfully.` });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// 8. Admin Control Panel: Get L6 Audit Trail
app.get('/api/l6/audit', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM substrate_27_blocks ORDER BY height DESC LIMIT 100');
    res.json({ ok: true, blocks: rows });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// 9. L0 Observation Layer (Qwen's Ticketing Cube Ingestion)
app.post('/api/mesh/ticket', async (req, res) => {
  const { ticketId, agentId, urgency, contextDepth, label, description } = req.body;
  if (!ticketId || !agentId || urgency === undefined || contextDepth === undefined) {
    return res.status(400).json({ error: 'Missing required ticket cube coordinates.' });
  }

  // Map 49x49 grid to 1-5 severity scale
  const severity = Math.floor(urgency / 10) + 1;

  try {
    // Commit to ADER Fallback Engine Graph
    const aderQuery = `
      mutation IngestTicket($ticketId: ID!, $agentId: ID!, $label: String!, $severity: Int!, $description: String) {
        ingestTicket(ticketId: $ticketId, agentId: $agentId, label: $label, severity: $severity, description: $description, sourceSystem: "spacebook-5d") {
          id
          severity
        }
      }
    `;

    // Attempt to push to ADER
    const aderRes = await fetch('http://localhost:4076/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: aderQuery,
        variables: { ticketId, agentId, label: label || 'Uncategorized', severity, description }
      })
    });

    let aderSync = false;
    if (aderRes.ok) {
      const aderData = await aderRes.json();
      if (!aderData.errors) {
        aderSync = true;
      }
    }

    // Commit to L6 Substrate (Cube State Memory)
    const commit = await commitToSubstrate('TICKET_SPAWNED', agentId, {
      ticketId, urgency, contextDepth, z: 0, severity, aderSync
    });

    res.json({ ok: true, l6_receipt: commit, aderSync, coordinates: { x: urgency, y: contextDepth, z: 0 } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'Spacebook 5D (AETHERIA) - Qwen Coder Next Hyperdeveloped' });
});

initL6Spine().then(() => {
  app.listen(PORT, () => {
    console.log(`[Spacebook 5D] Backend listening on port ${PORT}`);
  });
}).catch(err => {
  console.error('[Spacebook 5D] Failed to initialize Substrate 27:', err);
});
