import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { spawn } from 'child_process';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 4053;
const app = express();
app.use(express.json());

const STADIUM_URL = 'http://localhost:4054/api/gmi/stadium/broadcast';
const PQR_ROOT = 'C:/pqr.info';
const MANIFEST_PATH = path.join(PQR_ROOT, 'manifest.json');

async function broadcastToStadium(category, message, resonance_score = 90) {
  try {
    await fetch(STADIUM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        speaker: 'mesh_bootloader',
        category,
        message,
        resonance_score
      })
    });
    await fetch('http://localhost:4054/api/gmi/stadium/midi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category })
    });
  } catch (err) {
    // Silent fallback if Stadium engine is offline
  }
}

function getManifestHash() {
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      const content = fs.readFileSync(MANIFEST_PATH, 'utf8');
      return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
    } catch (e) {
      return 'hash_error';
    }
  }
  return 'no_manifest';
}

let runCounter = 1;
let currentCoreModule = null;
let previousState = null;
let activeServiceMeta = { service: 'zeta_l7', release: 'zeta_R2', genesisId: 'evolved_genesis_R1', run: 1, status: 'ok' };

function readManifestServiceState(serviceName = 'zeta_l7', kind = 'current') {
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
      const serviceConfig = manifest?.sovereign?.services?.[serviceName];
      if (serviceConfig && serviceConfig[kind]) {
        const releaseName = serviceConfig[kind].replace('../../releases/', '');
        const targetDir = path.join(PQR_ROOT, 'releases', releaseName);
        if (fs.existsSync(targetDir)) {
          if (serviceConfig.run_counter) {
            runCounter = serviceConfig.run_counter;
          }
          return targetDir;
        }
      }
    } catch (e) {
      console.warn(`[Bootloader] Failed reading manifest.json: ${e.message}`);
    }
  }
  return null;
}

function resolvePointer(serviceName = 'zeta_l7', kind = 'current') {
  const manifestDir = readManifestServiceState(serviceName, kind);
  if (manifestDir) return manifestDir;

  const runtimeDir = path.join(PQR_ROOT, 'runtime', serviceName);
  const ptrFile = path.join(runtimeDir, `${kind}.ptr`);
  
  if (fs.existsSync(ptrFile)) {
    const relTarget = fs.readFileSync(ptrFile, 'utf8').trim();
    const resolved = path.resolve(runtimeDir, relTarget);
    if (fs.existsSync(resolved)) {
      return resolved;
    }
  }
  
  const fallback = kind === 'genesis' 
    ? path.join(PQR_ROOT, 'releases', 'evolved_genesis_R1')
    : path.join(PQR_ROOT, 'releases', 'zeta_R2');
    
  return fs.existsSync(fallback) ? fallback : __dirname;
}

async function bootCore(serviceName = 'zeta_l7') {
  console.log(`\n[Bootloader] 🔥 Booting Sovereign-27 Core (${serviceName}) | RUN: ${runCounter} | Master PID: ${process.pid}`);
  
  const releaseDir = resolvePointer(serviceName, 'current');
  const serviceFile = path.join(releaseDir, 'service.js');
  const genesisFile = path.join(releaseDir, 'GENESIS_ID');
  
  let genesisId = 'evolved_genesis_R1';
  if (fs.existsSync(genesisFile)) {
    genesisId = fs.readFileSync(genesisFile, 'utf8').trim();
  }
  
  activeServiceMeta = { 
    service: serviceName, 
    release: path.basename(releaseDir), 
    genesisId,
    run: runCounter,
    status: 'ok',
    manifest_hash: getManifestHash()
  };

  if (fs.existsSync(serviceFile)) {
    const fileUrl = pathToFileURL(serviceFile).href + `?v=${runCounter}_${Date.now()}`;
    try {
      currentCoreModule = await import(fileUrl);
      if (currentCoreModule.start) {
        previousState = await currentCoreModule.start({ runCounter, previousState, genesisId });
      }
      activeServiceMeta.status = 'ok';
      console.log(`[Bootloader] ✅ Core initialized successfully. Release: ${activeServiceMeta.release} | Genesis: ${genesisId}`);
      await broadcastToStadium('GOVERNANCE_SIGNAL', `Bootloader initialized ${serviceName} (${activeServiceMeta.release}) under ${genesisId} at RUN=${runCounter}`, 95);
      await broadcastToStadium('TEMPORAL_DELTA', `Sequence step transition RUN=${runCounter} executed for ${serviceName}`, 85);
    } catch (e) {
      activeServiceMeta.status = 'fault';
      console.error(`[Bootloader] ❌ Failed to boot core from ${serviceFile}:`, e.stack);
      await broadcastToStadium('ANOMALY_WARNING', `Core boot failed for ${serviceName}: ${e.message}`, 100);
    }
  } else {
    activeServiceMeta.status = 'ok';
    console.warn(`[Bootloader] ⚠️ service.js not found in ${releaseDir}. Running in standby mode.`);
  }
}

