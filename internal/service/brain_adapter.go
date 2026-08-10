package service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	pb "pqr.info/proto/gemma4"
)

type BrainAdapter struct {
	sessions *SessionManager
	client   *http.Client
	endpoint string
}

func NewBrainAdapter() *BrainAdapter {
	endpoint := os.Getenv("GEMMA4_ENDPOINT")
	if endpoint == "" {
		endpoint = "http://localhost:4111"
	}

	return &BrainAdapter{
		sessions: NewSessionManager(),
		client:   &http.Client{Timeout: 60 * time.Second},
		endpoint: endpoint,
	}
}

func (b *BrainAdapter) callGemma(ctx context.Context, sessionID string) (string, error) {
	sess := b.sessions.GetOrCreate(sessionID)

	body, err := json.Marshal(map[string]interface{}{
		"model":    "gemma-4-e4b",
		"messages": sess.Messages,
		"stream":   false,
	})
	if err != nil {
		return "", err
	}

	req, err := http.NewRequestWithContext(ctx, "POST", b.endpoint+"/v1/chat/completions", bytes.NewBuffer(body))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := b.client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("unexpected status code from brain: %d", resp.StatusCode)
	}

	var parsed struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&parsed); err != nil {
		return "", err
	}

	if len(parsed.Choices) == 0 {
		return "", fmt.Errorf("empty response choices from brain")
	}

	content := parsed.Choices[0].Message.Content
	b.sessions.AddMessage(sessionID, "assistant", content)
	return content, nil
}

// Plan initiates a workflow plan from a goal
func (b *BrainAdapter) Plan(ctx context.Context, sessionID, goal, contextStr string) (string, error) {
	prompt := fmt.Sprintf("Goal: %s\nContext: %s\nGenerate a detailed multi-agent workflow plan.", goal, contextStr)
	b.sessions.AddMessage(sessionID, "user", prompt)
	sess := b.sessions.GetOrCreate(sessionID)
	sess.LastTask = "plan"
	return b.callGemma(ctx, sessionID)
}

// Route maps tasks to specific agent capabilities
func (b *BrainAdapter) Route(ctx context.Context, sessionID, task string, availableAgents []string) (string, error) {
	agentsJSON, _ := json.Marshal(availableAgents)
	prompt := fmt.Sprintf("Task: %s\nAvailable Agents: %s\nSelect the best agent and provide routing instructions.", task, string(agentsJSON))
	b.sessions.AddMessage(sessionID, "user", prompt)
	sess := b.sessions.GetOrCreate(sessionID)
	sess.LastTask = "route"
	return b.callGemma(ctx, sessionID)
}

// Heal generates a resolution plan for an execution failure
func (b *BrainAdapter) Heal(ctx context.Context, sessionID, ticketID, snapshot string) (string, error) {
	prompt := fmt.Sprintf("Heal ticket %s. Current system snapshot: %s\nProvide step-by-step resolution actions.", ticketID, snapshot)
	b.sessions.AddMessage(sessionID, "user", prompt)
	sess := b.sessions.GetOrCreate(sessionID)
	sess.LastTask = "heal"
	return b.callGemma(ctx, sessionID)
}

// Continue extends the current conversation session
func (b *BrainAdapter) Continue(ctx context.Context, sessionID string) (string, error) {
	b.sessions.AddMessage(sessionID, "user", "continue")
	return b.callGemma(ctx, sessionID)
}

// SubmitExperience submits a batch of experience metrics to the brain endpoint
func (b *BrainAdapter) SubmitExperience(ctx context.Context, batchID string, experiences []*pb.Experience) error {
	body, err := json.Marshal(pb.ExperienceBatch{
		BatchId:     batchID,
		Experiences: experiences,
	})
	if err != nil {
		return err
	}
	req, err := http.NewRequestWithContext(ctx, "POST", b.endpoint+"/v1/submit_experience", bytes.NewBuffer(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := b.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status from brain experience endpoint: %d", resp.StatusCode)
	}
	return nil
}
