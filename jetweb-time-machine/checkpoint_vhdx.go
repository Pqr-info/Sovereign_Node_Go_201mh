package main

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"time"
)

type VhdxSnapshotEngine struct {
	BasePath      string
	CheckpointDir string
	ActivePath    string
}

func NewVhdxSnapshotEngine() *VhdxSnapshotEngine {
	return &VhdxSnapshotEngine{
		BasePath:      `C:\JetWeb\wslenv\base.vhdx`,
		CheckpointDir: `C:\JetWeb\wslenv\checkpoints`,
	}
}

func (e *VhdxSnapshotEngine) runPS(script string) error {
	cmd := exec.Command("powershell", "-NoProfile", "-NonInteractive", script)
	out, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("powershell error: %v\nOutput: %s", err, string(out))
	}
	return nil
}

func (e *VhdxSnapshotEngine) InitBaseline() error {
	fmt.Println("[VHDX ENGINE] Initializing baseline...")

	if err := os.MkdirAll(e.CheckpointDir, 0755); err != nil {
		return fmt.Errorf("failed to create directories: %v", err)
	}

	if _, err := os.Stat(e.BasePath); os.IsNotExist(err) {
		fmt.Println("[VHDX ENGINE] Creating base.vhdx (64GB Dynamic)...")
		script := fmt.Sprintf(`New-VHD -Path "%s" -SizeBytes 64GB -Dynamic`, e.BasePath)
		if err := e.runPS(script); err != nil {
			return err
		}
	}

	// Make sure it's mounted
	script := fmt.Sprintf(`Mount-VHD -Path "%s" -ErrorAction SilentlyContinue`, e.BasePath)
	_ = e.runPS(script) // ignore error if already mounted

	e.ActivePath = e.BasePath
	fmt.Println("[VHDX ENGINE] Baseline initialized and mounted.")
	return nil
}

func (e *VhdxSnapshotEngine) CreateCheckpoint(label string) (string, error) {
	if !State.HITLEnabled {
		return "", fmt.Errorf("HITL Proxy not enabled")
	}

	checkpoints, err := e.ListCheckpoints()
	if err != nil {
		return "", err
	}

	nextID := fmt.Sprintf("cp_%04d", len(checkpoints)+1)
	newPath := filepath.Join(e.CheckpointDir, nextID+".avhdx")
	parentPath := e.ActivePath

	fmt.Printf("[VHDX ENGINE] Creating differencing disk %s parented to %s...\n", nextID, filepath.Base(parentPath))

	script := fmt.Sprintf(`New-VHD -Path "%s" -ParentPath "%s" -Differencing`, newPath, parentPath)
	if err := e.runPS(script); err != nil {
		return "", err
	}

	// Switch active
	if e.ActivePath != "" {
		fmt.Println("[VHDX ENGINE] Dismounting old active disk...")
		_ = e.runPS(fmt.Sprintf(`Dismount-VHD -Path "%s" -ErrorAction SilentlyContinue`, e.ActivePath))
	}

	fmt.Println("[VHDX ENGINE] Mounting new checkpoint...")
	if err := e.runPS(fmt.Sprintf(`Mount-VHD -Path "%s"`, newPath)); err != nil {
		return "", err
	}

	e.ActivePath = newPath

	cp := Checkpoint{
		ID:        nextID,
		Label:     label,
		Parent:    parentPath,
		Timestamp: time.Now().Unix(),
		Path:      newPath,
	}

	b, err := json.MarshalIndent(cp, "", "  ")
	if err != nil {
		return "", fmt.Errorf("failed to marshal checkpoint metadata: %v", err)
	}
	metaPath := filepath.Join(e.CheckpointDir, nextID+".json")
	if err := os.WriteFile(metaPath, b, 0644); err != nil {
		return "", fmt.Errorf("failed to write checkpoint metadata: %v", err)
	}

	fmt.Printf("[SNAPSHOT] Successfully created checkpoint: %s (%s)\n", nextID, label)
	return nextID, nil
}

func (e *VhdxSnapshotEngine) ListCheckpoints() ([]Checkpoint, error) {
	files, err := os.ReadDir(e.CheckpointDir)
	if err != nil {
		return nil, err
	}

	var checkpoints []Checkpoint
	for _, f := range files {
		if filepath.Ext(f.Name()) == ".json" {
			b, err := os.ReadFile(filepath.Join(e.CheckpointDir, f.Name()))
			if err == nil {
				var cp Checkpoint
				if err := json.Unmarshal(b, &cp); err == nil {
					checkpoints = append(checkpoints, cp)
				}
			}
		}
	}

	sort.Slice(checkpoints, func(i, j int) bool {
		return checkpoints[i].Timestamp < checkpoints[j].Timestamp
	})

	return checkpoints, nil
}

func (e *VhdxSnapshotEngine) RollbackToCheckpoint(id string) error {
	checkpoints, err := e.ListCheckpoints()
	if err != nil {
		return err
	}

	var target *Checkpoint
	targetIdx := -1
	for i, cp := range checkpoints {
		if cp.ID == id {
			target = &checkpoints[i]
			targetIdx = i
			break
		}
	}

	if target == nil {
		return fmt.Errorf("checkpoint %s not found", id)
	}

	fmt.Printf("[ROLLBACK] Dismounting current disk (%s)...\n", e.ActivePath)
	_ = e.runPS(fmt.Sprintf(`Dismount-VHD -Path "%s" -ErrorAction SilentlyContinue`, e.ActivePath))

	fmt.Printf("[ROLLBACK] Mounting target disk (%s)...\n", target.Path)
	if err := e.runPS(fmt.Sprintf(`Mount-VHD -Path "%s"`, target.Path)); err != nil {
		return err
	}
	e.ActivePath = target.Path

	// Destructive: Delete newer checkpoints
	for i := targetIdx + 1; i < len(checkpoints); i++ {
		toDelete := checkpoints[i]
		fmt.Printf("[ROLLBACK] Destroying orphaned checkpoint: %s...\n", toDelete.ID)
		_ = os.Remove(toDelete.Path)
		_ = os.Remove(filepath.Join(e.CheckpointDir, toDelete.ID+".json"))
	}

	fmt.Printf("[ROLLBACK] Successfully rolled back to %s.\n", id)
	return nil
}

func (e *VhdxSnapshotEngine) RollbackToBase() error {
	fmt.Printf("[ROLLBACK] Dismounting current disk (%s)...\n", e.ActivePath)
	_ = e.runPS(fmt.Sprintf(`Dismount-VHD -Path "%s" -ErrorAction SilentlyContinue`, e.ActivePath))

	fmt.Printf("[ROLLBACK] Mounting base.vhdx...\n")
	if err := e.runPS(fmt.Sprintf(`Mount-VHD -Path "%s"`, e.BasePath)); err != nil {
		return err
	}
	e.ActivePath = e.BasePath

	fmt.Println("[ROLLBACK] Obliterating all differencing layers...")
	files, _ := os.ReadDir(e.CheckpointDir)
	for _, f := range files {
		_ = os.Remove(filepath.Join(e.CheckpointDir, f.Name()))
	}

	fmt.Println("[ROLLBACK] Restored pristine baseline.")
	return nil
}
