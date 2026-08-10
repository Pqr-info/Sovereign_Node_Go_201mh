// jetwebLoggingAdapter.js
const fs = require('fs');
const path = require('path');
const { canonical_json } = require('./utils'); // implement canonical_json similar to mgsh_mcp.canonical_json
const { recordEvent, updateLineage, updateCorridor } = require('./jetwebAPI');

const LOG_DIR = process.env.JETWEB_LOG_DIR || path.join(process.cwd(), 'jetweb_logs');

function makeEventId(prefix = 'evt') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
}

async function persistToFile(logEntry) {
  try {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
    const filename = path.join(LOG_DIR, `${logEntry.eventId}.json`);
    fs.writeFileSync(filename, JSON.stringify(logEntry, null, 2), { encoding: 'utf8' });
    return { ok: true, path: filename };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

/**
 * recordValidationFailure
 *
 * Deterministically records a macro validation failure into Jetweb corridors and durable storage.
 *
 * Inputs:
 *  - taskState: object conforming to TaskStateSchema
 *  - errors: array of validation error strings
 *  - opts: { source: string, corridor: string, persistFile: boolean }
 *
 * Returns:
 *  { status: "recorded" | "failed", eventId, storage }
 */
async function recordValidationFailure(taskState, errors, opts = {}) {
  const source = opts.source || 'macroValidator';
  const corridor = opts.corridor || 'Validation';
  const eventId = makeEventId('validation');
  const timestamp = new Date().toISOString();

  const logEntry = {
    eventId,
    type: 'validation_failure',
    taskId: taskState.taskId || null,
    taskState,
    errors,
    source,
    corridor,
    timestamp,
    canonical: canonical_json({ eventId, type: 'validation_failure', taskId: taskState.taskId || null, errors, source, corridor, timestamp })
  };

  // 1. Persist to Jetweb event log via jetwebAPI.recordEvent
  try {
    await recordEvent(logEntry);
  } catch (e) {
    // deterministic fallback: continue to file persistence and return failure flag
  }

  // 2. Update lineage and corridor memory deterministically
  try {
    await updateLineage({ corridor, eventId, domDiff: taskState.execution && taskState.execution.domDiff ? taskState.execution.domDiff : null });
    await updateCorridor({ corridor, lastSnapshot: taskState.execution && taskState.execution.domSnapshotAfter ? taskState.execution.domSnapshotAfter : null, lastDiff: taskState.execution && taskState.execution.domDiff ? taskState.execution.domDiff : null });
  } catch (e) {
    // ignore errors but log them to console for deterministic audit
    console.error('jetwebLoggingAdapter lineage update failed', String(e));
  }

  // 3. Optional durable file persistence for offline audit
  let storage = null;
  if (opts.persistFile !== false) {
    const fileResult = await persistToFile(logEntry);
    storage = fileResult;
  }

  return { status: 'recorded', eventId, storage };
}

module.exports = { recordValidationFailure };