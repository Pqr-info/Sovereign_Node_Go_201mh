package agentbridge

import (
	"context"
	"testing"
)

// Mocks
type mockPQR struct {
	storedEvt *MemoryPageEvent
}

func (m *mockPQR) GetTicket(ctx context.Context, id TicketID) (Ticket, error) {
	return Ticket{ID: id, Relationship: "local", Layer: 2}, nil
}
func (m *mockPQR) GetParent(ctx context.Context, id TicketID) (Ticket, bool, error) {
	return Ticket{}, false, nil
}
func (m *mockPQR) GetChildren(ctx context.Context, id TicketID) ([]Ticket, error) {
	return nil, nil
}
func (m *mockPQR) GetMemory(ctx context.Context, id TicketID) ([]MemoryBlock, error) {
	return []MemoryBlock{{Content: "Mock Memory Content", Score: 0.99}}, nil
}
func (m *mockPQR) StoreMemoryEvent(ctx context.Context, evt MemoryPageEvent) error {
	m.storedEvt = &evt
	return nil
}

type mockManifest struct{}

func (m *mockManifest) GetCapabilities(ctx context.Context) ([]string, map[string]string, error) {
	return []string{"health_check"}, map[string]string{"check": "health_check"}, nil
}

type mockLLM struct{}

func (m *mockLLM) Chat(ctx context.Context, systemPrompt string, userInput string) (string, error) {
	return "Mock Reply content", nil
}

func TestBridgeHandleSuccess(t *testing.T) {
	pqr := &mockPQR{}
	manifest := &mockManifest{}
	llm := &mockLLM{}
	b := NewBridge(pqr, manifest, llm)

	inv := AgentInvocation{
		AgentID:   "test-agent",
		TicketID:  "ticket-123",
		UserInput: "Verify system health.",
	}

	reply, err := b.Handle(context.Background(), inv)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if reply != "Mock Reply content" {
		t.Errorf("Expected reply 'Mock Reply content', got '%s'", reply)
	}

	if pqr.storedEvt == nil {
		t.Fatal("Expected memory to be paged, got nil stored event")
	}

	if pqr.storedEvt.User != inv.UserInput {
		t.Errorf("Expected paged UserInput '%s', got '%s'", inv.UserInput, pqr.storedEvt.User)
	}
}

func TestBridgeHandleMissingTicket(t *testing.T) {
	b := NewBridge(&mockPQR{}, &mockManifest{}, &mockLLM{})
	inv := AgentInvocation{
		AgentID:   "test-agent",
		UserInput: "Verify system health.",
	}

	_, err := b.Handle(context.Background(), inv)
	if err == nil {
		t.Fatal("Expected error due to missing ticket ID, got nil")
	}
}

func TestValidateActions(t *testing.T) {
	manifest := &mockManifest{}

	err := ValidatePlannedActions(context.Background(), manifest, []string{"health_check"})
	if err != nil {
		t.Fatalf("Expected validation to pass, got %v", err)
	}

	err = ValidatePlannedActions(context.Background(), manifest, []string{"unauthorized_action"})
	if err == nil {
		t.Fatal("Expected validation to fail on unauthorized action, got nil")
	}
}
