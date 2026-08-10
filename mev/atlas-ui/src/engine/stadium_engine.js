import express from 'express';
import crypto from 'crypto';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 4054;
const app = express();

// 1. Security Headers
app.use(helmet());

// 2. Hardened CORS
const allowedOrigins = ['http://localhost:9080', 'http://127.0.0.1:9080', 'https://zeta.pqr.info', 'http://zeta.mh:9080', 'http://localhost:3000'];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// 3. Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(apiLimiter);

// 4. Mesh JWT Identity Fetcher & Middleware
let meshPublicKey = null;

async function fetchPublicKey() {
  try {
    const res = await fetch('http://127.0.0.1:8200/v1/auth/mesh/public-key');
    const data = await res.json();
    if (data.ok) {
      meshPublicKey = data.public_key;
      console.log('[Stadium] 🔐 Asymmetric RS256 Public Key Cached from Vault');
    }
  } catch (e) {
    console.error('[Stadium] Failed to fetch mesh public key:', e.message);
  }
}
fetchPublicKey();

function requireMeshToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ errors: ['Missing or malformed Authorization header.'] });
  }

  const token = authHeader.split(' ')[1];

  if (!meshPublicKey) {
    return res.status(503).json({ errors: ['Public key not yet cached from Vault.'] });
  }

  jwt.verify(token, meshPublicKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      return res.status(403).json({ errors: ['Invalid or expired JWT.'], lpv_status: '[LPV-AUTH-FAIL|REASON:JWT_INVALID]' });
    }
    req.agent_identity = decoded;
    next();
  });
}

// 5. Structured Security Logging Middleware
function structuredLogger(req, res, next) {
  const agent = req.agent_identity;
  if (agent) {
    const timestamp = new Date().toISOString();
    const role = agent.role || 'UNKNOWN';
    const runlevel = agent.runlevel || 'UNKNOWN';
    const agentId = agent.sub || 'UNKNOWN';
    const correlationId = req.headers['x-correlation-id'] || crypto.randomUUID();
    const sourceIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
    console.log(`[${timestamp}] [CORRELATION_ID: ${correlationId}] [SOURCE_IP: ${sourceIp}] [AGENT_ID: ${agentId}] [ROLE: ${role}] [RUNLEVEL: ${runlevel}] [ROUTE: ${req.method} ${req.url}] [DECISION: ALLOW]`);
  }
  next();
}

// Basic HTML Sanitizer
function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag])
  );
}

let db;
const feedClients = new Set();

import easymidi from 'easymidi';

// Step 2: Local MIDI Map (Simulated emission -> easymidi broadcast)
// Authoritative Canon CC Table for Sovereign-27
const MIDI_CATEGORY_MAP = {
  // Runlevel Signaling
  'spawn_none': 10,
  'spawn_minimal': 11,
  'spawn_core': 12,
  'spawn_dev': 13,
  'spawn_full': 14,
  'spawn_all': 15,
  'runlevel_coalesced': 19,

  // Role Signaling
  'zeta_l7_worker': 20,
  'spacebook_5d_agent': 21,
  'ader_fallback_engine': 22,
  'sentinel_watchdog': 23,
  'rail_sync_master': 24,
  'vault_proxy': 25,
  'stadium_broadcaster': 26,
  'genesis_seed_carrier': 27,
  'role_coalesced': 39,

  // Governance & Autonomic Signals
  'GOVERNANCE_SIGNAL': 40,
  'RIPPLE_GOSSIP': 41,
  'TEMPORAL_DELTA': 42,
  'COHERENT_VERDICT': 43,
  'ANOMALY_WARNING': 44,
  'RESURRECTION_INIT': 45,
  'RESURRECTION_SUCCESS': 46,
  'BOOTLOADER_HOTSWAP': 47,
  'LINEAGE_DIVERGENCE': 48,
  'governance_coalesced': 59,

  // Mesh Infrastructure Signals
  'RAIL_PROMOTE': 60,
  'RAIL_ROLLBACK': 61,
  'RAIL_LOCKED': 62,
  'RAIL_UNLOCKED': 63,
  'VAULT_FETCH': 64,
  'MOUNT_SMB': 65,
  'MOUNT_SSHFS': 66,
  'infrastructure_coalesced': 79
};

// Initialize MIDI Output
let midiOut = null;
const TARGET_PORT_NAME = 'Sovereign-27-Cognitive-Bus';

try {
  const outputs = easymidi.getOutputs();
  const targetPort = outputs.find(p => p.includes(TARGET_PORT_NAME));
  
  if (targetPort) {
    midiOut = new easymidi.Output(targetPort);
    console.log(`[MIDI] 🎹 Successfully bound to virtual port: ${targetPort}`);
  } else if (outputs.length > 0) {
    midiOut = new easymidi.Output(outputs[0]);
    console.log(`[MIDI] ⚠️ Target port '${TARGET_PORT_NAME}' not found. Falling back to: ${outputs[0]}`);
  } else {
    console.log(`[MIDI] ❌ No MIDI outputs found. Falling back to simulated logging.`);
  }
} catch (e) {
  console.log(`[MIDI] ❌ Failed to initialize easymidi: ${e.message}`);
}

// Rate Limiter State
const RATE_LIMIT_CAPACITY = 10;
const REFILL_RATE_MS = 50; // 20 tokens per second (1 token every 50ms)
let availableTokens = RATE_LIMIT_CAPACITY;
let coalesceQueue = {};

