package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"

	"pqr.info/pqrcloud/internal/provision"
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
	port := flag.Int("port", 17352, "PQRCloud management daemon port")
	flag.Parse()

	log.Println("[PQRCLOUDD] Starting PQRCloud Host Management Daemon...")

	token := os.Getenv("HETZNER_API_KEY")
	if token == "" {
		log.Println("Warning: HETZNER_API_KEY environment variable not set. API calls will fail.")
	}

	http.HandleFunc("/provision", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req ProvisionRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		p := provision.NewProvisioner(token, req.KeyPath)
		ip, err := p.CreateNode(req.Name)
		if err != nil {
			http.Error(w, fmt.Sprintf("Provisioning failed: %v", err), http.StatusInternalServerError)
			return
		}

		if err := p.HardenDocker(ip, "root"); err != nil {
			http.Error(w, fmt.Sprintf("Docker hardening failed: %v", err), http.StatusInternalServerError)
			return
		}

		orch := runlevels.NewRunlevelOrchestrator(req.KeyPath)
		if req.ArchivePath != "" {
			if err := orch.RemoteBoot(ip, "root", req.ArchivePath); err != nil {
				http.Error(w, fmt.Sprintf("Remote runlevel boot failed: %v", err), http.StatusInternalServerError)
				return
			}
		}

		resp := ProvisionResponse{
			IP:      ip,
			Status:  "SUCCESS",
			Message: "Node successfully provisioned, hardened, and booted.",
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	})

	log.Printf("[PQRCLOUDD] Listening on port :%d\n", *port)
	if err := http.ListenAndServe(fmt.Sprintf(":%d", *port), nil); err != nil {
		log.Fatalf("Fatal: pqrcloudd failed: %v", err)
	}
}
