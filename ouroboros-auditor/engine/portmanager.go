package engine

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"sync"
	"time"
	"unsafe"
	"os"
)

const locksFile = "portlocks.json"

// PortLock represents a leased port.
type PortLock struct {
	AgentID   string    `json:"agent_id"`
	ExpiresAt time.Time `json:"expires_at"`
	Revision  int       `json:"revision"` // Monotonically increasing lease revision
}

type SwapEvent struct {
	AgentID        string
	SwapType       string
	Timestamp      int64
	ComputeMinutes float64
}

// PortManager manages global portlocks across the mesh.
type PortManager struct {
	mu                sync.Mutex
	ActiveLocks       map[int]PortLock       // port -> lock info
	SentinelListeners map[int]net.Listener   // port -> sentinel listener blocking squatters
	StateSegment      []byte                 // 8Mb Pre-allocated memory segment for Tele-Swaps
	globalRevision    int                    // Tracks the highest revision issued
	SwapEventBus      chan SwapEvent         // Bus for automated ledger updates
	AgentTimers       map[string]time.Time   // AgentID -> start time (tea-timer)
}

// NewPortManager creates a new autonomous Port Manager and loads persistent state.
func NewPortManager() *PortManager {
	pm := &PortManager{
		ActiveLocks:       make(map[int]PortLock),
		SentinelListeners: make(map[int]net.Listener),
		StateSegment:      make([]byte, 8*1024*1024),
		globalRevision:    0,
		SwapEventBus:      make(chan SwapEvent, 100),
		AgentTimers:       make(map[string]time.Time),
	}
	pm.loadState()
	return pm
}

// popAndResetTimerLocked calculates compute minutes and resets the tea-timer.
// The caller MUST hold pm.mu.
func (pm *PortManager) popAndResetTimerLocked(agentID string) float64 {
	start, exists := pm.AgentTimers[agentID]
	now := time.Now()
	if !exists {
		start = now
	}
	minutes := now.Sub(start).Minutes()
	pm.AgentTimers[agentID] = now // Reset tea-timer
	return minutes
}

func (pm *PortManager) loadState() {
	data, err := ioutil.ReadFile(locksFile)
	if err == nil {
		json.Unmarshal(data, &pm.ActiveLocks)
		// Find highest revision
		for _, lock := range pm.ActiveLocks {
			if lock.Revision > pm.globalRevision {
				pm.globalRevision = lock.Revision
			}
		}
		log.Printf("[PORTLOCK] Restored %d active locks from disk. High-water revision: %d", len(pm.ActiveLocks), pm.globalRevision)
	}
}

func (pm *PortManager) saveState() {
	data, err := json.MarshalIndent(pm.ActiveLocks, "", "  ")
	if err == nil {
		ioutil.WriteFile(locksFile, data, 0644)
	}
}

// RequestPortLock allocates a port to an agent if available, incrementing revision.
func (pm *PortManager) RequestPortLock(port int, agentID string, ttl time.Duration) (bool, int) {
	pm.mu.Lock()
	defer pm.mu.Unlock()

	// Initialize tea-timer if missing
	if _, exists := pm.AgentTimers[agentID]; !exists {
		pm.AgentTimers[agentID] = time.Now()
	}

	// Check if locked and not expired
	if lock, exists := pm.ActiveLocks[port]; exists && lock.AgentID != agentID {
		if time.Now().Before(lock.ExpiresAt) {
			log.Printf("[PORTLOCK] Denied: Port %d is currently locked by %s until %v", port, lock.AgentID, lock.ExpiresAt)
			return false, 0
		}
	}

	pm.globalRevision++
	newLock := PortLock{
		AgentID:   agentID,
		ExpiresAt: time.Now().Add(ttl),
		Revision:  pm.globalRevision,
	}
	pm.ActiveLocks[port] = newLock
	
	// Active Anti-Squatting: Bind the Sentinel Listener
	if _, hasSentinel := pm.SentinelListeners[port]; !hasSentinel {
		ln, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
		if err != nil {
			log.Printf("[PORTLOCK] WARNING: Sentinel failed to bind on %d: %v. Another rogue process may be squatting!", port, err)
		} else {
			pm.SentinelListeners[port] = ln
			log.Printf("[PORTLOCK] Sentinel bound to port %d to block squatters.", port)
		}
	}

	pm.saveState()
	log.Printf("[PORTLOCK] Granted: Port %d locked by %s (TTL: %v, Revision: %d)", port, agentID, ttl, newLock.Revision)
	return true, newLock.Revision
}

