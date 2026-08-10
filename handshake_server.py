#!/usr/bin/env python3
"""
client_handshake_example.py

Demonstrates a deterministic handshake and follow-up flow against the Gemma IDE
reference handshake server (handshake_server.py).

Usage
  python3 client_handshake_example.py
"""

import requests
import json
import uuid
import time

SERVER_BASE = "http://localhost:8080"  # adjust to your server
LOCAL_INSTANCE_ID = "remote_node_1"

def now_iso():
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

def make_nonce():
    return uuid.uuid4().hex

def build_offer(instance_id, capabilities, schemas):
    return {
        "protocol_version": "1.0",
        "instance_id": instance_id,
        "capabilities": capabilities,
        "schemas": schemas,
        "timestamp": now_iso(),
        "nonce": make_nonce()
    }

def post_json(path, body):
    url = f"{SERVER_BASE}{path}"
    headers = {"Content-Type": "application/json"}
    resp = requests.post(url, headers=headers, data=json.dumps(body))
    try:
        return resp.status_code, resp.json()
    except Exception:
        return resp.status_code, resp.text

def get_json(path):
    url = f"{SERVER_BASE}{path}"
    resp = requests.get(url)
    try:
        return resp.status_code, resp.json()
    except Exception:
        return resp.status_code, resp.text

def run_handshake_flow():
    # 1. Build and send handshake offer
    local_caps = ["macro_execution", "dom_snapshot_v1", "task_state_v1"]
    local_schemas = {"macro": "v1", "dom_snapshot": "v1", "task_state": "v1"}
    offer = build_offer(LOCAL_INSTANCE_ID, local_caps, local_schemas)

    print("Sending handshake offer to server...")
    status, accept_msg = post_json("/handshake/offer", offer)
    if status != 200:
        print("Handshake offer rejected or failed:", status, accept_msg)
        return

    print("Received accept message:")
    print(json.dumps(accept_msg, indent=2))

    # 2. Validate accept message nonce matches offer nonce (server includes offer_nonce)
    offer_nonce = offer["nonce"]
    if accept_msg.get("offer_nonce") != offer_nonce:
        print("Offer nonce mismatch. Aborting.")
        return

    # 3. Create a ticket for cross-organism delegation
    ticket_payload = {
        "origin_instance": LOCAL_INSTANCE_ID,
        "target_instance": "gemma_local_instance",
        "corridor": "Payments",
        "payload_summary": "Process invoice #1234"
    }
    print("Creating ticket...")
    status, ticket_resp = post_json("/ticket", ticket_payload)
    if status not in (200, 201):
        print("Ticket creation failed:", status, ticket_resp)
        return
    print("Ticket created:")
    print(json.dumps(ticket_resp, indent=2))
    ticket_id = ticket_resp.get("ticket_id")

    # 4. Persist an agentic memory fact with explicit consent
    memory_payload = {
        "fact": "Invoice 1234 approved by finance lead",
        "source_instance": LOCAL_INSTANCE_ID,
        "consent": True
    }
    print("Persisting memory fact...")
    status, mem_resp = post_json("/memory/persist", memory_payload)
    if status not in (200, 201):
        print("Memory persist failed:", status, mem_resp)
        return
    print("Memory persisted:")
    print(json.dumps(mem_resp, indent=2))
    fact_id = mem_resp.get("fact_id")

    # 5. Demonstrate contact_mothership proxy call
    # Build a deterministic payload that the remote subagent would analyze
    contact_payload = {
        "remote_endpoint": "https://remote.example/agent",  # demo value
        "payload": {
            "operator_directive": "Analyze invoice metadata",
            "input": {"invoice_id": "1234", "amount": "1000.00"}
        }
    }
    print("Calling contact_mothership proxy on server...")
    status, contact_resp = post_json("/contact_mothership", contact_payload)
    if status != 200:
        print("contact_mothership proxy failed:", status, contact_resp)
        return
    print("contact_mothership response:")
    print(json.dumps(contact_resp, indent=2))

    # 6. Query the ticket we created
    print("Querying ticket...")
    status, ticket_query = get_json(f"/ticket/{ticket_id}")
    if status != 200:
        print("Ticket query failed:", status, ticket_query)
    else:
        print("Ticket state:")
        print(json.dumps(ticket_query, indent=2))

    # 7. Query the persisted memory fact
    print("Querying persisted memory fact...")
    status, mem_query = get_json(f"/memory/{fact_id}")
    if status != 200:
        print("Memory query failed:", status, mem_query)
    else:
        print("Memory record:")
        print(json.dumps(mem_query, indent=2))

if __name__ == "__main__":
    run_handshake_flow()