#!/usr/bin/env python3
"""
🌐 Hetzner Canonical Master Release Sync
========================================
Synchronizes immutable release snapshots (zeta_R*, evolved_genesis_R*, etc.)
between the Hetzner Storage Box SMB Share and local node release rails (MAX, TED, Oracle).

Hetzner Storage Box Details:
  Vault Path: sovereign/canon
  Username: u589955-sub6
  SMB/CIFS Share: \\u589955-sub6.your-storagebox.de\u589955-sub6
  URL: u589955-sub6.your-storagebox.de

Usage:
  python hetzner_master_sync.py pull <release-id>
  python hetzner_master_sync.py push <release-id>
  python hetzner_master_sync.py list
"""

import sys
import os
import shutil
import subprocess
import urllib.request
import json

PQR_ROOT = "C:/pqr.info"
LOCAL_RELEASES = os.path.join(PQR_ROOT, "releases")
HETZNER_SHARE_ROOT = os.environ.get("HETZNER_SHARE_ROOT", r"\\u589955-sub6.your-storagebox.de\u589955-sub6")
HETZNER_MASTER_PATH = os.environ.get("HETZNER_MASTER_PATH", os.path.join(HETZNER_SHARE_ROOT, "pqr.info", "releases"))
HETZNER_USER = os.environ.get("HETZNER_USER", "u589955-sub6")
VAULT_ADDR = os.environ.get("VAULT_ADDR", "http://localhost:8200")
VAULT_TOKEN = os.environ.get("VAULT_TOKEN", "root")

def fetch_connect_string_from_vault():
    """Retrieve SMB connect string from Substrate 27 Vault path sovereign/canon."""
    url = f"{VAULT_ADDR.rstrip('/')}/v1/secret/data/sovereign/canon"
    headers = {"X-Vault-Token": VAULT_TOKEN}
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            connect_str = data.get("data", {}).get("data", {}).get("smb_connect") or data.get("data", {}).get("data", {}).get("connect_string")
            return connect_str
    except Exception as e:
        return None

def ensure_share_connected():
    """Ensure SMB share connection is active on Windows using Vault or env password."""
    if os.name == 'nt':
        connect_cmd = fetch_connect_string_from_vault()
        if connect_cmd:
            subprocess.run(connect_cmd, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return
            
        password = os.environ.get("HETZNER_PASSWORD")
        if password and HETZNER_SHARE_ROOT.startswith(r"\\"):
            cmd = f'net use "{HETZNER_SHARE_ROOT}" {password} /user:{HETZNER_USER} /persistent:yes'
            subprocess.run(cmd, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def ensure_dirs():
    os.makedirs(LOCAL_RELEASES, exist_ok=True)
    ensure_share_connected()
    try:
        os.makedirs(HETZNER_MASTER_PATH, exist_ok=True)
    except Exception as e:
        pass

def pull_release(release_id: str):
    ensure_dirs()
    remote_src = os.path.join(HETZNER_MASTER_PATH, release_id)
    local_dest = os.path.join(LOCAL_RELEASES, release_id)
    
    if not os.path.exists(remote_src):
        print(f"[Hetzner Master] [!] Release '{release_id}' not found on Hetzner Storage Box at {remote_src}")
        return False
        
    if os.path.exists(local_dest):
        print(f"[Hetzner Master] [i] Release '{release_id}' already present locally at {local_dest}")
        return True
        
    print(f"[Hetzner Master] Pulling release '{release_id}' from Hetzner Storage Box -> {local_dest}...")
    shutil.copytree(remote_src, local_dest)
    print(f"[Hetzner Master] [+] Pull completed for '{release_id}'!")
    return True

def push_release(release_id: str):
    ensure_dirs()
    local_src = os.path.join(LOCAL_RELEASES, release_id)
    remote_dest = os.path.join(HETZNER_MASTER_PATH, release_id)
    
    if not os.path.exists(local_src):
        print(f"[Hetzner Master] [!] Local release '{release_id}' not found at {local_src}")
        return False
        
    if os.path.exists(remote_dest):
        print(f"[Hetzner Master] [i] Release '{release_id}' already exists on Hetzner Storage Box.")
        return True
        
    print(f"[Hetzner Master] Publishing release '{release_id}' to Hetzner Storage Box -> {remote_dest}...")
    shutil.copytree(local_src, remote_dest)
    print(f"[Hetzner Master] [+] Release '{release_id}' published to Hetzner Storage Box!")
    return True

def list_releases():
    ensure_dirs()
    local_set = set(os.listdir(LOCAL_RELEASES)) if os.path.exists(LOCAL_RELEASES) else set()
    remote_set = set()
    if os.path.exists(HETZNER_MASTER_PATH):
        try:
            remote_set = set(os.listdir(HETZNER_MASTER_PATH))
        except Exception:
            pass
            
    all_releases = sorted(list(local_set | remote_set))
    print(f"\n[Hetzner Storage Box] CANONICAL RELEASE MATRIX ({HETZNER_SHARE_ROOT})")
    print("=" * 70)
    for r in all_releases:
        in_local = "YES" if r in local_set else "NO"
        in_remote = "YES" if r in remote_set else "NO"
        print(f"  * {r:<25} | Local: {in_local:<4} | Hetzner Storage Box: {in_remote:<4}")
    print("=" * 70)

def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python hetzner_master_sync.py list")
        print("  python hetzner_master_sync.py pull <release-id>")
        print("  python hetzner_master_sync.py push <release-id>")
        sys.exit(1)

    cmd = sys.argv[1].lower()
    if cmd == "list":
        list_releases()
    elif cmd == "pull" and len(sys.argv) > 2:
        pull_release(sys.argv[2])
    elif cmd == "push" and len(sys.argv) > 2:
        push_release(sys.argv[2])
    else:
        print(f"Invalid command or arguments: {cmd}")
        sys.exit(1)

if __name__ == "__main__":
    main()
