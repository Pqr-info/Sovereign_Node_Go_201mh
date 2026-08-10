// test/macroSanitizer.test.js
const assert = require("assert");
const { sanitizeMacro } = require("../macroSanitizer");

const raw = {
  plan: "Do thing",
  steps: [
    { id: "s1", type: "navigate", value: "https://example.com", extra: "remove" },
    { id: "", type: 123, selector: { bad: true }, metadata: { description: "ok", confidence: 1.2, secret: "x" } }
  ],
  unexpected: "drop"
};

const { sanitized, removed } = sanitizeMacro(raw);
assert.strictEqual(typeof sanitized.plan, "string");
assert.strictEqual(Array.isArray(sanitized.steps), true);
assert.ok(removed.length > 0);
console.log("macroSanitizer tests passed");