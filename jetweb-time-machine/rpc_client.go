package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// --- Substrate RPC Core ---

type SubstrateClient struct {
	RPCURL string
}

func NewSubstrateClient(url string) *SubstrateClient {
	return &SubstrateClient{RPCURL: url}
}

// Generic JSON-RPC request
type rpcRequest struct {
	Jsonrpc string        `json:"jsonrpc"`
	Method  string        `json:"method"`
	Params  []interface{} `json:"params"`
	ID      int           `json:"id"`
}

type rpcResponse struct {
	Jsonrpc string          `json:"jsonrpc"`
	Result  json.RawMessage `json:"result"`
	Error   *struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
	} `json:"error,omitempty"`
	ID int `json:"id"`
}

// --- Domain structs ---

type TauBalances struct {
	AccountBalance  uint64
	TreasuryBalance uint64
}

type DistributionEpochInfo struct {
	LastEpoch uint64
	NextEpoch uint64
}

type DistributionBreakdown struct {
	AgentDividendsPercent       float64
	ValidatorPayoutsPercent     float64
	EnvironmentSubsidiesPercent float64
	RollbackInsurancePercent    float64
}

func (c *SubstrateClient) callRPC(method string, params []interface{}) (json.RawMessage, error) {
	req := rpcRequest{
		Jsonrpc: "2.0",
		Method:  method,
		Params:  params,
		ID:      1,
	}
	body, _ := json.Marshal(req)

	resp, err := http.Post(c.RPCURL, "application/json", bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var rpcResp rpcResponse
	if err := json.NewDecoder(resp.Body).Decode(&rpcResp); err != nil {
		return nil, err
	}
	if rpcResp.Error != nil {
		return nil, fmt.Errorf("rpc error: %s", rpcResp.Error.Message)
	}
	return rpcResp.Result, nil
}

// scaleDecode mocks decoding SCALE bytes for MVP purposes
func scaleDecode(data []byte, v interface{}) error {
	// MOCK DECODER: in a real implementation we would decode SCALE bytes
	// For testing, we just cast mock static values.
	if p, ok := v.(*uint64); ok {
		*p = 1000 // Mock balance
	}
	return nil
}

func (c *SubstrateClient) GetTauBalances(account string) (*TauBalances, error) {
	accRes, err := c.callRPC("state_getStorage", []interface{}{"0xACCOUNT_TAU_KEY"})
	if err != nil {
		return nil, err
	}
	var accountBalance uint64
	_ = scaleDecode(accRes, &accountBalance)

	treRes, err := c.callRPC("state_getStorage", []interface{}{"0xTREASURY_TAU_KEY"})
	if err != nil {
		return nil, err
	}
	var treasuryBalance uint64
	_ = scaleDecode(treRes, &treasuryBalance)

	return &TauBalances{
		AccountBalance:  accountBalance,
		TreasuryBalance: treasuryBalance,
	}, nil
}

func (c *SubstrateClient) GetDistributionEpochInfo() (*DistributionEpochInfo, error) {
	res, err := c.callRPC("state_getStorage", []interface{}{"0xDISTRIBUTION_EPOCH_KEY"})
	if err != nil {
		return nil, err
	}
	var last, next uint64
	_ = scaleDecode(res, &last)

	next = last + 10000

	return &DistributionEpochInfo{
		LastEpoch: last,
		NextEpoch: next,
	}, nil
}

func GetDistributionBreakdown() *DistributionBreakdown {
	return &DistributionBreakdown{
		AgentDividendsPercent:       40.0,
		ValidatorPayoutsPercent:     30.0,
		EnvironmentSubsidiesPercent: 20.0,
		RollbackInsurancePercent:    10.0,
	}
}

// --- SAC Governance Types ---

type SACPower struct {
	Power uint64
}

type MutationProposal struct {
	ProposalID  uint64
	Proposer    string
	Description string
	Status      string
}

type MutationQueue struct {
	Proposals []MutationProposal
}

type VoteResponse struct {
	Success string `json:"success"`
	Message string `json:"message"`
}

// Query SAC power for an account
func (c *SubstrateClient) GetSACPower(account string) (*SACPower, error) {
	res, err := c.callRPC("state_getStorage", []interface{}{"0xSAC_POWER_KEY"})
	if err != nil {
		return nil, err
	}

	var power uint64
	_ = scaleDecode(res, &power)

	return &SACPower{Power: power}, nil
}

// stake_axiom extrinsic
func (c *SubstrateClient) StakeAxiom(account string, amount uint64) error {
	_, err := c.callRPC("author_submitExtrinsic",
		[]interface{}{fmt.Sprintf("0xSTAKE_AXIOM_%s_%d", account, amount)})
	return err
}

// unstake_axiom extrinsic
func (c *SubstrateClient) UnstakeAxiom(account string, amount uint64) error {
	_, err := c.callRPC("author_submitExtrinsic",
		[]interface{}{fmt.Sprintf("0xUNSTAKE_AXIOM_%s_%d", account, amount)})
	return err
}

// propose_mutation extrinsic
func (c *SubstrateClient) ProposeMutation(account, description string) error {
	_, err := c.callRPC("author_submitExtrinsic",
		[]interface{}{fmt.Sprintf("0xPROPOSE_MUTATION_%s_%s", account, description)})
	return err
}

// cast_vote extrinsic
func (c *SubstrateClient) CastVote(account string, proposalID uint64, approve bool) error {
	voteFlag := 0
	if approve {
		voteFlag = 1
	}
	_, err := c.callRPC("author_submitExtrinsic",
		[]interface{}{fmt.Sprintf("0xCAST_VOTE_%s_%d_%d", account, proposalID, voteFlag)})
	return err
}

// Query mutation queue
func (c *SubstrateClient) GetMutationQueue() (*MutationQueue, error) {
	res, err := c.callRPC("state_getStorage", []interface{}{"0xMUTATION_QUEUE_KEY"})
	if err != nil {
		return nil, err
	}

	var queue MutationQueue
	_ = scaleDecode(res, &queue)

	return &queue, nil
}

// --- Mesh Diagnostics Types ---

type MeshHealth struct {
	TreasuryBalance   uint64
	TotalAgents       uint64
	TotalValidators   uint64
	TotalEnvironments uint64
}

func (c *SubstrateClient) GetMeshHealth() (*MeshHealth, error) {
	// Treasury
	treRes, err := c.callRPC("state_getStorage", []interface{}{"0xTREASURY_TAU_KEY"})
	if err != nil {
		return nil, err
	}
	var treasury uint64
	_ = scaleDecode(treRes, &treasury)

	// Agent count
	agRes, err := c.callRPC("state_getStorage", []interface{}{"0xAGENT_COUNT_KEY"})
	if err != nil {
		return nil, err
	}
	var agents uint64
	_ = scaleDecode(agRes, &agents)

	// Validator count
	valRes, err := c.callRPC("state_getStorage", []interface{}{"0xVALIDATOR_COUNT_KEY"})
	if err != nil {
		return nil, err
	}
	var validators uint64
	_ = scaleDecode(valRes, &validators)

	// Environment count
	envRes, err := c.callRPC("state_getStorage", []interface{}{"0xENVIRONMENT_COUNT_KEY"})
	if err != nil {
		return nil, err
	}
	var envs uint64
	_ = scaleDecode(envRes, &envs)

	return &MeshHealth{
		TreasuryBalance:   treasury,
		TotalAgents:       agents,
		TotalValidators:   validators,
		TotalEnvironments: envs,
	}, nil
}

// --- Temporal Checkpoint Types ---

type TimeslipInfo struct {
	TimeslipID uint64
	Owner      string
	Open       bool
}

type CheckpointInfo struct {
	CheckpointID uint64
	TimeslipID   uint64
	Owner        string
	Timestamp    uint64
}

type RollbackResult struct {
	EffectiveBurn uint64
	SubsidyUsed   uint64
	Success       bool
}

// Open a new timeslip
func (c *SubstrateClient) OpenTimeslip(account string) error {
	_, err := c.callRPC("author_submitExtrinsic",
		[]interface{}{fmt.Sprintf("0xOPEN_TIMESLIP_%s", account)})
	return err
}

// Close a timeslip
func (c *SubstrateClient) CloseTimeslip(account string, timeslipID uint64) error {
	_, err := c.callRPC("author_submitExtrinsic",
		[]interface{}{fmt.Sprintf("0xCLOSE_TIMESLIP_%s_%d", account, timeslipID)})
	return err
}

// Create a checkpoint
func (c *SubstrateClient) CreateCheckpoint(account string, timeslipID uint64) error {
	_, err := c.callRPC("author_submitExtrinsic",
		[]interface{}{fmt.Sprintf("0xCREATE_CHECKPOINT_%s_%d", account, timeslipID)})
	return err
}

// Annihilate a checkpoint (rollback)
func (c *SubstrateClient) AnnihilateCheckpoint(account string, checkpointID uint64) (*RollbackResult, error) {
	res, err := c.callRPC("author_submitExtrinsic",
		[]interface{}{fmt.Sprintf("0xANNIHILATE_CHECKPOINT_%s_%d", account, checkpointID)})
	if err != nil {
		return nil, err
	}

	var result RollbackResult
	_ = scaleDecode(res, &result)

	return &result, nil
}

// Query active timeslips
func (c *SubstrateClient) GetActiveTimeslips(account string) ([]TimeslipInfo, error) {
	res, err := c.callRPC("state_getStorage", []interface{}{"0xTIMESLIP_LIST_KEY"})
	if err != nil {
		return nil, err
	}

	var slips []TimeslipInfo
	_ = scaleDecode(res, &slips)

	return slips, nil
}

// Query checkpoints
func (c *SubstrateClient) GetCheckpoints(timeslipID uint64) ([]CheckpointInfo, error) {
	res, err := c.callRPC("state_getStorage", []interface{}{"0xCHECKPOINT_LIST_KEY"})
	if err != nil {
		return nil, err
	}

	var cps []CheckpointInfo
	_ = scaleDecode(res, &cps)

	return cps, nil
}

// --- Cognitive Session Types ---

type CognitiveSession struct {
	SessionID string
	AgentID   string
	PageID    string
	Stage     string // L1, L2, L3, L4
}

type RawEvent struct {
	EventID   string
	Payload   string
	Timestamp uint64
}

type SemanticResult struct {
	RelationshipType string
	EntityA          string
	EntityB          string
	Epoch            uint64
}

type KnowledgeCommitResult struct {
	Success   bool
	Extrinsic string
}

func (c *SubstrateClient) SemanticExtract(session CognitiveSession) (*SemanticResult, error) {
	// Placeholder: real extraction will come from mgsh_mcp
	return &SemanticResult{
		RelationshipType: "AGENT_CONTEXTUALIZED",
		EntityA:          session.AgentID,
		EntityB:          "RESOURCE_X",
		Epoch:            uint64(time.Now().Unix()),
	}, nil
}

func (c *SubstrateClient) CommitKnowledge(result SemanticResult) (*KnowledgeCommitResult, error) {
	extrinsic := fmt.Sprintf("0xCOMMIT_KNOWLEDGE_%s_%s_%d",
		result.EntityA, result.EntityB, result.Epoch)

	_, err := c.callRPC("author_submitExtrinsic", []interface{}{extrinsic})
	if err != nil {
		return nil, err
	}

	return &KnowledgeCommitResult{
		Success:   true,
		Extrinsic: extrinsic,
	}, nil
}

// --- Temporal Mesh Visualization Layer Types ---

type TreasuryFlowSnapshot struct {
	TreasuryBalance  uint64
	AgentShare       float64
	ValidatorShare   float64
	EnvironmentShare float64
	InsuranceShare   float64
}

type AgentEvolutionSnapshot struct {
	TotalAgents uint64
	TopAgents   []string
}

type ValidatorStabilitySnapshot struct {
	TotalValidators uint64
	TopValidators   []string
}

type EnvironmentGrowthSnapshot struct {
	TotalEnvironments uint64
	TopEnvironments   []string
}

// Snapshot helpers

func (c *SubstrateClient) GetTreasuryFlowSnapshot() (*TreasuryFlowSnapshot, error) {
	health, err := c.GetMeshHealth()
	if err != nil {
		return nil, err
	}
	return &TreasuryFlowSnapshot{
		TreasuryBalance:  health.TreasuryBalance,
		AgentShare:       40.0,
		ValidatorShare:   30.0,
		EnvironmentShare: 20.0,
		InsuranceShare:   10.0,
	}, nil
}

func (c *SubstrateClient) GetAgentEvolutionSnapshot() (*AgentEvolutionSnapshot, error) {
	health, err := c.GetMeshHealth()
	if err != nil {
		return nil, err
	}
	// Placeholder: wire to pallet_marketplace::AgentStats later
	return &AgentEvolutionSnapshot{
		TotalAgents: health.TotalAgents,
		TopAgents:   []string{"ag-core-genesis-test", "B987", "C456"},
	}, nil
}

func (c *SubstrateClient) GetValidatorStabilitySnapshot() (*ValidatorStabilitySnapshot, error) {
	health, err := c.GetMeshHealth()
	if err != nil {
		return nil, err
	}
	return &ValidatorStabilitySnapshot{
		TotalValidators: health.TotalValidators,
		TopValidators:   []string{"val-alpha", "val-beta"},
	}, nil
}

func (c *SubstrateClient) GetEnvironmentGrowthSnapshot() (*EnvironmentGrowthSnapshot, error) {
	health, err := c.GetMeshHealth()
	if err != nil {
		return nil, err
	}
	return &EnvironmentGrowthSnapshot{
		TotalEnvironments: health.TotalEnvironments,
		TopEnvironments:   []string{"env-singularity-27", "env-lab-01"},
	}, nil
}
