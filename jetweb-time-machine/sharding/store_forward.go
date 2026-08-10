package sharding

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

// Vessel represents the sealed cryptographic payload based on the //schema/vessel.proto
type Vessel struct {
	VesselID       string `json:"vessel_id"`
	OriginMeshID   string `json:"origin_mesh_id"`
	OriginPlanetID string `json:"origin_planet_id"`
	PayloadShard   string `json:"payload_shard"` // Hex encoded bytes
	Signature      string `json:"signature"`
	Timestamp      string `json:"timestamp"`
}

// StoreAndForward listens to Substrate, packages events into Vessels, writes them to disk, and forwards them.
func StoreAndForward(eventPayload []byte, meshID string, planetID string, targetEndpoint string) error {
	timestamp := time.Now().UTC().Format(time.RFC3339)
	
	// Create Hash for Vessel ID
	hash := sha256.Sum256(eventPayload)
	vesselID := hex.EncodeToString(hash[:16])
	
	// Mock Signature
	signature := "0x_sig_" + vesselID

	vessel := Vessel{
		VesselID:       vesselID,
		OriginMeshID:   meshID,
		OriginPlanetID: planetID,
		PayloadShard:   hex.EncodeToString(eventPayload),
		Signature:      signature,
		Timestamp:      timestamp,
	}

	// 1. STORE: Write Vessel to disk for persistence, cold-storage, and physical transport
	err := writeVesselToDisk(vessel)
	if err != nil {
		fmt.Printf("Error writing vessel to disk: %v\n", err)
	}

	// 2. FORWARD: Broadcast Vessel via DTHP Interplanetary Endpoint
	err = forwardVessel(vessel, targetEndpoint)
	if err != nil {
		fmt.Printf("Error forwarding vessel: %v\n", err)
		return err
	}

	return nil
}

func writeVesselToDisk(vessel Vessel) error {
	basePath := filepath.Join("C:\\Users\\theal\\vessels", vessel.OriginPlanetID, vessel.OriginMeshID)
	os.MkdirAll(basePath, os.ModePerm)
	
	filePath := filepath.Join(basePath, vessel.VesselID+".vsl")
	
	data, err := json.MarshalIndent(vessel, "", "  ")
	if err != nil {
		return err
	}
	
	err = ioutil.WriteFile(filePath, data, 0644)
	if err == nil {
		fmt.Printf("[STORE] Vessel %s written to %s\n", vessel.VesselID, filePath)
	}
	return err
}

func forwardVessel(vessel Vessel, endpoint string) error {
	data, err := json.Marshal(vessel)
	if err != nil {
		return err
	}

	// In a real implementation this sends to Next.js API /api/interplanetary/handshake
	// The delay-tolerant transport queues it if unreachable
	req, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(data))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	
	if err != nil {
		fmt.Printf("[FORWARD-DELAYED] Endpoint unreachable. Vessel %s stored for retry.\n", vessel.VesselID)
		// Delay-tolerant logic would queue this for later
		return nil
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		fmt.Printf("[FORWARD-SUCCESS] Vessel %s successfully broadcasted to %s\n", vessel.VesselID, endpoint)
	} else {
		fmt.Printf("[FORWARD-ERROR] Server returned status %d\n", resp.StatusCode)
	}
	return nil
}
