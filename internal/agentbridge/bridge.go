package agentbridge

import (
	"context"
	"fmt"
)

type TicketID string

type AgentInvocation struct {
	AgentID   string
	TicketID  TicketID
	UserInput string
}

type LLMClient interface {
	Chat(ctx context.Context, systemPrompt string, userInput string) (string, error)
}

type Bridge struct {
	pqr      PQRClient
	manifest ManifestClient
	llm      LLMClient
}

func NewBridge(pqr PQRClient, manifest ManifestClient, llm LLMClient) *Bridge {
	return &Bridge{pqr: pqr, manifest: manifest, llm: llm}
}

func (b *Bridge) Handle(ctx context.Context, inv AgentInvocation) (string, error) {
	if inv.TicketID == "" {
		return "", fmt.Errorf("ticket ID is required for execution scoping")
	}

	// 1. Build 7-layer context window from PQR
	window, err := BuildContextWindow(ctx, b.pqr, inv.TicketID)
	if err != nil {
		return "", fmt.Errorf("context window error: %w", err)
	}

	// 2. Build governed system prompt
	systemPrompt, err := BuildGovernedPrompt(ctx, b.manifest, inv.AgentID, inv.TicketID, window)
	if err != nil {
		return "", fmt.Errorf("prompt build error: %w", err)
	}

	// 3. Call LLM
	reply, err := b.llm.Chat(ctx, systemPrompt, inv.UserInput)
	if err != nil {
		return "", fmt.Errorf("llm error: %w", err)
	}

	// 4. Page memory into PQR
	if err := PageMemory(ctx, b.pqr, inv.TicketID, inv.AgentID, systemPrompt, inv.UserInput, reply); err != nil {
		return "", fmt.Errorf("memory paging error: %w", err)
	}

	return reply, nil
}
