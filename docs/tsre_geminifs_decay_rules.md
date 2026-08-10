# TSRE Decay & Compaction Rules for GeminiFS (Canonical Phase-24 Spec)

GeminiFS is a **TSRE organ**, meaning its files represent *ephemeral conversational trading state*. TSRE governs **fast decay**, **high churn**, and **aggressive compaction**.

These rules apply to every file under:
`C:\pqr.info\geminifs\turns\` and any agent reading from `/geminifs`.

---

## 1. TSRE Time-Decay Parameters

| Parameter | Value | Meaning |
|----------|-------|---------|
| **Half-life** | **12 turns** | After 12 turns, the file's semantic weight is halved. |
| **Max retention** | **64 turns** | After 64 turns, the file is dropped (ignored) unless protected. |
| **Compaction threshold** | **8 turns** | After 8 turns, compaction is recommended. |

These values are **strict** and must be honored by all agents.

---

## 2. TSRE Compaction Levels

TSRE supports three compaction granularities:
1. **3-sentence summary**
2. **1-sentence summary**
3. **1-line ultra-compact summary**

Agents choose the level based on their subsystem:
- **ZETA** → 3-sentence
- **MAX** → 1-sentence
- **TED** → 1-line
- **DeepSeek** → 1-line serrated-edge
- **Qwen CLI** → developer-friendly 1-sentence

---

## 3. Compaction Trigger Logic

A GeminiFS file should be compacted when:
`age_turns >= compaction_threshold AND priority_tags does NOT include "never_drop"`

Compaction **never overwrites** the original file. Instead, it creates a sibling:
`turn_<timestamp>_<role>_turn_<index>_summary.md`

With:
```markdown
---
role: "assistant"
summary_level: "1_line"
origin: "TSRE_compaction"
turn_index: <index>
---

<summary>
```

This preserves immutability while enabling decay.

---

## 4. TSRE Drop Rules

A GeminiFS file should be **ignored** (logically dropped) when:
`age_turns >= max_retention AND priority_tags does NOT include "never_drop"`

GeminiFS **never deletes** files — agents simply stop reading them. This keeps the organ immutable and audit-safe.

---

## 5. TSRE Priority Tags

GeminiFS files automatically receive:
```json
{
  "priority_tags": ["decay_fast"]
}
```

Agents interpret this as:
- **ZETA** → compact aggressively
- **TED** → drop aggressively
- **DeepSeek** → summarize aggressively
- **MAX** → preserve summaries, drop raw
- **Copilot Architect** → ignore (Copilot reads only canonical organs)

If a user manually tags a GeminiFS file with `["never_drop"]`, it becomes **permanent trading state**, immune to TSRE decay.

---

# Qwen CLI Usage Patterns Over `/geminifs`

Qwen CLI is your execution organ — it thrives on structured, file-based input.

1. **Analyze a turn:** `qwen analyze /geminifs/turns/turn_0042.md`
2. **Generate code from a turn:** `qwen codegen /geminifs/turns/turn_0042.md --out /copilotfs/code/turn_0042_analysis.py`
3. **TSRE compaction:** `qwen summarize /geminifs/turns/turn_0031.md --level 1_line`
4. **Convert a turn into a structured spec:** `qwen spec /geminifs/turns/turn_0050.md --out /copilotfs/specs/turn_0050_spec.md`

---

# DeepSeek Usage Patterns Over `/geminifs`

DeepSeek is your precision-cutting organ — it wants minimal, sharp context.

1. **Extract the semantic signal:** `deepseek extract-signal /geminifs/turns/turn_0042.md`
2. **Produce a serrated-edge summary:** `deepseek cut /geminifs/turns/turn_0028.md --mode aggressive`
3. **Build a multi-turn distilled chain:** `deepseek chain /geminifs/turns/turn_00*.md --out /copilotfs/chains/chain_0001.md`
