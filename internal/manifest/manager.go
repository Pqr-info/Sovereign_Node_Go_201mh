package manifest

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"fmt"
	"os"

	_ "github.com/lib/pq"
)

type ManifestManager struct {
	connStr string
}

func NewManifestManager(connStr string) *ManifestManager {
	return &ManifestManager{connStr: connStr}
}

// LoadFromFile reads manifest bytes from disk.
func (m *ManifestManager) LoadFromFile(path string) ([]byte, error) {
	return os.ReadFile(path)
}

// SaveToFile writes manifest bytes to disk.
func (m *ManifestManager) SaveToFile(path string, data []byte) error {
	return os.WriteFile(path, data, 0644)
}

// CalculateHash returns the SHA-256 hash of the manifest bytes.
func (m *ManifestManager) CalculateHash(data []byte) string {
	hash := sha256.Sum256(data)
	return hex.EncodeToString(hash[:])
}

// LoadFromDB fetches the configuration manifest JSON from CockroachDB.
func (m *ManifestManager) LoadFromDB() ([]byte, error) {
	db, err := sql.Open("postgres", m.connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}
	defer db.Close()

	var data []byte
	err = db.QueryRow("SELECT value FROM system_manifest WHERE key = $1", "config_manifest").Scan(&data)
	if err != nil {
		return nil, fmt.Errorf("failed to query config_manifest: %w", err)
	}

	return data, nil
}

// SaveToDB stores the configuration manifest JSON into CockroachDB.
func (m *ManifestManager) SaveToDB(data []byte) error {
	db, err := sql.Open("postgres", m.connStr)
	if err != nil {
		return fmt.Errorf("failed to open database: %w", err)
	}
	defer db.Close()

	_, err = db.Exec(`
		INSERT INTO system_manifest (key, value, updated_at)
		VALUES ($1, $2, CURRENT_TIMESTAMP)
		ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
	`, "config_manifest", data)
	if err != nil {
		return fmt.Errorf("failed to insert/update config_manifest: %w", err)
	}

	return nil
}
