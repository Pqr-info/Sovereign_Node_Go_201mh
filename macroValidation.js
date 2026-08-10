// macroValidation.js
const MacroStepTypes = new Set(["navigate", "click", "type", "extract", "wait", "custom"]);

function isString(x) {
  return typeof x === "string" && x.length >= 0;
}

function isNullableString(x) {
  return x === null || isString(x);
}

function validateStep(step) {
  const errors = [];

  if (!step || typeof step !== "object") {
    errors.push("step must be an object");
    return errors;
  }

  if (!isString(step.id) || step.id.trim() === "") {
    errors.push("step.id must be a non-empty string");
  }

  if (!isString(step.type) || !MacroStepTypes.has(step.type)) {
    errors.push(`step.type must be one of: ${Array.from(MacroStepTypes).join(", ")}`);
  }

  if (step.selector !== undefined && !isNullableString(step.selector)) {
    errors.push("step.selector must be a string or null");
  }

  if (step.value !== undefined && !isNullableString(step.value)) {
    errors.push("step.value must be a string or null");
  }

  if (step.metadata !== undefined) {
    if (typeof step.metadata !== "object" || Array.isArray(step.metadata)) {
      errors.push("step.metadata must be an object");
    } else {
      if (step.metadata.description !== undefined && !isString(step.metadata.description)) {
        errors.push("step.metadata.description must be a string");
      }
      if (step.metadata.confidence !== undefined) {
        const c = step.metadata.confidence;
        if (typeof c !== "number" || c < 0 || c > 1) {
          errors.push("step.metadata.confidence must be a number between 0.0 and 1.0");
        }
      }
    }
  }

  return errors;
}

function validateMacro(macro) {
  const errors = [];

  if (!macro || typeof macro !== "object") {
    return { valid: false, errors: ["macro must be an object"] };
  }

  if (!isString(macro.plan)) {
    errors.push("plan must be a string");
  }

  if (!Array.isArray(macro.steps)) {
    errors.push("steps must be an array");
  } else if (macro.steps.length === 0) {
    errors.push("steps must contain at least one step");
  } else {
    macro.steps.forEach((s, idx) => {
      const stepErrors = validateStep(s);
      stepErrors.forEach(e => errors.push(`steps[${idx}]: ${e}`));
    });
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateMacro };