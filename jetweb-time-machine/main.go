package main

import (
	"encoding/base64"
	"fmt"
	"io"
	"os/exec"
	"time"
)

var (
	snapshotEngine SnapshotEngine
	triggerEngine  TriggerEngine
	vaultEngine    VaultEngine
	timeslipEngine *DefaultTimeslipEngine
	singularitySvc *SingularityMockService
	singularityClient *SubstrateSingularityClient
)

func main() {
	// Initialize real VHDX differencing engine and mock trigger/vault engines
	snapshotEngine = NewVhdxSnapshotEngine()
	triggerEngine = NewMockTriggerEngine()
	vaultEngine = NewMockVaultEngine()
	singularitySvc = NewSingularityMockService()
	singularityClient = NewSingularityClient(singularitySvc)
	timeslipEngine = NewTimeslipEngine(snapshotEngine, singularityClient)

	// Phase 12 - Start L0 MemoryBridge Server
	go StartL0Server(":8080")

	client := NewSubstrateClient("http://localhost:9933")
	l0 := NewL0Client("http://localhost:8080")
	myAccount := "0xALICE_PUB_KEY" // Placeholder

	for {
		fmt.Println("\n===========================================================")
		fmt.Println(" JETWEB TIME MACHINE - SOVEREIGN MESH CONSOLE")
		fmt.Println(" (Phase 7 - Temporal Organism Interface)")
		fmt.Println("===========================================================")
		fmt.Println("1) Temporal Gas (\u03c4) & Treasury Physics")
		fmt.Println("2) Agents (Marketplace & Reputation)")
		fmt.Println("3) Validators (Stability & Timeline Integrity)")
		fmt.Println("4) Environments (Activity & Subsidies)")
		fmt.Println("5) L0 Cognitive Relay (Teleportation & Memory)")
		fmt.Println("6) Sovereign OS (ACS Introspection)")
		fmt.Println("7) Temporal Governance (SAC)")
		fmt.Println("8) System Diagnostics & Mesh Health")
		fmt.Println("9) Temporal Checkpoint Orchestration")
		fmt.Println("10) Agent Cognitive Sessions (L1 \u2192 L4)")
		fmt.Println("11) Temporal Mesh Visualization Layer")
		fmt.Println("12) Cognitive Reconstruction Engine")
		fmt.Println("0) Exit")
		fmt.Println("===========================================================")
		fmt.Print("Select option: ")

		var choice int
		_, err := fmt.Scanln(&choice)
		if err != nil {
			if err == io.EOF {
				fmt.Println("Stdin closed. Running L0 server in background daemon mode...")
				select {} // block forever
			}
			// Clear buffer on error
			var discard string
			fmt.Scanln(&discard)
			fmt.Println("Invalid input.")
			continue
		}

		switch choice {
		case 1:
			showTemporalGasMenu(client, myAccount)
		case 2:
			fmt.Println("\n[Under Construction] Agents domain pending implementation...")
		case 3:
			fmt.Println("\n[Under Construction] Validators domain pending implementation...")
		case 4:
			fmt.Println("\n[Under Construction] Environments domain pending implementation...")
		case 5:
			showL0RelayMenu(l0)
		case 6:
			fmt.Println("\n[Under Construction] Sovereign OS (ACS) domain pending implementation...")
		case 7:
			showGovernanceMenu(client, myAccount)
		case 8:
			showDiagnosticsMenu(client, l0)
		case 9:
			showTemporalCheckpointMenu(client, myAccount)
		case 10:
			showCognitiveSessionMenu(client, l0, myAccount)
		case 11:
			showVisualizationMenu(client, l0)
		case 12:
			showCognitiveReconstructionMenu(client, l0)
		case 0:
			fmt.Println("Exiting...")
			return
		default:
			fmt.Println("Invalid selection. Please choose an option 0-12.")
		}
	}
}

