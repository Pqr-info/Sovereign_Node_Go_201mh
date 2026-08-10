package agentbridge

import (
	"context"
	"encoding/json"
	"fmt"
)

// AgentBridge is the high-level interface agents use.
type AgentBridge struct {
	MCP *MCPInvoker
}

// NewAgentBridge constructs a bridge with the MCP invoker already wired.
func NewAgentBridge(mcp *MCPInvoker) *AgentBridge {
	return &AgentBridge{MCP: mcp}
}

// CallTool is the generic helper used by all specific tool helpers.
// It enforces capability naming conventions and wraps the MCP invocation.
func (b *AgentBridge) CallTool(
	ctx context.Context,
	ticketID string,
	capability string,
	toolName string,
	args map[string]interface{},
) (json.RawMessage, error) {

	if b.MCP == nil {
		return nil, fmt.Errorf("MCP invoker not initialized")
	}

	return b.MCP.Invoke(ctx, ticketID, capability, toolName, args)
}

// ConsultMothership queries Gemini Pro/Flash for architectural guidance.
func (b *AgentBridge) ConsultMothership(
	ctx context.Context,
	ticketID string,
	query string,
	model string,
) (json.RawMessage, error) {

	if model == "" {
		model = "gemini-1.5-flash"
	}

	return b.CallTool(ctx, ticketID,
		"sovereign.consult_mothership",
		"consult_mothership",
		map[string]interface{}{
			"query": query,
			"model": model,
		},
	)
}

// StoreMemory persists a memory into CockroachDB.
func (b *AgentBridge) StoreMemory(
	ctx context.Context,
	ticketID string,
	agentID string,
	key string,
	content string,
) (json.RawMessage, error) {

	return b.CallTool(ctx, ticketID,
		"sovereign.store_memory",
		"store_memory",
		map[string]interface{}{
			"agent_id":       agentID,
			"memory_key":     key,
			"memory_content": content,
		},
	)
}

// RetrieveMemory fetches memories for an agent.
func (b *AgentBridge) RetrieveMemory(
	ctx context.Context,
	ticketID string,
	agentID string,
	key string,
) (json.RawMessage, error) {

	args := map[string]interface{}{
		"agent_id": agentID,
	}
	if key != "" {
		args["memory_key"] = key
	}

	return b.CallTool(ctx, ticketID,
		"sovereign.retrieve_memory",
		"retrieve_memory",
		args,
	)
}

// RemoteExecute runs a command on the mesh node.
func (b *AgentBridge) RemoteExecute(
	ctx context.Context,
	ticketID string,
	command string,
	args []string,
) (json.RawMessage, error) {

	return b.CallTool(ctx, ticketID,
		"sovereign.remote_execute",
		"remote_execute",
		map[string]interface{}{
			"command": command,
			"args":    args,
		},
	)
}
