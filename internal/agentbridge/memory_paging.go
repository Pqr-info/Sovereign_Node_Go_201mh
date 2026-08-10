package agentbridge

import (
	"context"
	"time"
)

type MemoryPageEvent struct {
	AgentID   string
	TicketID  TicketID
	System    string
	User      string
	Reply     string
	Timestamp time.Time
}

func PageMemory(
	ctx context.Context,
	pqr PQRClient,
	ticketID TicketID,
	agentID string,
	systemPrompt string,
	userInput string,
	reply string,
) error {
	evt := MemoryPageEvent{
		AgentID:   agentID,
		TicketID:  ticketID,
		System:    systemPrompt,
		User:      userInput,
		Reply:     reply,
		Timestamp: time.Now(),
	}
	return pqr.StoreMemoryEvent(ctx, evt)
}