func showTemporalGasMenu(client *SubstrateClient, myAccount string) {
	for {
		fmt.Println("\n=== Temporal Gas (\u03c4) & Treasury Physics ===")
		fmt.Println("1) View My \u03c4 Balance")
		fmt.Println("2) View Treasury Balance")
		fmt.Println("3) View Last/Next Distribution Epoch")
		fmt.Println("4) View Treasury Distribution Breakdown")
		fmt.Println("5) Back to Main Menu")
		fmt.Print("Select option: ")

		var choice int
		_, err := fmt.Scanln(&choice)
		if err != nil {
			var discard string
			fmt.Scanln(&discard)
			fmt.Println("Invalid input.")
			continue
		}

		switch choice {
		case 1:
			bal, err := client.GetTauBalances(myAccount)
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Printf("My \u03c4 Balance: %d \u03c4\n", bal.AccountBalance)
		case 2:
			bal, err := client.GetTauBalances(myAccount)
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Printf("Treasury Balance: %d \u03c4\n", bal.TreasuryBalance)
		case 3:
			epoch, err := client.GetDistributionEpochInfo()
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Printf("Last Epoch: %d\nNext Epoch: %d\n", epoch.LastEpoch, epoch.NextEpoch)
		case 4:
			br := GetDistributionBreakdown()
			fmt.Printf("Agent Dividends: %.1f%%\n", br.AgentDividendsPercent)
			fmt.Printf("Validator Payouts: %.1f%%\n", br.ValidatorPayoutsPercent)
			fmt.Printf("Environment Subsidies: %.1f%%\n", br.EnvironmentSubsidiesPercent)
			fmt.Printf("Rollback Insurance: %.1f%%\n", br.RollbackInsurancePercent)
		case 5:
			return
		default:
			fmt.Println("Invalid choice.")
		}
	}
}

func showL0RelayMenu(l0 *L0Client) {
	var currentPageID string

	for {
		fmt.Println("\n=== L0 Cognitive Relay \u2014 Teleportation & Memory Physics ===")
		fmt.Println("1) Allocate Page")
		fmt.Println("2) Attach Agent to Page")
		fmt.Println("3) Swap Agents (Teleportation)")
		fmt.Println("4) Read Context Slice")
		fmt.Println("5) Commit Slice")
		fmt.Println("6) Back to Main Menu")
		fmt.Print("Select option: ")

		var choice int
		_, err := fmt.Scanln(&choice)
		if err != nil {
			var discard string
			fmt.Scanln(&discard)
			fmt.Println("Invalid input.")
			continue
		}

		switch choice {
		case 1:
			fmt.Print("Agent ID: ")
			var agentID string
			fmt.Scanln(&agentID)

			resp, err := l0.AllocatePage(agentID)
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}
			currentPageID = resp.PageID
			fmt.Printf("Allocated Page: %s (Owner: %s)\n", resp.PageID, resp.InitialOwner)

		case 2:
			if currentPageID == "" {
				fmt.Println("No current page. Allocate first.")
				continue
			}
			fmt.Print("Agent ID to attach: ")
			var agentID string
			fmt.Scanln(&agentID)

			resp, err := l0.AttachAgent(currentPageID, agentID)
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Println(resp.Message)

		case 3:
			if currentPageID == "" {
				fmt.Println("No current page. Allocate first.")
				continue
			}
			fmt.Print("Agent A ID: ")
			var agentA string
			fmt.Scanln(&agentA)
			fmt.Print("Agent B ID: ")
			var agentB string
			fmt.Scanln(&agentB)

			resp, err := l0.SwapAgents(currentPageID, agentA, agentB)
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Println(resp.Message)

		case 4:
			if currentPageID == "" {
				fmt.Println("No current page. Allocate first.")
				continue
			}
			fmt.Print("Slice length: ")
			var length int
			fmt.Scanln(&length)

			resp, err := l0.GetContextSlice(currentPageID, length)
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Printf("Context slice length: %d bytes\n", resp.DataLen)

		case 5:
			if currentPageID == "" {
				fmt.Println("No current page. Allocate first.")
				continue
			}
			fmt.Print("Data to commit (plain text): ")
			var data string
			fmt.Scanln(&data)

			dataBase64 := base64.StdEncoding.EncodeToString([]byte(data))
			resp, err := l0.CommitSlice(currentPageID, dataBase64)
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Println(resp.Message)

		case 6:
			return
		default:
			fmt.Println("Invalid choice.")
		}
	}
}

