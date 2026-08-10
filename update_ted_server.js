const fs = require('fs');

const tedServerPath = '\\\\ted\\pqr.info\\mev\\atlas-ui\\server.js';

try {
  let content = fs.readFileSync(tedServerPath, 'utf8');
  
  // Replace the Max path with the Ted path
  content = content.replace(
    /const sharedBrainPath = path\.join\(process\.env\.USERPROFILE, '\.gemini', 'config', 'plugins', 'shared_brain'\);/,
    "const sharedBrainPath = 'D:/Users/theal/.gemini/config/plugins/shared_brain';"
  );
  
  fs.writeFileSync(tedServerPath, content, 'utf8');
  console.log("Updated Ted's server.js successfully!");
} catch (e) {
  console.error("Error updating Ted's server.js", e);
}
