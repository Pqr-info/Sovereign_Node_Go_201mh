package chat

import (
	"context"
	"fmt"
	"log"

	"pqr.info/internal/service"
)

// ChatOrchestrator handles the mission lifecycle and Valkey state for the chat
type ChatOrchestrator struct {
	SwarmSvc *service.SwarmService
}

func NewChatOrchestrator(swarmSvc *service.SwarmService) *ChatOrchestrator {
	return &ChatOrchestrator{
		SwarmSvc: swarmSvc,
	}
}

// StartMission sets the initial mission state
func (o *ChatOrchestrator) StartMission(ctx context.Context, missionID string) {
	stateKey := fmt.Sprintf("mission:%s:state", missionID)
	
	_, err := o.SwarmSvc.SyncState(ctx, "chat", "orchestrator", "api", "rest", map[string]interface{}{
		stateKey: map[string]interface{}{
			"status": "started",
			"type":   "chat",
		},
	})

	if err != nil {
		log.Printf("[Orchestrator] Error starting mission %s: %v", missionID, err)
	}
}

// SetTicket writes a ticket to Valkey
func (o *ChatOrchestrator) SetTicket(ctx context.Context, missionID string, ticketID string, data map[string]interface{}) {
	key := fmt.Sprintf("mission:%s:ticket:%s", missionID, ticketID)
	_, err := o.SwarmSvc.SyncState(ctx, "chat", "orchestrator", "api", "rest", map[string]interface{}{
		key: data,
	})
	if err != nil {
		log.Printf("[Orchestrator] Error setting ticket %s for mission %s: %v", ticketID, missionID, err)
	}
}

// GetTicket reads a ticket from Valkey
func (o *ChatOrchestrator) GetTicket(ctx context.Context, missionID string, ticketID string) map[string]interface{} {
	key := fmt.Sprintf("mission:%s:ticket:%s", missionID, ticketID)
	snap, err := o.SwarmSvc.GetState(ctx, "chat", "orchestrator")
	if err != nil {
		return nil
	}

	if val, ok := snap.Payload[key]; ok {
		if data, ok := val.(map[string]interface{}); ok {
			return data
		}
	}
	return nil
}
