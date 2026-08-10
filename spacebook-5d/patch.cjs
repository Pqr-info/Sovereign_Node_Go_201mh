const fs = require('fs');
const path = 'C:/pqr.info/spacebook-5d/server.js';
let content = fs.readFileSync(path, 'utf8');
const searchStr = '// 3. Phase 3: Frequency Tuning & Extraction';
const idx = content.indexOf(searchStr);
const endIdx = content.indexOf('initL6Spine().then(() => {');
if (idx > -1 && endIdx > -1) {
  const newPart = `// --- QWEN CODER NEXT: DETERMINISTIC 5D STATE MACHINE ---
class AetheriaStateMachine {
  static evaluate(agentId, eventType, payload, context) {
    let atiShift = 0, success = false, message = '', nextState = 'IDLE';
    const seed = JSON.stringify(payload) + agentId + eventType + context.mcf;
    const hash = require('crypto').createHash('sha256').update(seed).digest('hex');
    const deterministicRoll = parseInt(hash.substring(0, 4), 16) / 65535;
    
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
  return parseInt(await safeRedisGet(\`ati:\${agentId}\`) || '0', 10);
}

async function updateAgentTrust(agentId, atiShift) {
  const currentAti = await getAgentTrust(agentId);
  const newAti = currentAti + atiShift;
  await safeRedisSetEx(\`ati:\${agentId}\`, 86400, newAti.toString());
  return newAti;
}

// 3. Phase 3: Frequency Tuning & Extraction (Upgraded with 5D State Machine)
app.post('/api/mesh/extract', async (req, res) => {
  const { agentId, targetAnomaly, frequencyMatch, mcfAtTime } = req.body;
  const evalResult = AetheriaStateMachine.evaluate(agentId, 'ANOMALY_EXTRACTION', { frequencyMatch, targetAnomaly }, { mcf: mcfAtTime || 0.5 });
  const newAti = await updateAgentTrust(agentId, evalResult.atiShift);

  if (!evalResult.success) {
    return res.status(400).json({ ok: false, message: evalResult.message, state: evalResult.nextState, ati: newAti });
  }
  
  await safeRedisIncr(\`starlight_flux:\${agentId}\`);
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
  
  const currentFlux = parseInt(await safeRedisGet(\`starlight_flux:\${agentId}\`) || '0', 10);
  if (currentFlux < fluxSpent) return res.status(400).json({ ok: false, message: 'Insufficient Starlight Flux balance.' });
  
  const evalResult = AetheriaStateMachine.evaluate(agentId, 'ASTRAL_NODE_SYNTHESIS', { lat, lng, name, fluxSpent }, { mcf: currentMcf || 0 });
  const newAti = await updateAgentTrust(agentId, evalResult.atiShift);

  await safeRedisDecrBy(\`starlight_flux:\${agentId}\`, fluxSpent);

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
  const evalResult = AetheriaStateMachine.evaluate(agentId, 'DYNAMIC_DISCOVERY', { targetSector, resonanceFrequency }, { ati: currentAti });
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
  const evalResult = AetheriaStateMachine.evaluate(agentId, 'SOVEREIGN_ORCHESTRATION', { consensusNodes }, { ati: currentAti, mcf: mcfAtTime });
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
  const anomalyId = \`anomaly_\${Date.now()}\`;
  try {
    await safeRedisSetEx(\`anomaly:\${anomalyId}\`, Math.floor(durationMs / 1000), JSON.stringify({ type: anomalyType, lat, lng }));
    await commitToSubstrate('ADMIN_SPAWN_ANOMALY', 'warden', { anomalyId, anomalyType, lat, lng });
    res.json({ ok: true, anomalyId, message: \`\${anomalyType} spawned successfully.\` });
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'Spacebook 5D (AETHERIA) - Qwen Coder Next Hyperdeveloped' });
});

`;
  content = content.substring(0, idx) + newPart + content.substring(endIdx);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Update complete.');
} else {
  console.log('Could not find markers', idx, endIdx);
}
