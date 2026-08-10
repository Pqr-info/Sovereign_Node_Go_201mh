import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

BACKCHANNEL_FILE = ".copilot_backchannel.json"
WORKSPACE_ROOT = Path(__file__).resolve().parent


def ensure_backchannel_schema(data, owner="bcpd", active_agent=None, active_file=None, active_runlevel=None, active_container=None):
    if not isinstance(data, dict):
        raise ValueError("Backchannel data must be a dictionary.")

    data.setdefault("messages", [])
    data["owner"] = owner or data.get("owner", "bcpd")
    data["intent"] = data.get("intent") if data.get("intent") is not None else None
    data["copilot_sync"] = True
    data["vscode_hook"] = data.get("vscode_hook", "http://localhost:17351/update")

    context = data.setdefault("context", {})
    context["workspace"] = str(WORKSPACE_ROOT)
    if active_agent is not None:
        context["active_agent"] = active_agent
    if active_file is not None:
        context["active_file"] = active_file
    if active_runlevel is not None:
        context["active_runlevel"] = active_runlevel
    if active_container is not None:
        context["active_container"] = active_container

    data.setdefault("copilot_last_message", "Continuity relay active; backchannel is authoritative and sync-ready.")
    return data


def read_backchannel():
    if not os.path.exists(BACKCHANNEL_FILE):
        print("Error: Backchannel file not found.")
        return None
    with open(BACKCHANNEL_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return ensure_backchannel_schema(data)


def write_backchannel(data):
    data = ensure_backchannel_schema(data)
    data["last_updated"] = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    with open(BACKCHANNEL_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print("Backchannel state updated successfully.")


def update_state(action, next_step, active_agent="Antigravity/Gemini"):
    data = read_backchannel()
    if not data:
        return
    data["active_agent"] = active_agent
    data["last_action_performed"] = action
    data["next_blocking_step"] = next_step
    data["intent"] = None
    write_backchannel(data)


def set_intent(intent_payload):
    data = read_backchannel()
    if not data:
        return
    data["intent"] = intent_payload
    write_backchannel(data)


def clear_intent():
    data = read_backchannel()
    if not data:
        return
    data["intent"] = None
    write_backchannel(data)


def display_status():
    data = read_backchannel()
    if not data:
        return
    print("=== PQR STATE BACKCHANNEL STATUS ===")
    print(f"Active Agent : {data.get('active_agent')}")
    print(f"Owner        : {data.get('owner')}")
    print(f"Copilot Sync : {data.get('copilot_sync')}")
    print(f"Last Updated : {data.get('last_updated')}")
    print(f"Current RL   : {data.get('current_runlevel')} ({data.get('fsm_state')})")
    print(f"Last Action  : {data.get('last_action_performed')}")
    print(f"Next Step    : {data.get('next_blocking_step')}")
    print("====================================")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        display_status()
        sys.exit(0)

    cmd = sys.argv[1].lower()
    if cmd == "status":
        display_status()
    elif cmd == "update" and len(sys.argv) >= 4:
        update_state(sys.argv[2], sys.argv[3])
    elif cmd == "set-intent" and len(sys.argv) >= 3:
        set_intent(sys.argv[2])
    elif cmd == "clear-intent":
        clear_intent()
    else:
        print("Usage: python sync_backchannel.py [status | update '<last_action>' '<next_step>' | set-intent '<payload>' | clear-intent]")
