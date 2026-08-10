package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"sync"
	"time"
)

const (
	backchannelPath = ".copilot_backchannel.json"
	port            = 17351
)

type WorkspaceContext struct {
	Workspace       string `json:"workspace"`
	ActiveFile      string `json:"active_file"`
	ActiveAgent     string `json:"active_agent"`
	ActiveRunlevel  string `json:"active_runlevel"`
	ActiveContainer string `json:"active_container"`
}

type BackchannelState struct {
	SyncVersion         string                 `json:"sync_version"`
	LastUpdated         string                 `json:"last_updated"`
	ActiveAgent         string                 `json:"active_agent"`
	Platform            string                 `json:"platform"`
	TargetHost          string                 `json:"target_host"`
	CurrentRunlevel     string                 `json:"current_runlevel"`
	RunlevelStatus      map[string]string      `json:"runlevel_status"`
	FsmState            string                 `json:"fsm_state"`
	WorkspaceState      map[string]interface{} `json:"workspace_state"`
	LastActionPerformed string                 `json:"last_action_performed"`
	NextBlockingStep    string                 `json:"next_blocking_step"`
	Messages            []map[string]interface{} `json:"messages,omitempty"`
	
	// AG-BCP/1.1 Additions
	Owner              string            `json:"owner"`
	CopilotSync        bool              `json:"copilot_sync"`
	Context            WorkspaceContext  `json:"context"`
	CopilotLastMessage string            `json:"copilot_last_message,omitempty"`
	VscodeHook         string            `json:"vscode_hook"`
	Intent             interface{}       `json:"intent,omitempty"`
	Heartbeat          bool              `json:"heartbeat,omitempty"`
}

type BCPServer struct {
	mu    sync.Mutex
	state BackchannelState
}

func main() {
	log.Println("[AG-BCP/1.1] Booting Backchannel Continuity Protocol Daemon...")

	server := &BCPServer{}
	if err := server.loadState(); err != nil {
		log.Printf("Warning: failed to load initial state: %v. Initializing default schema.", err)
		server.state = BackchannelState{
			SyncVersion: "1.1.0",
			ActiveAgent: "Antigravity/Gemini",
			Platform:    "Windows-Local",
			FsmState:    "READY",
			Owner:       "bcpd",
			VscodeHook:  "http://localhost:17351/update",
			Context: WorkspaceContext{
				Workspace:       "D:\\pqr.info",
				ActiveFile:      "cmd/bcpd/main.go",
				ActiveAgent:     "bcpd",
				ActiveRunlevel:  "PQRL7",
				ActiveContainer: "mesh-adapter",
			},
		}
	}

	// Ensure correct schema fields are set on boot
	server.state.Owner = "bcpd"
	server.state.VscodeHook = "http://localhost:17351/update"
	_ = server.saveState()

	// 1. Start Heartbeat Broadcast Loop (5 seconds)
	go server.startHeartbeatLoop()

	// 2. Start Input Intent Poller Loop (1-2 seconds)
	go server.startIntentPollerLoop()

	// 3. Register HTTP handlers
	http.HandleFunc("/state", server.handleGetState)
	http.HandleFunc("/update", server.handlePostUpdate)
	http.HandleFunc("/ping", server.handlePing)

	log.Printf("[AG-BCP/1.1] Continuity Server listening on http://localhost:%d\n", port)
	if err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil); err != nil {
		log.Fatalf("Fatal: BCP server failed: %v", err)
	}
}

func (s *BCPServer) loadState() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	data, err := os.ReadFile(backchannelPath)
	if err != nil {
		return err
	}
	return json.Unmarshal(data, &s.state)
}

func (s *BCPServer) saveState() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.state.LastUpdated = time.Now().UTC().Format(time.RFC3339)
	data, err := json.MarshalIndent(s.state, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(backchannelPath, data, 0644)
}

func (s *BCPServer) handleGetState(w http.ResponseWriter, r *http.Request) {
	_ = s.loadState()

	s.mu.Lock()
	data, err := json.Marshal(s.state)
	s.mu.Unlock()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(data)
}

func (s *BCPServer) handlePostUpdate(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	s.mu.Lock()
	err = json.Unmarshal(body, &s.state)
	s.mu.Unlock()

	if err != nil {
		http.Error(w, "Invalid JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Enforce ownership rules on write
	s.state.Owner = "bcpd"

	if err := s.saveState(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte(`{"status":"updated"}`))
}

func (s *BCPServer) handlePing(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte("pong"))
}

func (s *BCPServer) startHeartbeatLoop() {
	ticker := time.NewTicker(5 * time.Second)
	for range ticker.C {
		s.mu.Lock()
		s.state.Heartbeat = true
		s.state.CopilotSync = true
		s.state.LastUpdated = time.Now().UTC().Format(time.RFC3339)
		s.mu.Unlock()

		if err := s.saveState(); err != nil {
			log.Printf("[AG-BCP/1.1] Heartbeat write failed: %v", err)
		}
	}
}

func (s *BCPServer) startIntentPollerLoop() {
	ticker := time.NewTicker(2 * time.Second)
	for range ticker.C {
		// Read external updates from file
		var fileState BackchannelState
		data, err := os.ReadFile(backchannelPath)
		if err != nil {
			continue
		}

		if err := json.Unmarshal(data, &fileState); err != nil {
			continue
		}

		if fileState.Intent != nil && fileState.Intent != "" {
			log.Printf("[AG-BCP/1.1] Intent Detected: %v", fileState.Intent)
			
			// Echo last message context if provided inside intent description
			if m, ok := fileState.Intent.(map[string]interface{}); ok {
				if msg, exists := m["message"].(string); exists {
					s.mu.Lock()
					s.state.CopilotLastMessage = msg
					s.mu.Unlock()
				}
			}

			// Clear intent to prevent infinite loops (intent -> null)
			s.mu.Lock()
			s.state = fileState
			s.state.Intent = nil
			s.state.Owner = "bcpd"
			s.mu.Unlock()
			_ = s.saveState()
		}
	}
}

