export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    //
    // ────────────────────────────────────────────────
    //  /mh → Marshall Islands Demo
    // ────────────────────────────────────────────────
    //
    if (path.startsWith("/mh")) {
      return handleMarshallIslands(request);
    }

    //
    // ────────────────────────────────────────────────
    //  /saml → SAML Endpoints
    // ────────────────────────────────────────────────
    //
    if (path.startsWith("/saml")) {
      if (path === "/saml/acs") return handleACS(request);
      if (path === "/saml/metadata") return handleMetadata(request);
      if (path === "/saml/login") return handleLogin(request);
      return new Response("SAML endpoint not found", { status: 404 });
    }

    //
    // ────────────────────────────────────────────────
    //  /surfgo → surfgo.net Endpoints
    // ────────────────────────────────────────────────
    //
    if (path.startsWith("/surfgo")) {
      return handleSurfgo(request, env);
    }

    //
    // ────────────────────────────────────────────────
    //  Everything else → Cloudflare Pages
    // ────────────────────────────────────────────────
    //
    return env.ASSETS.fetch(request);
  }
};


//
// ────────────────────────────────────────────────
//  Marshall Islands Demo Handler
// ────────────────────────────────────────────────
//
function handleMarshallIslands(request) {
  return new Response("Marshall Islands Demo", {
    headers: { "content-type": "text/plain" }
  });
}

//
// ────────────────────────────────────────────────
//  SAML: Assertion Consumer Service (ACS)
// ────────────────────────────────────────────────
//
function handleACS(request) {
  return new Response("SAML ACS endpoint", {
    headers: { "content-type": "text/plain" }
  });
}

//
// ────────────────────────────────────────────────
//  SAML: Metadata
// ────────────────────────────────────────────────
//
function handleMetadata(request) {
  return new Response("SAML Metadata XML goes here", {
    headers: { "content-type": "application/xml" }
  });
}

//
// ────────────────────────────────────────────────
//  SAML: Login Redirect
// ────────────────────────────────────────────────
//
function handleLogin(request) {
  return new Response("SAML Login Redirect", {
    headers: { "content-type": "text/plain" }
  });
}

//
// ────────────────────────────────────────────────
//  Surfgo.net / SpaceBook 5D Handler
// ────────────────────────────────────────────────
//
async function handleSurfgo(request, env) {
  const url = new URL(request.url);
  
  if (url.pathname === "/surfgo/inference") {
    // 1. Check KV Cache (Pre-cognitive caching)
    const cached = await env.SURFGO_MEMORY_KV.get("latest_inference");
    if (cached) {
      return new Response(`[KV CACHED] ${cached}`, { status: 200 });
    }

    // 2. Proxy request to the 'max' node inference engine
    // We assume max is accessible via a secured tunnel or direct IP for the MVP
    const MAX_NODE_URL = "http://192.168.12.234:1234/v1/chat/completions"; 
    
    try {
      const maxResponse = await fetch(MAX_NODE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "Qwen3-coder-next",
          messages: [{ role: "user", content: "Agentic Swarm Init" }]
        })
      });
      
      const maxData = await maxResponse.text();
      
      // Store in KV
      await env.SURFGO_MEMORY_KV.put("latest_inference", maxData, { expirationTtl: 60 });
      
      return new Response(`[MAX NODE INFERENCE] ${maxData}`, { status: 200 });
    } catch (e) {
      return new Response(`[ERROR] Unable to reach max node: ${e.message}`, { status: 502 });
    }
  }

  if (url.pathname === "/surfgo/memory") {
    // 3. Interact with Durable Object for Consistent State (Audit Spine)
    let id = env.SURFGO_MEMORY_DO.idFromName("global_state");
    let obj = env.SURFGO_MEMORY_DO.get(id);
    return obj.fetch(request);
  }

  return new Response("Welcome to surfgo.net - The Substrate for SpaceBook 5D", { status: 200 });
}

//
// ────────────────────────────────────────────────
//  SurfgoMemory Durable Object
// ────────────────────────────────────────────────
//
export class SurfgoMemory {
  constructor(state, env) {
    this.state = state;
    
    // Initialize the 7-second HyperGossip loop if not already set
    this.state.blockConcurrencyWhile(async () => {
      let currentAlarm = await this.state.storage.getAlarm();
      if (currentAlarm == null) {
        // Set alarm for 7 seconds from now
        await this.state.storage.setAlarm(Date.now() + 7000);
      }
    });
  }

  async fetch(request) {
    let value = await this.state.storage.get("memory_cube") || 0;
    value++;
    await this.state.storage.put("memory_cube", value);
    
    return new Response(`Global Synchronized Memory Cube State: ${value}`);
  }

  // Edge Sidecar 7-second loop via DO Alarm
  async alarm() {
    let loopCount = await this.state.storage.get("loop_count") || 0;
    loopCount++;
    
    console.log(`[HyperGossip Edge Sidecar] 7-second loop tick ${loopCount}. Echoing state...`);
    
    await this.state.storage.put("loop_count", loopCount);
    
    // Broadcast / Gossip state updates across the mesh would happen here.
    
    // Re-arm the alarm for another 7 seconds
    await this.state.storage.setAlarm(Date.now() + 7000);
  }
}

