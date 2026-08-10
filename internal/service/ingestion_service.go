package service

import (
	"context"
	"encoding/json"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
	"time"

	pb "pqr.info/proto/gemma4"
)

type IngestionService struct {
	brain     *BrainAdapter
	rootPaths []string
}

func NewIngestionService(brain *BrainAdapter) *IngestionService {
	return &IngestionService{
		brain: brain,
		rootPaths: []string{
			filepath.Join(os.Getenv("USERPROFILE"), ".antigravity"),
			filepath.Join(os.Getenv("USERPROFILE"), ".gemini"),
		},
	}
}

func (s *IngestionService) StartIngestion(ctx context.Context) error {
	for _, root := range s.rootPaths {
		if _, err := os.Stat(root); err == nil {
			if err := s.walkAndIngest(ctx, root); err != nil {
				return err
			}
		}
	}
	return nil
}

func (s *IngestionService) walkAndIngest(ctx context.Context, root string) error {
	var batch []*pb.Experience

	_ = filepath.WalkDir(root, func(path string, d fs.DirEntry, err error) error {
		if err != nil || d.IsDir() {
			return nil
		}

		if !s.isIngestible(path) {
			return nil
		}

		content, err := os.ReadFile(path)
		if err != nil {
			return nil
		}

		exp := s.normalize(path, string(content))
		batch = append(batch, exp)

		if len(batch) >= 50 {
			s.flushBatch(ctx, batch)
			batch = nil
		}

		return nil
	})

	if len(batch) > 0 {
		s.flushBatch(ctx, batch)
	}

	return nil
}

func (s *IngestionService) isIngestible(path string) bool {
	ext := strings.ToLower(filepath.Ext(path))
	switch ext {
	case ".md", ".yaml", ".yml", ".json", ".skill", ".workflow", ".go", ".kt", ".proto", ".ps1", ".txt":
		return true
	default:
		return false
	}
}

func (s *IngestionService) normalize(path, content string) *pb.Experience {
	expType := "knowledge"
	if strings.Contains(path, ".skill") {
		expType = "skill"
	} else if strings.Contains(path, ".workflow") {
		expType = "workflow"
	} else if strings.Contains(path, ".yaml") || strings.Contains(path, ".yml") {
		expType = "config"
	} else if strings.Contains(path, ".go") || strings.Contains(path, ".kt") {
		expType = "code"
	}

	meta := map[string]string{
		"path":      path,
		"timestamp": time.Now().UTC().Format(time.RFC3339),
		"type":      expType,
	}

	metaJSON, _ := json.Marshal(meta)

	return &pb.Experience{
		Type:         expType,
		Source:       "antigravity",
		Content:      content,
		MetadataJson: string(metaJSON),
	}
}

func (s *IngestionService) flushBatch(ctx context.Context, batch []*pb.Experience) {
	batchID := time.Now().UTC().Format("20060102T150405.000Z")
	_ = s.brain.SubmitExperience(ctx, batchID, batch)
}
