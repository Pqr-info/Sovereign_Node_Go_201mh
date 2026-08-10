package service

import (
	"context"
	"encoding/json"
	"log"
	"time"

	pb "pqr.info/proto/gemma4"
)

type ExperienceStore interface {
	SaveBatch(ctx context.Context, batchID string, exps []*pb.Experience) error
	ListRecent(ctx context.Context, since time.Time) ([]*pb.Experience, error)
	SaveModelUpdate(ctx context.Context, update *ModelUpdate) error
}

type ModelUpdate struct {
	ID        string             `json:"id"`
	Timestamp time.Time          `json:"timestamp"`
	Metrics   map[string]float64 `json:"metrics"`
	Notes     string             `json:"notes"`
}

type SubstrateLearningLoop struct {
	store      ExperienceStore
	brain      *BrainAdapter
	interval   time.Duration
	windowSize time.Duration
}

func NewSubstrateLearningLoop(store ExperienceStore, brain *BrainAdapter) *SubstrateLearningLoop {
	return &SubstrateLearningLoop{
		store:      store,
		brain:      brain,
		interval:   5 * time.Minute,
		windowSize: 1 * time.Hour,
	}
}

func (s *SubstrateLearningLoop) Start(ctx context.Context) {
	ticker := time.NewTicker(s.interval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			if err := s.runLearningPass(ctx); err != nil {
				log.Printf("[SUBSTRATE] learning pass error: %v", err)
			}
		}
	}
}

func (s *SubstrateLearningLoop) runLearningPass(ctx context.Context) error {
	since := time.Now().Add(-s.windowSize)
	exps, err := s.store.ListRecent(ctx, since)
	if err != nil || len(exps) == 0 {
		return err
	}

	summary := s.buildSummary(exps)

	resp, err := s.brain.Plan(ctx, "substrate-learning", "update substrate priors", summary)
	if err != nil {
		return err
	}

	update := &ModelUpdate{
		ID:        time.Now().UTC().Format("20060102T150405.000Z"),
		Timestamp: time.Now().UTC(),
		Metrics:   map[string]float64{},
		Notes:     resp,
	}
	return s.store.SaveModelUpdate(ctx, update)
}

func (s *SubstrateLearningLoop) buildSummary(exps []*pb.Experience) string {
	type compact struct {
		Type    string `json:"type"`
		Source  string `json:"source"`
		Path    string `json:"path,omitempty"`
		Snippet string `json:"snippet"`
	}
	var out []compact

	for _, e := range exps {
		var meta map[string]string
		_ = json.Unmarshal([]byte(e.MetadataJson), &meta)

		snippet := e.Content
		if len(snippet) > 512 {
			snippet = snippet[:512]
		}

		out = append(out, compact{
			Type:    e.Type,
			Source:  e.Source,
			Path:    meta["path"],
			Snippet: snippet,
		})
	}

	b, _ := json.Marshal(out)
	return string(b)
}
