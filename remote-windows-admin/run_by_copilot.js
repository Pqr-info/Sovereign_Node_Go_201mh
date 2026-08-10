const fs = require('fs');
const path = require('path');

const CONVERSATION_ID = "4e73b625-1155-499f-a28d-a85c6944cff3";
const planPath = 'C:\\Users\\theal\\.gemini\\antigravity\\brain\\4e73b625-1155-499f-a28d-a85c6944cff3\\implementation_plan.md';
const walkthroughPath = 'C:\\Users\\theal\\.gemini\\antigravity\\brain\\4e73b625-1155-499f-a28d-a85c6944cff3\\walkthrough.md';

async function runByCopilot() {
    console.log(`[*] Initiating Copilot Sync for Conversation ID: ${CONVERSATION_ID}...`);

    let plan = '';
    let walkthrough = '';
    try {
        plan = fs.readFileSync(planPath, 'utf8');
    } catch (e) {
        console.log("[-] No implementation plan found.");
    }
    try {
        walkthrough = fs.readFileSync(walkthroughPath, 'utf8');
    } catch (e) {
        console.log("[-] No walkthrough found.");
    }

    const promptMessage = `Hello Copilot. I have built and verified a Secure Remote Windows Administration solution optimized for both humans and AIs.

Here is the current Implementation Plan:
${plan}

Here is the Walkthrough of the changes made:
${walkthrough}

Please review the design, API schema, and visual diagnostics capabilities. Let me know if you approve this plan or if you have any feedback/improvements.`;

    try {
        console.log(`[*] Sending prompt to Copilot chat endpoint (ID: ${CONVERSATION_ID})...`);
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
            
            // Save response to scratch
            const outputDir = 'C:\\Users\\theal\\.gemini\\antigravity\\brain\\4e73b625-1155-499f-a28d-a85c6944cff3\\scratch';
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            fs.writeFileSync(path.join(outputDir, 'copilot_feedback.txt'), data.text, 'utf8');
            console.log(`[+] Feedback saved to scratch/copilot_feedback.txt`);
        } else {
            console.error("[-] Copilot query failed:", data.error);
        }
    } catch (e) {
        console.error("[-] Error communicating with Copilot server:", e);
    }
}

runByCopilot();
