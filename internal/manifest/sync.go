package manifest

import (
	"fmt"
	"time"
)

type SyncController struct {
	manager    *ManifestManager
	localPath  string
	schemaPath string
}

func NewSyncController(manager *ManifestManager, localPath string, schemaPath string) *SyncController {
	return &SyncController{
		manager:    manager,
		localPath:  localPath,
		schemaPath: schemaPath,
	}
}

// SyncLocalWithDB downloads the database manifest, validates it, and overwrites the local copy.
func (s *SyncController) SyncLocalWithDB() error {
	dbData, err := s.manager.LoadFromDB()
	if err != nil {
		return fmt.Errorf("failed to fetch manifest from DB: %w", err)
	}

	// Validate against JSON schema
	schemaBytes, err := s.manager.LoadFromFile(s.schemaPath)
	if err != nil {
		return fmt.Errorf("failed to load JSON schema: %w", err)
	}

	if err := ValidateBytes(dbData, schemaBytes); err != nil {
		return fmt.Errorf("database manifest failed schema validation: %w", err)
	}

	// Write to local file
	if err := s.manager.SaveToFile(s.localPath, dbData); err != nil {
		return fmt.Errorf("failed to save manifest locally: %w", err)
	}

	// Run bootstrapper logic
	if err := BootstrapFromManifest(dbData); err != nil {
		return fmt.Errorf("failed to bootstrap from synced manifest: %w", err)
	}

	return nil
}

// RunPeriodicSync triggers synchronization in the background at set intervals.
func (s *SyncController) RunPeriodicSync(interval time.Duration, stopChan <-chan struct{}) {
	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			fmt.Println("[SyncController] Checking config status...")
			if err := s.SyncLocalWithDB(); err != nil {
				fmt.Printf("[SyncController] Sync error: %v\n", err)
			}
		case <-stopChan:
			fmt.Println("[SyncController] Stopping sync routine.")
			return
		}
	}
}
