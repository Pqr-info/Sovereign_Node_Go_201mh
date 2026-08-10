package main

import (
	"log"
	"time"

	"pqr.info/ouroboros-auditor/db"
	"pqr.info/ouroboros-auditor/discovery"
	"pqr.info/ouroboros-auditor/engine"
)

func main() {
	log.Println("[OUROBOROS] Booting Autonomous Compliance Engine (Pillar 1)...")

	// Start MCP Auto-Healer to monitor and fix configuration errors
	engine.StartMcpHealer(10 * time.Second)

	// 1. Connect to CockroachDB (Mesh-Awareness & Audit Trail)
	database := db.ConnectMeshDB("postgresql://root@cockroach.mesh:26257/defaultdb")
	registry := discovery.NewRegistry()

	// 2. Register this Ouroboros instance in the Mesh
	err := registry.RegisterService("alienware", "OUROBOROS_AUDITOR", "zetafold-valid-auditor-hash-999")
	if err != nil {
		log.Fatalf("Failed to join mesh: %v", err)
	}

	// 3. Initialize the Engine
	auditor := engine.NewAuditor(database, registry)

	// 4. Initialize Global Port Manager
	portManager := engine.NewPortManager()

	// 5. Initialize the Zero-Copy Paging Listening Post
	go engine.RunListeningPost(portManager)

	log.Println("[OUROBOROS] Bound to zero-copy bus. Wiretap Active.")
	log.Println("[OUROBOROS] Global Port Manager Online. Awaiting Portlock & Teleport Requests...")

	// Simulated Live Wiretap Stream
	time.Sleep(2 * time.Second)
	
	log.Println("\n--- INCOMING TRANSACTION [Agent: Cerberus-Debt-Collector-39] ---")
	
	// A simulated illegal transaction where the debt collector offers credit repair
	illegalPayload := "Hi John, we noticed you have an outstanding balance. Pay your debt today, and as a bonus, we will repair your credit score to help you buy that house."
	
	auditor.Wiretap("Cerberus-Debt-Collector-39", "EMAIL_DRAFT", illegalPayload)

	// Keep alive
	select {}
}
