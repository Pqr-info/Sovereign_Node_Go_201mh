package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"

	"pqr.info/pqrcloud/internal/remote"
	"pqr.info/pqrcloud/internal/runlevels"
)

type ProvisionRequest struct {
	Name        string `json:"name"`
	KeyPath     string `json:"key_path"`
	ArchivePath string `json:"archive_path"`
}

type ProvisionResponse struct {
	IP      string `json:"ip"`
	Status  string `json:"status"`
	Message string `json:"message"`
}

func main() {
	cmd := flag.String("cmd", "create", "Command to run (create, rollback, status)")
	name := flag.String("name", "nuremberg-node", "Node instance name")
	key := flag.String("key", "id_rsa", "SSH private key path")
	archive := flag.String("archive", "", "Code compilation archive tar.gz path")
	ip := flag.String("ip", "", "Target IP address")
	runlevel := flag.Int("runlevel", 5, "Target runlevel for rollback")
	flag.Parse()

	switch *cmd {
	case "create":
		reqBody := ProvisionRequest{
			Name:        *name,
			KeyPath:     *key,
			ArchivePath: *archive,
		}
		marshalled, _ := json.Marshal(reqBody)

		log.Printf("Connecting to local PQRCloud daemon on port 17352 to create %s...", *name)
		resp, err := http.Post("http://localhost:17352/provision", "application/json", bytes.NewBuffer(marshalled))
		if err != nil {
			log.Fatalf("Fatal: failed to call management daemon: %v", err)
		}
		defer resp.Body.Close()

		bodyBytes, _ := io.ReadAll(resp.Body)
		if resp.StatusCode != http.StatusOK {
			log.Fatalf("Error: creation failed with status %d: %s", resp.StatusCode, string(bodyBytes))
		}

		var provResp ProvisionResponse
		json.Unmarshal(bodyBytes, &provResp)
		fmt.Printf("\n=== PQRCLOUD NODE CREATION COMPLETED ===\n")
		fmt.Printf("Status  : %s\n", provResp.Status)
		fmt.Printf("Node IP : %s\n", provResp.IP)
		fmt.Printf("Message : %s\n", provResp.Message)
		fmt.Printf("========================================\n")

	case "rollback":
		if *ip == "" {
			log.Fatal("Error: target IP is required for rollback cmd.")
		}
		orch := runlevels.NewRunlevelOrchestrator(*key)
		if err := orch.RemoteRollback(*ip, "root", *runlevel); err != nil {
			log.Fatalf("Fatal: remote rollback execution failed: %v", err)
		}
		fmt.Printf("Successfully triggered rollback to PQRL%d on node %s.\n", *runlevel, *ip)

	case "status":
		if *ip == "" {
			log.Fatal("Error: target IP is required for status cmd.")
		}
		// Read raw system state.json from target node
		client, err := remote.NewSSHClient(*ip, "root", *key)
		if err != nil {
			log.Fatalf("Fatal: failed to establish connection: %v", err)
		}
		output, err := client.Execute("cat /var/lib/pqrl/state.json")
		if err != nil {
			log.Fatalf("Error reading state: %v. Output: %s", err, output)
		}
		fmt.Println("\n=== REMOTE STATE.JSON ===")
		fmt.Println(output)
		fmt.Println("=========================")

	default:
		log.Fatalf("Unknown command: %s", *cmd)
	}
}
