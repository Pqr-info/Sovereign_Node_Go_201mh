// macroSanitizer.js
// Deterministic preflight sanitizer for Macro objects

const ALLOWED_STEP_KEYS = new Set(["id", "type", "selector", "value", "metadata"]);
const ALLOWED_METADATA_KEYS = new Set(["description", "confidence"]);
const ALLOWED_TOP_KEYS = new Set(["plan", "steps"]);

function isString(x) {
  return typeof x === "string";
}

function isNullableString(x) {
  return x === null || isString(x);
}

function sanitizeStep(step) {
  const removed = [];
  const sanitized = {};

  if (!step || typeof step !== "object") {
    return { sanitized: null, removed: ["step_not_object"] };
  }

  // id
  if (isString(step.id)) sanitized.id = step.id;
  else sanitized.id = `step_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;

  // type
  if (isString(step.type)) sanitized.type = step.type;
  else sanitized.type = "custom";

  // selector
  if (step.selector === undefined) sanitized.selector = null;
  else if (isNullableString(step.selector)) sanitized.selector = step.selector;
  else {
    sanitized.selector = null;
    removed.push("selector_invalid");
  }

  // value
  if (step.value === undefined) sanitized.value = null;
  else if (isNullableString(step.value)) sanitized.value = step.value;
  else {
    sanitized.value = null;
    removed.push("value_invalid");
  }

  // metadata
  sanitized.metadata = {};
  if (step.metadata && typeof step.metadata === "object" && !Array.isArray(step.metadata)) {
    for (const k of Object.keys(step.metadata)) {
      if (!ALLOWED_METADATA_KEYS.has(k)) {
        removed.push(`metadata_key_removed:${k}`);
        continue;
      }
      const v = step.metadata[k];
      if (k === "description" && isString(v)) sanitized.metadata.description = v;
      else if (k === "confidence" && typeof v === "number" && v >= 0 && v <= 1) sanitized.metadata.confidence = v;
      else removed.push(`metadata_key_invalid:${k}`);
    }
  } else if (step.metadata !== undefined) {
    removed.push("metadata_invalid");
  }

  // Remove any extra keys deterministically
  for (const k of Object.keys(step)) {
    if (!ALLOWED_STEP_KEYS.has(k)) removed.push(`step_key_removed:${k}`);
  }

  return { sanitized, removed };
}

function sanitizeMacro(macro) {
  const removed = [];
  const sanitized = { plan: "", steps: [] };

  if (!macro || typeof macro !== "object") {
    return { sanitized: null, removed: ["macro_not_object"] };
  }

  // Top-level keys
  for (const k of Object.keys(macro)) {
    if (!ALLOWED_TOP_KEYS.has(k)) removed.push(`top_key_removed:${k}`);
  }

  // plan
  if (isString(macro.plan)) sanitized.plan = macro.plan;
  else sanitized.plan = "";

  // steps
  if (!Array.isArray(macro.steps)) {
    removed.push("steps_not_array");
    sanitized.steps = [];
  } else {
    for (let i = 0; i < macro.steps.length; i++) {
      const step = macro.steps[i];
      const { sanitized: sStep, removed: r } = sanitizeStep(step);
      if (sStep) sanitized.steps.push(sStep);
      if (r && r.length) r.forEach(x => removed.push(`steps[${i}]:${x}`));
    }
  }

  return { sanitized, removed };
}

module.exports = { sanitizeMacro };