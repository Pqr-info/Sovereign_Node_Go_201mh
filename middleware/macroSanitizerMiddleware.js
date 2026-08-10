// middleware/macroSanitizerMiddleware.js
const { sanitizeMacro } = require("../macroSanitizer");
const { recordEvent } = require("../jetwebAPI");

async function macroSanitizerMiddleware(req, res, next) {
  const macro = req.body.macro || req.body;
  const { sanitized, removed } = sanitizeMacro(macro);

  // Attach sanitized macro and audit info to request deterministically
  req.sanitizedMacro = sanitized;
  req.sanitizerReport = { removed, timestamp: new Date().toISOString() };

  // Persist sanitizer event to Jetweb for lineage
  try {
    await recordEvent({
      timestamp: req.sanitizerReport.timestamp,
      corridor: "Validation",
      plan: sanitized.plan || null,
      actions: sanitized.steps || [],
      execution: { status: "sanitized", output: null, domSnapshot: null },
      meta: { sanitizerReport: req.sanitizerReport }
    });
  } catch (e) {
    console.error("Jetweb recordEvent failed", String(e));
  }

  return next();
}

module.exports = { macroSanitizerMiddleware };