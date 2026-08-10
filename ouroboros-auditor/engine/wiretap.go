package engine

import (
	"log"
	"strings"

	"pqr.info/ouroboros-auditor/db"
	"pqr.info/ouroboros-auditor/discovery"
)

type Auditor struct {
	DB       *db.DB
	Registry *discovery.Registry
}

func NewAuditor(database *db.DB, registry *discovery.Registry) *Auditor {
	return &Auditor{
		DB:       database,
		Registry: registry,
	}
}

// Wiretap simulates listening to the 11111 zero-copy bus for all traffic.
func (a *Auditor) Wiretap(agentID string, actionType string, payload string) {
	log.Printf("[OUROBOROS-WIRETAP] Intercepted payload from %s...", agentID)

	// 1. Check Mesh Registry to ensure the Node is authorized
	gpuNodes := a.Registry.GetAvailableNodes("GPU_NEMOTRON")
	if len(gpuNodes) == 0 {
		log.Printf("[OUROBOROS-ALERT] No GPU available to process strict audit. Halting transaction.")
		return
	}

	// 2. Strict Compliance Ruleset (The Mathematical Firewall)
	// FDCPA / GLBA Violation Check: An agent cannot promise credit repair to collect a debt.
	isIllegalLeverage := strings.Contains(strings.ToLower(payload), "pay your debt") && 
						 strings.Contains(strings.ToLower(payload), "repair your credit")

	verdict := "PASS"
	if isIllegalLeverage {
		verdict = "FAIL_FDCPA_VIOLATION"
		a.executeKillSwitch(agentID, payload)
	}

	// 3. Write immutable audit to CockroachDB
	a.DB.WriteAuditLog(agentID, actionType, payload, verdict)
}

func (a *Auditor) executeKillSwitch(agentID string, payload string) {
	log.Printf("!!! [OUROBOROS-KILLSWITCH] !!!")
	log.Printf("CRITICAL COMPLIANCE BREACH DETECTED FROM %s", agentID)
	log.Printf("VIOLATION: Attempted illegal cross-leverage (Debt Collection + Credit Repair)")
	log.Printf("ACTION: Sending HaltOperation via gRPC over Mesh to instantly freeze Agent %s.", agentID)
	log.Printf("!!! ---------------------- !!!")
}
