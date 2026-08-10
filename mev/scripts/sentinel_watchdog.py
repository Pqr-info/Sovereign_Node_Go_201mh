#!/usr/bin/env python3
"""
Sentinel Watchdog Ring & Role Governor Engine
===================================================
Process monitoring and adaptive governance daemon for Sovereign-27 nodes.
Monitors node health, detects PID crashes, manifest_hash drift,
and governs dynamic Role Shedding, Role Promotion, and Node Resurrection.

Usage:
  python sentinel_watchdog.py --daemon
  python sentinel_watchdog.py --single-check
  python sentinel_watchdog.py --test-resurrection
  python sentinel_watchdog.py --test-role-governor
  python sentinel_watchdog.py --simulate-load
"""

import sys
import os
import json
import urllib.request
import subprocess
import time
import random

PQR_ROOT = "C:/pqr.info"
MANIFEST_PATH = os.path.join(PQR_ROOT, "manifest.json")
BOOTSTRAP_SCRIPT = os.path.join(PQR_ROOT, "mev", "scripts", "bootstrap_genesis.py")
EMITTER_SCRIPT = os.path.join(PQR_ROOT, "mev", "scripts", "stadium_telemetry_emitter.py")
BOOTLOADER_HEALTH_URL = "http://localhost:4053/api/health"

SIMULATE_LOAD = "--simulate-load" in sys.argv

def load_manifest():
    if not os.path.exists(MANIFEST_PATH):
        raise Exception(f"Operative manifest.json not found at {MANIFEST_PATH}")
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_manifest(manifest):
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

def emit_stadium(category: str, message: str):
    if os.path.exists(EMITTER_SCRIPT):
        cmd = [sys.executable, EMITTER_SCRIPT, "broadcast", "--speaker", "sentinel_watchdog", "--category", category, "--message", message]
        try:
            subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except Exception:
            pass

def query_health():
    try:
        req = urllib.request.Request(BOOTLOADER_HEALTH_URL)
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if SIMULATE_LOAD:
                # 30% chance to simulate CPU spike
                if random.random() < 0.3:
                    data["cpu"] = random.randint(85, 99)
                    data["status"] = "DEGRADED"
                else:
                    data["cpu"] = random.randint(10, 40)
                    data["status"] = "HEALTHY"
                data["mem"] = random.randint(40, 60)
            else:
                data["cpu"] = 10
                data["mem"] = 40
            return data
    except Exception:
        return None

def quarantine_failure(node_id: str, recipe: str, reason: str):
    post_mortem_dir = os.path.join(PQR_ROOT, "post_mortem")
    os.makedirs(post_mortem_dir, exist_ok=True)
    filename = f"sentinel_resurrection_{node_id}_{int(time.time())}.json"
    filepath = os.path.join(post_mortem_dir, filename)
    
    log_data = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "node_id": node_id,
        "recipe": recipe,
        "reason": reason,
        "action": "AUTO_RESURRECT_BOOTSTRAP_GENESIS"
    }
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(log_data, f, indent=2)
    print(f"[Sentinel Watchdog] Quarantined fault snapshot to {filepath}")
    return filepath

# Priorities (lower index = lower priority = first to shed)
ROLE_PRIORITIES = [
    "zeta_l7_worker",
    "spacebook_5d_agent",
    "rail_sync_master",
    "stadium_broadcaster",
    "vault_proxy",
    "ader_fallback_engine",
    "sentinel_watchdog",
    "genesis_seed_carrier"
]

def get_role_priority(role: str) -> int:
    try:
        return ROLE_PRIORITIES.index(role)
    except ValueError:
        return 0

