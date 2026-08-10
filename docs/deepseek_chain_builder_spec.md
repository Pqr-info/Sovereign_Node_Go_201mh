# DeepSeek Chain-Builder Spec (Phase-24 Canonical Block)

DeepSeek is your **precision-cutting organ**.  
Its job inside Sovereign-27 is to:
- extract semantic signal from GeminiFS turns
- compact aggressively
- build distilled reasoning chains
- feed those chains into CopilotFS → Copilot Architect → Governance

This spec defines the *exact* behavior DeepSeek should follow.

---

## 1. Chain-Builder Input Model

DeepSeek consumes files from: `/geminifs/turns/`

Input selection patterns:
### Pattern A — Explicit turn list
`deepseek chain /geminifs/turns/turn_0042.md /geminifs/turns/turn_0043.md`

### Pattern B — Glob pattern
`deepseek chain /geminifs/turns/turn_00*.md`

### Pattern C — Time-bounded selection
`deepseek chain --since 2026-08-04T01:00:00Z --until 2026-08-04T01:30:00Z`

### Pattern D — TSRE-filtered selection
DeepSeek should automatically ignore:
- dropped turns (`age_turns >= maxRetentionTurns`)
- turns with `decay_fast` that have already been compacted
- turns with missing or malformed frontmatter

---

## 2. Chain-Builder Output Model

DeepSeek writes distilled chains into CopilotFS:
`C:\pqr.info\copilotfs\chains\chain_<timestamp>.md`

---

## 3. Chain File Format (Canonical)

```markdown
---
origin: "DeepSeek_chain_builder"
created_at: "2026-08-04T01:45:00Z"
subsystem: "TSRE"
priority_tags: ["decay_fast"]
turns_included: [42, 43, 44, 45]
summary_level: "serrated_edge"
---

# DeepSeek Distilled Chain

## 1. Core Signal
<1-line distilled signal from turn 0042>

## 2. Supporting Signal
<1-line distilled signal from turn 0043>

## 3. Reinforcing Context
<1-line distilled signal from turn 0044>

## 4. Final Synthesis
<DeepSeek’s serrated-edge synthesis across all included turns>
```

This file is **immutable** and becomes part of CopilotFS.

---

## 4. DeepSeek Chain-Builder Algorithm (Canonical)

### Step 1 — Load candidate turns
- Read all matching files from `/geminifs/turns/`
- Parse YAML frontmatter
- Extract `turn_index`, `role`, `origin`, `priority_tags`, `body`

### Step 2 — Apply TSRE decay filters
Skip any turn where:
`age_turns >= maxRetentionTurns AND NOT priority_tags.includes("never_drop")`

### Step 3 — Extract serrated-edge signal
For each turn: `deepseek extract-signal <file>` (produces 1-line distilled core).

### Step 4 — Build chain structure
DeepSeek arranges signals into:
1. Core Signal (first turn)
2. Supporting Signal (second turn)
3. Reinforcing Context (middle turns)
4. Final Synthesis (DeepSeek’s multi-turn inference)

### Step 5 — Write chain to CopilotFS
Write `/copilotfs/chains/chain_<timestamp>.md` with canonical frontmatter.

### Step 6 — Notify Copilot Architect
DeepSeek emits a synthetic message into Chat Gemini:
`[COPILOT · ARCHITECT] DeepSeek chain generated: chain_2026-08-04T01-45-00Z.md`
Tagged: `["constitution", "never_drop"]`
This ensures the Architect sees the distilled chain as **canonical input**.

---

## 5. Backend Integration

```
POST /api/deepseek/chain
```
Payload: `{"pattern": "/geminifs/turns/turn_00*.md"}`
Response: `{"status": "OK", "chain_path": "C:\\pqr.info\\copilotfs\\chains\\chain_2026-08-04T01-45-00Z.md"}`
