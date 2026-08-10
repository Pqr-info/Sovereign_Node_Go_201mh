// adapter.js (excerpt)
const { validateMacro } = require('./macroValidation');
const { recordValidationFailure } = require('./jetwebLoggingAdapter');

async function executeMacro(macro, taskState = {}) {
  const { valid, errors } = validateMacro(macro);
  if (!valid) {
    await recordValidationFailure(Object.assign({}, taskState, { taskId: taskState.taskId || `task_${Date.now()}` }), errors, { source: 'adapter', corridor: 'Validation' });
    return {
      status: 'failure',
      output: `Macro validation failed: ${errors.join('; ')}`,
      domSnapshot: await cobrowser.snapshot()
    };
  }

  // existing deterministic execution logic...
}