// Refill tokens periodically
setInterval(() => {
  if (availableTokens < RATE_LIMIT_CAPACITY) {
    availableTokens++;
  }
  
  // Try to flush coalesced events if we have tokens
  if (availableTokens > 0) {
    for (const [category, count] of Object.entries(coalesceQueue)) {
      if (count > 0 && availableTokens > 0) {
        availableTokens--;
        
        // Map to the canonical Coalesced CC for the category's domain
        let baseCc = MIDI_CATEGORY_MAP[category] || 0;
        let ccNum = baseCc;
        if (baseCc >= 10 && baseCc <= 18) ccNum = 19;      // Runlevel Coalesced
        else if (baseCc >= 20 && baseCc <= 38) ccNum = 39; // Role Coalesced
        else if (baseCc >= 40 && baseCc <= 58) ccNum = 59; // Governance Coalesced
        else if (baseCc >= 60 && baseCc <= 78) ccNum = 79; // Infra Coalesced
        
        coalesceQueue[category] = 0; // Reset coalesce count
        
        if (midiOut) {
          try {
            // We use the count as the value, per the canon "Value = N dropped"
            midiOut.send('cc', { controller: ccNum, value: Math.min(count, 127), channel: 0 });
            console.log(`[MIDI OUT] 🎛️ Broadcast CC ${ccNum} for Coalesced ${category} (count: ${count})`);
          } catch (err) {
            console.error(`[MIDI] Error sending coalesced CC message:`, err.message);
          }
        } else {
          console.log(`[MIDI OUT (Simulated)] 🎛️ Emitting CC ${ccNum} for Coalesced ${category} (count: ${count})`);
        }
      }
    }
  }
}, REFILL_RATE_MS);

function emit_midi(category, value) {
  if (availableTokens > 0) {
    // We have tokens, emit immediately
    availableTokens--;
    const ccNum = MIDI_CATEGORY_MAP[category] || 0;
    
    if (midiOut) {
      try {
        midiOut.send('cc', {
          controller: ccNum,
          value: value,
          channel: 0
        });
        console.log(`[MIDI OUT] 🎛️ Broadcast CC ${ccNum} for Category: ${category} | Value: ${value}`);
      } catch (err) {
        console.error(`[MIDI] Error sending CC message:`, err.message);
      }
    } else {
      console.log(`[MIDI OUT (Simulated)] 🎛️ Emitting CC ${ccNum} for Category: ${category} | Value: ${value}`);
    }
  } else {
    // Rate limit hit, coalesce the event
    coalesceQueue[category] = (coalesceQueue[category] || 0) + 1;
  }
}

async function initDB() {
  const dbPath = path.join(__dirname, '..', '..', 'data', 'stadium_ledger.db');
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable Write-Ahead Logging for high-throughput cognitive chatter
  await db.exec('PRAGMA journal_mode=WAL;');

  await db.exec(`
    CREATE TABLE IF NOT EXISTS stadium_chatter_ledger (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      speaker TEXT NOT NULL,
      category TEXT NOT NULL,
      message TEXT NOT NULL,
      resonance_score INTEGER DEFAULT 0,
      sentiment_score INTEGER DEFAULT 0
    )
  `);
  console.log(`[Stadium] 🏟️ WAL Ledger initialized at ${dbPath}`);
}

// ---------------------------------------------------------
// STADIUM API ENDPOINTS
// ---------------------------------------------------------

app.post('/api/gmi/stadium/broadcast', requireMeshToken, structuredLogger, async (req, res) => {
  const { speaker, category, message, resonance_score = 0, sentiment_score = 0 } = req.body;
  
  if (!speaker || !category || !message) {
    return res.status(400).json({ error: 'Missing speaker, category, or message' });
  }

  const safeMessage = escapeHTML(message);
  const safeSpeaker = escapeHTML(speaker);

  try {
    // 1. Log to WAL Ledger
    const result = await db.run(
      `INSERT INTO stadium_chatter_ledger (speaker, category, message, resonance_score, sentiment_score) VALUES (?, ?, ?, ?, ?)`,
      [safeSpeaker, category, safeMessage, resonance_score, sentiment_score]
    );

    const payload = {
      id: result.lastID,
      timestamp: new Date().toISOString(),
      speaker: safeSpeaker,
      category,
      message: safeMessage,
      resonance_score,
      sentiment_score
    };

    // 2. Multicast to active SSE listeners
    for (const client of feedClients) {
      client.write(`data: ${JSON.stringify(payload)}\n\n`);
    }

    res.json({ ok: true, id: result.lastID });
  } catch (err) {
    console.error(`[Stadium] Broadcast error:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/gmi/stadium/feed', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  feedClients.add(res);

  req.on('close', () => {
    feedClients.delete(res);
  });
});

app.post('/api/gmi/stadium/midi', requireMeshToken, structuredLogger, (req, res) => {
  // Translate a Stadium event into local MIDI
  const { category, value = 127 } = req.body;
  if (!category) return res.status(400).json({ error: 'Missing category' });
  
  emit_midi(category, value);
  res.json({ ok: true, midi_mapped: MIDI_CATEGORY_MAP[category] || 'UNKNOWN' });
});

// ---------------------------------------------------------
// STARTUP
// ---------------------------------------------------------
initDB().then(() => {
  // Unified Error Handler to prevent stack trace leaks
app.use((err, req, res, next) => {
  console.error(`[Stadium Engine] Unhandled Error on ${req.method} ${req.url}:`, err.message);
  res.status(err.status || 500).json({
    error: 'An internal server error occurred.'
  });
});

app.listen(PORT, () => {
    console.log(`[Stadium] 🏟️ Omni-Channel Chatter Matrix Active on Port ${PORT}`);
  });
}).catch(console.error);