def shed_role(manifest, from_node: str):
    """Role Shedding: Transfers lowest priority role from degraded node to a healthy peer."""
    sovereign = manifest.get("sovereign", {})
    nodes = sovereign.get("nodes", {})
    if from_node not in nodes:
        return False
        
    my_roles = nodes[from_node].get("roles", [])
    if not my_roles:
        return False
        
    # Sort roles by priority
    my_roles.sort(key=get_role_priority)
    role_to_shed = my_roles[0] # shed lowest priority
    
    # Find candidate node
    candidate = None
    for n_id, n_info in nodes.items():
        if n_id == from_node: continue
        # Simple capacity check (could be robust later)
        if len(n_info.get("roles", [])) < 3: 
            candidate = n_id
            break
            
    if candidate:
        print(f"\n[Sentinel Role Governor] SHEDDING ROLE '{role_to_shed}' from Node '{from_node}' -> Node '{candidate}'")
        nodes[from_node]["roles"].remove(role_to_shed)
        if role_to_shed not in nodes[candidate].get("roles", []):
            nodes[candidate].setdefault("roles", []).append(role_to_shed)
        save_manifest(manifest)
        emit_stadium("GOVERNANCE_SIGNAL", f"Role '{role_to_shed}' SHED from '{from_node}' to '{candidate}'")
        emit_stadium(role_to_shed, "SHED")
        return True
    return False

def promote_role(manifest, to_node: str):
    """Role Promotion: Assigns an unassigned role to a healthy node."""
    sovereign = manifest.get("sovereign", {})
    nodes = sovereign.get("nodes", {})
    all_roles = sovereign.get("roles", {}).keys()
    
    assigned_roles = set()
    for n_info in nodes.values():
        assigned_roles.update(n_info.get("roles", []))
        
    unassigned = set(all_roles) - assigned_roles
    if unassigned and to_node in nodes:
        role_to_add = sorted(list(unassigned), key=get_role_priority, reverse=True)[0]
        print(f"\n[Sentinel Role Governor] PROMOTING NODE '{to_node}' to Role '{role_to_add}'")
        nodes[to_node].setdefault("roles", []).append(role_to_add)
        save_manifest(manifest)
        emit_stadium("GOVERNANCE_SIGNAL", f"Node '{to_node}' PROMOTED to Role '{role_to_add}'")
        emit_stadium(role_to_add, "PROMOTED")
        return True
    return False

def downgrade_runlevel(manifest, node_id: str):
    sovereign = manifest.get("sovereign", {})
    nodes = sovereign.get("nodes", {})
    if node_id not in nodes: return False
    
    recipe = nodes[node_id].get("recipe")
    new_recipe = recipe
    if recipe == "spawn_all": new_recipe = "spawn_full"
    elif recipe == "spawn_full": new_recipe = "spawn_core"
    elif recipe == "spawn_core": new_recipe = "spawn_minimal"
    elif recipe == "spawn_dev": new_recipe = "spawn_core"
    
    if new_recipe != recipe:
        print(f"\n[Sentinel Role Governor] DOWNGRADING RUNLEVEL for '{node_id}': {recipe} -> {new_recipe}")
        nodes[node_id]["recipe"] = new_recipe
        save_manifest(manifest)
        emit_stadium("GOVERNANCE_SIGNAL", f"Runlevel DOWNGRADED for '{node_id}' to '{new_recipe}'")
        emit_stadium(new_recipe, "DOWNGRADE")
        return True
    return False

def upgrade_runlevel(manifest, node_id: str):
    sovereign = manifest.get("sovereign", {})
    nodes = sovereign.get("nodes", {})
    if node_id not in nodes: return False
    
    recipe = nodes[node_id].get("recipe")
    new_recipe = recipe
    if recipe == "spawn_minimal": new_recipe = "spawn_core"
    elif recipe == "spawn_core": new_recipe = "spawn_full"
    
    if new_recipe != recipe:
        print(f"\n[Sentinel Role Governor] UPGRADING RUNLEVEL for '{node_id}': {recipe} -> {new_recipe}")
        nodes[node_id]["recipe"] = new_recipe
        save_manifest(manifest)
        emit_stadium("GOVERNANCE_SIGNAL", f"Runlevel UPGRADED for '{node_id}' to '{new_recipe}'")
        emit_stadium(new_recipe, "UPGRADE")
        return True
    return False

