import fs from "fs";
import path from "path";

const GEMINIFS_DIR = "C:\\pqr.info\\geminifs\\turns";
const COPILOTFS_DIR = "C:\\pqr.info\\copilotfs";

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
    meta[k] = isNaN(v) ? v : Number(v);
  }
  const body = lines.slice(i).join("\n");
  return { meta, body };
}

export function analyze(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const { meta, body } = parseFrontmatter(content);

  return {
    turn_index: meta.turn_index,
    role: meta.role,
    origin: meta.origin,
    priority_tags: meta.priority_tags || "decay_fast",
    length: body.length,
    preview: body.slice(0, 256)
  };
}

export function summarize(filePath, level = "1_line") {
  const content = fs.readFileSync(filePath, "utf8");
  const { meta, body } = parseFrontmatter(content);

  const maxLen = level === "3_sentence" ? 512 :
                 level === "1_sentence" ? 256 : 128;

  const summary = body.length <= maxLen ? body : body.slice(0, maxLen) + "\n...";

  const base = path.basename(filePath, ".md");
  const summaryPath = path.join(
    path.dirname(filePath),
    `${base}_summary_${level}.md`
  );

  const header = [
    "---",
    `role: "assistant"`,
    `summary_level: "${level}"`,
    `origin: "Qwen_summary"`,
    `turn_index: ${meta.turn_index || 0}`,
    "---",
    ""
  ].join("\n");

  fs.writeFileSync(summaryPath, header + summary, "utf8");
  return summaryPath;
}

export function spec(filePath, outPath) {
  const content = fs.readFileSync(filePath, "utf8");
  const { meta, body } = parseFrontmatter(content);

  const specContent = [
    "---",
    `origin: "Qwen_spec"`,
    `created_at: "${new Date().toISOString()}"`,
    `turn_index: ${meta.turn_index || 0}`,
    `subsystem: "TSRE"`,
    "---",
    "",
    "# Qwen Spec",
    "",
    "## Source Turn",
    `Turn Index: ${meta.turn_index}`,
    `Role: ${meta.role}`,
    "",
    "## Extracted Content",
    body,
    ""
  ].join("\n");

  fs.writeFileSync(outPath, specContent, "utf8");
  return outPath;
}

export function codegen(filePath, outPath) {
  const content = fs.readFileSync(filePath, "utf8");
  const { body } = parseFrontmatter(content);

  const code = `// Qwen codegen output\n// Generated from GeminiFS turn\n\n/*\n${body.slice(0, 512)}\n*/\n\n// TODO: Implement logic\n`;

  fs.writeFileSync(outPath, code, "utf8");
  return outPath;
}

export function ingest(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const { meta, body } = parseFrontmatter(content);

  const outPath = path.join(
    COPILOTFS_DIR,
    `ingest_turn_${String(meta.turn_index).padStart(4, "0")}.md`
  );

  const header = [
    "---",
    `origin: "Qwen_ingest"`,
    `created_at: "${new Date().toISOString()}"`,
    `turn_index: ${meta.turn_index || 0}`,
    `subsystem: "Governance"`,
    `priority_tags: ["constitution", "never_drop"]`,
    "---",
    ""
  ].join("\n");

  fs.writeFileSync(outPath, header + body, "utf8");
  return outPath;
}
