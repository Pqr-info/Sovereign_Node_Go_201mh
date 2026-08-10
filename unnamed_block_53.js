// adapter.js excerpt
const { validateMacro } = require("./macroValidation");
const { executeMacroCore } = require("./adapterCore"); // existing deterministic executor
const { recordValidationFailure } = require("./jetwebLoggingAdapter");

async function executeMacro(macro, taskState = {}) {
  // If middleware provided sanitized macro, prefer it
  const effectiveMacro = macro.sanitizedMacro || macro;

  // Validate
  const { valid, errors } = validateMacro(effectiveMacro);
  if (!valid) {
    await recordValidationFailure(Object.assign({}, taskState, { taskId: taskState.taskId || `task_${Date.now()}` }), errors, { source: 'adapter', corridor: 'Validation' });
    return {
      status: 'failure',
      output: `Macro validation failed: ${errors.join('; ')}`,
      domSnapshot: await cobrowser.snapshot()
    };
  }

  // Execute using deterministic core
  return await executeMacroCore(effectiveMacro);
}

module.exports = { executeMacro };