// Wrapper handler for Rollback to base (still physical)
func RollbackToBase() {
	if !CheckPaidTier("Rollback to Base") {
		return
	}
	err := snapshotEngine.RollbackToBase()
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	}
	// Note: In a full integration, this would also invalidate ALL timeslips.
}

func showGovernanceMenu(client *SubstrateClient, myAccount string) {
	for {
		fmt.Println("\n=== Temporal Governance (SAC) ===")
		fmt.Println("1) View My SAC Power")
		fmt.Println("2) Stake Axiom")
		fmt.Println("3) Unstake Axiom")
		fmt.Println("4) Propose Mutation")
		fmt.Println("5) Cast Vote")
		fmt.Println("6) View Mutation Queue")
		fmt.Println("7) Back to Main Menu")
		fmt.Print("Select option: ")

		var choice int
		_, err := fmt.Scanln(&choice)
		if err != nil {
			var discard string
			fmt.Scanln(&discard)
			fmt.Println("Invalid input.")
			continue
		}

		switch choice {
		case 1:
			power, err := client.GetSACPower(myAccount)
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Printf("Your SAC Power: %d\n", power.Power)

		case 2:
			fmt.Print("Amount to stake: ")
			var amt uint64
			fmt.Scanln(&amt)

			if err := client.StakeAxiom(myAccount, amt); err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Println("Stake submitted.")

		case 3:
			fmt.Print("Amount to unstake: ")
			var amt uint64
			fmt.Scanln(&amt)

			if err := client.UnstakeAxiom(myAccount, amt); err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Println("Unstake submitted.")

		case 4:
			fmt.Print("Mutation description: ")
			var desc string
			fmt.Scanln(&desc)

			if err := client.ProposeMutation(myAccount, desc); err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Println("Mutation proposal submitted.")

		case 5:
			fmt.Print("Proposal ID: ")
			var pid uint64
			fmt.Scanln(&pid)

			fmt.Print("Approve? (y/n): ")
			var yn string
			fmt.Scanln(&yn)
			approve := yn == "y"

			if err := client.CastVote(myAccount, pid, approve); err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Println("Vote submitted.")

		case 6:
			queue, err := client.GetMutationQueue()
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}

			fmt.Println("\n--- Mutation Queue ---")
			for _, p := range queue.Proposals {
				fmt.Printf("ID: %d | Proposer: %s | Status: %s | Desc: %s\n",
					p.ProposalID, p.Proposer, p.Status, p.Description)
			}

		case 7:
			return

		default:
			fmt.Println("Invalid choice.")
		}
	}
}

