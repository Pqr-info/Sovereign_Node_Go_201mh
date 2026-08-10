// test-macroValidation.js
const { validateMacro } = require("./macroValidation");

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

console.log(validateMacro(good)); // { valid: true, errors: [] }
console.log(validateMacro(bad));  // { valid: false, errors: [...] }