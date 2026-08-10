package meshnode

import (
	"context"
	"time"
)

// HeartbeatClient represents a daemon that fires periodic ping updates.
type HeartbeatClient struct {
	registry *Registry
	node     *MeshNode
	interval time.Duration
	stopCh   chan struct{}
}

// NewHeartbeatClient creates a new HeartbeatClient.
func NewHeartbeatClient(registry *Registry, node *MeshNode, interval time.Duration) *HeartbeatClient {
	return &HeartbeatClient{
		registry: registry,
		node:     node,
		interval: interval,
		stopCh:   make(chan struct{}),
	}
}

// Start runs a background goroutine firing periodic ping updates.
func (h *HeartbeatClient) Start() {
	go func() {
		ticker := time.NewTicker(h.interval)
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:
				h.node.LastHeartbeat = time.Now()
				h.node.Status = "online"
				// Best effort update
				_ = h.registry.Register(context.Background(), h.node)
			case <-h.stopCh:
				return
			}
		}
	}()
}

// Stop halts the heartbeat daemon.
func (h *HeartbeatClient) Stop() {
	close(h.stopCh)
}
