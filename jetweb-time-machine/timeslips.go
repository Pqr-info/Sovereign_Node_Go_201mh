package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"time"
)

type TimeslipStatus string

const (
	StatusOpen        TimeslipStatus = "OPEN"
	StatusClosed      TimeslipStatus = "CLOSED"
	StatusInvalidated TimeslipStatus = "INVALIDATED"
)

type Timeslip struct {
	ID              string         `json:"id"`
	Title           string         `json:"title"`
	Status          TimeslipStatus `json:"status"`
	CheckpointID    string         `json:"checkpoint_id"`
	Billable        bool           `json:"billable"`
	Rate            float64        `json:"rate"`
	Start           int64          `json:"start"`
	End             int64          `json:"end"`
	DurationSeconds int64          `json:"duration_seconds"`
	Cost            float64        `json:"cost"`
	RollbackNote    string         `json:"rollback_note,omitempty"`
}

type DefaultTimeslipEngine struct {
	StorageDir        string
	SnapshotEngine    SnapshotEngine
	SingularityClient SingularityClient
}

func NewTimeslipEngine(snapshot SnapshotEngine, singClient SingularityClient) *DefaultTimeslipEngine {
	dir := `C:\JetWeb\wslenv\timeslips`
	os.MkdirAll(dir, 0755)
	return &DefaultTimeslipEngine{
		StorageDir:        dir,
		SnapshotEngine:    snapshot,
		SingularityClient: singClient,
	}
}

func (e *DefaultTimeslipEngine) getNextID() string {
	slips, _ := e.ListTimeslips()
	return fmt.Sprintf("TS-2026-%06d", len(slips)+1)
}