func showDiagnosticsMenu(sub *SubstrateClient, l0 *L0Client) {
	for {
		fmt.Println("\n=== Mesh Diagnostics & Health ===")
		fmt.Println("1) View Mesh Health Summary")
		fmt.Println("2) View Treasury Flow Graph (Text Summary)")
		fmt.Println("3) View Agent Evolution Stats")
		fmt.Println("4) View Validator Stability Stats")
		fmt.Println("5) View Environment Growth Stats")
		fmt.Println("6) View L0 Teleportation Log")
		fmt.Println("7) View ACS Boot Log")
		fmt.Println("8) Back to Main Menu")
		fmt.Print("Select option: ")

		var choice int
		_, err := fmt.Scanln(&choice)
		if err != nil {
			var discard string
			fmt.Scanln(&discard)
			fmt.Println("Invalid input.")
			continue
		}

		switch choice {

		case 1:
			health, err := sub.GetMeshHealth()
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Printf("\n--- Mesh Health ---\nTreasury: %d \u03c4\nAgents: %d\nValidators: %d\nEnvironments: %d\n",
				health.TreasuryBalance, health.TotalAgents, health.TotalValidators, health.TotalEnvironments)

		case 2:
			fmt.Println("\n--- Treasury Flow Summary ---")
			fmt.Println("40% \u2192 Agent Dividends")
			fmt.Println("30% \u2192 Validator Stability")
			fmt.Println("20% \u2192 Environment Growth")
			fmt.Println("10% \u2192 Rollback Insurance Pool")

		case 3:
			fmt.Println("\nAgent Evolution Graph (text placeholder)")
			fmt.Println("Use pallet_marketplace::AgentStats for real values.")

		case 4:
			fmt.Println("\nValidator Stability Graph (text placeholder)")
			fmt.Println("Use pallet_temporal_gov::ValidatorStats for real values.")

		case 5:
			fmt.Println("\nEnvironment Growth Graph (text placeholder)")
			fmt.Println("Use pallet_temporal_gov::EnvironmentStats for real values.")

		case 6:
			log, err := l0.GetTeleportationLog()
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Println("\n--- Teleportation Log ---")
			for _, e := range log.Entries {
				fmt.Printf("Page %s | %s \u2194 %s | t=%d\n", e.PageID, e.AgentA, e.AgentB, e.Timestamp)
			}

		case 7:
			info, err := l0.GetACSBootInfo()
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Println("\n--- ACS Boot Info ---")
			fmt.Printf("Runlevel: %s\nCPU Cores: %d\nRAM: %d MB\n", info.Runlevel, info.CPUCores, info.RAMMB)
			fmt.Println("Active Services:")
			for _, svc := range info.ActiveServices {
				fmt.Printf(" - %s\n", svc)
			}

		case 8:
			return

		default:
			fmt.Println("Invalid choice.")
		}
	}
}

func showTemporalCheckpointMenu(client *SubstrateClient, myAccount string) {
	for {
		fmt.Println("\n=== Temporal Checkpoint Orchestration ===")
		fmt.Println("1) Open Timeslip")
		fmt.Println("2) Close Timeslip")
		fmt.Println("3) Create Checkpoint")
		fmt.Println("4) View Active Timeslips")
		fmt.Println("5) View Checkpoints for Timeslip")
		fmt.Println("6) Annihilate Checkpoint (Rollback)")
		fmt.Println("7) Back to Main Menu")
		fmt.Print("Select option: ")

		var choice int
		_, err := fmt.Scanln(&choice)
		if err != nil {
			var discard string
			fmt.Scanln(&discard)
			fmt.Println("Invalid input.")
			continue
		}

		switch choice {

		case 1:
			if err := client.OpenTimeslip(myAccount); err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Println("Timeslip opened.")

		case 2:
			fmt.Print("Timeslip ID: ")
			var tid uint64
			fmt.Scanln(&tid)

			if err := client.CloseTimeslip(myAccount, tid); err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Println("Timeslip closed.")

		case 3:
			fmt.Print("Timeslip ID: ")
			var tid uint64
			fmt.Scanln(&tid)

			if err := client.CreateCheckpoint(myAccount, tid); err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Println("Checkpoint created.")

		case 4:
			slips, err := client.GetActiveTimeslips(myAccount)
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}

			fmt.Println("\n--- Active Timeslips ---")
			for _, s := range slips {
				fmt.Printf("ID: %d | Owner: %s | Open: %v\n", s.TimeslipID, s.Owner, s.Open)
			}

		case 5:
			fmt.Print("Timeslip ID: ")
			var tid uint64
			fmt.Scanln(&tid)

			cps, err := client.GetCheckpoints(tid)
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}

			fmt.Println("\n--- Checkpoints ---")
			for _, c := range cps {
				fmt.Printf("ID: %d | Timeslip: %d | Owner: %s | t=%d\n",
					c.CheckpointID, c.TimeslipID, c.Owner, c.Timestamp)
			}

		case 6:
			fmt.Print("Checkpoint ID: ")
			var cid uint64
			fmt.Scanln(&cid)

			result, err := client.AnnihilateCheckpoint(myAccount, cid)
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}

			fmt.Println("\n--- Rollback Result ---")
			fmt.Printf("Effective Burn: %d \u03c4\n", result.EffectiveBurn)
			fmt.Printf("Insurance Subsidy Used: %d \u03c4\n", result.SubsidyUsed)
			fmt.Printf("Success: %v\n", result.Success)

		case 7:
			return

		default:
			fmt.Println("Invalid choice.")
		}
	}
}

