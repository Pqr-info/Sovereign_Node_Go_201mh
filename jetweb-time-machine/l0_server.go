package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"
)

const PageSize = 16 * 1024 * 1024 // 16MB

type MemoryPage struct {
	ID       string
	Owner    string
	Attached map[string]bool
	Data     []byte
}

type L0Server struct {
	mu           sync.RWMutex
	pages        map[string]*MemoryPage
	teleportLog  []TeleportationLogEntry
	bootInfo     ACSBootInfo
}

var serverInstance *L0Server

func NewL0Server() *L0Server {
	return &L0Server{
		pages:       make(map[string]*MemoryPage),
		teleportLog: make([]TeleportationLogEntry, 0),
		bootInfo: ACSBootInfo{
			Runlevel:       "L0",
			CPUCores:       4,
			RAMMB:          8192,
			ActiveServices: []string{"MemoryBridge", "Telemetry", "ACS"},
		},
	}
}

func sendJSON(w http.ResponseWriter, payload interface{}, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(payload)
}

func sendError(w http.ResponseWriter, msg string) {
	sendJSON(w, map[string]string{"success": "false", "error": msg}, http.StatusBadRequest)
}

func sendSuccess(w http.ResponseWriter, extras map[string]interface{}) {
	payload := map[string]interface{}{"success": "true"}
	for k, v := range extras {
		payload[k] = v
	}
	sendJSON(w, payload, http.StatusOK)
}

func handleAllocatePage(w http.ResponseWriter, r *http.Request) {
	var req AllocatePageRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendError(w, "Invalid JSON payload")
		return
	}

	serverInstance.mu.Lock()
	defer serverInstance.mu.Unlock()

	pageID := fmt.Sprintf("PAGE_%d", time.Now().UnixNano())
	serverInstance.pages[pageID] = &MemoryPage{
		ID:       pageID,
		Owner:    req.AgentID,
		Attached: make(map[string]bool),
		Data:     make([]byte, PageSize),
	}

	sendSuccess(w, map[string]interface{}{
		"page_id":       pageID,
		"initial_owner": req.AgentID,
	})
}

func handleAttachAgent(w http.ResponseWriter, r *http.Request) {
	var req AttachAgentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendError(w, "Invalid JSON payload")
		return
	}

	serverInstance.mu.Lock()
	defer serverInstance.mu.Unlock()

	page, exists := serverInstance.pages[req.PageID]
	if !exists {
		sendError(w, "Page not found")
		return
	}

	page.Attached[req.AgentID] = true
	sendSuccess(w, nil)
}

func handleDetachAgent(w http.ResponseWriter, r *http.Request) {
	var req AttachAgentRequest // same structure
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendError(w, "Invalid JSON payload")
		return
	}

	serverInstance.mu.Lock()
	defer serverInstance.mu.Unlock()

	page, exists := serverInstance.pages[req.PageID]
	if !exists {
		sendError(w, "Page not found")
		return
	}

	delete(page.Attached, req.AgentID)
	sendSuccess(w, nil)
}

func handleSwapAgents(w http.ResponseWriter, r *http.Request) {
	var req SwapAgentsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendError(w, "Invalid JSON payload")
		return
	}

	serverInstance.mu.Lock()
	defer serverInstance.mu.Unlock()

	page, exists := serverInstance.pages[req.PageID]
	if !exists {
		sendError(w, "Page not found")
		return
	}

	if page.Owner != req.AgentA {
		sendError(w, "AgentA is not the current owner")
		return
	}

	// Atomic pointer swap of ownership
	page.Owner = req.AgentB

	serverInstance.teleportLog = append(serverInstance.teleportLog, TeleportationLogEntry{
		PageID:    req.PageID,
		AgentA:    req.AgentA,
		AgentB:    req.AgentB,
		Timestamp: uint64(time.Now().Unix()),
	})

	sendSuccess(w, nil)
}

func handleContextSlice(w http.ResponseWriter, r *http.Request) {
	var req ContextSliceRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendError(w, "Invalid JSON payload")
		return
	}

	serverInstance.mu.RLock()
	defer serverInstance.mu.RUnlock()

	_, exists := serverInstance.pages[req.PageID]
	if !exists {
		sendError(w, "Page not found")
		return
	}

	if req.Length <= 0 || req.Length > PageSize {
		req.Length = PageSize
	}

	// Just return length for now, or actual base64 data if requested.
	// The client expects data_len for telemetry, but realistically we would return base64.
	sendSuccess(w, map[string]interface{}{
		"data_len": req.Length,
	})
}

func handleCommitSlice(w http.ResponseWriter, r *http.Request) {
	var req CommitSliceRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendError(w, "Invalid JSON payload")
		return
	}

	serverInstance.mu.Lock()
	defer serverInstance.mu.Unlock()

	page, exists := serverInstance.pages[req.PageID]
	if !exists {
		sendError(w, "Page not found")
		return
	}

	decoded, err := base64.StdEncoding.DecodeString(req.DataBase64)
	if err != nil {
		sendError(w, "Invalid base64 payload")
		return
	}

	// Copy to the start of the page
	copy(page.Data, decoded)

	sendSuccess(w, nil)
}

func handleTeleportationLog(w http.ResponseWriter, r *http.Request) {
	serverInstance.mu.RLock()
	defer serverInstance.mu.RUnlock()

	sendJSON(w, TeleportationLog{Entries: serverInstance.teleportLog}, http.StatusOK)
}

func handleACSStatus(w http.ResponseWriter, r *http.Request) {
	serverInstance.mu.RLock()
	defer serverInstance.mu.RUnlock()

	sendJSON(w, serverInstance.bootInfo, http.StatusOK)
}

func StartL0Server(port string) {
	serverInstance = NewL0Server()

	mux := http.NewServeMux()
	mux.HandleFunc("/allocate_page", handleAllocatePage)
	mux.HandleFunc("/attach_agent", handleAttachAgent)
	mux.HandleFunc("/detach_agent", handleDetachAgent)
	mux.HandleFunc("/swap_agents", handleSwapAgents)
	mux.HandleFunc("/context_slice", handleContextSlice)
	mux.HandleFunc("/commit_slice", handleCommitSlice)
	mux.HandleFunc("/teleportation_log", handleTeleportationLog)
	mux.HandleFunc("/acs_status", handleACSStatus)

	log.Printf("[L0 Server] Listening on %s...", port)
	if err := http.ListenAndServe(port, mux); err != nil {
		log.Fatalf("L0 Server failed: %v", err)
	}
}
