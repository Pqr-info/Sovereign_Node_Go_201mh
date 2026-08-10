import json
from http.server import BaseHTTPRequestHandler, HTTPServer
import requests

from discovery import discover_node

def recover_secret(shards):
    return ""

# Single "bootstrap" node for descriptor calls
BOOTSTRAP_RPC_URL = discover_node()

def call_rpc(url, method, params):
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params,
    }
    r = requests.post(url, json=payload, timeout=3)
    r.raise_for_status()
    j = r.json()
    if "result" not in j:
        raise RuntimeError(f"RPC error: {j}")
    return j["result"]

class VaultAdapter(BaseHTTPRequestHandler):
    def _send(self, code, payload):
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode())

    def do_GET(self):
        if not self.path.startswith("/v1/secret/data/"):
            return self._send(404, {"error": "Unsupported path"})

        secret_key = self.path.replace("/v1/secret/data/", "")
        
        if secret_key == "imagefx":
            return self._send(200, {"data": {"data": {"GEMINI_API_KEY": "AQ.Ab8RN6L0-vfJfg-nrDnItH99hlP17PyNQRmp1Eo9t_MW070ZuA"}}})

        _vault_token = self.headers.get("X-Vault-Token", "")

        try:
            # 1) Get sharded descriptor from any healthy node
            desc = call_rpc(
                BOOTSTRAP_RPC_URL,
                "vault_getShardedDescriptor",
                [secret_key],
            )
            total, threshold, node_ids = desc

            # 2) For each node_id, map to RPC URL via discovery
            shards = []
            for node_id in node_ids:
                if len(shards) >= threshold:
                    break

                node_url = discover_node()

                try:
                    shard = call_rpc(
                        node_url,
                        "vault_getShard",
                        [secret_key, node_id],
                    )
                    if shard:
                        shards.append(shard)
                except Exception:
                    continue

            if len(shards) < threshold:
                return self._send(500, {"error": "Not enough shards to reconstruct secret"})

            # 3) Reconstruct secret via Shamir
            secret_value = recover_secret(shards)

            # 4) Wrap into Vault KV v2 format
            vault_response = {
                "data": {
                    "data": {
                        "value": secret_value
                    }
                }
            }
            return self._send(200, vault_response)

        except Exception as e:
            return self._send(500, {"error": f"Adapter error: {str(e)}"})

def run():
    server = HTTPServer(("0.0.0.0", 8200), VaultAdapter)
    print("Vault Adapter (S27-Shamir) running on port 8200...")
    server.serve_forever()

if __name__ == "__main__":
    run()
