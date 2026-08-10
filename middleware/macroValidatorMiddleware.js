// middleware/macroValidatorMiddleware.js
const { validateMacro } = require("../macroValidation");
const { recordEvent } = require("../jetwebAPI"); // Jetweb logging adapter

async function macroValidatorMiddleware(req, res, next) {
  const macro = req.body.macro || req.body; // support both { macro } and raw macro payloads
  const { valid, errors } = validateMacro(macro);

  if (valid) {
    return next();
  }

  const taskId = `validation_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
  const errorPayload = {
    taskId,
    status: "validation_failed",
    errors,
    receivedAt: new Date().toISOString()
  };

  try {
    await recordEvent({
      timestamp: new Date().toISOString(),
      corridor: "Validation",
      plan: null,
      actions: [],
      execution: { status: "failure", output: "Macro validation failed", domSnapshot: null },
      meta: { validation: errorPayload }
    });
  } catch (e) {
    // deterministic fallback: continue without blocking response
    console.error("Jetweb recordEvent failed", e && e.message);
  }

  return res.status(400).json({
    error: "macro_validation_failed",
    details: errors,
    taskId,
    timestamp: new Date().toISOString()
  });
}

module.exports = { macroValidatorMiddleware };