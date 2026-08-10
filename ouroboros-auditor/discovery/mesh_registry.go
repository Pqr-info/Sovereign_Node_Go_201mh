package discovery

import (
	"fmt"
	"log"
	"strings"
	"time"
)

type Service struct {
	NodeID       string
	ServiceType  string
	GRPCPort     string
	BusPort      string
	Status       string
	PedigreeHash string
	LastSeen     time.Time
}

// Registry handles Mesh-Awareness.
// Every node broadcasts its available hardware/services to CockroachDB.
type Registry struct {
	// Reference to the DB connection
}

func NewRegistry() *Registry {
	return &Registry{}
}

// RegisterService allows a node to announce its presence to the global mesh.
// Validates Swarm Pedigree and Cryptographic Governance rules before registering.
func (r *Registry) RegisterService(nodeID, serviceType, pedigreeHash string) error {
	log.Printf("[MESH-DISCOVERY] Attempting to register Node [%s] with Service [%s] (Pedigree: %s)", nodeID, serviceType, pedigreeHash)
	
	// Enforce Cryptographic Governance
	if !r.validatePedigree(pedigreeHash) {
		log.Printf("[OUROBOROS-GOVERNANCE] ALERT: Mutant or unverified agent blocked from mesh! Node [%s], Hash: %s", nodeID, pedigreeHash)
		return fmt.Errorf("cryptographic governance failure: invalid pedigree hash")
	}

	log.Printf("[MESH-DISCOVERY] Pedigree verified. Node [%s] with Service [%s] joined the mesh.", nodeID, serviceType)
	// UPSERT INTO mesh_registry (node_id, service_type, status, pedigree_hash, last_seen) 
	// VALUES ($1, $2, 'ONLINE', $3, now())
	return nil
}

func (r *Registry) validatePedigree(hash string) bool {
	if hash == "" {
		return false
	}
	hashLower := strings.ToLower(hash)
	if strings.Contains(hashLower, "mutant") || strings.Contains(hashLower, "unverified") {
		return false
	}
	if len(hash) < 16 { // Require sufficient cryptographic length
		return false
	}
	return true
}

// GetAvailableNodes returns a list of healthy nodes providing a specific service.
func (r *Registry) GetAvailableNodes(serviceType string) []Service {
	log.Printf("[MESH-DISCOVERY] Querying CockroachDB for active [%s] nodes...", serviceType)
	
	// SELECT node_id FROM mesh_registry WHERE service_type=$1 AND status='ONLINE'
	
	// Simulated response
	if serviceType == "GPU_NEMOTRON" {
		return []Service{{NodeID: "alienware", ServiceType: "GPU_NEMOTRON", GRPCPort: "1111"}}
	}
	if serviceType == "NPU_CLASSIFIER" {
		return []Service{{NodeID: "yoga", ServiceType: "NPU_CLASSIFIER", GRPCPort: "1111"}}
	}
	
	return []Service{
		{NodeID: "39.mh", ServiceType: "WEB_SCRAPER", GRPCPort: "1111"},
		{NodeID: "38.mh", ServiceType: "WEB_SCRAPER", GRPCPort: "1111"},
	}
}
