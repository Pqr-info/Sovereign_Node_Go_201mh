import fs from "fs";
import path from "path";
import crypto from "crypto";

const GEMINIFS_TURNS_DIR = "C:\\Users\\theal\\geminifs-output\\turns";

// TSRE decay parameters (canonical)
const TSRE_PARAMS = {
  halfLifeTurns: 12,
  maxRetentionTurns: 64,
  compactionThresholdTurns: 8
};

// Simple age computation: assumes turn_index is monotonically increasing
function computeAgeTurns(turnIndex, currentTurnIndex) {
  return Math.max(0, currentTurnIndex - turnIndex);
}

// Parse YAML frontmatter from a GeminiFS file
function parseFrontmatter(content) {
  const lines = content.split("\n");
  if (lines[0].trim() !== "---") return { meta: {}, body: content };

  let i = 1;
  const meta = {};
  for (; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "---") {
      i++;
      break;
    }
    const [key, rawValue] = line.split(":");
    if (!key || !rawValue) continue;
    const k = key.trim();
    const v = rawValue.trim().replace(/^"|"$/g, "");
    if (k === "turn_index") {
      meta[k] = parseInt(v, 10);
    } else {
      meta[k] = v;
    }
  }
  const body = lines.slice(i).join("\n");
  return { meta, body };
}

// Write a TSRE summary sibling file
function writeSummaryFile(originalPath, meta, summaryContent, level) {
  const dir = path.dirname(originalPath);
  const base = path.basename(originalPath, ".md");
  // Check if we've already written a summary of this level for this file
  const summaryName = `${base}_summary_${level}.md`;
  const summaryPath = path.join(dir, summaryName);
  
  if (fs.existsSync(summaryPath)) return; // Don't rewrite unnecessarily

  const header = [
    "---",
    `role: "assistant"`,
    `summary_level: "${level}"`,
    `origin: "TSRE_compaction"`,
    `turn_index: ${meta.turn_index || 0}`,
    "---",
    "",
  ].join("\n");

  fs.writeFileSync(summaryPath, header + summaryContent, "utf8");
}

// Placeholder summarization (you can later call an LLM here)
function summarizeBody(body, level) {
  // Very simple stub: truncate or compress based on level
  const maxLen = level === "3_sentence" ? 512
               : level === "1_sentence" ? 256
               : 128; // 1_line
  if (body.length <= maxLen) return body;
  return body.slice(0, maxLen) + "\n...";
}

// Core TSRE decay scheduler
export function runTsreDecayScheduler(currentTurnIndex) {
  if (!fs.existsSync(GEMINIFS_TURNS_DIR)) return;

  const entries = fs.readdirSync(GEMINIFS_TURNS_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md") || entry.name.includes("_summary_")) continue;

    const fullPath = path.join(GEMINIFS_TURNS_DIR, entry.name);
    const content = fs.readFileSync(fullPath, "utf8");
    const { meta, body } = parseFrontmatter(content);

    const turnIndex = meta.turn_index || 0;
    const ageTurns = computeAgeTurns(turnIndex, currentTurnIndex);

    // Priority tags: default decay_fast, optional never_drop
    const priorityTags = (meta.priority_tags || "").split(",").map(s => s.trim()).filter(Boolean);
    const hasNeverDrop = priorityTags.includes("never_drop");

    // Drop logic: agents simply ignore files past maxRetentionTurns unless never_drop
    const shouldDrop = ageTurns >= TSRE_PARAMS.maxRetentionTurns && !hasNeverDrop;
    if (shouldDrop) {
      // We do NOT delete; logical drop is enforced by readers.
      continue;
    }

    // Compaction logic
    const shouldCompact = ageTurns >= TSRE_PARAMS.compactionThresholdTurns && !hasNeverDrop;
    if (shouldCompact) {
      // Choose compaction level based on subsystem/agent; here we default to 1_line
      const level = "1_line";
      const summary = summarizeBody(body, level);
      writeSummaryFile(fullPath, meta, summary, level);
    }
  }
}

// Example wiring: run every N seconds
export function startTsreDecayScheduler(intervalMs, getCurrentTurnIndex) {
  setInterval(() => {
    const currentTurnIndex = getCurrentTurnIndex();
    runTsreDecayScheduler(currentTurnIndex);
  }, intervalMs);
}
