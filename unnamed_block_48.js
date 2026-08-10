const express = require("express");
const { macroValidatorMiddleware } = require("./middleware/macroValidatorMiddleware");
const { executeMacro } = require("./adapter");

const router = express.Router();

router.post("/execute-macro", macroValidatorMiddleware, async (req, res) => {
  const macro = req.body.macro || req.body;
  const result = await executeMacro(macro);
  res.json(result);
});

module.exports = router;