package main

import (
	"fmt"
	"os"
	"path/filepath"
)

func EnableHITLProxy() {
	fmt.Println("\n[HITL PROXY ACTIVATION]")
	
	if State.HITLEnabled {
		fmt.Println("HITL Proxy is already enabled.")
		return
	}

	// 1. Require payment method on file (no charge)
	fmt.Print("Enter Payment Method Token (Stripe/Paypal) to start Free Tier: ")
	var token string
	fmt.Scanln(&token)
	State.PaymentMethodValid = true

	// 2. Fingerprint IDEs
	FingerprintIDEs()

	// 3. Register mutation zones
	RegisterMutationZones()

	// 4. Create baseline snapshot
	fmt.Println("Creating baseline snapshot of all protected zones...")
	err := snapshotEngine.InitBaseline()
	if err != nil {
		fmt.Printf("Failed to initialize baseline: %v\n", err)
		return
	}

	// 5. Initialize differencing disk chain (implicitly started via snapshotEngine)
	// 6. Begin continuous protection
	triggerEngine.StartWatching()

	State.HITLEnabled = true
	fmt.Println("HITL Proxy successfully activated. Free Tier enabled. Continuous protection running.")
}

func FingerprintIDEs() {
	fmt.Println("Fingerprinting active IDEs and dev tools...")
	
	userProfile := os.Getenv("USERPROFILE")
	appData := os.Getenv("APPDATA")
	localAppData := os.Getenv("LOCALAPPDATA")

	paths := map[string][]string{
		"VS Code":       {filepath.Join(appData, "Code"), filepath.Join(userProfile, ".vscode")},
		"Visual Studio": {filepath.Join(appData, "Microsoft", "VisualStudio"), filepath.Join(localAppData, "Microsoft", "VisualStudio")},
		"JetBrains":     {filepath.Join(appData, "JetBrains"), filepath.Join(localAppData, "JetBrains")},
		"Unity":         {filepath.Join(appData, "Unity")},
		"Unreal":        {filepath.Join(appData, "UnrealEngine")},
	}

	for ide, dirs := range paths {
		found := false
		for _, dir := range dirs {
			if _, err := os.Stat(dir); err == nil {
				found = true
				break
			}
		}
		State.IDEFingerprints[ide] = found
		if found {
			fmt.Printf(" - Found %s\n", ide)
		}
	}
}

func RegisterMutationZones() {
	userProfile := os.Getenv("USERPROFILE")
	
	zones := []string{
		"WSL: ext4.vhdx",
		"Docker: ~/.docker, WSL docker state",
		"Node: node_modules, global npm dirs",
		filepath.Join(userProfile, ".docker"),
		filepath.Join(userProfile, ".npm-global"),
		filepath.Join(userProfile, ".cargo"),
		filepath.Join(userProfile, "go", "pkg", "mod"),
	}
	
	State.ProtectedZones = append(State.ProtectedZones, zones...)
	fmt.Printf("Registered %d mutation zones for continuous protection.\n", len(zones))
}

func ViewProtectedZones() {
	if !State.HITLEnabled {
		fmt.Println("HITL Proxy not enabled. Protected zones inactive.")
		return
	}
	fmt.Println("\nActive Protected Zones:")
	for _, zone := range State.ProtectedZones {
		fmt.Println(" - " + zone)
	}
}

func ViewIDEFingerprints() {
	fmt.Println("\nIDE Fingerprints:")
	for ide, active := range State.IDEFingerprints {
		status := "Not Found"
		if active {
			status = "Active"
		}
		fmt.Printf(" - %s: %s\n", ide, status)
	}
}
