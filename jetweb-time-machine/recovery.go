package main

import (
	"bufio"
	"fmt"
	"strings"
)

// CheckPaidTier enforces the Post-Pay Recovery Funnel
func CheckPaidTier(actionName string) bool {
	if !State.HITLEnabled {
		fmt.Printf("\nHITL Proxy not enabled. Please enable Free Tier first.\n")
		return false
	}

	if !State.PaymentMethodValid {
		fmt.Printf("\n[PAID TIER REQUIRED] Action '%s' requires an active payment method on file.\n", actionName)
		return false
	}

	fmt.Printf("\n[PAYMENT GATEWAY] '%s' will result in a charge ONLY upon successful recovery.\n", actionName)
	return true
}

func ShowRecoveryActions(reader *bufio.Reader) {
	if !CheckPaidTier("Access Recovery Actions") {
		return
	}

	fmt.Println("\n===========================================================")
	fmt.Println(" POST-PAY RECOVERY ACTIONS")
	fmt.Println("===========================================================")
	fmt.Println("1) Restore Corrupted Differencing Chain")
	fmt.Println("2) Undelete WSL")
	fmt.Println("3) Repair VHDX/ext4")
	fmt.Println("4) Recover IDE State")
	fmt.Println("5) Merge Fragments")
	fmt.Println("6) Mount Recovered Filesystem")
	fmt.Println("7) Vault Intervention (Rotate/Rollback)")
	fmt.Println("8) Return to Main Menu")
	fmt.Println("===========================================================")
	fmt.Print("Select an action: ")

	input, _ := reader.ReadString('\n')
	input = strings.TrimSpace(input)

	switch input {
	case "1":
		fmt.Println("Restoring corrupted differencing chain...")
	case "2":
		fmt.Println("Undeleting WSL...")
	case "3":
		fmt.Println("Repairing VHDX/ext4 metadata...")
	case "4":
		fmt.Println("Recovering IDE State...")
	case "5":
		fmt.Println("Merging fragments using smart logic...")
	case "6":
		fmt.Println("Mounting recovered filesystem...")
	case "7":
		vaultEngine.Intervene()
	case "8":
		return
	default:
		fmt.Println("Invalid selection.")
	}
}
