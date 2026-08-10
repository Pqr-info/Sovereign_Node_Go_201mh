package engine

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

// MutationRequest matches the expected format for the Go Mesh sidecar ticket endpoint.
type MutationRequest struct {
	Proposer string `json:"proposer"`
	Key      string `json:"key"`
	Value    string `json:"value"`
	Reason   string `json:"reason"`
}

// RunListeningPost starts a non-blocking background daemon that listens for zero-copy
// memory paging and atomic socket handoffs, automatically syncing the ledger.
func RunListeningPost(pm *PortManager) {
	log.Println("[LISTENING POST] Automated ticket sync daemon initialized.")
	
	// Create a robust, reusable HTTP client for ledger updates.
	client := &http.Client{
		Timeout: 5 * time.Second, // Prevent hanging if the sidecar drops
	}

	for {
		select {
		case event, ok := <-pm.SwapEventBus:
			if !ok {
				log.Println("[LISTENING POST] Swap event bus closed. Shutting down daemon.")
				return
			}
			
			go handleSwapEvent(client, event)
		}
	}
}

// handleSwapEvent processes a single swap event asynchronously to avoid blocking the bus.
func handleSwapEvent(client *http.Client, event SwapEvent) {
	log.Printf("[LISTENING POST] Detected %s for Agent %s. Initiating automated ledger sync.", event.SwapType, event.AgentID)

	// In a real system, the target key would be dynamic based on the active CognitiveSessionManifest
	ticketKey := fmt.Sprintf("CSM_%s_LIVE_LOC", event.AgentID)
	
	// Construct the mutation value
	stateUpdate := map[string]interface{}{
		"agent_id":        event.AgentID,
		"swap_type":       event.SwapType,
		"timestamp":       event.Timestamp,
		"compute_minutes": event.ComputeMinutes,
		"status":          "PHASE_SHIFT_COMPLETE",
	}
	
	valueJSON, err := json.Marshal(stateUpdate)
	if err != nil {
		log.Printf("[LISTENING POST] Error marshaling state update: %v", err)
		return
	}

	mutation := MutationRequest{
		Proposer: "ouroboros-auditor",
		Key:      ticketKey,
		Value:    string(valueJSON),
		Reason:   fmt.Sprintf("Automated Ticket Sync: %s (Logged %.2f compute minutes)", event.SwapType, event.ComputeMinutes),
	}

	payload, err := json.Marshal(mutation)
	if err != nil {
		log.Printf("[LISTENING POST] Error marshaling mutation payload: %v", err)
		return
	}

	req, err := http.NewRequest("POST", "http://127.0.0.1:8085/api/v2/tickets", bytes.NewBuffer(payload))
	if err != nil {
		log.Printf("[LISTENING POST] Error constructing HTTP request: %v", err)
		return
	}
	req.Header.Set("Content-Type", "application/json")

	// Fire and forget (with timeout protection from the client)
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("[LISTENING POST] ERROR: Sidecar unresponsive during ticket sync. Is port 8085 down? (%v)", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		log.Printf("[LISTENING POST] Successfully committed zero-copy page mutation for %s to the mesh ledger.", event.AgentID)
	} else {
		body, _ := ioutil.ReadAll(resp.Body)
		log.Printf("[LISTENING POST] WARNING: Mesh ledger rejected the ticket update. Status: %s. Response: %s", resp.Status, string(body))
	}
}
