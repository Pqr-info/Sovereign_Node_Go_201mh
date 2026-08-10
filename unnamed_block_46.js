// express-router-api.js (Node/Express)
const express = require('express');
const { router } = require('./router'); // your router.js
const { TaskStateSchema } = require('./taskState');
const { integrateWithJetweb } = require('./jetwebIntegration');

const app = express();
app.use(express.json());

app.post('/api/router/ask', async (req, res) => {
  const { operatorRequest, context } = req.body;
  const taskId = `task_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;

  // Build initial taskState (deterministic)
  const taskState = {
    taskId,
    operatorRequest,
    intent: { type: null, confidence: 0 },
    plan: null,
    actions: [],
    execution: { status: 'none', output: '', domSnapshotBefore: null, domSnapshotAfter: null, domDiff: null },
    corridor: 'default',
    lineage: { eventId: null, previousEventId: null },
    timestamps: { received: new Date().toISOString(), classified: null, planned: null, executed: null, integrated: null }
  };

  // Call router (which will call Gemma/Gemini/Cobrowser as needed)
  const routerOutput = await router(operatorRequest, { domSnapshot: context.domSnapshot || null, taskState });

  // Update taskState deterministically
  taskState.intent = { type: routerOutput.intentType || 'analysis', confidence: routerOutput.intentConfidence || 1.0 };
  taskState.plan = routerOutput.plan;
  taskState.actions = routerOutput.actions;
  taskState.execution = routerOutput.execution;
  taskState.timestamps.planned = new Date().toISOString();

  // Integrate with Jetweb (optional)
  try {
    await integrateWithJetweb(routerOutput, context.domSnapshot || {}, taskState.execution.domSnapshot || {}, taskState.corridor);
    taskState.timestamps.integrated = new Date().toISOString();
  } catch (e) {
    // deterministic fallback: log and continue
    console.error('Jetweb integration failed', e);
  }

  res.json({ taskState, routerOutput });
});

module.exports = app;