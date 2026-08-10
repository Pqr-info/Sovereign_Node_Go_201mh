package meshnode

import (
	"context"
	"encoding/json"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// FiveDAddress represents a canonical FiveDAddress.
// We use string here to avoid missing crypto5d import issues.
type FiveDAddress string

// MeshNode represents a node in the Sovereign-27 ecosystem.
type MeshNode struct {
	Address       FiveDAddress
	Hostname      string
	NodeRole      string
	Capabilities  map[string]bool
	Status        string
	LastHeartbeat time.Time
}

// Registry manages MeshNode registration in CockroachDB.
type Registry struct {
	db *pgxpool.Pool
}

// NewRegistry creates a new Registry.
func NewRegistry(db *pgxpool.Pool) *Registry {
	return &Registry{db: db}
}

// Register upserts a node's state into the registry.
func (r *Registry) Register(ctx context.Context, node *MeshNode) error {
	caps, err := json.Marshal(node.Capabilities)
	if err != nil {
		return err
	}

	query := `
		INSERT INTO mesh_nodes (addr_packed, hostname, role, capabilities, status, last_heartbeat)
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (hostname) DO UPDATE SET
			addr_packed = EXCLUDED.addr_packed,
			role = EXCLUDED.role,
			capabilities = EXCLUDED.capabilities,
			status = EXCLUDED.status,
			last_heartbeat = EXCLUDED.last_heartbeat
	`
	_, err = r.db.Exec(ctx, query,
		string(node.Address),
		node.Hostname,
		node.NodeRole,
		caps,
		node.Status,
		node.LastHeartbeat,
	)
	return err
}

// ListOnline retrieves all online peers.
func (r *Registry) ListOnline(ctx context.Context) ([]*MeshNode, error) {
	query := `SELECT addr_packed, hostname, role, capabilities, status, last_heartbeat FROM mesh_nodes WHERE status = 'online'`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var nodes []*MeshNode
	for rows.Next() {
		var n MeshNode
		var caps []byte
		var addr []byte
		if err := rows.Scan(&addr, &n.Hostname, &n.NodeRole, &caps, &n.Status, &n.LastHeartbeat); err != nil {
			return nil, err
		}
		n.Address = FiveDAddress(addr)
		if err := json.Unmarshal(caps, &n.Capabilities); err != nil {
			return nil, err
		}
		nodes = append(nodes, &n)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return nodes, nil
}
