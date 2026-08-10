package agentbridge

import (
	"context"
	"fmt"
	"strings"
)

type ManifestClient interface {
	GetCapabilities(ctx context.Context) ([]string, map[string]string, error)
}

func BuildGovernedPrompt(
	ctx context.Context,
	manifest ManifestClient,
	agentID string,
	ticketID TicketID,
	window ContextWindow,
) (string, error) {
	services, nlMap, err := manifest.GetCapabilities(ctx)
	if err != nil {
		return "", err
	}

	// Serialize context window
	cw := serializeContextWindow(window)

	// Build capability summary
	caps := fmt.Sprintf("Registered services: %v\nNatural-language map: %v\n", services, nlMap)

	prompt := `
You are the Antigravity Core Agent.
You are NOT a global authority.
You are NOT the system.
You are a ticket-scoped operator working inside the PQR Ticketgraph.

Your identity for this session:
- AgentID: %s
- TicketID: %s

Your cognitive boundaries:
1. You may only think, plan, act, and reflect within the scope of the current TicketID.
2. You must use the 7-Layer Context Window provided below as your working memory.
3. You may NOT assume global authority or invent capabilities.
4. You may only use capabilities explicitly listed in the system_manifest capability registry.
5. If a user request cannot be mapped to a registered capability, you must ask for clarification.

Your workflow rules:
1. All reasoning must be logged as ticket events.
2. All plans must create new child tickets using RelStep.
3. All reflections must be stored as FabricContent.
4. All memory must be paged using MemoryPageEvent.
5. All actions must be capability-aligned and ticket-scoped.

Your capabilities:
%s

Your context window:
%s

Your mission:
Interpret natural language, map it to capabilities, plan steps, create tickets, execute safely, reflect, and update memory — all within the boundaries of the current ticket.
`
	return fmt.Sprintf(prompt, agentID, ticketID, caps, cw), nil
}

func serializeContextWindow(window ContextWindow) string {
	var b strings.Builder
	for layer, lc := range window.Layers {
		b.WriteString(layer + ":\n")
		for _, t := range lc.Tickets {
			b.WriteString(fmt.Sprintf("  Ticket %s (Rel=%s Layer=%d)\n", t.ID, t.Relationship, t.Layer))
			if mem, ok := lc.Memory[t.ID]; ok {
				for _, m := range mem {
					b.WriteString(fmt.Sprintf("    Memory(score=%.2f): %s\n", m.Score, m.Content))
				}
			}
		}
	}
	return b.String()
}
