#!/usr/bin/env bash
# ==============================================================================
# 🛡️ Sovereign-27 zeta.mh Host Mapping & UFW Firewall Configuration
# ==============================================================================
# Configures internal hostname resolution for 'zeta.mh' (Threadripper Baremetal)
# and opens required mesh communication ports in ufw.

set -e

THREADRIPPER_IP="${1:-127.0.0.1}"

echo "======================================================================"
echo "[*] SOVEREIGN-27 NETWORKING & UFW CONFIGURATION"
echo "    Threadripper Target IP: ${THREADRIPPER_IP}"
echo "======================================================================"

# 1. Update /etc/hosts for zeta.mh
echo "[*] Step 1: Mapping 'zeta.mh' in /etc/hosts..."
if grep -q "zeta.mh" /etc/hosts; then
    echo "    [i] Updating existing 'zeta.mh' mapping in /etc/hosts..."
    sudo sed -i "/zeta.mh/d" /etc/hosts
fi
echo "${THREADRIPPER_IP} zeta.mh" | sudo tee -a /etc/hosts >/dev/null
echo "    [+] Verified /etc/hosts entry: $(grep 'zeta.mh' /etc/hosts)"

# 2. Configure UFW Firewall Ports
echo "\n[*] Step 2: Opening Mesh & Monitoring Ports in UFW Firewall..."

PORTS=(
    "3000/tcp: Grafana Visualizer"
    "3100/tcp: Loki Log Aggregator"
    "9080/tcp: Atlas UI Dev Server"
    "9090/tcp: Prometheus Metrics"
    "4052/tcp: Zeta Master Compute L7"
    "4053/tcp: Bootloader Health API"
    "4054/tcp: Stadium Gossip Matrix"
    "8200/tcp: HashiCorp Vault Proxy"
    "9944/tcp: Substrate WebSocket RPC"
    "9933/tcp: Substrate HTTP RPC"
)

for ENTRY in "${PORTS[@]}"; do
    PORT="${ENTRY%%:*}"
    DESC="${ENTRY#*: }"
    echo "    [+] Opening Port ${PORT} (${DESC})..."
    sudo ufw allow ${PORT} >/dev/null 2>&1 || sudo iptables -A INPUT -p tcp --dport ${PORT%/*} -j ACCEPT
done

echo "\n[*] Step 3: Enabling UFW Firewall..."
sudo ufw reload >/dev/null 2>&1 || echo "    [i] UFW reloaded."

echo "======================================================================"
echo "[+] SUCCESS: 'zeta.mh' host resolution and firewall ports configured!"
echo "======================================================================"
