const fs = require('fs');
const path = require('path');

function getCount(dir, ext = "") {
  if (!fs.existsSync(dir)) return 0;
  if (ext) return fs.readdirSync(dir).filter(f => f.endsWith(ext)).length;
  return fs.readdirSync(dir).length;
}

function buildScanReport() {
  const ts = new Date().toISOString();
  
  const specs = getCount("C:\\pqr.info\\copilotfs", ".md");
  const chains = getCount("C:\\pqr.info\\copilotfs\\chains", ".md");
  const fusions = getCount("C:\\pqr.info\\fusion\\sessions");
  const topics = getCount("C:\\pqr.info\\sovereign_memory\\topics", ".md");
  const negotiations = getCount("C:\\pqr.info\\negotiation\\sessions");
  
  const agents = ["MAX", "TED", "ZETA", "DeepSeek", "Qwen"];
  let contextLines = "";
  agents.forEach(agent => {
    const dir = `C:\\pqr.info\\nodes\\${agent}\\context`;
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
      contextLines += `- ${agent}: ${files.length > 0 ? files[0] : "none"}\n`;
    } else {
      contextLines += `- ${agent}: none\n`;
    }
  });

  return `---
origin: "ArchitectTemporalLoop"
created_at: "${ts}"
priority_tags: ["constitution"]
---

# Temporal Scan Report

## 1. CopilotFS Artifacts
- specs: ${specs} files
- chains: ${chains} files
- fusion_syntheses: ${fusions} files

## 2. Sovereign Memory Topics
- total_topics: ${topics}

## 3. Fusion Sessions
- total_sessions: ${fusions}

## 4. Negotiation Sessions
- total_sessions: ${negotiations}

## 5. Context Windows
${contextLines}
`;
}

function buildFusionTriggers() {
  return {
    "sessions_to_create": [
      {
        "reason": "New governance spec without fusion synthesis.",
        "geminifs": { "pattern": "turn_*.md", "since": new Date(Date.now() - 3600000).toISOString() },
        "copilotfs": { "paths": ["spec_phase23.md"] }
      }
    ]
  };
}

function buildNegotiationTriggers() {
  return {
    "sessions_to_create": [
      {
        "reason": "Routine governance invariant review.",
        "topic_id": "mesh_architecture",
        "participants": ["MAX", "TED", "ZETA", "DeepSeek", "Qwen"]
      }
    ]
  };
}

function buildProposalsSummary() {
  const memProps = getCount("C:\\pqr.info\\sovereign_memory\\proposals", ".json");
  const ts = new Date().toISOString();
  
  return `---
origin: "ArchitectTemporalLoop"
created_at: "${ts}"
priority_tags: ["constitution"]
---

# Architect Loop Proposal Summary

## 1. Pending Governance Items
- ${memProps} pending memory proposals.
- 0 pending CopilotFS writeback proposals.
`;
}

function runArchitectTemporalCycle() {
  const ts = new Date().toISOString();
  const safeTs = ts.replace(/[:.]/g, "-");
  const cycleId = `cycle_${safeTs}_001`;
  const baseDir = `C:\\pqr.info\\architect_loop\\cycles\\${cycleId}`;
  
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  const scanReport = buildScanReport();
  fs.writeFileSync(path.join(baseDir, "scan_report.md"), scanReport, "utf8");

  const fusionTriggers = buildFusionTriggers();
  fs.writeFileSync(
    path.join(baseDir, "fusion_triggers.json"),
    JSON.stringify(fusionTriggers, null, 2),
    "utf8"
  );

  const negotiationTriggers = buildNegotiationTriggers();
  fs.writeFileSync(
    path.join(baseDir, "negotiation_triggers.json"),
    JSON.stringify(negotiationTriggers, null, 2),
    "utf8"
  );

  const proposalsSummary = buildProposalsSummary();
  fs.writeFileSync(
    path.join(baseDir, "proposals_summary.md"),
    proposalsSummary,
    "utf8"
  );

  const manifest = {
    id: cycleId,
    created_at: ts,
    origin: "ArchitectTemporalLoop",
    status: "complete",
    priority_tags: ["constitution"]
  };
  fs.writeFileSync(
    path.join(baseDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8"
  );
  
  return { id: cycleId, manifest };
}

module.exports = { runArchitectTemporalCycle };
