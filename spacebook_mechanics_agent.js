const http = require('http');
const fs = require('fs');
const path = require('path');

const MAX_HOST = '192.168.12.234';
const PORT = 1234;
const MODEL = 'qwen/qwen3-coder-next';

const prompts = [
  {
    topic: "5D Spatial Navigation & Physics",
    content: "Design the game mechanics for '5D Spatial Navigation' in SpaceBook 5D. Describe how players move through an environment where physics are offloaded to nearby peer NPUs (Neural Processing Units). What happens when peer density is high vs low? How does the 'Temporal Drift' affect gravity?"
  },
  {
    topic: "Pre-Cognitive Interactions",
    content: "Design the mechanics for 'Pre-Cognitive Interactions'. The local NPU predicts the player's next action and caches future states. How does this translate into gameplay? Can players 'rewind' mistakes if the cached state was different from reality? Explain the UI/UX for this."
  },
  {
    topic: "The Autonomous Agent Swarm",
    content: "Design the mechanics for NPC behavior using 'The Autonomous Agent Swarm'. Every NPC is a sovereign agent living on a peer's NPU. How do they trade, fight, or form alliances based on semantic data? How does the Valkey Global Brain synchronize their memories?"
  }
];

async function queryLMStudio(prompt) {
  const data = JSON.stringify({
    model: MODEL,
    messages: [
      { role: "system", content: "You are the Lead Game Designer for SpaceBook 5D, a groundbreaking game powered by a distributed NPU supercomputer mesh. Your task is to write detailed, highly creative, and mathematically sound game mechanics for the requested topic. Output strictly formatted Markdown." },
      { role: "user", content: prompt.content }
    ],
    temperature: 0.7,
    max_tokens: 2048
  });

  const options = {
    hostname: MAX_HOST,
    port: PORT,
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.choices && parsed.choices.length > 0) {
            resolve(parsed.choices[0].message.content);
          } else {
            resolve(`Error: No choices returned. Body: ${body}`);
          }
        } catch (e) {
          resolve(`Error parsing JSON: ${e.message}. Body: ${body}`);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
}

async function runOrchestration() {
  console.log("Starting SpaceBook 5D Mechanics Generation...");
  let markdown = "# SpaceBook 5D Game Mechanics Design Document\n\nGenerated autonomously by Qwen3 on Ryzen AI Max.\n\n";

  for (const p of prompts) {
    console.log(`Querying LM Studio for topic: ${p.topic}`);
    try {
      const response = await queryLMStudio(p);
      markdown += `## ${p.topic}\n\n${response}\n\n---\n\n`;
      console.log(`Successfully generated mechanics for ${p.topic}.`);
    } catch (e) {
      console.error(`Failed to generate topic ${p.topic}:`, e);
      markdown += `## ${p.topic}\n\n*Generation Failed: ${e.message}*\n\n---\n\n`;
    }
  }

  const outPath = path.join(__dirname, 'spacebook_mechanics.md');
  fs.writeFileSync(outPath, markdown);
  console.log(`\nSuccessfully wrote mechanics to ${outPath}`);
}

runOrchestration();
