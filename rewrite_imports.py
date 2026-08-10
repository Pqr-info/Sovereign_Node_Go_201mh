import os, glob, re

module_map = {
    'github.com/thealanphipps-del/pqr/cockpit': 'pqr.info/cockpit',
    'github.com/thealanphipps-del/pqr/jetweb-core': 'pqr.info/jetweb-core',
    'jetweb-time-machine': 'pqr.info/jetweb-time-machine',
    'pqr.info/mev': 'pqr.info/mev',
    'github.com/mev-protocol/network': 'pqr.info/mev/network',
    'github.com/thealanphipps-del/pqr/ouroboros-auditor': 'pqr.info/ouroboros-auditor',
    'github.com/pqr-info/pqr-info-swarm/proxy': 'pqr.info/proxy',
    'sovereign-node-go': 'pqr.info/remote-windows-admin/Sovereign_Node_Go',
    'fived_asp_bridge': 'pqr.info/shared/go_sidecar',
    'github.com/pqr-info/pqr-info-swarm/cockpit': 'pqr.info/cockpit',
    'github.com/thealanphipps-del/pqr': 'pqr.info'
}

sorted_prefixes = sorted(module_map.keys(), key=len, reverse=True)

go_files = glob.glob('**/*.go', recursive=True)
count = 0
for file_path in go_files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        for old_mod in sorted_prefixes:
            new_mod = module_map[old_mod]
            new_content = re.sub(rf'\"{re.escape(old_mod)}\"', f'\"{new_mod}\"', new_content)
            new_content = re.sub(rf'\"{re.escape(old_mod)}/', f'\"{new_mod}/', new_content)
            
        if content != new_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Updated imports in {file_path}')
            count += 1
    except Exception as e:
        print(f'Error reading {file_path}: {e}')

print(f"Updated {count} files")
