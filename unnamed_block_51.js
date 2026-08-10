// middleware/macroValidatorMiddleware.js (excerpt)
const { validateMacro } = require('../macroValidation');
const { recordValidationFailure } = require('../jetwebLoggingAdapter');

async function macroValidatorMiddleware(req, res, next) {
  const macro = req.body.macro || req.body;
  const { valid, errors } = validateMacro(macro);

  if (valid) return next();

  const taskState = req.body.taskState || {
    taskId: `task_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
    operatorRequest: req.body.operatorRequest || null,
    timestamps: { received: new Date().toISOString() }
  };

  await recordValidationFailure(taskState, errors, { source: 'macroValidator', corridor: 'Validation' });

  return res.status(400).json({
    error: 'macro_validation_failed',
    details: errors,
    taskId: taskState.taskId,
    timestamp: new Date().toISOString()
  });
}

module.exports = { macroValidatorMiddleware };