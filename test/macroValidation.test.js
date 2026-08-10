// test/macroValidation.test.js
const assert = require("assert");
const { validateMacro } = require("../macroValidation");

const good = {
  plan: "Fill form",
  steps: [
    { id: "s1", type: "navigate", value: "https://example.com" },
    { id: "s2", type: "click", selector: "#start" },
    { id: "s3", type: "type", selector: "#name", value: "Alan" }
  ]
};

const bad = {
  plan: 123,
  steps: [
    { id: "", type: "fly", selector: 5 }
  ]
};

const r1 = validateMacro(good);
assert.strictEqual(r1.valid, true, "Good macro should validate");

const r2 = validateMacro(bad);
assert.strictEqual(r2.valid, false, "Bad macro should fail validation");
assert.ok(r2.errors.length > 0, "Errors should be present for bad macro");

console.log("macroValidation tests passed");