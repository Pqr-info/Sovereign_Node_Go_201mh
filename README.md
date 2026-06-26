# 🌀 SWEND: Swarm Execution Node Daemon

The master repository for the **SWEND** stack under [pqr.info](file:///C:/Users/theal/pqr.info).

This repository houses the core Go-based execution daemon, cross-platform client installers (Windows, WSL, Linux, and Android), Model Context Protocol (MCP) tool integrations, and system documentation.

---

## 📂 Repository Structure

* **`cmd/swend/`**: Main entry point for the Swarm Execution Node Daemon binary.
* **`internal/`**: Core logic for task execution, database persistence, and TUI layouts.
* **`clients/`**: Cross-platform bootstrapping and setup scripts:
  * **`windows/`**: Elevated PowerShell task scheduler installers.
  * **`wsl/`**: WSL IP mapping and background execution loops.
  * **`linux/`**: systemd system service unit templates and shell setups.
  * **`android/`**: Kotlin client stubs for mobile node integration.
* **`mcp/`**: Python stubs and example tools for Model Context Protocol integrations.
* **`docs/`**: Integrated Wiki covering architecture, protocols, and troubleshooting.

---

## ⚡ Quick Start

### 1. Windows Host Setup
Run the following inside an **elevated (Administrator) PowerShell session**:
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
cd C:\Users\theal\pqr.info\clients\windows
.\install_swend.ps1
```
This automatically compiles `swend.exe` and registers it as a background task.

### 2. WSL Environment Setup
From your WSL terminal:
```bash
chmod +x C:\Users\theal\pqr.info\clients\wsl\install_swend.sh
/usr/bin/env bash C:\Users\theal\pqr.info\clients\wsl\install_swend.sh
```

### 3. Native Linux Node Installation
Run as `root` or using `sudo`:
```bash
sudo chmod +x ./clients/linux/install_swend.sh
sudo ./clients/linux/install_swend.sh
```

---

## 🛠️ CLI Operations Reference

The `swend` binary accepts several control arguments:

* **`swend genesis` / `swend install`**: Installs local schema and writes the genesis snapshot to CockroachDB.
* **`swend monitor`**: Launches the terminal user interface (TUI) for local execution tracing.
* **`swend rt list`**: Lists all active tickets in the ticketing memory database.
* **`swend rt show <ticket-id>`**: Inspects a specific ticket and its corresponding intent metadata.
* **`swend goback --last`**: Undoes the last consensus state mutation.
* **`swend goback --to <timestamp>`**: Rewinds the state ledger to a specific historic checkpoint.

---

## 🧠 Model Context Protocol (MCP) Integration

Expose SWEND state to your AI assistant by registering the tool hub:

1. **Install python dependencies**:
   ```bash
   pip install mcp psycopg2-binary
   ```
2. **Review configuration settings** at `mcp/mcp_config.json`.
3. **Run the example tool consumer**:
   ```bash
   python mcp/example_agent_tool.py
   ```
