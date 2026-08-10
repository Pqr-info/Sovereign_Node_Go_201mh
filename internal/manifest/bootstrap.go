package manifest

import (
	"encoding/json"
	"fmt"
	"net"
	"os/exec"
)

type ManifestStruct struct {
	NetworkTopology struct {
		Ports map[string]int `json:"ports"`
	} `json:"network_topology"`
}

// CheckPortAvailable verifies if a local port is open or already bound.
func CheckPortAvailable(port int) bool {
	listener, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		return false
	}
	listener.Close()
	return true
}

// BootstrapFromManifest reads the system configuration and validates system readiness.
func BootstrapFromManifest(manifestData []byte) error {
	var m ManifestStruct
	if err := json.Unmarshal(manifestData, &m); err != nil {
		return fmt.Errorf("failed to parse manifest for bootstrap: %w", err)
	}

	// Validate ports
	for name, port := range m.NetworkTopology.Ports {
		// We expect cockroachdb to be bound, other ports should either be available or bound correctly
		if name != "cockroachdb" && name != "lmstudio" {
			if !CheckPortAvailable(port) {
				fmt.Printf("[Warning] Port %d for service %s is already bound. Check for conflicts.\n", port, name)
			} else {
				fmt.Printf("[Info] Port %d for service %s is available.\n", port, name)
			}
		}
	}

	return nil
}

// RestartLocalService executes systemctl to restart a target service in Linux/WSL.
func RestartLocalService(serviceName string) error {
	cmd := exec.Command("sudo", "systemctl", "restart", serviceName)
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("failed to restart service %s: %w", serviceName, err)
	}
	return nil
}
