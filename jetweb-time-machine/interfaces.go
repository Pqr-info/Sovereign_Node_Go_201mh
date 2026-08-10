package main

// Checkpoint represents a temporal snapshot in the deep chain.
type Checkpoint struct {
	ID        string `json:"id"`
	Label     string `json:"label"`
	Parent    string `json:"parent"`
	Timestamp int64  `json:"timestamp"`
	Path      string `json:"path"`
}

// SnapshotEngine defines how the temporal checkpoint system creates and manages differencing layers.
type SnapshotEngine interface {
	InitBaseline() error
	CreateCheckpoint(label string) (string, error)
	RollbackToCheckpoint(id string) error
	RollbackToBase() error
	ListCheckpoints() ([]Checkpoint, error)
}

// TriggerEngine defines how mutation events are detected in the protected zones.
type TriggerEngine interface {
	StartWatching() error
	StopWatching() error
	GetMutationTriggers() []string
}

// VaultEngine defines the honeypot and secret bleeding protection system.
type VaultEngine interface {
	DeployHoneypots() error
	MonitorHoneypots() error
	GetVaultStatus() string
	Intervene() error
}

// JetWebState holds the global state for the module.
type JetWebState struct {
	HITLEnabled        bool
	PaymentMethodValid bool
	HourlyRate         float64
	OrgID              string
	TeamID             string
	ProjectID          string
	EnvironmentID      string
	DeveloperID        string
	ProtectedZones     []string
	IDEFingerprints    map[string]bool
}

// Global state instance
var State = &JetWebState{
	OrgID:           "org-jetweb",
	TeamID:          "team-temporal",
	ProjectID:       "proj-singularity",
	EnvironmentID:   "env-wsl-01",
	DeveloperID:     "alan",
	IDEFingerprints: make(map[string]bool),
	HourlyRate:      125.00, // Configurable default
}
