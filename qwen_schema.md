# Graph Schema for Failure-to-Success Paths

This schema models problem-solving trajectories where an initial **failure state** is resolved through a sequence of actions into a successful outcome.

## 🧱 Nodes

| Label | Description |
|-------|-------------|
| `Problem` | Represents the original failure or challenge. |
| `Observation` | A key insight, symptom, or data point during investigation. |
| `Hypothesis` | A proposed explanation or solution attempt (may be correct or incorrect). |
| `Action` | A concrete step taken to test or implement a hypothesis. |
| `Result` | The outcome of an action: success, partial success, or failure. |
| `SuccessPath` | An aggregate node representing a complete path from failure → success. |
| `Entity` | Domain-specific objects (e.g., code module, hardware component, user account) involved in the path. |

## 🔗 Edges

| Type | From → To | Description | Properties |
|------|-----------|-------------|------------|
| `MENTIONS` | `Problem` → `Entity` | Links problem to affected entities | `role: "affected" \| "root_cause"`, `confidence: FLOAT` |
| `LEADS_TO` | `Observation` → `Hypothesis` | Observation motivates hypothesis | `evidence_strength: 0.0–1.0`, `method: "inductive" \| "abductive"` |
| `TESTS` | `Action` → `Hypothesis` | Action is designed to validate/test the hypothesis | `test_type: "experiment" \| "deployment"`, `risk_level: LOW\|MEDIUM\|HIGH` |
| `PRODUCES` | `Action` → `Result` | Action yields a measurable result | `timestamp: DATETIME`, `duration_ms: INT`, `is_success: BOOLEAN` |
| `BUILDS_ON` | `SuccessPath` → `Observation`, `Hypothesis`, `Action`, or `Result` | Orders elements chronologically in path | `step_order: INT`, `is_critical_path: BOOLEAN` |
| `RESOLVES` | `SuccessPath` → `Problem` | Finalizes resolution of the original problem | `resolution_confidence: 0.0–1.0`, `timestamp: DATETIME` |

## 📦 Node & Edge Properties

### Shared Properties
- All nodes:  
  - `id` (UUID)  
  - `created_at` (DATETIME)  
  - `tags`: `STRING[]` (e.g., `["backend", "database"]`)  
  - `source_system` (`"jira"`, `"grafana"`, `"log_analysis"`, `"human_expert"`)

### Specific Properties

| Node/Edge | Properties |
|-----------|------------|
| `Problem` | `title`, `severity: INT (1–5)`, `description: TEXT`, `status: "open" \| "investigating" \| "resolved"` |
| `Observation` | `raw_data_ref`, `extracted_signal`, `confidence_score`, `anomaly_type` |
| `Hypothesis` | `statement`, `plausibility: 0.0–1.0`, `falsifiability_score`, `complexity: INT (1–5)` |
| `Action` | `command`, `environment`, `rollback_plan`, `is_reversible: BOOLEAN` |
| `Result` | `outcome: "success" \| "partial" \| "failure"`, `metrics_before`, `metrics_after`, `logs_ref` |
| `SuccessPath` | `path_id`, `title`, `total_steps`, `avg_confidence`, `reusability_score: 0.0–1.0` |

---

## 🧪 Example Cypher Query

**Goal**: Retrieve the most reusable failure-to-success path for a given domain (`"database_timeout"`) and extract its step-by-step actions.

```cypher
MATCH (sp:SuccessPath)-[:RESOLVES]->(p:Problem {tags: "database_timeout"})
WHERE sp.reusability_score >= 0.85
WITH sp ORDER BY sp.reusability_score DESC LIMIT 1

// Collect all elements in path order
CALL apoc.path.expand(
  sp,
  "<BUILDSON|>",
  "-Observation|-Hypothesis|-Action|-Result",
  0, 
  -1,
  "BREADTH_FIRST"
) YIELD path AS traversalPath

WITH sp, nodes(traversalPath) AS steps
UNWIND range(0, size(steps)-1) AS i
WITH sp, steps[i] AS step, i+1 AS step_order
WHERE step IS NOT NULL

RETURN 
  sp.path_id,
  step_order,
  CASE labels(step)[0]
    WHEN "Observation" THEN {type: "observation", data: {signal: step.extracted_signal}}
    WHEN "Hypothesis"   THEN {type: "hypothesis", data: {statement: step.statement, confidence: step.plausibility}}
    WHEN "Action"       THEN {type: "action", data: {command: step.command, is_reversible: step.is_reversible}}
    WHEN "Result"       THEN {type: "result", data: {outcome: step.outcome, duration_ms: step.duration_ms}}
  END AS step_info
ORDER BY step_order;
```

---

## 🧠 Example GraphQL Query (if using Apollo Federation)

```graphql
query GetFailureToSuccessPath($problemTag: String!) {
  successPaths(tags: [$problemTag], minReusabilityScore: 0.85, limit: 1) {
    pathId
    totalSteps
    steps(orderBy: step_order) {
      __typename
      ... on ObservationNode { extractedSignal confidenceScore }
      ... on HypothesisNode { statement plausibility }
      ... on ActionNode { command isReversible }
      ... on ResultNode { outcome durationMs }
    }
  }
}
# fragment inline type matching in schema:
# type SuccessPath @key(fields: "pathId") {
#   pathId: ID!
#   totalSteps: Int
#   steps: [PathStep!]!
# }
# union PathStep = ObservationNode | HypothesisNode | ActionNode | ResultNode
```

---

This schema enables **traceable, reusable knowledge capture** of debugging or problem-solving workflows — ideal for SRE, DevOps, and technical support systems.