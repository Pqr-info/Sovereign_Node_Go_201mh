package main

import (
	"fmt"
	"time"
)

// EventType constants
const (
	EventTimeslipOpened        = "TimeslipOpened"
	EventTimeslipClosed        = "TimeslipClosed"
	EventTimeslipInvalidated   = "TimeslipInvalidated"
	EventCheckpointCreated     = "CheckpointCreated"
	EventCheckpointAnnihilated = "CheckpointAnnihilated"
)

// EdgeType constants
const (
	EdgeCaused   = "caused"
	EdgeDepends  = "depends"
	EdgeTemporal = "temporal"
)

// Identity context for every event
type SingularityIdentity struct {
	OrgID         string `json:"org_id"`
	TeamID        string `json:"team_id"`
	ProjectID     string `json:"project_id"`
	EnvironmentID string `json:"environment_id"`
	DeveloperID   string `json:"developer_id"`
}

// SingularityEvent represents a timeline action
type SingularityEvent struct {
	EventID   string              `json:"event_id"`
	EventType string              `json:"event_type"`
	Timestamp int64               `json:"timestamp"`
	Identity  SingularityIdentity `json:"identity"`
	Payload   interface{}         `json:"payload"`
}

// GraphNode represents a discrete timeline state
type GraphNode struct {
	NodeID       string              `json:"node_id"`
	Type         string              `json:"type"` // "timeslip" or "checkpoint"
	TimeslipID   string              `json:"timeslip_id,omitempty"`
	CheckpointID string              `json:"checkpoint_id,omitempty"`
	Identity     SingularityIdentity `json:"identity"`
	Status       string              `json:"status"`
	Start        int64               `json:"start"`
	End          int64               `json:"end,omitempty"`
	DurationSec  int64               `json:"duration_seconds,omitempty"`
	Cost         float64             `json:"cost,omitempty"`
	Tags         []string            `json:"tags,omitempty"`
}

// GraphEdge represents the relationship between nodes
type GraphEdge struct {
	EdgeID   string                 `json:"edge_id"`
	FromNode string                 `json:"from_node"`
	ToNode   string                 `json:"to_node"`
	Type     string                 `json:"type"` // "caused", "depends", "temporal"
	Metadata map[string]interface{} `json:"metadata,omitempty"`
}

// Helper to construct an event with standard identity
func NewSingularityEvent(eventType string, payload interface{}) SingularityEvent {
	return SingularityEvent{
		EventID:   fmt.Sprintf("EVT-%d", time.Now().UnixNano()),
		EventType: eventType,
		Timestamp: time.Now().Unix(),
		Identity: SingularityIdentity{
			OrgID:         State.OrgID,
			TeamID:        State.TeamID,
			ProjectID:     State.ProjectID,
			EnvironmentID: State.EnvironmentID,
			DeveloperID:   State.DeveloperID,
		},
		Payload: payload,
	}
}
