// Cloudflare Worker + Durable Object Entrypoint for JetWeb SAML Gateway
import { Buffer } from 'node:buffer';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. SAML AuthnRequest Redirect
    if (url.pathname === "/login") {
      const samlIdpUrl = env.SAML_IDP_URL || "https://mock-idp.jetweb.us/saml/sso";
      const samlAcsUrl = `https://${url.host}/saml/acs`;
      
      // Simple AuthnRequest XML wrapper encoded in base64
      const authnRequestXml = `
        <samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" 
                            xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" 
                            ID="_${Math.random().toString(36).substring(2)}" 
                            Version="2.0" 
                            IssueInstant="${new Date().toISOString()}" 
                            AssertionConsumerServiceURL="${samlAcsUrl}">
          <saml:Issuer>https://${url.host}/saml/metadata</saml:Issuer>
        </samlp:AuthnRequest>
      `;
      const encodedSaml = Buffer.from(authnRequestXml).toString('base64');
      const redirectUrl = `${samlIdpUrl}?SAMLRequest=${encodeURIComponent(encodedSaml)}`;
      
      return Response.redirect(redirectUrl, 302);
    }

    // 2. SAML ACS Assertion Callback
    if (url.pathname === "/saml/acs" && request.method === "POST") {
      try {
        const formData = await request.formData();
        const samlResponse = formData.get("SAMLResponse");
        if (!samlResponse) {
          return new Response("Missing SAMLResponse parameter", { status: 400 });
        }

        // Decode assertion XML
        const decodedXml = Buffer.from(samlResponse, 'base64').toString('utf8');
        
        // Audit & Log assertion safely (removing secure signatures)
        console.log(`[AUDIT] SAML assertion received at /saml/acs. Length: ${decodedXml.length}`);

        // Extract Email/NameID using a simple Regex parser for Worker compatibility
        const nameIdMatch = decodedXml.match(/<saml:NameID[^>]*>([\s\S]*?)<\/saml:NameID>/i) ||
                            decodedXml.match(/<saml2:NameID[^>]*>([\s\S]*?)<\/saml2:NameID>/i);
        
        if (!nameIdMatch) {
          return new Response("Unauthorized SAML assertion: NameID parameter extraction failed.", { status: 401 });
        }
        const userEmail = nameIdMatch[1].trim();

        // Sign the session JWT
        const token = await generateJWT(userEmail, env.JWT_SECRET || "DefaultSecretKey2026!");
        
        console.log(`[AUDIT] Session created successfully for identity user: ${userEmail}`);
        return new Response(JSON.stringify({ token, expires_in: 900, type: "Bearer" }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(`SAML Authentication Error: ${err.message}`, { status: 500 });
      }
    }

    // 3. Admin Client Socket Access
    if (url.pathname === "/admin") {
      const token = url.searchParams.get("token");
      if (!token || !(await verifyJWT(token, env.JWT_SECRET || "DefaultSecretKey2026!"))) {
        return new Response("Forbidden: Invalid or Expired JWT authentication token.", { status: 403 });
      }

      // Route WebSocket upgrade connection to Durable Object
      const doId = env.SESSION_DO.idFromName("global_session");
      const doObj = env.SESSION_DO.get(doId);
      return doObj.fetch(request);
    }

    // 4. Host Tunnel Relays
    if (url.pathname === "/tunnel") {
      const secret = request.headers.get("X-Tunnel-Secret");
      if (secret !== (env.TUNNEL_SECRET || "SuperSecretKey2026!")) {
        return new Response("Unauthorized Outbound Tunnel Header", { status: 401 });
      }

      const doId = env.SESSION_DO.idFromName("global_session");
      const doObj = env.SESSION_DO.get(doId);
      return doObj.fetch(request);
    }

    const landingHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sovereign-27 | JetWeb Gateway</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Outfit:wght@400;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-color: #050505;
      --accent: #00f0ff;
      --card-bg: rgba(20, 20, 20, 0.6);
      --text: #e0e0e0;
      --glow: rgba(0, 240, 255, 0.4);
    }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
      background: radial-gradient(circle at center, #1a1a2e 0%, var(--bg-color) 100%);
      color: var(--text);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      overflow: hidden;
    }
    .container {
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 24px;
      padding: 4rem 3rem;
      text-align: center;
      box-shadow: 0 0 40px var(--glow), inset 0 0 20px rgba(255, 255, 255, 0.02);
      max-width: 500px;
      width: 90%;
      animation: float 6s ease-in-out infinite;
      position: relative;
    }
    .container::before {
      content: '';
      position: absolute;
      top: -2px; left: -2px; right: -2px; bottom: -2px;
      background: linear-gradient(45deg, var(--accent), transparent, var(--accent));
      z-index: -1;
      border-radius: 26px;
      opacity: 0.3;
    }
    h1 {
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 2.5rem;
      margin: 0 0 1rem;
      letter-spacing: 2px;
      background: linear-gradient(90deg, #fff, var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      font-weight: 300;
      line-height: 1.6;
      margin-bottom: 2.5rem;
      color: #aaa;
    }
    .btn {
      display: inline-block;
      padding: 1rem 2.5rem;
      font-size: 1.1rem;
      font-weight: 600;
      color: #000;
      background: var(--accent);
      border: none;
      border-radius: 50px;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      box-shadow: 0 4px 15px var(--glow);
    }
    .btn:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 6px 25px rgba(0, 240, 255, 0.6);
    }
    .links {
      margin-top: 2rem;
      display: flex;
      justify-content: center;
      gap: 1.5rem;
    }
    .links a {
      color: var(--accent);
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.3s ease;
    }
    .links a:hover {
      color: #fff;
      text-shadow: 0 0 8px var(--accent);
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    .particles {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      z-index: -2;
      background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
      background-size: 50px 50px;
    }
  </style>
</head>
<body>
  <div class="particles"></div>
  <div class="container">
    <h1>SOVEREIGN-27</h1>
    <p>JetWeb Access Gateway is active.<br>Securely authenticate to access the internal mesh and Atlas 5D interfaces.</p>
    <a href="/login" class="btn">Authenticate via SAML</a>
    <div class="links">
      <a href="https://zeta.pqr.info/atlas5D">Atlas 5D Portal</a>
      <a href="/saml/metadata">Gateway Metadata</a>
    </div>
  </div>
</body>
</html>`;

    return new Response(landingHtml, { 
      status: 200,
      headers: { "Content-Type": "text/html;charset=UTF-8" }
    });
  }
};

// Cryptographic JWT Signing Helpers
async function generateJWT(email, secret) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    sub: email,
    sid: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
    exp: Math.floor(Date.now() / 1000) + 900, // 15 minute lifetime
    capabilities: ["RDP", "SSH", "HTTPS"]
  })).toString('base64url');

  const unsignedToken = `${header}.${payload}`;
  const signature = await hmacSha256(unsignedToken, secret);
  return `${unsignedToken}.${signature}`;
}

async function verifyJWT(token, secret) {
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const unsignedToken = `${parts[0]}.${parts[1]}`;
  const verifiedSig = await hmacSha256(unsignedToken, secret);
  if (parts[2] !== verifiedSig) return false;

  const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  if (payload.exp < Date.now() / 1000) return false; // Token expired

  return true;
}

async function hmacSha256(message, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Buffer.from(signature).toString('base64url');
}

// Cloudflare Durable Object Session Bridge Manager
export class SessionDO {
  constructor(state, env) {
    this.state = state;
    this.hostWebSocket = null;
    this.activeSockets = new Set();
  }

  async fetch(request) {
    const url = new URL(request.url);

    // Host Outbound Socket Handler
    if (url.pathname === "/tunnel") {
      const webSocketPair = new WebSocketPair();
      const [client, server] = Object.values(webSocketPair);

      this.hostWebSocket = server;
      this.hostWebSocket.accept();
      console.log(`[AUDIT] Host outbound WebSocket tunnel bound to SessionDO.`);

      this.hostWebSocket.addEventListener("close", () => {
        console.log(`[AUDIT] Host outbound WebSocket closed. Tearing down active sessions.`);
        this.hostWebSocket = null;
        this.activeSockets.forEach(socket => socket.close());
        this.activeSockets.clear();
      });

      return new Response(null, { status: 101, webSocket: client });
    }

    // Client Administrative Connection Handler
    if (url.pathname === "/admin") {
      if (!this.hostWebSocket) {
        return new Response("Host Tunnel Offline", { status: 503 });
      }

      const webSocketPair = new WebSocketPair();
      const [client, server] = Object.values(webSocketPair);

      server.accept();
      this.activeSockets.add(server);
      console.log(`[AUDIT] Admin client WebSocket session established.`);

      // Bridge: Client Input -> Host Tunnel
      server.addEventListener("message", (event) => {
        if (this.hostWebSocket && this.hostWebSocket.readyState === 1) {
          this.hostWebSocket.send(event.data);
        }
      });

      // Bridge: Host Output -> Client Socket
      this.hostWebSocket.addEventListener("message", (event) => {
        if (server.readyState === 1) {
          server.send(event.data);
        }
      });

      server.addEventListener("close", () => {
        console.log(`[AUDIT] Admin client session closed.`);
        this.activeSockets.delete(server);
        server.close();
      });

      return new Response(null, { status: 101, webSocket: client });
    }
  }
}
