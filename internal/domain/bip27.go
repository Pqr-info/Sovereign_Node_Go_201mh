package domain

import (
	"crypto/sha512"
	"errors"
	"fmt"
	"math/big"
	"strings"
	"unicode"

	"golang.org/x/crypto/blake2b"
)

// Alphabet contains the 27 characters of the BIP-27 base-27 spec.
const Alphabet = "ABCDEFGH1JK-MN0PQRSTUVWXYZ!"

// CaseState represents the case states: Uppercase = 0, Lowercase = 1, Inverted = 2.
type CaseState int

const (
	Uppercase CaseState = 0
	Lowercase CaseState = 1
	Inverted  CaseState = 2
)

// Symbol represents a single logical symbol position.
type Symbol struct {
	CharVal   rune
	CaseVal   CaseState
}

// DigitValue returns the index of the character in the Alphabet (0..26).
func (s Symbol) DigitValue() int {
	return strings.IndexRune(Alphabet, s.CharVal)
}

// Combine returns the byte representation (d_i * 3 + c_i).
func (s Symbol) Combine() byte {
	return byte(s.DigitValue()*3 + int(s.CaseVal))
}

// ParsePhrase parses a 27-symbol recovery phrase.
// It parses exactly 3 blocks of 9 logical symbols, separated by dashes at index boundaries.
func ParsePhrase(phrase string) ([]Symbol, error) {
	runes := []rune(phrase)
	var symbols []Symbol
	idx := 0

	for block := 0; block < 3; block++ {
		blockSymbols := 0
		for blockSymbols < 9 {
			if idx >= len(runes) {
				return nil, errors.New("phrase is too short, expected 27 logical symbols")
			}
			c := runes[idx]
			if c == '!' {
				if idx+1 < len(runes) {
					nextC := runes[idx+1]
					if nextC == '!' {
						symbols = append(symbols, Symbol{CharVal: '!', CaseVal: Inverted})
						idx += 2
					} else {
						norm := unicode.ToUpper(nextC)
						if strings.ContainsRune(Alphabet, norm) && norm != '!' {
							symbols = append(symbols, Symbol{CharVal: norm, CaseVal: Inverted})
							idx += 2
						} else {
							// Single ! symbol
							symbols = append(symbols, Symbol{CharVal: '!', CaseVal: Uppercase})
							idx++
						}
					}
				} else {
					symbols = append(symbols, Symbol{CharVal: '!', CaseVal: Uppercase})
					idx++
				}
			} else if c == '_' {
				symbols = append(symbols, Symbol{CharVal: '!', CaseVal: Lowercase})
				idx++
			} else {
				norm := unicode.ToUpper(c)
				if strings.ContainsRune(Alphabet, norm) {
					caseVal := Uppercase
					if unicode.IsLower(c) {
						caseVal = Lowercase
					}
					symbols = append(symbols, Symbol{CharVal: norm, CaseVal: caseVal})
					idx++
				} else {
					return nil, fmt.Errorf("character %c at index %d not in Base-27 alphabet", c, idx)
				}
			}
			blockSymbols++
		}

		// After each block (except the last), expect a separator dash '-'
		if block < 2 {
			if idx >= len(runes) {
				return nil, errors.New("missing separator dash between blocks")
			}
			if runes[idx] != '-' {
				return nil, fmt.Errorf("expected separator dash at index %d, got %c", idx, runes[idx])
			}
			idx++ // consume separator dash
		}
	}

	if idx != len(runes) {
		return nil, fmt.Errorf("extra characters at the end of phrase starting at index %d", idx)
	}

	return symbols, nil
}

// DeriveSeed128 derives the 128-bit seed from the 27 symbols using Blake2b-256.
func DeriveSeed128(symbols []Symbol) ([16]byte, error) {
	if len(symbols) != 27 {
		return [16]byte{}, errors.New("must provide exactly 27 symbols")
	}

	bytes := make([]byte, 27)
	for i, sym := range symbols {
		bytes[i] = sym.Combine()
	}

	hash, err := blake2b.New256(nil)
	if err != nil {
		return [16]byte{}, err
	}
	hash.Write(bytes)
	sum := hash.Sum(nil)

	var seed [16]byte
	copy(seed[:], sum[0:16])
	return seed, nil
}

// ExpandSeed256 expands the 128-bit seed to 32 bytes using Blake2b-256.
func ExpandSeed256(seed128 [16]byte) ([32]byte, error) {
	hash, err := blake2b.New256(nil)
	if err != nil {
		return [32]byte{}, err
	}
	hash.Write(seed128[:])
	hash.Write([]byte("expand_seed_256"))
	sum := hash.Sum(nil)

	var seed [32]byte
	copy(seed[:], sum[0:32])
	return seed, nil
}

// Base58Encode encodes bytes to a Base58 string.
func Base58Encode(b []byte) string {
	alphabet := "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
	n := new(big.Int).SetBytes(b)
	base := big.NewInt(58)
	zero := big.NewInt(0)
	mod := new(big.Int)

	var result []byte
	for n.Cmp(zero) > 0 {
		n.DivMod(n, base, mod)
		result = append(result, alphabet[mod.Int64()])
	}

	// Add leading zeros
	for _, byteVal := range b {
		if byteVal == 0 {
			result = append(result, alphabet[0])
		} else {
			break
		}
	}

	// Reverse
	for i, j := 0, len(result)-1; i < j; i, j = i+1, j-1 {
		result[i], result[j] = result[j], result[i]
	}

	return string(result)
}

// SS58Encode encodes a 32-byte public key to SS58 string with custom network prefix.
func SS58Encode(prefix uint16, pubkey [32]byte) string {
	var data []byte
	if prefix < 64 {
		data = append(data, byte(prefix))
	} else {
		first := byte(((prefix & 0b0000_0000_1111_1100) >> 2) | 0b0100_0000)
		second := byte((prefix >> 8) | ((prefix & 0b0000_0000_0000_0011) << 6))
		data = append(data, first, second)
	}

	data = append(data, pubkey[:]...)

	// Blake2b-512 checksum of "SS58PRE" || data
	hasher, _ := blake2b.New(64, nil)
	hasher.Write([]byte("SS58PRE"))
	hasher.Write(data)
	hash := hasher.Sum(nil)

	// Append first 2 bytes of checksum
	data = append(data, hash[0:2]...)

	return Base58Encode(data)
}

// SubstrateHashSHA512 fallback if Blake2b-512 is not used in standard libraries
func SubstrateHashSHA512(data []byte) [64]byte {
	return sha512.Sum512(data)
}
