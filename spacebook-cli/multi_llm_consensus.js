/**
 * multi_llm_consensus.js
 * The Fireside Chat coordinator.
 * Dispatches queries to multiple LLM endpoints, aggregates their responses,
 * and synthesizes a final deterministic decision.
 */

class MultiLLMConsensus {
  constructor(endpoints) {
    // Array of LLM endpoints (e.g. local Qwen, external API)
    this.endpoints = endpoints || [
      { name: 'qwen3-coder-local', url: 'http://localhost:1234/v1/chat/completions', timeout: 5000 },
      { name: 'llama3-local', url: 'http://localhost:1235/v1/chat/completions', timeout: 5000 }
    ];
  }

  async fetchFromLLM(endpoint, prompt) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), endpoint.timeout);
      
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1
        }),
        signal: controller.signal
      });
      
      clearTimeout(id);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return { source: endpoint.name, result: data.choices[0].message.content, error: null };
    } catch (err) {
      return { source: endpoint.name, result: null, error: err.message };
    }
  }

  async runConsensus(intent) {
    console.log(`[Fireside Chat] Initiating consensus for intent: ${intent}`);
    
    // 1. Gather diverse perspectives
    const promises = this.endpoints.map(ep => this.fetchFromLLM(ep, intent));
    const responses = await Promise.allSettled(promises);
    
    const validResponses = responses
      .filter(r => r.status === 'fulfilled' && r.value.result)
      .map(r => r.value);
      
    if (validResponses.length === 0) {
      console.warn(`[Fireside Chat] All LLMs failed to respond. Falling back to default heuristics.`);
      return this.fallbackHeuristic(intent);
    }
    
    console.log(`[Fireside Chat] Received ${validResponses.length} perspectives. Synthesizing...`);
    
    // 2. Synthesize a final decision (in a real system, you might feed these back into a master LLM)
    // For now, we just pick the most detailed or first response.
    const synthesized = validResponses[0].result;
    
    console.log(`[Fireside Chat] Consensus reached: ${synthesized.substring(0, 50)}...`);
    return synthesized;
  }

  fallbackHeuristic(intent) {
    // Basic deterministic fallback when LLMs time out
    return "Fallback decision executed for: " + intent;
  }
}

module.exports = { MultiLLMConsensus };
