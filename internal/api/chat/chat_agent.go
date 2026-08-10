package chat

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"pqr.info/internal/service"
)

// RunChatAgent executes the Antigravity agent logic for a specific mission
func RunChatAgent(ctx context.Context, swarmSvc *service.SwarmService, missionID string) {
	agentName := "chat_agent"
	agentStateKey := fmt.Sprintf("mission:%s:agents:%s", missionID, agentName)

	// BOOT
	swarmSvc.SyncState(ctx, "chat", "orchestrator", agentName, "agent", map[string]interface{}{
		agentStateKey: map[string]interface{}{
			"status": "running",
		},
	})

	// OBSERVE
	ticket1Key := fmt.Sprintf("mission:%s:ticket:1", missionID)
	snap, err := swarmSvc.GetState(ctx, "chat", "orchestrator")
	if err != nil {
		log.Printf("[ChatAgent] Failed to get state for mission %s", missionID)
		return
	}

	val, ok := snap.Payload[ticket1Key]
	if !ok {
		log.Printf("[ChatAgent] Failed to read ticket 1 for mission %s", missionID)
		return
	}

	var userMsg map[string]interface{}
	if data, ok := val.(map[string]interface{}); ok {
		userMsg = data
	}

	contentStr, ok := userMsg["content"].(string)
	if !ok {
		contentStr = ""
	}

	// INFER (Call local Gemma/Gemini)
	reply := CallGemini(contentStr)

	// WRITE
	ticket2Key := fmt.Sprintf("mission:%s:ticket:2", missionID)
	swarmSvc.SyncState(ctx, "chat", "orchestrator", agentName, "agent", map[string]interface{}{
		ticket2Key: map[string]interface{}{
			"role":    "assistant",
			"content": reply,
		},
		agentStateKey: map[string]interface{}{
			"status": "completed",
		},
	})
}

// CallGemini calls the local LLM endpoint (simulating the Swarm inference)
func CallGemini(prompt string) string {
	gemmaURL := os.Getenv("GEMMA_ENDPOINT")
	if gemmaURL == "" {
		gemmaURL = "http://127.0.0.1:11435"
	}

	modelName := os.Getenv("GEMMA_MODEL")
	if modelName == "" {
		modelName = "gemma2:2b"
	}

	reqBody := map[string]interface{}{
		"model": modelName,
		"messages": []map[string]interface{}{
			{"role": "user", "content": prompt},
		},
		"stream": false,
	}

	bodyBytes, _ := json.Marshal(reqBody)
	reqObj, _ := http.NewRequest("POST", gemmaURL+"/api/chat", bytes.NewBuffer(bodyBytes))
	reqObj.Header.Set("Content-Type", "application/json")
	reqObj.Header.Set("Accept", "application/json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(reqObj)
	if err != nil {
		return fmt.Sprintf("Error connecting to Gemini/Gemma: %v", err)
	}
	defer resp.Body.Close()

	respBytes, _ := io.ReadAll(resp.Body)
	var result map[string]interface{}
	json.Unmarshal(respBytes, &result)

	if msg, ok := result["message"].(map[string]interface{}); ok {
		if content, ok := msg["content"].(string); ok {
			return content
		}
	}

	return "No response generated."
}
