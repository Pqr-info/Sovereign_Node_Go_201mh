import os
import random
import dns.resolver
import requests

DEFAULT_URL = os.getenv("SUBSTRATE_RPC_URL", "http://127.0.0.1:9933")

def probe(url):
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "system_health",
        "params": []
    }
    try:
        r = requests.post(url, json=payload, timeout=1)
        return r.ok
    except Exception:
        return False

def discover_node():
    try:
        answers = dns.resolver.resolve("_substrate._tcp.mesh.pqr.info", "SRV")
        candidates = []
        for rdata in answers:
            host = str(rdata.target).rstrip(".")
            port = rdata.port
            url = f"http://{host}:{port}"
            if probe(url):
                candidates.append(url)
        if candidates:
            return random.choice(candidates)
        return DEFAULT_URL
    except Exception:
        return DEFAULT_URL
