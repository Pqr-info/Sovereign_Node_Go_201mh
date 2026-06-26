#!/usr/bin/env bash
# install_swend.sh (Native Linux variant)
# =========================================================================================
# 🌀 SWEND - NATIVE LINUX DAEMON DEPLOYMENT SCRIPT
# =========================================================================================
# Run this script with sudo privileges on your Linux nodes to configure a systemd daemon.
# =========================================================================================

set -e

# Harmonious colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Require root execution
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}[ERROR] Please run this script using sudo or as root.${NC}"
  exit 1
fi

echo -e "${CYAN}=====================================================================${NC}"
echo -e "${CYAN}       🌀 SWEND (SWARM EXECUTION DAEMON) - NATIVE LINUX DEPLOY       ${NC}"
echo -e "${CYAN}=====================================================================${NC}"
echo ""

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
echo -e "${GREEN}[SYSTEM] Mounting install path: ${REPO_DIR}${NC}"
cd "$REPO_DIR"

# 1. Dependency checks
if ! command -v go &> /dev/null; then
    echo -e "${YELLOW}[WARNING] Go runtime is missing. Installing golang package...${NC}"
    apt-get update -y && apt-get install -y golang
fi

# 2. Compile SWEND for Linux
echo -e "${CYAN}[SYSTEM] Compiling SWEND binary...${NC}"
go build -ldflags="-s -w" -o /usr/local/bin/swend-daemon ./cmd/swend/main.go
echo -e "${GREEN}[SUCCESS] swend-daemon binary installed under /usr/local/bin/${NC}"

# 3. Create dedicated system user if not present
if ! id -u swend &>/dev/null; then
    echo -e "${CYAN}[SYSTEM] Creating dedicated user 'swend' for execution containment...${NC}"
    useradd -r -s /bin/false swend
fi

# 4. Copy systemd config unit
SERVICE_SRC="${REPO_DIR}/clients/linux/swend.service"
SERVICE_DST="/etc/systemd/system/swend.service"

if [ ! -f "$SERVICE_SRC" ]; then
    echo -e "${RED}[ERROR] Could not resolve swend.service template at: ${SERVICE_SRC}${NC}"
    exit 1
fi

echo -e "${CYAN}[SYSTEM] Deploying systemd service unit...${NC}"
cp "$SERVICE_SRC" "$SERVICE_DST"

# Apply correct path configuration to the systemd unit
sed -i "s|{{INSTALL_DIR}}|${REPO_DIR}|g" "$SERVICE_DST"

# 5. Reload daemon registry and activate
echo -e "${CYAN}[SYSTEM] Activating swend.service daemon...${NC}"
systemctl daemon-reload
systemctl enable swend.service
systemctl restart swend.service

echo ""
echo -e "${GREEN}=====================================================================${NC}"
echo -e "${GREEN}  ✅ Service deployed! Verify status with: systemctl status swend.service${NC}"
echo -e "${GREEN}=====================================================================${NC}"
