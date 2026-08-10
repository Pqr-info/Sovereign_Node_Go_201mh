package service

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"pqr.info/internal/domain"
)

type stateSyncRepo struct {
	states   map[string]domain.StateSnapshot
	messages []domain.AgentMessage
}

func (r *stateSyncRepo) UpsertState(ctx context.Context, scope, owner, agentID, source string, payload map[string]interface{}, checksum string) (domain.StateSnapshot, error) {
	snap := domain.StateSnapshot{Scope: scope, Owner: owner, AgentID: agentID, Source: source, Payload: payload, Checksum: checksum}
	if r.states == nil {
		r.states = make(map[string]domain.StateSnapshot)
	}
	r.states[scope+":"+owner] = snap
	return snap, nil
}

func (r *stateSyncRepo) GetState(ctx context.Context, scope, owner string) (*domain.StateSnapshot, error) {
	snap, ok := r.states[scope+":"+owner]
	if !ok {
		return nil, context.Canceled
	}
	return &snap, nil
}

func (r *stateSyncRepo) SendMessage(ctx context.Context, scope, sender, receiver, kind, body string, payload map[string]interface{}) (domain.AgentMessage, error) {
	msg := domain.AgentMessage{ID: uuid.New(), Scope: scope, Sender: sender, Receiver: receiver, Kind: kind, Body: body, Payload: payload}
	r.messages = append(r.messages, msg)
	return msg, nil
}

func (r *stateSyncRepo) ListMessages(ctx context.Context, scope, receiver string) ([]domain.AgentMessage, error) {
	var out []domain.AgentMessage
	for _, msg := range r.messages {
		if msg.Scope == scope && msg.Receiver == receiver {
			out = append(out, msg)
		}
	}
	return out, nil
}

func (r *stateSyncRepo) CreateTicket(ctx context.Context, ticket *domain.FabricTicket, content *domain.FabricContent) error {
	return nil
}
func (r *stateSyncRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.FabricTicket, *domain.FabricContent, error) {
	return nil, nil, nil
}
func (r *stateSyncRepo) Update(ctx context.Context, id uuid.UUID, status string, title string) error {
	return nil
}
func (r *stateSyncRepo) UpdateIteration(ctx context.Context, id uuid.UUID, iteration int, escalation int, status string) error {
	return nil
}
func (r *stateSyncRepo) Link(ctx context.Context, parentID, childID uuid.UUID, relType domain.RelationshipType) error {
	return nil
}
func (r *stateSyncRepo) ListRecent(ctx context.Context, limit int) ([]domain.FabricTicket, error) {
	return nil, nil
}
func (r *stateSyncRepo) GetAuditTrail(ctx context.Context, id uuid.UUID) ([]domain.AuditEntry, error) {
	return nil, nil
}
func (r *stateSyncRepo) AddAudit(ctx context.Context, entry domain.AuditEntry) error { return nil }
func (r *stateSyncRepo) AddFailedAttempt(ctx context.Context, id uuid.UUID, attempt string) error {
	return nil
}
func (r *stateSyncRepo) FindSimilarResolutions(ctx context.Context, vector []float64, limit int) ([]domain.FabricTicket, error) {
	return nil, nil
}
func (r *stateSyncRepo) Search(ctx context.Context, criteria map[string]interface{}) ([]domain.FabricTicket, error) {
	return nil, nil
}
func (r *stateSyncRepo) IncrementMetric(ctx context.Context, key string, amount float64) error {
	return nil
}
func (r *stateSyncRepo) GetMetric(ctx context.Context, key string) (float64, float64, error) {
	return 0, 0, nil
}
func (r *stateSyncRepo) Store(ctx context.Context, agentID string, ticketID uuid.UUID, memType string, data map[string]interface{}, score float64) error {
	return nil
}
func (r *stateSyncRepo) Get(ctx context.Context, agentID string, ticketID uuid.UUID, memType string) (map[string]interface{}, error) {
	return nil, nil
}
func (r *stateSyncRepo) GetContext(ctx context.Context, agentID string, limit int) ([]domain.FabricTicket, error) {
	return nil, nil
}

func TestSwarmServiceSyncStateRoundTrip(t *testing.T) {
	repo := &stateSyncRepo{}
	svc := NewSwarmService(repo, repo)

	payload := map[string]interface{}{"cursor": "main.go", "selection": "5"}
	snap, err := svc.SyncState(context.Background(), "ide", "antigravity", "vscode", "editor", payload)
	if err != nil {
		t.Fatalf("sync state failed: %v", err)
	}
	if snap.Payload["cursor"] != "main.go" {
		t.Fatalf("expected cursor to be persisted, got %#v", snap.Payload["cursor"])
	}

	fetched, err := svc.GetState(context.Background(), "ide", "antigravity")
	if err != nil {
		t.Fatalf("get state failed: %v", err)
	}
	if fetched.Payload["selection"] != "5" {
		t.Fatalf("expected selection to be available, got %#v", fetched.Payload["selection"])
	}
}

func TestSwarmServiceMessageChannel(t *testing.T) {
	repo := &stateSyncRepo{}
	svc := NewSwarmService(repo, repo)

	msg, err := svc.SendMessage(context.Background(), "ide", "copilot", "antigravity", "note", "ready to continue", nil)
	if err != nil {
		t.Fatalf("send message failed: %v", err)
	}
	if msg.Body != "ready to continue" {
		t.Fatalf("expected message body to be preserved, got %q", msg.Body)
	}

	messages, err := svc.ListMessages(context.Background(), "ide", "antigravity")
	if err != nil {
		t.Fatalf("list messages failed: %v", err)
	}
	if len(messages) != 1 {
		t.Fatalf("expected 1 message, got %d", len(messages))
	}
}
