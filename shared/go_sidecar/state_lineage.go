package main

import (
	"crypto/sha256"
	"encoding/binary"
	"math"
	"time"
)

type StateSnapshot struct {
	Addr    FiveDAddress
	Payload []byte // arbitrary event/state payload (swap, NFT mint, Tor fetch, etc.)
}

type LineageEntry struct {
	Addr      FiveDAddress
	ScalarSn  float64
	Timestamp time.Time
	HashPrev  [32]byte
	HashCurr  [32]byte
}

// primeBasisScalar projects normalized 5D vector onto ln(primes) basis.
func primeBasisScalar(addr FiveDAddress) float64 {
	// Normalize each dimension to [0,1] based on field ranges.
	vx := float64(addr.X) / float64((1<<20)-1)
	vy := float64(addr.Y) / float64((1<<20)-1)
	vz := float64(addr.Z) / float64((1<<20)-1)
	vphi := float64(addr.Phi) / float64((1<<12)-1)
	vlambda := float64(addr.Lambda) / float64((1<<12)-1)

	primes := []float64{2, 3, 5, 7, 11}
	vec := []float64{vx, vy, vz, vphi, vlambda}

	sn := 0.0
	for i := 0; i < 5; i++ {
		sn += vec[i] * math.Log(primes[i])
	}
	return sn
}

// computeLineageHash builds hn = H(Sn, Tn, hn-1) per the whitepaper.
func computeLineageHash(sn float64, t time.Time, hPrev [32]byte) [32]byte {
	buf := make([]byte, 8+8+32)
	// Sn as IEEE-754 double, big-endian
	binary.BigEndian.PutUint64(buf[0:8], math.Float64bits(sn))
	// Tn as uint64 nanoseconds, big-endian
	binary.BigEndian.PutUint64(buf[8:16], uint64(t.UnixNano()))
	// hn-1 raw bytes
	copy(buf[16:48], hPrev[:])

	sum := sha256.Sum256(buf)
	return sum
}

// AdvanceLineage computes the next lineage entry for a given state snapshot.
func AdvanceLineage(snapshot StateSnapshot, hPrev [32]byte) LineageEntry {
	sn := primeBasisScalar(snapshot.Addr)
	t := time.Now() // local monotone timestamp; can be injected for testing
	hCurr := computeLineageHash(sn, t, hPrev)
	
	return LineageEntry{
		Addr:      snapshot.Addr,
		ScalarSn:  sn,
		Timestamp: t,
		HashPrev:  hPrev,
		HashCurr:  hCurr,
	}
}

// TeleportToGlobalBrain synchronizes the computed lineage entry with the Gemma-4-e4b Shared Learning Brain via Valkey MCP.
func TeleportToGlobalBrain(entry LineageEntry) error {
	// In a real implementation, this performs an RPC or Redis/Valkey call to set_global_state
	// E.g., valkeyClient.Set("lineage:state:" + hex.EncodeToString(entry.HashCurr[:]), entryJSON)
	return nil
}
