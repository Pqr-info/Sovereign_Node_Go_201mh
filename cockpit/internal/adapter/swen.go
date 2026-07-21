package adapter

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"
)

type SwenClient struct {
	httpClient   *http.Client
	swarmAPIURL  string
	ticketAPIURL string
}

func NewSwenClient(swarmAPIURL, ticketAPIURL string) *SwenClient {
	if ticketAPIURL == "" {
		ticketAPIURL = "http://127.0.0.1:3196"
	}
	return &SwenClient{
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
		swarmAPIURL:  swarmAPIURL,
		ticketAPIURL: ticketAPIURL,
	}
}

type ProxyEvent struct {
	Proxy    string `json:"proxy"`
	URL      string `json:"url"`
	Method   string `json:"method"`
	ReqBody  string `json:"reqBody"`
	RespBody string `json:"respBody"`
	Status   int    `json:"status"`
}

type ChatCompletion struct {
	Choices []struct {
		Message struct {
			Role             string `json:"role"`
			Content          string `json:"content"`
			ReasoningContent string `json:"reasoning_content"`
		} `json:"message"`
	} `json:"choices"`
}

func (c *SwenClient) FetchSwarmStream(ctx context.Context) ([]string, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", c.ticketAPIURL+"/REST/2.0/tickets", nil)
	if err != nil {
		return nil, err
	}
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return []string{"[Stream Offline]"}, nil
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return []string{fmt.Sprintf("[HTTP %d Error]", resp.StatusCode)}, nil
	}

	var tickets []map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&tickets); err != nil {
		return nil, err
	}

	var stream []string
	for _, t := range tickets {
		stream = append(stream, fmt.Sprintf("Ticket %v [%s] created by %v", t["id"], t["status"], t["creator_agent_id"]))
	}
	if len(stream) == 0 {
		stream = append(stream, "No active swarm stream tickets.")
	}
	return stream, nil
}

func (c *SwenClient) FetchTimeline(ctx context.Context) ([]string, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", c.ticketAPIURL+"/REST/2.0/sos/timeline", nil)
	if err != nil {
		return nil, err
	}
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return []string{"[Timeline Offline]"}, nil
	}
	defer resp.Body.Close()

	var res struct {
		Events []string `json:"events"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return nil, err
	}

	if len(res.Events) == 0 {
		return []string{"Sovereign timeline clean. No fault iterations recorded."}, nil
	}
	return res.Events, nil
}

func (c *SwenClient) SendAgentMessage(ctx context.Context, agentID, msg string) error {
	payload := map[string]string{
		"sender":  "COCKPIT-USER",
		"message": msg,
	}
	payloadBytes, _ := json.Marshal(payload)
	req, err := http.NewRequestWithContext(ctx, "POST", fmt.Sprintf("%s/REST/2.0/agent/%s/message", c.ticketAPIURL, agentID), bytes.NewBuffer(payloadBytes))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return fmt.Errorf("failed to send message, status: %d", resp.StatusCode)
	}
	return nil
}

func (c *SwenClient) ExecuteCommand(ctx context.Context, cmd string) (string, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", fmt.Sprintf("%s/REST/2.0/bridge?cmd=%s", c.ticketAPIURL, url.QueryEscape(cmd)), nil)
	if err != nil {
		return "", err
	}
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("command execution error (HTTP %d): %s", resp.StatusCode, string(bodyBytes))
	}
	return string(bodyBytes), nil
}