func showCognitiveSessionMenu(sub *SubstrateClient, l0 *L0Client, myAccount string) {
	var session *CognitiveSession

	for {
		fmt.Println("\n=== Agent Cognitive Sessions (L1 \u2192 L2 \u2192 L3 \u2192 L4) ===")
		fmt.Println("1) Start Cognitive Session (L1)")
		fmt.Println("2) Write Raw Event (L1 \u2192 L2)")
		fmt.Println("3) Semantic Extraction (L2 \u2192 L3)")
		fmt.Println("4) Commit Knowledge (L3 \u2192 L4)")
		fmt.Println("5) View Current Session")
		fmt.Println("6) Back to Main Menu")
		fmt.Print("Select option: ")

		var choice int
		_, err := fmt.Scanln(&choice)
		if err != nil {
			var discard string
			fmt.Scanln(&discard)
			fmt.Println("Invalid input.")
			continue
		}

		switch choice {

		case 1:
			fmt.Print("Agent ID: ")
			var agentID string
			fmt.Scanln(&agentID)

			s, err := l0.StartCognitiveSession(agentID)
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}
			session = s
			fmt.Printf("Started session %s on page %s\n", session.SessionID, session.PageID)

		case 2:
			if session == nil {
				fmt.Println("Start a session first.")
				continue
			}

			fmt.Print("Raw event payload: ")
			var payload string
			fmt.Scanln(&payload)

			event := RawEvent{
				EventID:   fmt.Sprintf("EV_%d", time.Now().UnixNano()),
				Payload:   payload,
				Timestamp: uint64(time.Now().Unix()),
			}

			if err := l0.WriteRawEvent(session.PageID, event); err != nil {
				fmt.Println("Error:", err)
				continue
			}

			session.Stage = "L2"
			fmt.Println("Raw event written.")

		case 3:
			if session == nil {
				fmt.Println("Start a session first.")
				continue
			}

			result, err := sub.SemanticExtract(*session)
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}

			fmt.Printf("Semantic Extraction:\nType: %s\nA: %s\nB: %s\nEpoch: %d\n",
				result.RelationshipType, result.EntityA, result.EntityB, result.Epoch)

			session.Stage = "L3"

		case 4:
			if session == nil {
				fmt.Println("Start a session first.")
				continue
			}

			result, err := sub.SemanticExtract(*session)
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}

			commit, err := sub.CommitKnowledge(*result)
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}

			fmt.Printf("Knowledge committed via extrinsic: %s\n", commit.Extrinsic)
			session.Stage = "L4"

		case 5:
			if session == nil {
				fmt.Println("No active session.")
				continue
			}
			fmt.Printf("Session %s | Agent %s | Page %s | Stage %s\n",
				session.SessionID, session.AgentID, session.PageID, session.Stage)

		case 6:
			return

		default:
			fmt.Println("Invalid choice.")
		}
	}
}

