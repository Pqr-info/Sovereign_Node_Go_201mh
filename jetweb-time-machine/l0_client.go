package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type L0Client struct {
	BaseURL string
}

func NewL0Client(url string) *L0Client {
	return &L0Client{BaseURL: url}
}

type AllocatePageRequest struct {
	AgentID string `json:"agent_id"`
}

type AllocatePageResponse struct {
	Success       string `json:"success"`
	Message       string `json:"message"`
	PageID        string `json:"page_id"`
	InitialOwner  string `json:"initial_owner"`
}

type AttachAgentRequest struct {
	PageID  string `json:"PageID"`
	AgentID string `json:"AgentID"`
}

type GenericResponse struct {
	Success string `json:"success"`
	Message string `json:"message"`
	PageID  string `json:"page_id,omitempty"`
}

type SwapAgentsRequest struct {
	PageID string `json:"page_id"`
	AgentA string `json:"agent_a"`
	AgentB string `json:"agent_b"`
}

type ContextSliceRequest struct {
	PageID string `json:"PageID"`
	Length int    `json:"Length"`
}

type ContextSliceResponse struct {
	Success string `json:"success"`
	DataLen int    `json:"data_len"`
}

type CommitSliceRequest struct {
	PageID     string `json:"PageID"`
	DataBase64 string `json:"DataBase64"`
}

func (c *L0Client) post(path string, payload interface{}, out interface{}) error {
	body, _ := json.Marshal(payload)
	resp, err := http.Post(c.BaseURL+path, "application/json", bytes.NewReader(body))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if out != nil {
		return json.NewDecoder(resp.Body).Decode(out)
	}
	return nil
}

func (c *L0Client) AllocatePage(agentID string) (*AllocatePageResponse, error) {
	req := AllocatePageRequest{AgentID: agentID}
	var resp AllocatePageResponse
	if err := c.post("/allocate_page", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (c *L0Client) AttachAgent(pageID, agentID string) (*GenericResponse, error) {
	req := AttachAgentRequest{PageID: pageID, AgentID: agentID}
	var resp GenericResponse
	if err := c.post("/attach_agent", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (c *L0Client) SwapAgents(pageID, agentA, agentB string) (*GenericResponse, error) {
	req := SwapAgentsRequest{PageID: pageID, AgentA: agentA, AgentB: agentB}
	var resp GenericResponse
	if err := c.post("/swap_agents", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (c *L0Client) GetContextSlice(pageID string, length int) (*ContextSliceResponse, error) {
	req := ContextSliceRequest{PageID: pageID, Length: length}
	var resp ContextSliceResponse
	if err := c.post("/context_slice", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (c *L0Client) CommitSlice(pageID, dataBase64 string) (*GenericResponse, error) {
	req := CommitSliceRequest{PageID: pageID, DataBase64: dataBase64}
	var resp GenericResponse
	if err := c.post("/commit_slice", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

type TeleportationLogEntry struct {
	PageID    string
	AgentA    string
	AgentB    string
	Timestamp uint64
}

type TeleportationLog struct {
	Entries []TeleportationLogEntry
}

type ACSBootInfo struct {
	Runlevel       string
	CPUCores       int
	RAMMB          uint64
	ActiveServices []string
}

func (c *L0Client) GetTeleportationLog() (*TeleportationLog, error) {
	resp, err := http.Get(c.BaseURL + "/teleportation_log")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var log TeleportationLog
	if err := json.NewDecoder(resp.Body).Decode(&log); err != nil {
		return nil, err
	}
	return &log, nil
}

func (c *L0Client) GetACSBootInfo() (*ACSBootInfo, error) {
	resp, err := http.Get(c.BaseURL + "/acs_status")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var info ACSBootInfo
	if err := json.NewDecoder(resp.Body).Decode(&info); err != nil {
		return nil, err
	}
	return &info, nil
}

func (c *L0Client) StartCognitiveSession(agentID string) (*CognitiveSession, error) {
	// Allocate page for the session
	alloc, err := c.AllocatePage(agentID)
	if err != nil {
		return nil, err
	}

	session := &CognitiveSession{
		SessionID: fmt.Sprintf("SESSION_%d", time.Now().UnixNano()),
		AgentID:   agentID,
		PageID:    alloc.PageID,
		Stage:     "L1",
	}

	return session, nil
}

func (c *L0Client) WriteRawEvent(pageID string, event RawEvent) error {
	data := fmt.Sprintf("%s|%s|%d", event.EventID, event.Payload, event.Timestamp)
	encoded := base64.StdEncoding.EncodeToString([]byte(data))
	_, err := c.CommitSlice(pageID, encoded)
	return err
}
