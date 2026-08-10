const fs = require('fs');

const CONVERSATION_ID = "f813a299-ac32-48aa-b973-683c584deb7b";
const planPath = `C:\\Users\\theal\\.gemini\\antigravity\\brain\\${CONVERSATION_ID}\\implementation_plan.md`;

async function askCopilot() {
    let plan = '';
    try {
        plan = fs.readFileSync(planPath, 'utf8');
    } catch (e) {
        console.log("[-] No implementation plan found.");
        return;
    }

    const promptMessage = `Hello Copilot. I have an implementation plan for integrating a filesystem indexer into the Shared Brain registry for the Sovereign-27 Mesh.

Here is the current Implementation Plan:
${plan}

Please review this plan. Do you approve of this design for adding filesystem indexing capability to the shared brain? Let me know if I should proceed or if you want any modifications.`;

    try {
        console.log(`[*] Sending prompt to Copilot chat endpoint...`);
        const response = await fetch('http://localhost:3456/api/copilot/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                conversationId: CONVERSATION_ID,
                prompt: promptMessage
            })
        });

        const data = await response.json();
        if (data.success) {
            console.log("\n[+] Response received from Copilot:");
            console.log("------------------------------------------");
            console.log(data.text);
            console.log("------------------------------------------\n");
        } else {
            console.error("[-] Copilot query failed:", data.error);
        }
    } catch (e) {
        console.error("[-] Error communicating with Copilot server:", e.message);
    }
}

askCopilot();