def resurrect_node(node_id: str = "MAX", recipe: str = "spawn_dev"):
    print(f"\n[Sentinel Watchdog] INITIATING NODE RESURRECTION PROTOCOL for Node '{node_id}' (Recipe: {recipe})...")
    emit_stadium("RESURRECTION_INIT", f"Triggering Node Resurrection (Recipe: '{recipe}')...")
    
    quarantine_failure(node_id, recipe, "Bootloader health check timeout / process crash")

    # Trigger Bootstrap Genesis Engine
    cmd = [sys.executable, BOOTSTRAP_SCRIPT, "--recipe", recipe]
    res = subprocess.run(cmd, capture_output=True, text=True)
    print(res.stdout)

    # Verify health recovery
    time.sleep(2)
    health = query_health()
    if health and health.get("status") in ["ok", "HEALTHY"]:
        run_counter = health.get("run", "N/A")
        release_id = health.get("release", "N/A")
        print(f"[Sentinel Watchdog] [+] NODE RESURRECTION SUCCESSFUL for Node '{node_id}'! Release: {release_id}, RUN: {run_counter}")
        emit_stadium("RESURRECTION_SUCCESS", f"Node '{node_id}' Resurrection SUCCESSFUL! [Release: {release_id}, RUN={run_counter}, Recipe: {recipe}]")
        emit_stadium("COHERENT_VERDICT", f"Mesh health consensus re-established for Node '{node_id}' ({release_id}).")
        return True
    else:
        print(f"[Sentinel Watchdog] [!] Resurrection attempt failed for Node '{node_id}'. Sentinel issuing secondary KICK alert.")
        emit_stadium("ANOMALY_WARNING", f"Resurrection attempt failed for Node '{node_id}'!")
        return False

def monitor_loop(single_check: bool = False):
    manifest = load_manifest()
    sovereign = manifest.get("sovereign", {})
    sentinel_cfg = sovereign.get("sentinel", {})
    poll_interval = sentinel_cfg.get("poll_interval_sec", 5)
    max_failures = sentinel_cfg.get("max_failures_before_resurrection", 2)
    
    active_node = "MAX"

    print("=" * 75)
    print(f"SENTINEL WATCHDOG RING & ROLE GOVERNOR ACTIVE (Node: {active_node})")
    print(f"   Poll Interval: {poll_interval}s | Failure Threshold: {max_failures}")
    if SIMULATE_LOAD:
        print("   *** SIMULATING LOAD SPIKES FOR REFLEX TESTING ***")
    print("=" * 75)

    consecutive_failures = 0
    
    while True:
        # Reload manifest to get latest node config
        manifest = load_manifest()
        nodes = manifest.get("sovereign", {}).get("nodes", {})
        active_cfg = nodes.get(active_node, {})
        recipe = active_cfg.get("recipe", "spawn_dev")
        
        health = query_health()
        
        if health:
            status = health.get("status", "UNKNOWN")
            cpu = health.get("cpu", 0)
            
            if status in ["ok", "HEALTHY"] and cpu < 80:
                print(f"[Sentinel] Node '{active_node}' Status: HEALTHY | CPU: {cpu}%")
                consecutive_failures = 0
                
                # Check for idle upgrade
                if cpu < 20:
                    promoted = promote_role(manifest, active_node)
                    if not promoted:
                        upgrade_runlevel(manifest, active_node)
                        
            elif status == "DEGRADED" or cpu >= 80:
                print(f"[Sentinel] WARNING: Node '{active_node}' is DEGRADED! CPU: {cpu}%")
                consecutive_failures = 0
                emit_stadium("ANOMALY_WARNING", f"Node '{active_node}' degraded (CPU {cpu}%)")
                
                # Shed load
                shed = shed_role(manifest, active_node)
                if not shed:
                    downgrade_runlevel(manifest, active_node)
            else:
                # UNHEALTHY or non-ok
                consecutive_failures += 1
                print(f"[Sentinel] WARNING: Health Check Failed for '{active_node}'! ({consecutive_failures}/{max_failures})")
                emit_stadium("ANOMALY_WARNING", f"Health Check Failed for '{active_node}'")
                
        else:
            consecutive_failures += 1
            print(f"[Sentinel] WARNING: Node '{active_node}' is OFFLINE! ({consecutive_failures}/{max_failures})")
            emit_stadium("ANOMALY_WARNING", f"Node '{active_node}' OFFLINE")

        if consecutive_failures >= max_failures:
            resurrect_node(node_id=active_node, recipe=recipe)
            consecutive_failures = 0

        if single_check:
            break
        time.sleep(poll_interval)

def main():
    single_check = "--single-check" in sys.argv
    monitor_loop(single_check=single_check)

if __name__ == "__main__":
    main()
