const fs = require("fs");
const path = require("path");

const AGENTS = ["MAX", "TED", "ZETA", "DeepSeek", "Qwen"];

function getDecayProfile(agent) {
  const profiles = {
    "MAX": "long_horizon",
    "TED": "compaction",
    "ZETA": "governance_ultra",
    "DeepSeek": "serrated_edge",
    "Qwen": "execution"
  };
  return profiles[agent] || "default";
}

function getPriorityTags(agent) {
  return ["constitution", "mesh_context"];
}

function computeExpiry(agent) {
  const minutes = {
    "MAX": 30,
    "TED": 10,
    "ZETA": 20,
    "DeepSeek": 5,
    "Qwen": 15
  };
  const duration = (minutes[agent] || 15) * 60000;
  return new Date(Date.now() + duration).toISOString();
}

function selectGeminiFs(agent) {
  const baseDir = "C:\\Users\\theal\\geminifs-output\\turns";
  if (!fs.existsSync(baseDir)) return [];
  const files = fs.readdirSync(baseDir).filter(f => f.endsWith(".md"));
  let selected = files.slice(-5); 
  if (agent === "DeepSeek") {
    selected = selected.map(f => f + "_summary_1_line");
  }
  return selected;
}

function selectCopilotFs(agent) {
  const baseDir = "C:\\pqr.info\\copilotfs";
  let items = [];
  if (fs.existsSync(baseDir)) {
    items = fs.readdirSync(baseDir)
      .filter(f => fs.statSync(path.join(baseDir, f)).isFile() && f.endsWith(".md"))
      .slice(-5);
  }
  return items;
}

function selectFusionSessions(agent) {
  const baseDir = "C:\\pqr.info\\fusion\\sessions";
  let items = [];
  if (fs.existsSync(baseDir)) {
    const sessions = fs.readdirSync(baseDir);
    if (sessions.length > 0) {
      items.push(`${sessions[sessions.length - 1]}/synthesis.md`);
    }
  }
  return items;
}

function buildContextWindow(agent) {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  return {
    agent,
    window_id: `ctx_${ts}_${agent}`,
    sources: {
      geminifs: selectGeminiFs(agent),
      copilotfs: selectCopilotFs(agent),
      fusion: selectFusionSessions(agent)
    },
    decay_profile: getDecayProfile(agent),
    priority_tags: getPriorityTags(agent),
    expires_at: computeExpiry(agent)
  };
}

function writeContextWindow(agent, window) {
  const dir = `C:\\pqr.info\\nodes\\${agent}\\context`;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  // Clean up old ones
  const files = fs.readdirSync(dir);
  files.forEach(f => {
    if (f.startsWith("ctx_") && f.endsWith(".json")) {
      fs.unlinkSync(path.join(dir, f));
    }
  });

  const file = path.join(dir, `${window.window_id}.json`);
  fs.writeFileSync(file, JSON.stringify(window, null, 2), "utf8");
}

function runContextScheduler() {
  for (const agent of AGENTS) {
    const window = buildContextWindow(agent);
    writeContextWindow(agent, window);
  }
}

module.exports = { runContextScheduler };
