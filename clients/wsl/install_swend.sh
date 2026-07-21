#!/usr/bin/env bash
# install_swend.sh (WSL variant)
# =========================================================================================
# 🌀 SWEND - WSL AUTO-INSTALLER & SERVICE CONFIGURATION
# =========================================================================================
# Run this script inside your WSL Ubuntu shell to compile and initialize the SWEND daemon.
# =========================================================================================

set -e

# Harmonious colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}=====================================================================${NC}"
echo -e "${CYAN}         🌀 SWEND (SWARM EXECUTION DAEMON) - WSL INSTALLER           ${NC}"
echo -e "${CYAN}=====================================================================${NC}"
echo ""

# 1. Determine Repository Path
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
echo -e "${GREEN}[SYSTEM] Detected repository directory: ${REPO_DIR}${NC}"
cd "$REPO_DIR"

# 2. Check for Go
if ! command -v go &> /dev/null; then
    echo -e "${RED}[ERROR] Go compiler is not installed or not in PATH inside WSL.${NC}"
    echo -e "${YELLOW}Please install it using: sudo apt update && sudo apt install golang -y${NC}"
    exit 1
fi
echo -e "${GREEN}[DETECTED] Go Compiler is available.${NC}"

# 3. Compile the SWEND daemon
echo -e "${CYAN}[SYSTEM] Compiling SWEND binary for Linux...${NC}"
go build -ldflags="-s -w" -o swend-linux ./cmd/swend/main.go
echo -e "${GREEN}[SUCCESS] swend-linux binary compiled successfully!${NC}"

# 4. Create log and runner paths
LOG_DIR="${REPO_DIR}/logs"
mkdir -p "$LOG_DIR"

RUNNER_PATH="${REPO_DIR}/clients/wsl/run_swend.sh"
echo -e "${CYAN}[SYSTEM] Configuring background launcher at: ${RUNNER_PATH}${NC}"

cat << 'EOF' > "$RUNNER_PATH"
#!/usr/bin/env bash
# Automated WSL Swarm execution runner

# 1. Find correct bridging IP (filter out docker loopbacks)
WSL_IP=$(hostname -I | awk '{print $1}')
echo "[WSL Launcher] Resolved WSL IP: $WSL_IP"

# 2. Set environment parameters
export DATABASE_URL="postgresql://root@localhost:26257/antigravity?sslmode=disable"
export VAULT_ADDR="http://localhost:8200"
export SWEND_SWARM_ADDR="localhost:1111"
export SWEND_API_URL="http://localhost:8196"
export NODE_IP="$WSL_IP"

# 3. Execute
cd "$(dirname "$0")/../.."
nohup ./swend-linux menu > ./logs/swend_wsl.log 2>&1 &
echo "[WSL Launcher] SWEND execution daemon launched in background."
EOF

chmod +x "$RUNNER_PATH"

# 5. Launch the daemon
echo -e "${CYAN}[SYSTEM] Executing background launcher...${NC}"
bash "$RUNNER_PATH"

echo ""
echo -e "${GREEN}=====================================================================${NC}"
echo -e "${GREEN}  ✅ WSL Installation Complete! Monitor logs at: ${LOG_DIR}/swend_wsl.log${NC}"
echo -e "${GREEN}=====================================================================${NC}"
