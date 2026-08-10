package provision

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"pqr.info/pqrcloud/internal/remote"
)

type HetznerCreateRequest struct {
	Name       string   `json:"name"`
	ServerType string   `json:"server_type"`
	Image      string   `json:"image"`
	Location   string   `json:"location"`
	SshKeys    []string `json:"ssh_keys"`
}

type HetznerCreateResponse struct {
	Server struct {
		ID         int    `json:"id"`
		Name       string `json:"name"`
		Status     string `json:"status"`
		PublicNet  struct {
			IPv4 struct {
				IP string `json:"ip"`
			} `json:"ipv4"`
		} `json:"public_net"`
	} `json:"server"`
	Action struct {
		ID     int    `json:"id"`
		Status string `json:"status"`
	} `json:"action"`
}

type Provisioner struct {
	HetznerToken string
	SSHKeyPath   string
}

func NewProvisioner(token, sshKeyPath string) *Provisioner {
	return &Provisioner{
		HetznerToken: token,
		SSHKeyPath:   sshKeyPath,
	}
}

func (p *Provisioner) CreateNode(name string) (string, error) {
	log.Printf("[PQRCLOUD] Initiating Hetzner Cloud VM creation: %s...", name)

	reqBody := HetznerCreateRequest{
		Name:       name,
		ServerType: "cx21", // 2 vCPU, 4GB RAM VPS
		Image:      "ubuntu-22.04",
		Location:   "nbg1", // Nuremberg
	}

	marshalled, err := json.Marshal(reqBody)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", "https://api.hetzner.cloud/v1/servers", bytes.NewBuffer(marshalled))
	if err != nil {
		return "", err
	}

	req.Header.Set("Authorization", "Bearer "+p.HetznerToken)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to call Hetzner Cloud API: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("Hetzner API returned status %d: %s", resp.StatusCode, string(bodyBytes))
	}

	var createResp HetznerCreateResponse
	if err := json.NewDecoder(resp.Body).Decode(&createResp); err != nil {
		return "", err
	}

	ip := createResp.Server.PublicNet.IPv4.IP
	log.Printf("[PQRCLOUD] VM created successfully. Server ID: %d, Allocated IP: %s", createResp.Server.ID, ip)

	// Wait for VM to boot up and port 22 to be listening
	log.Println("[PQRCLOUD] Waiting for SSH port to open...")
	time.Sleep(15 * time.Second)

	return ip, nil
}

func (p *Provisioner) HardenDocker(ip, user string) error {
	log.Printf("[PQRCLOUD] Connecting to host %s to install and harden Docker...", ip)
	
	client, err := remote.NewSSHClient(ip, user, p.SSHKeyPath)
	if err != nil {
		return fmt.Errorf("failed to establish SSH connection: %w", err)
	}

	// Install Docker and apply secure sysctl limits
	commands := []string{
		"sudo apt-get update && sudo apt-get install -y docker.io",
		"sudo mkdir -p /etc/docker",
		"echo '{\"icc\":false,\"no-new-privileges\":true}' | sudo tee /etc/docker/daemon.json",
		"sudo systemctl restart docker",
		"sudo sysctl -w fs.file-max=2097152",
		"sudo sysctl -w vm.max_map_count=262144",
	}

	for _, cmd := range commands {
		log.Printf("[PQRCLOUD] Executing: %s", cmd)
		output, err := client.Execute(cmd)
		if err != nil {
			return fmt.Errorf("command execution failed (%s): %w. Output: %s", cmd, err, output)
		}
	}

	log.Println("[PQRCLOUD] Docker environment successfully installed and hardened.")
	return nil
}
