package agentbridge

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"
	"pqr.info/internal/domain"
)

type AuditLogger interface {
	AddAudit(ctx context.Context, entry domain.AuditEntry) error
}

type MCPInvoker struct {
	Endpoint string
	Client   *http.Client
	pqr      PQRClient
	manifest ManifestClient
	logger   AuditLogger
}

func NewMCPInvoker(endpoint string, pqr PQRClient, manifest ManifestClient, logger AuditLogger) *MCPInvoker {
	return &MCPInvoker{
		Endpoint: endpoint,
		Client: &http.Client{
			Timeout: 30 * time.Second,
		},
		pqr:      pqr,
		manifest: manifest,
		logger:   logger,
	}
}

type mcpRequest struct {
	JSONRPC string      `json:"jsonrpc"`
	ID      string      `json:"id"`
	Method  string      `json:"method"`
	Params  interface{} `json:"params"`
}

type mcpResponse struct {
	JSONRPC string          `json:"jsonrpc"`
	ID      string          `json:"id"`
	Result  json.RawMessage `json:"result"`
	Error   *mcpError       `json:"error,omitempty"`
}

type mcpError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func (m *MCPInvoker) Invoke(
	ctx context.Context,
	ticketID string,
	capability string,
	toolName string,
	args map[string]interface{},
) (json.RawMessage, error) {

	// 1. Enforce capability gate check using manifest
	services, nlMap, err := m.manifest.GetCapabilities(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to load capabilities: %w", err)
	}

	allowed := false
	for _, s := range services {
		if s == capability {
			allowed = true
			break
		}
	}
	if !allowed {
		for _, v := range nlMap {
			if v == capability {
				allowed = true
				break
			}
		}
	}

	if !allowed {
		return nil, fmt.Errorf("capability '%s' is not permitted by gate", capability)
	}

	// 2. Inject 7-layer context window
	ticketUUID, parseErr := uuid.Parse(ticketID)
	var cw ContextWindow
	if parseErr == nil {
		cw, err = BuildContextWindow(ctx, m.pqr, TicketID(ticketID))
		if err != nil {
			return nil, fmt.Errorf("context window error: %w", err)
		}
	}

	// 3. Construct MCP request
	req := mcpRequest{
		JSONRPC: "2.0",
		ID:      fmt.Sprintf("ticket-%s-%d", ticketID, time.Now().UnixNano()),
		Method:  "tools/call",
		Params: map[string]interface{}{
			"name":      toolName,
			"arguments": args,
			"context":   cw, // <-- full 7-layer context window
		},
	}

	body, _ := json.Marshal(req)

	// 4. Log outbound audit event
	if parseErr == nil && m.logger != nil {
		_ = m.logger.AddAudit(ctx, domain.AuditEntry{
			TicketID: ticketUUID,
			AgentID:  "antigravity-core",
			Action:   fmt.Sprintf("Outbound MCP: %s", toolName),
		})
	}

	// 5. Perform HTTP POST
	httpReq, err := http.NewRequestWithContext(ctx, "POST", m.Endpoint, bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := m.Client.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// 6. Decode response
	var rpc mcpResponse
	if err := json.NewDecoder(resp.Body).Decode(&rpc); err != nil {
		return nil, err
	}

	// 7. Handle MCP error
	if rpc.Error != nil {
		return nil, errors.New(rpc.Error.Message)
	}

	// 8. Log inbound audit event
	if parseErr == nil && m.logger != nil {
		_ = m.logger.AddAudit(ctx, domain.AuditEntry{
			TicketID: ticketUUID,
			AgentID:  "antigravity-core",
			Action:   fmt.Sprintf("Inbound MCP Complete: %s", toolName),
		})
	}

	// 9. Return result
	return rpc.Result, nil
}
