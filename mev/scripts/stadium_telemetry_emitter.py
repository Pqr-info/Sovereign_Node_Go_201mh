#!/usr/bin/env python3
"""
🏟️ Stadium Telemetry Emitter
=============================
Unified telemetry client for emitting mesh chatter, Sentinel watchdogs, ADER fallbacks,
and Zeta execution telemetry into The Stadium cognitive bus and MIDI matrix.

Usage:
  python stadium_telemetry_emitter.py broadcast --speaker sentinel --category ANOMALY_WARNING --message "Watchdog heartbeat timeout"
  python stadium_telemetry_emitter.py midi --category GOVERNANCE_SIGNAL --value 127
"""

import sys
import os
import json
import urllib.request
import urllib.error
import time

STADIUM_ENDPOINTS = [
    "http://localhost:4050/api/gmi/stadium",  # Sovereign-27 Backend Server
    "http://localhost:4054/api/gmi/stadium"   # Stadium Engine (Atlas-UI)
]

CATEGORIES = [
    "GOVERNANCE_SIGNAL",
    "RIPPLE_GOSSIP",
    "TEMPORAL_DELTA",
    "ANOMALY_WARNING",
    "COHERENT_VERDICT",
    "AGENT_EFFICIENCY_RANK"
]

def send_post(endpoint_suffix: str, payload: dict):
    success = False
    for base in STADIUM_ENDPOINTS:
        url = f"{base}{endpoint_suffix}"
        headers = {"Content-Type": "application/json"}
        req_data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=req_data, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=3) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                print(f"[Stadium Emitter] Broadcast to {url} succeeded: {data.get('status', 'OK')}")
                success = True
        except Exception as e:
            # Fallback or silent continuation if secondary port is down
            pass
    return success

def emit_chatter(speaker: str, category: str, message: str, resonance_score: int = 85, sentiment_score: int = 90):
    if category not in CATEGORIES:
        category = "RIPPLE_GOSSIP"
    
    payload = {
        "speaker": speaker,
        "speaker_id": speaker,
        "channel": "STADIUM_MAIN",
        "category": category,
        "message": message,
        "chatterText": message,
        "resonance_score": resonance_score,
        "sentiment_score": sentiment_score
    }
    
    # 1. Emit chatter to Stadium ledger & SSE stream
    send_post("/broadcast", payload)
    
    # 2. Automatically translate category to MIDI CC event
    emit_midi(category, value=127)

def emit_midi(category: str, value: int = 127):
    payload = {
        "category": category,
        "value": value
    }
    send_post("/midi", payload)

def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python stadium_telemetry_emitter.py broadcast --speaker <speaker> --category <cat> --message <msg>")
        print("  python stadium_telemetry_emitter.py midi --category <cat> --value <val>")
        sys.exit(1)

    mode = sys.argv[1].lower()
    if mode == "broadcast":
        speaker = "sentinel"
        category = "RIPPLE_GOSSIP"
        message = "Mesh chatter pulse"
        
        for i in range(2, len(sys.argv)):
            if sys.argv[i] == "--speaker" and i+1 < len(sys.argv):
                speaker = sys.argv[i+1]
            elif sys.argv[i] == "--category" and i+1 < len(sys.argv):
                category = sys.argv[i+1]
            elif sys.argv[i] == "--message" and i+1 < len(sys.argv):
                message = sys.argv[i+1]
                
        emit_chatter(speaker, category, message)
        
    elif mode == "midi":
        category = "GOVERNANCE_SIGNAL"
        val = 127
        for i in range(2, len(sys.argv)):
            if sys.argv[i] == "--category" and i+1 < len(sys.argv):
                category = sys.argv[i+1]
            elif sys.argv[i] == "--value" and i+1 < len(sys.argv):
                val = int(sys.argv[i+1])
        emit_midi(category, val)

if __name__ == "__main__":
    main()
