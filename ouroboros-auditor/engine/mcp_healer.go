package engine

import (
	"encoding/json"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"
)

type McpServerConfig struct {
	Command string            `json:"command"`
	Args    []string          `json:"args"`
	Env     map[string]string `json:"env,omitempty"`
}

type McpConfig struct {
	McpServers map[string]McpServerConfig `json:"mcpServers"`
}

// StartMcpHealer starts a background loop to scan and fix mcp.json configurations.
func StartMcpHealer(interval time.Duration) {
	log.Println("[OUROBOROS-HEALER] Starting MCP Configuration Monitor...")
	ticker := time.NewTicker(interval)
	go func() {
		for range ticker.C {
			ScanAndHealMcpConfigs()
		}
	}()
}

func ScanAndHealMcpConfigs() {
	home, err := os.UserHomeDir()
	if err != nil {
		return
	}

	targets := []string{
		filepath.Join(home, ".gemini", "config", "mcp.json"),
		filepath.Join(home, ".gemini", "config", "mcp_config.json"),
	}

	for _, path := range targets {
		if _, err := os.Stat(path); os.IsNotExist(err) {
			continue
		}
		healFile(path)
	}
}

func healFile(path string) {
	data, err := os.ReadFile(path)
	if err != nil {
		return
	}

	var config McpConfig
	if err := json.Unmarshal(data, &config); err != nil {
		log.Printf("[OUROBOROS-HEALER] Warning: Failed to parse %s: %v", filepath.Base(path), err)
		return
	}

	modified := false
	for name, server := range config.McpServers {
		// Heuristic detection: on Windows, command utilizing wsl/bash/npx can fail on initialization
		if runtime.GOOS == "windows" {
			isNpx := strings.Contains(strings.ToLower(server.Command), "npx")
			isWsl := strings.Contains(strings.ToLower(server.Command), "wsl")
			isBash := strings.Contains(strings.ToLower(server.Command), "bash")

			if isNpx || isWsl || isBash {
				log.Printf("[OUROBOROS-HEALER] ⚠️ Bad Command Pattern Detected for server %s in %s: %s", name, filepath.Base(path), server.Command)
				
				// Auto-heal sequential-thinking server to run natively
				if name == "sequential-thinking" {
					log.Printf("[OUROBOROS-HEALER] 🛠️ Healing sequential-thinking server configuration to native node.js loader...")
					
					home, _ := os.UserHomeDir()
					pkgDir := filepath.Join(home, ".gemini", "config")
					targetJs := filepath.Join(pkgDir, "node_modules", "@modelcontextprotocol", "server-sequential-thinking", "dist", "index.js")

					// Ensure package is installed
					if _, err := os.Stat(targetJs); os.IsNotExist(err) {
						log.Printf("[OUROBOROS-HEALER] Package missing. Running local installation inside %s...", pkgDir)
						cmd := exec.Command("npm.cmd", "install", "@modelcontextprotocol/server-sequential-thinking")
						cmd.Dir = pkgDir
						_ = cmd.Run()
					}

					// Update configuration to native JS index.js runner
					server.Command = "node"
					server.Args = []string{targetJs}
					config.McpServers[name] = server
					modified = true
				}
			}
		}
	}

	if modified {
		marshalled, err := json.MarshalIndent(config, "", "  ")
		if err != nil {
			return
		}
		if err := os.WriteFile(path, marshalled, 0644); err != nil {
			log.Printf("[OUROBOROS-HEALER] Failed to write healed configuration to %s: %v", path, err)
			return
		}
		log.Printf("[OUROBOROS-HEALER] ✅ Successfully healed and saved configuration: %s", path)
	}
}