// Simple JSON Health Endpoint with manifest_hash for promote scripts & Sentinel watchdog
app.get('/api/health', (req, res) => {
  res.json({
    service: activeServiceMeta.service,
    run: activeServiceMeta.run,
    release: activeServiceMeta.release,
    genesisId: activeServiceMeta.genesisId,
    status: activeServiceMeta.status,
    manifest_hash: getManifestHash(),
    pid: process.pid,
    timestamp: Date.now()
  });
});

// KICK endpoint for Atomic Promotion & Sentinel Watchdog
app.post('/api/kick', async (req, res) => {
  const { service = 'zeta_l7', release, rollback = false } = req.body;
  console.log(`\n[Bootloader] ⚠️ KICK COMMAND RECEIVED! Service: ${service} | Rollback: ${rollback} | Initiating Atomic reHUP...`);

  try {
    if (currentCoreModule && currentCoreModule.stop) {
      console.log(`[Bootloader] Halting active Core execution...`);
      currentCoreModule.stop();
    }

    const postMortemDir = path.join(PQR_ROOT, 'post_mortem');
    if (!fs.existsSync(postMortemDir)) {
      fs.mkdirSync(postMortemDir, { recursive: true });
    }
    const backupName = `${service}_quarantine_run${runCounter}_${Date.now()}.json`;
    const failureLog = {
      timestamp: new Date().toISOString(),
      runCounter,
      service,
      rollback,
      lastActiveRelease: activeServiceMeta.release,
      pid: process.pid,
      manifest_hash: getManifestHash()
    };
    fs.writeFileSync(path.join(postMortemDir, backupName), JSON.stringify(failureLog, null, 2));
    console.log(`[Bootloader] Quarantined run snapshot to ${backupName}`);

    runCounter++;

    await bootCore(service);

    res.json({
      ok: true,
      status: 'reHUP_complete',
      service: activeServiceMeta.service,
      run: activeServiceMeta.run,
      release: activeServiceMeta.release,
      genesisId: activeServiceMeta.genesisId,
      manifest_hash: getManifestHash(),
      pid: process.pid
    });
  } catch (err) {
    console.error(`[Bootloader] CRITICAL FAULT DURING KICK:`, err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

let stadiumProcess = null;

function bootStadium() {
  const stadiumPath = path.join(PQR_ROOT, 'mev', 'atlas-ui', 'src', 'engine', 'stadium_engine.js');
  console.log(`[Bootloader] 🏟️ Launching Stadium Engine...`);
  stadiumProcess = spawn('node', [stadiumPath], { stdio: 'inherit' });
  
  stadiumProcess.on('close', (code) => {
    console.warn(`[Bootloader] ⚠️ Stadium Engine exited with code ${code}. Respawning in 3 seconds...`);
    setTimeout(bootStadium, 3000);
  });
}

app.listen(PORT, () => {
  console.log(`[Bootloader] 🛡️ Watchdog & Release Rail Active on Port ${PORT} | Master PID: ${process.pid}`);
  bootStadium();
  bootCore();
});