func (e *DefaultTimeslipEngine) saveTimeslip(ts *Timeslip) error {
	b, err := json.MarshalIndent(ts, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(filepath.Join(e.StorageDir, ts.ID+".json"), b, 0644)
}

func (e *DefaultTimeslipEngine) OpenTimeslip(title string, billable bool, rate float64) (*Timeslip, error) {
	if rate == 0 {
		rate = State.HourlyRate
	}

	fmt.Printf("[TIMESLIP] Opening Timeslip: %s...\n", title)
	
	// Create bound checkpoint
	cpID, err := e.SnapshotEngine.CreateCheckpoint("Timeslip: " + title)
	if err != nil {
		return nil, fmt.Errorf("failed to create bound checkpoint: %v", err)
	}

	ts := &Timeslip{
		ID:           e.getNextID(),
		Title:        title,
		Status:       StatusOpen,
		CheckpointID: cpID,
		Billable:     billable,
		Rate:         rate,
		Start:        time.Now().Unix(),
	}

	if err := e.saveTimeslip(ts); err != nil {
		return nil, err
	}

	if e.SingularityClient != nil {
		e.SingularityClient.Emit(NewSingularityEvent(EventTimeslipOpened, ts))
	}

	fmt.Printf("[TIMESLIP] Successfully opened %s. Bound to checkpoint %s. Timer started at $%.2f/hr.\n", ts.ID, cpID, rate)
	return ts, nil
}

func (e *DefaultTimeslipEngine) getTimeslip(id string) (*Timeslip, error) {
	b, err := os.ReadFile(filepath.Join(e.StorageDir, id+".json"))
	if err != nil {
		return nil, err
	}
	var ts Timeslip
	if err := json.Unmarshal(b, &ts); err != nil {
		return nil, err
	}
	return &ts, nil
}

func (e *DefaultTimeslipEngine) CloseTimeslip(id string) (*Timeslip, error) {
	ts, err := e.getTimeslip(id)
	if err != nil {
		return nil, fmt.Errorf("timeslip not found: %v", err)
	}

	if ts.Status != StatusOpen {
		return nil, fmt.Errorf("timeslip %s is not open", id)
	}

	ts.Status = StatusClosed
	ts.End = time.Now().Unix()
	ts.DurationSeconds = ts.End - ts.Start
	
	if ts.Billable {
		hours := float64(ts.DurationSeconds) / 3600.0
		ts.Cost = hours * ts.Rate
	}

	if err := e.saveTimeslip(ts); err != nil {
		return nil, err
	}

	if e.SingularityClient != nil {
		e.SingularityClient.Emit(NewSingularityEvent(EventTimeslipClosed, ts))
	}

	fmt.Printf("[TIMESLIP] %s closed. Duration: %ds. Total Cost: $%.2f\n", ts.ID, ts.DurationSeconds, ts.Cost)
	fmt.Printf("[SINGULARITY] Timeslip closed. You earned %d τ.\n", int(ts.Cost))
	return ts, nil
}

func (e *DefaultTimeslipEngine) RollbackTimeslip(id string) error {
	ts, err := e.getTimeslip(id)
	if err != nil {
		return fmt.Errorf("timeslip not found: %v", err)
	}

	// Calculate final cost if it was open
	if ts.Status == StatusOpen {
		ts.End = time.Now().Unix()
		ts.DurationSeconds = ts.End - ts.Start
		if ts.Billable {
			hours := float64(ts.DurationSeconds) / 3600.0
			ts.Cost = hours * ts.Rate
		}
	}

	fmt.Printf("[TIMESLIP ROLLBACK] Triggering temporal rollback to %s (Bound CP: %s)...\n", ts.ID, ts.CheckpointID)
	fmt.Printf("[SINGULARITY] This operation will burn 100 τ. Proceeding...\n")
	
	// Issue destructive rollback to the physical engine
	if err := e.SnapshotEngine.RollbackToCheckpoint(ts.CheckpointID); err != nil {
		return fmt.Errorf("failed to execute physical rollback: %v", err)
	}

	// Mark as invalidated by its own rollback
	ts.Status = StatusInvalidated
	ts.RollbackNote = fmt.Sprintf("Rolled back manually at %v", time.Now().Unix())
	e.saveTimeslip(ts)

	if e.SingularityClient != nil {
		e.SingularityClient.Emit(NewSingularityEvent(EventTimeslipInvalidated, ts))
	}

	// Invalidate downstream timeslips
	slips, _ := e.ListTimeslips()
	for _, slip := range slips {
		// If slip started after this one, it's downstream and invalidated
		if slip.Start > ts.Start && slip.Status != StatusInvalidated {
			slip.Status = StatusInvalidated
			slip.RollbackNote = fmt.Sprintf("Invalidated by destructive rollback to %s / %s", ts.ID, ts.CheckpointID)
			
			// Finalize timer if it was open
			if slip.End == 0 {
				slip.End = time.Now().Unix()
				slip.DurationSeconds = slip.End - slip.Start
				if slip.Billable {
					hours := float64(slip.DurationSeconds) / 3600.0
					slip.Cost = hours * slip.Rate
				}
			}
			e.saveTimeslip(&slip)
			
			if e.SingularityClient != nil {
				e.SingularityClient.Emit(NewSingularityEvent(EventTimeslipInvalidated, slip))
			}
			
			fmt.Printf("[TIMESLIP AUDIT] Orphaned downstream timeslip %s invalidated.\n", slip.ID)
		}
	}

	fmt.Printf("[TIMESLIP ROLLBACK] Successfully rolled universe back to %s.\n", ts.ID)
	return nil
}

func (e *DefaultTimeslipEngine) ListTimeslips() ([]Timeslip, error) {
	files, err := os.ReadDir(e.StorageDir)
	if err != nil {
		return nil, err
	}

	var slips []Timeslip
	for _, f := range files {
		if filepath.Ext(f.Name()) == ".json" {
			b, err := os.ReadFile(filepath.Join(e.StorageDir, f.Name()))
			if err == nil {
				var ts Timeslip
				if err := json.Unmarshal(b, &ts); err == nil {
					slips = append(slips, ts)
				}
			}
		}
	}

	// Sort chronologically
	sort.Slice(slips, func(i, j int) bool {
		return slips[i].Start < slips[j].Start
	})

	return slips, nil
}
