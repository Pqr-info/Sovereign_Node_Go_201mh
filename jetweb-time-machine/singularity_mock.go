package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sync"
)

// SingularityMockService acts as the central computation plane for Phase 2.0
type SingularityMockService struct {
	mu       sync.Mutex
	Nodes    map[string]GraphNode `json:"nodes"`
	Edges    map[string]GraphEdge `json:"edges"`
	MeshFile string
}

func NewSingularityMockService() *SingularityMockService {
	dir := `C:\JetWeb\wslenv\singularity_mesh`
	os.MkdirAll(dir, 0755)
	
	svc := &SingularityMockService{
		Nodes:    make(map[string]GraphNode),
		Edges:    make(map[string]GraphEdge),
		MeshFile: filepath.Join(dir, "singularity_mesh.json"),
	}
	
	svc.loadMesh()
	return svc
}

func (s *SingularityMockService) loadMesh() {
	b, err := os.ReadFile(s.MeshFile)
	if err == nil {
		json.Unmarshal(b, s)
	}
}

func (s *SingularityMockService) saveMesh() {
	b, _ := json.MarshalIndent(s, "", "  ")
	os.WriteFile(s.MeshFile, b, 0644)
}

func (s *SingularityMockService) IngestEvent(event SingularityEvent) {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Reconstruct the node state
	payloadBytes, _ := json.Marshal(event.Payload)
	var ts Timeslip
	json.Unmarshal(payloadBytes, &ts)

	nodeID := "N-" + ts.ID
	
	node := GraphNode{
		NodeID:       nodeID,
		Type:         "timeslip",
		TimeslipID:   ts.ID,
		CheckpointID: ts.CheckpointID,
		Identity:     event.Identity,
		Status:       string(ts.Status),
		Start:        ts.Start,
		End:          ts.End,
		DurationSec:  ts.DurationSeconds,
		Cost:         ts.Cost,
	}

	// Update node
	s.Nodes[nodeID] = node

	// Build edges based on causality/temporality
	// Example: The event inherently means this node existed after the previous node.
	// For a production mesh, we'd look up the parent checkpoint ID to build true causality.

	s.saveMesh()
	fmt.Printf("[SingularityMesh] Ingested %s -> Node %s updated.\n", event.EventType, nodeID)
}

func (s *SingularityMockService) DumpMesh() {
	s.mu.Lock()
	defer s.mu.Unlock()
	fmt.Printf("=== SINGULARITY MESH (Nodes: %d, Edges: %d) ===\n", len(s.Nodes), len(s.Edges))
	for _, n := range s.Nodes {
		fmt.Printf(" Node: %s [%s] Cost: $%.2f (Dev: %s, Env: %s)\n", n.NodeID, n.Status, n.Cost, n.Identity.DeveloperID, n.Identity.EnvironmentID)
	}
	for _, e := range s.Edges {
		fmt.Printf(" Edge: %s -> %s (%s)\n", e.FromNode, e.ToNode, e.Type)
	}
	fmt.Println("===========================================================")
}
