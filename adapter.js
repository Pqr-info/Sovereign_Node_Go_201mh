// adapter.js (excerpt)
const { validateMacro } = require("./macroValidation");
const cobrowser = require("./cobrowser"); // your backend

async function executeMacro(macro) {
  const { valid, errors } = validateMacro(macro);
  if (!valid) {
    return {
      status: "failure",
      output: `Macro validation failed: ${errors.join("; ")}`,
      domSnapshot: await cobrowser.snapshot()
    };
  }

  for (const step of macro.steps) {
    const result = await executeStep(step);
    if (result.status === "failure") {
      return {
        status: "failure",
        output: `Step ${step.id} failed: ${result.error}`,
        domSnapshot: await cobrowser.snapshot()
      };
    }
  }

  return {
    status: "success",
    output: "All steps executed successfully.",
    domSnapshot: await cobrowser.snapshot()
  };
}

module.exports = { executeMacro };