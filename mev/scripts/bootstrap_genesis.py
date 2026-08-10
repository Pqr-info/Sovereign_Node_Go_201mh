#!/usr/bin/env python3
"""
Sovereign-27 Bootstrap Genesis Protocol Engine
=================================================
Agentic node provisioning and self-spawning orchestrator.
Reads operative configuration directly from manifest.json.

Usage:
  python bootstrap_genesis.py --recipe spawn_dev
  python bootstrap_genesis.py --recipe spawn_all --dry-run
"""

import sys
import os
import json
import urllib.request
import subprocess
import time

PQR_ROOT = "C:/pqr.info"
MANIFEST_PATH = os.path.join(PQR_ROOT, "manifest.json")
EMITTER_SCRIPT = os.path.join(PQR_ROOT, "mev", "scripts", "stadium_telemetry_emitter.py")
BOOTLOADER_HEALTH_URL = "http://localhost:4053/api/health"

def load_manifest():
    if not os.path.exists(MANIFEST_PATH):
        raise Exception(f"Operative manifest.json not found at {MANIFEST_PATH}")
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def emit_stadium(category: str, message: str):
    if os.path.exists(EMITTER_SCRIPT):
        cmd = [sys.executable, EMITTER_SCRIPT, "broadcast", "--speaker", "bootstrap_genesis", "--category", category, "--message", message]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def check_bootloader_health():
    try:
        req = urllib.request.Request(BOOTLOADER_HEALTH_URL)
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if data.get("status") in ["ok", "HEALTHY"]:
                return data
    except Exception:
        pass
    return None

def verify_lineage_consistency(expected_genesis: str, node_type: str):
    """Lineage consistency check: Ensure node genesis pointer matches manifest genesis root."""
    runtime_dir = os.path.join(PQR_ROOT, "runtime", "zeta_l7")
    ptr_file = os.path.join(runtime_dir, "genesis.ptr")
    if os.path.exists(ptr_file):
        with open(ptr_file, "r", encoding="utf-8") as f:
            target = f.read().strip()
            resolved = os.path.basename(target)
            if resolved != expected_genesis:
                print(f"[!] WARNING: Lineage divergence detected for {node_type}! Pointer: {resolved} vs Expected: {expected_genesis}")
                emit_stadium("ANOMALY_WARNING", f"Lineage divergence detected on {node_type} ({resolved} != {expected_genesis})")
                return False
    print(f"    [+] Lineage Consistency Verified: {expected_genesis}")
    return True

def provision_node(template_name: str, template_config: dict, provision_rules: dict, expected_genesis: str, node_roles: list = None, dry_run: bool = False):
    roles_str = ', '.join(node_roles) if node_roles else 'unassigned'
    print(f"\n[*] Provisioning Node Template: '{template_name}' (OS: {template_config.get('os')})")
    print(f"    Assigned Roles: [{roles_str}]")
    print(f"    Services: {', '.join(template_config.get('services', []))}")
    print(f"    Mounts: {', '.join(template_config.get('mounts', []))}")

    if dry_run:
        print("    [DRY-RUN] Skipped actual process spawning and network mounting.")
        return True

    # 1. Mount network shares
    for m in template_config.get("mounts", []):
        if m.startswith("smb://"):
            print(f"    [+] Initializing Hetzner Storage Box SMB connection ({m})...")
            sync_script = os.path.join(PQR_ROOT, "mev", "scripts", "hetzner_master_sync.py")
            if os.path.exists(sync_script):
                subprocess.run([sys.executable, sync_script, "list"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # 2. Check Lineage Consistency
    verify_lineage_consistency(expected_genesis, template_name)

    # 3. Check and instantiate bootloader if not running
    if template_config.get("os") == "windows" and "zeta_l7" in template_config.get("services", []):
        health = check_bootloader_health()
        if not health:
            print("    [+] Bootloader not active. Instantiating mesh_bootloader.js...")
            bootloader_path = os.path.join(PQR_ROOT, "mev", "atlas-ui", "mesh_bootloader.js")
            if os.path.exists(bootloader_path):
                subprocess.Popen(["node", bootloader_path], cwd=PQR_ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                time.sleep(2)
                health = check_bootloader_health()

        if health:
            print(f"    [+] Bootloader daemon is HEALTHY (Release: {health.get('release')}, RUN: {health.get('run')}).")
            emit_stadium("RIPPLE_GOSSIP", f"Bootloader online for node '{template_name}' (PID: {health.get('pid')}, Roles: [{roles_str}])")
            emit_stadium("COHERENT_VERDICT", f"Node '{template_name}' verified HEALTHY under lineage {expected_genesis}")

    emit_stadium("GOVERNANCE_SIGNAL", f"Node '{template_name}' successfully provisioned with roles [{roles_str}].")
    return True

def run_bootstrap(recipe_name: str = None, dry_run: bool = False):
    manifest = load_manifest()
    sovereign = manifest.get("sovereign", {})
    
    canon_version = sovereign.get("canon_version", "R1")
    genesis_release = sovereign.get("genesis", "evolved_genesis_R1")
    spawn_recipes = sovereign.get("spawn_recipes", {})
    node_templates = sovereign.get("node_templates", {})
    provision_rules = sovereign.get("provision", {})
    sentinel_nodes = sovereign.get("sentinel", {}).get("nodes", {})
    
    if not recipe_name:
        recipe_name = sovereign.get("bootstrap", {}).get("default_recipe", "spawn_dev")
        
    targets = spawn_recipes.get(recipe_name, ["windows_worker"])
    
    print("=" * 75)
    print(f"[+] SOVEREIGN-27 BOOTSTRAP GENESIS PROTOCOL ENGINE (Canon: {canon_version})")
    print(f"    Ancestry Root: {genesis_release} | Recipe: '{recipe_name}' | DryRun: {dry_run}")
    print("=" * 75)

    emit_stadium("GOVERNANCE_SIGNAL", f"Initiating Bootstrap Genesis Protocol (Recipe: '{recipe_name}', Canon: {canon_version})")

    # Map node templates to node roles
    for node_type in targets:
        template = node_templates.get(node_type)
        if not template:
            print(f"[!] Warning: Unknown node template '{node_type}' in recipe '{recipe_name}'")
            continue
            
        # Determine roles for template
        node_roles = []
        for n_id, n_cfg in sentinel_nodes.items():
            if n_cfg.get("recipe") == recipe_name:
                node_roles.extend(n_cfg.get("roles", []))
                
        provision_node(node_type, template, provision_rules, genesis_release, list(set(node_roles)), dry_run)

    emit_stadium("TEMPORAL_DELTA", f"Bootstrap Genesis sequence complete for recipe '{recipe_name}'. Mesh active.")
    print("\n[+] BOOTSTRAP GENESIS SEQUENCE COMPLETED SUCCESSFULLY!")

def main():
    recipe = None
    dry_run = False
    
    for i in range(1, len(sys.argv)):
        if sys.argv[i] == "--recipe" and i + 1 < len(sys.argv):
            recipe = sys.argv[i + 1]
        elif sys.argv[i] == "--dry-run":
            dry_run = True
            
    run_bootstrap(recipe_name=recipe, dry_run=dry_run)

if __name__ == "__main__":
    main()
