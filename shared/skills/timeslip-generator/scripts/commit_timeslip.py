import sys
import json
import time
import uuid
import urllib.request
import urllib.error

def commit_timeslip(prompt, raw_context, semantic_relations_str):
    try:
        # Build the CSM payload
        relations = [r.strip() for r in semantic_relations_str.split(',') if r.strip()]
        
        session_id = f"csm_{uuid.uuid4().hex[:8]}"
        extrinsic_id = f"ext_{uuid.uuid4().hex[:8]}"
        context_slice_id = f"ctx_{uuid.uuid4().hex[:8]}"
        
        manifest = {
            "session_id": session_id,
            "agent_id": "antigravity",
            "model_id": "antigravity",
            "model_version": "1.0",
            "prompt": prompt,
            "context_slice_id": context_slice_id,
            "raw_context": raw_context,
            "semantic_relations": relations,
            "extrinsic_id": extrinsic_id,
            "created_at": int(time.time())
        }

        # Target the Sovereign Mesh REST 2.0 sidecar port 8085
        url = "http://127.0.0.1:8085/api/v2/tickets"
        
        # The ProposeSwarmMutation endpoint expects key, value, reason, proposer
        payload = {
            "key": f"CSM_{session_id}",
            "value": json.dumps(manifest),
            "reason": "Timeslip Generation",
            "proposer": "antigravity"
        }
        
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
        
        print(f"Submitting CognitiveSessionManifest to {url}...")
        
        with urllib.request.urlopen(req, timeout=10) as response:
            res_body = response.read().decode("utf-8")
            res_json = json.loads(res_body)
            
            if "error" in res_json:
                print(f"FAILED to commit CSM (Mesh Error): {res_json['error']}")
                sys.exit(1)
            
            data_res = res_json.get("data", {})
            if data_res.get("consensus_reached"):
                block_index = data_res.get("block_index")
                print(f"SUCCESS: CSM committed. Block Index: {block_index}")
                return block_index
            else:
                print(f"FAILED: Consensus rejected the mutation. {data_res}")
                sys.exit(1)

    except urllib.error.URLError as e:
        print(f"FAILED to connect to sidecar API. Is the mesh node running on 8085? Error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"FAILED to commit CSM: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python commit_timeslip.py '<prompt>' '<raw_context>' '<comma,separated,relations>'")
        sys.exit(1)
        
    prompt = sys.argv[1]
    raw_context = sys.argv[2]
    relations = sys.argv[3]
    
    commit_timeslip(prompt, raw_context, relations)
