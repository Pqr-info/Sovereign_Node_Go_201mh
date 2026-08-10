// macroValidation.ajv.js
// Example using AJV if you prefer JSON Schema validation (install ajv in your environment)

const Ajv = require("ajv").default;
const ajv = new Ajv({ allErrors: true, strict: false });

const macroSchema = {
  type: "object",
  required: ["plan", "steps"],
  properties: {
    plan: { type: "string" },
    steps: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["id", "type"],
        properties: {
          id: { type: "string" },
          type: { type: "string", enum: ["navigate","click","type","extract","wait","custom"] },
          selector: { anyOf: [{ type: "string" }, { type: "null" }] },
          value: { anyOf: [{ type: "string" }, { type: "null" }] },
          metadata: {
            type: "object",
            properties: {
              description: { type: "string" },
              confidence: { type: "number", minimum: 0, maximum: 1 }
            },
            additionalProperties: true
          }
        },
        additionalProperties: true
      }
    }
  },
  additionalProperties: false
};

const validate = ajv.compile(macroSchema);

function validateMacroAjv(macro) {
  const valid = validate(macro);
  return { valid, errors: valid ? [] : validate.errors };
}

module.exports = { validateMacroAjv };