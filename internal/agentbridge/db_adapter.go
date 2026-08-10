package agentbridge

import (
	"context"
	"database/sql"
	"encoding/json"
	"os"

	"github.com/google/uuid"
	"pqr.info/internal/infrastructure/db"
)

type DbClientAdapter struct {
	repo *db.CockroachRepository
	db   *sql.DB
}

func NewDbClientAdapter(repo *db.CockroachRepository) *DbClientAdapter {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		connStr = "postgresql://root@localhost:26257/antigravity?sslmode=disable"
	}
	dbConn, _ := sql.Open("postgres", connStr)

	return &DbClientAdapter{
		repo: repo,
		db:   dbConn,
	}
}

func (a *DbClientAdapter) GetTicket(ctx context.Context, id TicketID) (Ticket, error) {
	uid, err := uuid.Parse(string(id))
	if err != nil {
		return Ticket{}, err
	}
	t, _, err := a.repo.GetByID(ctx, uid)
	if err != nil {
		return Ticket{}, err
	}
	return Ticket{
		ID:           TicketID(t.ID.String()),
		Relationship: "local",
		Layer:        t.LayerID,
	}, nil
}

func (a *DbClientAdapter) GetParent(ctx context.Context, id TicketID) (Ticket, bool, error) {
	uid, err := uuid.Parse(string(id))
	if err != nil {
		return Ticket{}, false, err
	}
	var parentID string
	var relType string
	err = a.db.QueryRowContext(ctx, "SELECT parent_id, relationship_type FROM ticket_relationships WHERE child_id = $1 LIMIT 1", uid).Scan(&parentID, &relType)
	if err == sql.ErrNoRows {
		return Ticket{}, false, nil
	}
	if err != nil {
		return Ticket{}, false, err
	}

	pUUID, _ := uuid.Parse(parentID)
	t, _, err := a.repo.GetByID(ctx, pUUID)
	if err != nil {
		return Ticket{}, false, err
	}

	return Ticket{
		ID:           TicketID(parentID),
		Relationship: relType,
		Layer:        t.LayerID,
	}, true, nil
}

func (a *DbClientAdapter) GetChildren(ctx context.Context, id TicketID) ([]Ticket, error) {
	uid, err := uuid.Parse(string(id))
	if err != nil {
		return nil, err
	}
	rows, err := a.db.QueryContext(ctx, "SELECT child_id, relationship_type FROM ticket_relationships WHERE parent_id = $1", uid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tickets []Ticket
	for rows.Next() {
		var childID string
		var relType string
		if err := rows.Scan(&childID, &relType); err != nil {
			return nil, err
		}
		cUUID, _ := uuid.Parse(childID)
		t, _, err := a.repo.GetByID(ctx, cUUID)
		if err == nil {
			tickets = append(tickets, Ticket{
				ID:           TicketID(childID),
				Relationship: relType,
				Layer:        t.LayerID,
			})
		}
	}
	return tickets, nil
}

func (a *DbClientAdapter) GetMemory(ctx context.Context, id TicketID) ([]MemoryBlock, error) {
	uid, err := uuid.Parse(string(id))
	if err != nil {
		return nil, err
	}
	rows, err := a.db.QueryContext(ctx, "SELECT memory_data, relevance_score FROM agent_memory WHERE ticket_id = $1", uid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var blocks []MemoryBlock
	for rows.Next() {
		var dataRaw []byte
		var score float64
		if err := rows.Scan(&dataRaw, &score); err != nil {
			return nil, err
		}
		blocks = append(blocks, MemoryBlock{
			Content: string(dataRaw),
			Score:   score,
		})
	}
	return blocks, nil
}

func (a *DbClientAdapter) StoreMemoryEvent(ctx context.Context, evt MemoryPageEvent) error {
	uid, err := uuid.Parse(string(evt.TicketID))
	if err != nil {
		return err
	}
	data := map[string]interface{}{
		"system":    evt.System,
		"user":      evt.User,
		"assistant": evt.Reply,
	}
	return a.repo.Store(ctx, evt.AgentID, uid, "context_page", data, 1.0)
}

func (a *DbClientAdapter) GetCapabilities(ctx context.Context) ([]string, map[string]string, error) {
	manifestPath := "manifest.json"
	if _, err := os.Stat(manifestPath); err != nil {
		manifestPath = "../manifest.json"
	}
	
	fileBytes, err := os.ReadFile(manifestPath)
	if err != nil {
		return []string{"windows_execution", "wsl_execution"}, map[string]string{"execute": "wsl_execution"}, nil
	}

	var manifest struct {
		Capabilities struct {
			GrpcServices       []string          `json:"grpc_services"`
			NaturalLanguageMap map[string]string `json:"natural_language_map"`
		} `json:"capabilities"`
	}

	if err := json.Unmarshal(fileBytes, &manifest); err != nil {
		return []string{"windows_execution", "wsl_execution"}, map[string]string{"execute": "wsl_execution"}, nil
	}

	return manifest.Capabilities.GrpcServices, manifest.Capabilities.NaturalLanguageMap, nil
}
