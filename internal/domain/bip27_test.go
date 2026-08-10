package domain

import (
	"bytes"
	"testing"
)

func TestBIP27Derivation(t *testing.T) {
	// Test phrase parsing
	phrase := "ABCDEFGH1-j-kmn0pqr-!t!u!v!w!x!y!z!!_"
	symbols, err := ParsePhrase(phrase)
	if err != nil {
		t.Fatalf("Failed to parse phrase: %v", err)
	}

	if len(symbols) != 27 {
		t.Errorf("Expected 27 symbols, got %d", len(symbols))
	}

	// Verify symbol properties
	// ABCDEFGH1 is block 1
	if symbols[0].CharVal != 'A' || symbols[0].CaseVal != Uppercase {
		t.Errorf("First symbol mismatch, got: %+v", symbols[0])
	}
	if symbols[8].CharVal != '1' || symbols[8].CaseVal != Uppercase {
		t.Errorf("Ninth symbol mismatch, got: %+v", symbols[8])
	}

	// Test seed derivation
	seed128, err := DeriveSeed128(symbols)
	if err != nil {
		t.Fatalf("Failed to derive seed 128: %v", err)
	}

	// Ensure seed is not all zeros
	allZeros := true
	for _, b := range seed128 {
		if b != 0 {
			allZeros = false
			break
		}
	}
	if allZeros {
		t.Errorf("Derived seed is all zeros")
	}

	// Test expanded seed derivation
	seed256, err := ExpandSeed256(seed128)
	if err != nil {
		t.Fatalf("Failed to expand seed: %v", err)
	}

	if bytes.Equal(seed256[:16], seed128[:]) {
		t.Errorf("Expanded seed shares too much raw prefix with seed128")
	}

	// Test SS58 encoding
	pubkey := [32]byte{1, 2, 3, 4, 5}
	addr := SS58Encode(42, pubkey)
	if len(addr) == 0 {
		t.Errorf("SS58 address is empty")
	}
}