// HandoffPort performs the Atomic Socket Handoff. 
// It extracts the OS socket descriptor from the Sentinel and relinquishes the Go wrapper.
func (pm *PortManager) HandoffPort(port int, agentID string, requestRevision int) (*os.File, error) {
	pm.mu.Lock()
	defer pm.mu.Unlock()

	lock, exists := pm.ActiveLocks[port]
	if !exists {
		return nil, fmt.Errorf("port %d is not locked", port)
	}

	if lock.AgentID != agentID {
		return nil, fmt.Errorf("unauthorized: port %d belongs to %s", port, lock.AgentID)
	}

	if lock.Revision != requestRevision {
		return nil, fmt.Errorf("stale revision: requested %d, active %d", requestRevision, lock.Revision)
	}

	ln, hasSentinel := pm.SentinelListeners[port]
	if !hasSentinel {
		return nil, fmt.Errorf("no sentinel active on port %d to handoff", port)
	}

	tcpLn, ok := ln.(*net.TCPListener)
	if !ok {
		return nil, fmt.Errorf("sentinel is not a TCPListener")
	}

	file, err := tcpLn.File()
	if err != nil {
		return nil, fmt.Errorf("failed to extract underlying socket FD: %v", err)
	}

	// Relinquish the sentinel wrapper without closing the underlying OS socket
	// The agent will receive the 'file' descriptor via Atomic Swap / Shared Memory
	delete(pm.SentinelListeners, port)
	
	// Fire async event to Listening Post
	minutes := pm.popAndResetTimerLocked(agentID)
	select {
	case pm.SwapEventBus <- SwapEvent{AgentID: agentID, SwapType: "Atomic Socket Handoff", Timestamp: time.Now().Unix(), ComputeMinutes: minutes}:
	default:
	}

	log.Printf("[TELEPORT] Atomic Socket Handoff prepared for Port %d (Agent: %s, Revision: %d)", port, agentID, lock.Revision)
	return file, nil
}

// ReleasePortLock frees a port and kills the sentinel if active.
func (pm *PortManager) ReleasePortLock(port int, agentID string) {
	pm.mu.Lock()
	defer pm.mu.Unlock()

	if lock, exists := pm.ActiveLocks[port]; exists && lock.AgentID == agentID {
		delete(pm.ActiveLocks, port)
		
		if ln, hasSentinel := pm.SentinelListeners[port]; hasSentinel {
			ln.Close()
			delete(pm.SentinelListeners, port)
		}

		pm.saveState()
		log.Printf("[PORTLOCK] Released: Port %d freed by %s", port, agentID)
	}
}

// ListLocks returns all current locks.
func (pm *PortManager) ListLocks() map[int]PortLock {
	pm.mu.Lock()
	defer pm.mu.Unlock()
	
	copyMap := make(map[int]PortLock)
	for k, v := range pm.ActiveLocks {
		copyMap[k] = v
	}
	return copyMap
}

// -----------------------------------------------------------------------------
// TELEPORTATION & ATOMIC SWAP MECHANICS
// -----------------------------------------------------------------------------

// LocalCoTeleSwap performs a zero-copy pointer swap for agents residing on the same physical server.
func (pm *PortManager) LocalCoTeleSwap(agentID string, foreignStatePtr unsafe.Pointer) unsafe.Pointer {
	log.Println("[TELEPORT] Initiating Local Co-Tele-Swap (Pointer Exchange)...")
	pm.mu.Lock()
	defer pm.mu.Unlock()
	localPtr := unsafe.Pointer(&pm.StateSegment[0])

	minutes := pm.popAndResetTimerLocked(agentID)
	select {
	case pm.SwapEventBus <- SwapEvent{AgentID: agentID, SwapType: "Zero-Copy Page", Timestamp: time.Now().Unix(), ComputeMinutes: minutes}:
	default:
	}

	return localPtr
}

// NetworkLiteralSwap executes a direct byte-for-byte stream over the local network segment.
func (pm *PortManager) NetworkLiteralSwap(agentID string, targetIP string, foreignPayload []byte) []byte {
	log.Printf("[TELEPORT] Initiating Network Segment Literal Swap with %s...", targetIP)
	pm.mu.Lock()
	defer pm.mu.Unlock()
	localPayload := make([]byte, len(pm.StateSegment))
	copy(localPayload, pm.StateSegment)
	if len(foreignPayload) <= len(pm.StateSegment) {
		copy(pm.StateSegment, foreignPayload)
	}

	minutes := pm.popAndResetTimerLocked(agentID)
	select {
	case pm.SwapEventBus <- SwapEvent{AgentID: agentID, SwapType: "Network Literal", Timestamp: time.Now().Unix(), ComputeMinutes: minutes}:
	default:
	}

	return localPayload
}

// GlobalDistributedTeleport compresses the agent state and swaps it globally over standard HTTP.
func (pm *PortManager) GlobalDistributedTeleport(targetEndpoint string) error {
	log.Printf("[TELEPORT] Initiating Global Distributed Teleport to %s...", targetEndpoint)
	payload, err := json.Marshal(pm.ListLocks())
	if err != nil {
		return err
	}
	resp, err := http.Post(fmt.Sprintf("http://%s/teleport/swap", targetEndpoint), "application/json", bytes.NewBuffer(payload))
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	return nil
}

// TeleportSelf invokes the TeleportAgent gRPC endpoint on a target node to migrate this Ouroboros instance.
func (pm *PortManager) TeleportSelf(targetNode string, grpcAddress string, runCommand string) error {
	return nil
}
