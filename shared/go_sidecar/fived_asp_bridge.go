package main

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

var Base27Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0"

type FiveDAddress struct {
	Packed [16]byte `json:"packed"`
	Base27 string   `json:"base27"`
	X      uint32
	Y      uint32
	Z      uint32
	Phi    uint16
	Lambda uint16
}

type AnchorMetadata struct {
	Paid     string   `json:"paid"`
	CifHash  [32]byte `json:"cif_hash"`
	Recovery []string `json:"recovery_words,omitempty"`
}

type RegisterRequest struct {
	Paid       string `json:"paid"`
	CifContent string `json:"cif_content"`
}

type LinkAssetRequest struct {
	Packed  string `json:"packed_hex"`
	AssetID string `json:"asset_id_hex"`
}

// In-memory mock for the Substrate Registry
var anchors = make(map[string]AnchorMetadata)
var assets = make(map[string][]string)

func hashCifToStructHash(paid, cifContent string) [32]byte {
	msg := []byte(paid + cifContent)
	return sha256.Sum256(msg)
}

func structHashToTuple(hash [32]byte) (uint32, uint32, uint32, uint16, uint16) {
	// Reconstruct top 64 bits exactly like Rust/JS
	top64 := (uint64(hash[0]) << 56) | (uint64(hash[1]) << 48) | (uint64(hash[2]) << 40) |
		(uint64(hash[3]) << 32) | (uint64(hash[4]) << 24) | (uint64(hash[5]) << 16) |
		(uint64(hash[6]) << 8) | uint64(hash[7])

	iPhase := uint16(top64>>52) & 0xFFF
	iLineage := uint16(top64>>40) & 0xFFF
	x := uint32(top64>>20) & 0xFFFFF
	y := uint32(top64) & 0xFFFFF

	next32 := (uint32(hash[7]) << 24) | (uint32(hash[8]) << 16) | (uint32(hash[9]) << 8) | uint32(hash[10])
	z := (next32 >> 4) & 0xFFFFF

	return x, y, z, iPhase, iLineage
}

func tupleToPacked(x, y, z uint32, phase, lineage uint16) [16]byte {
	var n0, n1 uint64

	n0 |= uint64(x) << 44
	n0 |= uint64(y) << 24
	n0 |= uint64(z) << 4
	n0 |= uint64(phase>>8) & 0xF

	n1 |= uint64(phase&0xFF) << 56
	n1 |= uint64(lineage) << 44

	// compute ECC over top 84 bits (10.5 bytes)
	var ecc uint64
	// Reconstruct N_high
	var tempLow uint64 = n0 << 20
	tempLow |= n1 >> 44

	// we'll just implement the JS logic via looping:
	// N_high = (n0 << 20) | (n1 >> 44) but we need BigInt equivalent logic
	// In JS we shift temp >> 8n. 
	// We can construct a 128 bit number:
	// Let's just do byte-wise sum for the top 10 bytes and top nibble of 11th byte
	var packed [16]byte
	for i := 0; i < 8; i++ {
		packed[i] = byte(n0 >> (56 - 8*i))
	}
	for i := 0; i < 8; i++ {
		packed[8+i] = byte(n1 >> (56 - 8*i))
	}

	for i := 0; i < 10; i++ {
		ecc = (ecc + uint64(packed[i])) & 0xFFF
	}
	// Add the upper nibble of 11th byte
	ecc = (ecc + uint64(packed[10]>>4)) & 0xFFF

	n1 |= ecc << 32
	n1 |= 1 << 28

	for i := 0; i < 8; i++ {
		packed[8+i] = byte(n1 >> (56 - 8*i))
	}
	return packed
}

func deriveFiveDAddress(paid, cifContent string) FiveDAddress {
	hash := hashCifToStructHash(paid, cifContent)
	x, y, z, phase, lineage := structHashToTuple(hash)
	packed := tupleToPacked(x, y, z, phase, lineage)

	// Base27 representation (simplified mock here, typically use big.Int)
	base27 := "MOCKEDBASE27STRING00000000"

	return FiveDAddress{Packed: packed, Base27: base27, X: x, Y: y, Z: z, Phi: phase, Lambda: lineage}
}

func main() {
	r := gin.Default()

	r.POST("/api/v1/anchor/register", func(c *gin.Context) {
		var req RegisterRequest
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Zero-Trust Validation
		addr := deriveFiveDAddress(req.Paid, req.CifContent)
		hash := hashCifToStructHash(req.Paid, req.CifContent)

		packedHex := hex.EncodeToString(addr.Packed[:])
		if _, exists := anchors[packedHex]; exists {
			c.JSON(http.StatusConflict, gin.H{"error": "Anchor already exists"})
			return
		}

		meta := AnchorMetadata{
			Paid:    req.Paid,
			CifHash: hash,
		}
		anchors[packedHex] = meta

		c.JSON(http.StatusOK, gin.H{
			"message": "Anchor registered to Sovereign Substrate",
			"address": addr,
		})
	})

	r.POST("/api/v1/asset/link", func(c *gin.Context) {
		var req LinkAssetRequest
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		assets[req.Packed] = append(assets[req.Packed], req.AssetID)

		c.JSON(http.StatusOK, gin.H{"message": "Asset linked", "assets": assets[req.Packed]})
	})

	r.GET("/api/v1/anchor/:packed", func(c *gin.Context) {
		packedHex := c.Param("packed")
		meta, exists := anchors[packedHex]
		if !exists {
			c.JSON(http.StatusNotFound, gin.H{"error": "Anchor not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"metadata": meta,
			"assets":   assets[packedHex],
		})
	})

		// Lineage State Map (Mocking persistence)
	var lineageHeads = make(map[string][32]byte)

	r.POST("/api/v1/state/advance", func(c *gin.Context) {
		var snap StateSnapshot
		if err := c.BindJSON(&snap); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		
		packedHex := hex.EncodeToString(snap.Addr.Packed[:])
		hPrev := lineageHeads[packedHex] // Defaults to [32]byte{} (all zeros) for Genesis state
		
		entry := AdvanceLineage(snap, hPrev)
		lineageHeads[packedHex] = entry.HashCurr
		
		c.JSON(200, gin.H{
			"message": "Lineage advanced",
			"entry": gin.H{
				"scalar_sn": entry.ScalarSn,
				"timestamp": entry.Timestamp,
				"hash_prev": hex.EncodeToString(entry.HashPrev[:]),
				"hash_curr": hex.EncodeToString(entry.HashCurr[:]),
			},
		})
	})

	r.GET("/api/v1/state/query/:packed", func(c *gin.Context) {
		packedHex := c.Param("packed")
		head, exists := lineageHeads[packedHex]
		if !exists {
			c.JSON(404, gin.H{"error": "No state lineage found for address"})
			return
		}
		
		c.JSON(200, gin.H{
			"head_hash": hex.EncodeToString(head[:]),
		})
	})

	fmt.Println("Sovereign-27 Go Sidecar (Level-0/Level-1 Bridge) running on :9085")
	r.Run(":9085")
}