func showVisualizationMenu(sub *SubstrateClient, l0 *L0Client) {
	for {
		fmt.Println("\n=== Temporal Mesh Visualization Layer ===")
		fmt.Println("1) Treasury Flow HUD")
		fmt.Println("2) Agent Evolution HUD")
		fmt.Println("3) Validator Stability HUD")
		fmt.Println("4) Environment Growth HUD")
		fmt.Println("5) L0 Teleportation HUD")
		fmt.Println("6) ACS Runlevel HUD")
		fmt.Println("7) Back to Main Menu")
		fmt.Print("Select option: ")

		var choice int
		_, err := fmt.Scanln(&choice)
		if err != nil {
			var discard string
			fmt.Scanln(&discard)
			fmt.Println("Invalid input.")
			continue
		}

		switch choice {
		case 1:
			snap, err := sub.GetTreasuryFlowSnapshot()
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Println("\n--- Treasury Flow HUD ---")
			fmt.Printf("Treasury: %d \u03c4\n", snap.TreasuryBalance)
			fmt.Printf("Agents: %.1f%% | Validators: %.1f%% | Environments: %.1f%% | Insurance: %.1f%%\n",
				snap.AgentShare, snap.ValidatorShare, snap.EnvironmentShare, snap.InsuranceShare)

		case 2:
			snap, err := sub.GetAgentEvolutionSnapshot()
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Println("\n--- Agent Evolution HUD ---")
			fmt.Printf("Total Agents: %d\n", snap.TotalAgents)
			fmt.Println("Top Agents:")
			for _, a := range snap.TopAgents {
				fmt.Printf(" - %s\n", a)
			}

		case 3:
			snap, err := sub.GetValidatorStabilitySnapshot()
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Println("\n--- Validator Stability HUD ---")
			fmt.Printf("Total Validators: %d\n", snap.TotalValidators)
			fmt.Println("Top Validators:")
			for _, v := range snap.TopValidators {
				fmt.Printf(" - %s\n", v)
			}

		case 4:
			snap, err := sub.GetEnvironmentGrowthSnapshot()
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Println("\n--- Environment Growth HUD ---")
			fmt.Printf("Total Environments: %d\n", snap.TotalEnvironments)
			fmt.Println("Top Environments:")
			for _, e := range snap.TopEnvironments {
				fmt.Printf(" - %s\n", e)
			}

		case 5:
			log, err := l0.GetTeleportationLog()
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Println("\n--- L0 Teleportation HUD ---")
			for _, e := range log.Entries {
				fmt.Printf("Page %s | %s \u2194 %s | t=%d\n", e.PageID, e.AgentA, e.AgentB, e.Timestamp)
			}

		case 6:
			info, err := l0.GetACSBootInfo()
			if err != nil {
				fmt.Println("Error:", err)
				continue
			}
			fmt.Println("\n--- ACS Runlevel HUD ---")
			fmt.Printf("Runlevel: %s\nCPU Cores: %d\nRAM: %d MB\n", info.Runlevel, info.CPUCores, info.RAMMB)
			fmt.Println("Active Services:")
			for _, svc := range info.ActiveServices {
				fmt.Printf(" - %s\n", svc)
			}

		case 7:
			return

		default:
			fmt.Println("Invalid choice.")
		}
	}
}

func showCognitiveReconstructionMenu(sub *SubstrateClient, l0 *L0Client) {
	fmt.Println("\n=== Cognitive Reconstruction Engine ===")
	fmt.Print("Enter Session ID: ")

	var sessionID string
	fmt.Scanln(&sessionID)

	fmt.Println("[*] Fetching CSM and invoking Python CRE Bridge...")

	// Call Python CRE
	cmd := exec.Command("python", "C:\\Users\\theal\\mgsh_mcp\\reconstruct_csm.py", sessionID)
	out, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println("CRE Error:", err)
		fmt.Println("Output:", string(out))
		return
	}

	fmt.Println("\n--- Reconstruction Result ---")
	fmt.Println(string(out))
}
