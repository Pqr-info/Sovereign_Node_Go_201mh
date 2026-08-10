package main

import (
	"fmt"
	"time"
)

// MockTriggerEngine simulates continuous monitoring of protected zones.
type MockTriggerEngine struct {
	watching bool
	triggers []string
}

func NewMockTriggerEngine() *MockTriggerEngine {
	return &MockTriggerEngine{
		watching: false,
		triggers: []string{
			"WSL: apt install/upgrade",
			"WSL: package manager changes",
			"WSL: distro updates",
			"VS Code: extension install/update",
			"VS Code: update",
			"VS Code: language server update",
			"VS Code: workspace metadata changes",
			"Visual Studio: plugin install/update",
			"Visual Studio: IDE update",
			"Visual Studio: solution migration",
			"Visual Studio: NuGet restore",
			"JetBrains: plugin install/update",
			"JetBrains: IDE update",
			"JetBrains: index rebuild",
			"JetBrains: project migration",
			"Docker: docker pull",
			"Docker: docker build",
			"Docker: docker compose up --build",
			"Docker: prune operations",
			"Git: pull",
			"Git: merge",
			"Git: rebase",
			"Git: large file additions",
			"Node/Python/Rust/Go: dependency installs",
			"Node/Python/Rust/Go: dependency upgrades",
			"Node/Python/Rust/Go: environment changes",
		},
	}
}

func (e *MockTriggerEngine) StartWatching() error {
	if e.watching {
		return nil
	}
	e.watching = true
	
	// Start background mock ticker
	go func() {
		for {
			if !e.watching {
				break
			}
			time.Sleep(2 * time.Minute)
			// Mock: Randomly trigger a mutation event if we wanted to
		}
	}()

	return nil
}

func (e *MockTriggerEngine) StopWatching() error {
	e.watching = false
	return nil
}

func (e *MockTriggerEngine) GetMutationTriggers() []string {
	return e.triggers
}

// Wrapper handler for menu
func ViewMutationTriggers() {
	triggers := triggerEngine.GetMutationTriggers()
	fmt.Println("\nRegistered Mutation Triggers:")
	for _, t := range triggers {
		fmt.Println(" - " + t)
	}
	fmt.Println("\n(Any of these events will immediately invoke a preemptive Temporal Checkpoint before executing)")
}
