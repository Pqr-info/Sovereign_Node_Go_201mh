// Neo4j / Cypher Schema Setup for ADER (Agent Dead End Resolution)

// 1. Create Constraints (Ensures uniqueness and indexes for performance)
CREATE CONSTRAINT problem_id_unique IF NOT EXISTS FOR (p:Problem) REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT observation_id_unique IF NOT EXISTS FOR (o:Observation) REQUIRE o.id IS UNIQUE;
CREATE CONSTRAINT hypothesis_id_unique IF NOT EXISTS FOR (h:Hypothesis) REQUIRE h.id IS UNIQUE;
CREATE CONSTRAINT action_id_unique IF NOT EXISTS FOR (a:Action) REQUIRE a.id IS UNIQUE;
CREATE CONSTRAINT result_id_unique IF NOT EXISTS FOR (r:Result) REQUIRE r.id IS UNIQUE;
CREATE CONSTRAINT success_path_id_unique IF NOT EXISTS FOR (sp:SuccessPath) REQUIRE sp.id IS UNIQUE;
CREATE CONSTRAINT entity_id_unique IF NOT EXISTS FOR (e:Entity) REQUIRE e.id IS UNIQUE;

// 2. Example Query: Retrieve most reusable failure-to-success path
// (This is a parameterized query to be run by the ADER Strategy Engine)
/*
MATCH (sp:SuccessPath)-[:RESOLVES]->(p:Problem {tags: $problem_tag})
WHERE sp.reusability_score >= 0.85
WITH sp ORDER BY sp.reusability_score DESC LIMIT 1

CALL apoc.path.expand(
  sp,
  "<BUILDS_ON|",
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
    WHEN "Hypothesis"   THEN {type: "hypothesis", data: {statement: step.statement, confidence: step.plausibility, validation_cost: step.validation_cost}}
    WHEN "Action"       THEN {type: "action", data: {command: step.command, is_reversible: step.is_reversible, side_effects: step.side_effects}}
    WHEN "Result"       THEN {type: "result", data: {outcome: step.outcome, duration_ms: step.duration_ms, recurrence_probability: step.recurrence_probability}}
  END AS step_info
ORDER BY step_order;
*/
