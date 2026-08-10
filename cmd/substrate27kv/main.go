package main

import (
	"crypto/ed25519"
	"encoding/hex"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"pqr.info/internal/domain"
)

func main() {
	if len(sysArgs()) < 2 {
		printUsageAndExit()
	}

	cmd := sysArgs()[1]

	switch cmd {
	case "keygen":
		if len(sysArgs()) < 3 {
			fmt.Println("Error: Missing recovery phrase")
			os.Exit(1)
		}
		phrase := sysArgs()[2]
		symbols, err := domain.ParsePhrase(phrase)
		if err != nil {
			fmt.Printf("Error parsing phrase: %v\n", err)
			os.Exit(1)
		}

		seed128, err := domain.DeriveSeed128(symbols)
		if err != nil {
			fmt.Printf("Error deriving 128-bit seed: %v\n", err)
			os.Exit(1)
		}

		seed256, err := domain.ExpandSeed256(seed128)
		if err != nil {
			fmt.Printf("Error expanding seed: %v\n", err)
			os.Exit(1)
		}

		// Derive Ed25519 public key
		privKey := ed25519.NewKeyFromSeed(seed256[:])
		pubKeyBytes := privKey.Public().(ed25519.PublicKey)
		
		var pubKey [32]byte
		copy(pubKey[:], pubKeyBytes)

		address := domain.SS58Encode(42, pubKey)

		fmt.Println("=== BIP-27 Key Derivation ===")
		fmt.Printf("Phrase:         %s\n", phrase)
		fmt.Printf("Seed (128-bit): %s\n", hex.EncodeToString(seed128[:]))
		fmt.Printf("Seed (256-bit): %s\n", hex.EncodeToString(seed256[:]))
		fmt.Printf("Public Key:     %s\n", hex.EncodeToString(pubKeyBytes))
		fmt.Printf("SS58 Address:   %s\n", address)

	case "store", "revoke", "get":
		// Remote SSH settings
		remoteIP := "204.168.138.60"
		sshKeyPath := filepath.Join(os.Getenv("USERPROFILE"), ".ssh", "id_ed25519")

		if cmd == "store" {
			if len(sysArgs()) < 5 {
				fmt.Println("Usage: substrate27kv store \"<phrase>\" <key_id_hex> <secret_text>")
				os.Exit(1)
			}
			phrase := sysArgs()[2]
			keyID := sysArgs()[3]
			secretText := sysArgs()[4]

			// Derive seed
			symbols, err := domain.ParsePhrase(phrase)
			if err != nil {
				fmt.Printf("Error parsing phrase: %v\n", err)
				os.Exit(1)
			}
			seed128, _ := domain.DeriveSeed128(symbols)
			seed256, _ := domain.ExpandSeed256(seed128)

			seedHex := hex.EncodeToString(seed256[:])
			secretHex := hex.EncodeToString([]byte(secretText))

			remoteCmd := fmt.Sprintf("python3 /root/substrate_helper.py store 0x%s %s %s", seedHex, keyID, secretHex)
			output, err := runRemoteSSH(remoteIP, sshKeyPath, remoteCmd)
			if err != nil {
				fmt.Printf("Remote execution failed: %v\n", err)
				os.Exit(1)
			}
			fmt.Println(output)

		} else if cmd == "get" {
			if len(sysArgs()) < 3 {
				fmt.Println("Usage: substrate27kv get <key_id_hex>")
				os.Exit(1)
			}
			keyID := sysArgs()[2]

			remoteCmd := fmt.Sprintf("python3 /root/substrate_helper.py get %s", keyID)
			output, err := runRemoteSSH(remoteIP, sshKeyPath, remoteCmd)
			if err != nil {
				fmt.Printf("Remote execution failed: %v\n", err)
				os.Exit(1)
			}
			fmt.Println(output)

		} else if cmd == "revoke" {
			if len(sysArgs()) < 4 {
				fmt.Println("Usage: substrate27kv revoke \"<phrase>\" <key_id_hex>")
				os.Exit(1)
			}
			phrase := sysArgs()[2]
			keyID := sysArgs()[3]

			// Derive seed
			symbols, err := domain.ParsePhrase(phrase)
			if err != nil {
				fmt.Printf("Error parsing phrase: %v\n", err)
				os.Exit(1)
			}
			seed128, _ := domain.DeriveSeed128(symbols)
			seed256, _ := domain.ExpandSeed256(seed128)

			seedHex := hex.EncodeToString(seed256[:])

			remoteCmd := fmt.Sprintf("python3 /root/substrate_helper.py revoke 0x%s %s", seedHex, keyID)
			output, err := runRemoteSSH(remoteIP, sshKeyPath, remoteCmd)
			if err != nil {
				fmt.Printf("Remote execution failed: %v\n", err)
				os.Exit(1)
			}
			fmt.Println(output)
		}

	default:
		printUsageAndExit()
	}
}

func sysArgs() []string {
	return os.Args
}

func printUsageAndExit() {
	fmt.Println("Substrate 27 Key-Value Client CLI")
	fmt.Println("Usage:")
	fmt.Println("  substrate27kv keygen \"<phrase>\"")
	fmt.Println("  substrate27kv store \"<phrase>\" <key_id_hex> <secret_text>")
	fmt.Println("  substrate27kv get <key_id_hex>")
	fmt.Println("  substrate27kv revoke \"<phrase>\" <key_id_hex>")
	os.Exit(1)
}

func runRemoteSSH(ip, keyPath, cmd string) (string, error) {
	sshCmd := exec.Command("ssh",
		"-o", "StrictHostKeyChecking=no",
		"-i", keyPath,
		fmt.Sprintf("root@%s", ip),
		cmd,
	)
	var stdout, stderr strings.Builder
	sshCmd.Stdout = &stdout
	sshCmd.Stderr = &stderr

	err := sshCmd.Run()
	if err != nil {
		return "", fmt.Errorf("ssh error: %v, stderr: %s", err, stderr.String())
	}
	return strings.TrimSpace(stdout.String()), nil
}
