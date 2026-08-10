#!/usr/bin/env python3
import urllib.request
import json
import os
import subprocess

HCLOUD_TOKEN = os.environ.get('HCLOUD_TOKEN', 'NWp5z8GM8t5ufitsknndPyrsk62W7uIn27cIiv5cURKWAGxzTkmpw9LfpyR9S2ww')

req = urllib.request.Request('https://api.hetzner.cloud/v1/servers')
req.add_header('Authorization', f'Bearer {HCLOUD_TOKEN}')

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
except Exception as e:
    print(f"Error fetching from hcloud API: {e}")
    exit(1)

zone_lines = [
    "$ORIGIN pqr.info.",
    "@   3600 IN SOA zeta.pqr.info. admin.pqr.info. (",
    "                2026080601 ; serial",
    "                7200       ; refresh",
    "                3600       ; retry",
    "                1209600    ; expire",
    "                3600       ; minimum",
    ")",
    "@   3600 IN NS zeta.pqr.info.",
    "zeta 3600 IN A 176.9.116.146",
    "max  3600 IN A 192.168.12.234",
    "ted  3600 IN A 10.240.18.54"
]

for srv in data.get('servers', []):
    name = srv['name']
    ip = srv['public_net']['ipv4']['ip']
    zone_lines.append(f"{name} 3600 IN A {ip}")

zone_content = "\n".join(zone_lines) + "\n"

with open('/etc/coredns/pqr.info.db', 'w') as f:
    f.write(zone_content)

print("Updated /etc/coredns/pqr.info.db")
subprocess.run(['systemctl', 'restart', 'coredns'])
print("Restarted CoreDNS")
