import urllib.request
import urllib.error
import json
import base64
import sys
import time

L0_URL = "http://localhost:8080"

def log(msg):
    print(f"[VALIDATION] {msg}")

def check_resp(resp_data):
    try:
        data = json.loads(resp_data)
        if data.get("success") != "true":
            raise RuntimeError(f"Endpoint failed: {data}")
        return data
    except ValueError:
        raise RuntimeError(f"Non-JSON response: {resp_data}")

def do_post(path, payload):
    req = urllib.request.Request(f"{L0_URL}{path}", data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as response:
        return response.read()

def do_get(path):
    with urllib.request.urlopen(f"{L0_URL}{path}") as response:
        return response.read()

def main():
    log("Starting Section 5: Master Validation Script")

    # 1. Check ACS Status
    log("Checking L0 Relay (ACS Status)...")
    try:
        do_get("/acs_status")
    except urllib.error.URLError:
        log("FAIL: L0 Relay is offline.")
        sys.exit(1)
    
    # 2. Allocate Page
    log("Allocating 16MB Page...")
    r = do_post("/allocate_page", {"agent_id": "SYS_VALIDATOR_1"})
    data = check_resp(r)
    page_id = data["page_id"]
    log(f"-> Page Allocated: {page_id}")

    # 3. Attach Agent
    log("Attaching Agent (SYS_VALIDATOR_2)...")
    r = do_post("/attach_agent", {"PageID": page_id, "AgentID": "SYS_VALIDATOR_2"})
    check_resp(r)
    log("-> Agent Attached")

    # 4. Swap Agents (Teleportation)
    log("Executing Pointer Swap (Teleportation)...")
    r = do_post("/swap_agents", {"page_id": page_id, "agent_a": "SYS_VALIDATOR_1", "agent_b": "SYS_VALIDATOR_2"})
    check_resp(r)
    log("-> Agents Swapped")

    # 5. Commit Slice
    payload = "COGNITIVE_TEST_PAYLOAD".encode('utf-8')
    b64_payload = base64.b64encode(payload).decode('utf-8')
    log("Committing Context Slice...")
    r = do_post("/commit_slice", {"PageID": page_id, "DataBase64": b64_payload})
    check_resp(r)
    log("-> Slice Committed")

    # 6. Read Context Slice
    log("Reading Context Slice...")
    r = do_post("/context_slice", {"PageID": page_id, "Length": 1024})
    check_resp(r)
    log("-> Slice Read Successfully")

    # 7. Check Teleportation Log
    log("Verifying Teleportation Log...")
    r = do_get("/teleportation_log")
    log_data = json.loads(r)
    if len(log_data.get("Entries", [])) == 0:
        log("FAIL: Teleportation log is empty!")
        sys.exit(1)
    log(f"-> Teleportation Log verified ({len(log_data['Entries'])} entries)")

    log("========================================")
    log("SUCCESS: All L0 Relay operations passed!")
    log("========================================")

if __name__ == "__main__":
    main()
