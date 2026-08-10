package chat

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"
	"pqr.info/internal/service"
)

// APIServer wraps the HTTP handlers for the Chat API
type APIServer struct {
	Orchestrator *ChatOrchestrator
}

func NewAPIServer(swarmSvc *service.SwarmService) *APIServer {
	return &APIServer{
		Orchestrator: NewChatOrchestrator(swarmSvc),
	}
}

func (s *APIServer) ChatHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var req struct {
		Message string `json:"message"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// 1. Create mission
	missionID := fmt.Sprintf("%d_%s", time.Now().UnixNano(), uuid.New().String()[:8])
	s.Orchestrator.StartMission(ctx, missionID)

	// 2. Write user message into Valkey via MCP (SwarmService SyncState)
	s.Orchestrator.SetTicket(ctx, missionID, "1", map[string]interface{}{
		"role":    "user",
		"content": req.Message,
	})

	// 3. Spawn chat agent
	go RunChatAgent(context.Background(), s.Orchestrator.SwarmSvc, missionID)

	// 4. Wait for response
	var reply map[string]interface{}
	for {
		reply = s.Orchestrator.GetTicket(ctx, missionID, "2")
		if reply != nil && reply["content"] != nil && reply["content"] != "" {
			break
		}
		time.Sleep(100 * time.Millisecond)

		// Context cancellation bailout
		select {
		case <-ctx.Done():
			http.Error(w, "Request timed out", http.StatusGatewayTimeout)
			return
		default:
		}
	}

	// 5. Return response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"reply": reply["content"],
	})
}
