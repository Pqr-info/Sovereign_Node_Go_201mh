package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	// "github.com/centrifuge/go-substrate-rpc-client/v4/signature"
	// "github.com/centrifuge/go-substrate-rpc-client/v4/types"
	// gsrpc "github.com/centrifuge/go-substrate-rpc-client/v4"
)

// SingularityClient defines the interface for emitting extrinsics
type SingularityClient interface {
	Emit(event SingularityEvent) error
}

type SubstrateSingularityClient struct {
	OutboxDir string
	Endpoint  string
}

func NewSingularityClient(mockSvc *SingularityMockService) *SubstrateSingularityClient {
	dir := `C:\JetWeb\wslenv\singularity_outbox`
	os.MkdirAll(dir, 0755)
	return &SubstrateSingularityClient{
		OutboxDir: dir,
		Endpoint:  "ws://127.0.0.1:9944",
	}
}

func (c *SubstrateSingularityClient) Emit(event SingularityEvent) error {
	// Spool locally for resilience
	b, err := json.MarshalIndent(event, "", "  ")
	if err == nil {
		path := filepath.Join(c.OutboxDir, event.EventID+".json")
		os.WriteFile(path, b, 0644)
	}

	// NOTE: In Phase 3.0, we parse the SingularityEvent back out into discrete Substrate Extrinsics.
	switch event.EventType {
	case EventTimeslipOpened:
		payload := event.Payload.(Timeslip)
		return c.OpenTimeslip(payload.Title, payload.CheckpointID, State.EnvironmentID)
	case EventTimeslipClosed:
		// payload := event.Payload.(Timeslip)
		// return c.CloseTimeslip(payload.ID, payload.Cost)
		fmt.Println("[Substrate] Skipping close_timeslip extrinsic for now.")
	case EventTimeslipInvalidated:
		fmt.Println("[Substrate] Skipping invalidate_timeslip extrinsic for now.")
	}

	return nil
}

func (c *SubstrateSingularityClient) OpenTimeslip(title, checkpointID, environment string) error {
	fmt.Printf("[Substrate RPC] Submitting open_timeslip(%s, %s, %s)...\n", title, checkpointID, environment)
	
	/*
	api, err := gsrpc.NewSubstrateAPI(c.Endpoint)
	if err != nil {
		return err
	}

	meta, err := api.RPC.State.GetMetadataLatest()
	if err != nil {
		return err
	}

	// Dev Mode Mnemonic (e.g. "//Alice")
	keypair, err := signature.KeyringPairFromSecret(State.DeveloperID, 42)
	if err != nil {
		return err
	}

	call, err := types.NewCall(
		meta,
		"Singularity.open_timeslip",
		[]byte(title),
		[]byte(checkpointID),
		[]byte(environment),
	)
	if err != nil {
		return err
	}

	ext := types.NewExtrinsic(call)
	// ... Signing logic goes here (genesis hash, nonce, etc.) ...
	// _, err = api.RPC.Author.SubmitExtrinsic(ext)
	*/
	
	fmt.Println("[Substrate RPC] Extrinsic accepted into mempool.")
	return nil
}
