package state

import (
    "time"
    "pqr.info/shared/go_sidecar/crypto5d"
)

type StateSnapshot struct {
	Addr    crypto5d.FiveDAddress
	Payload []byte
}

type LineageEntry struct {
	Addr      crypto5d.FiveDAddress
	ScalarSn  float64
	Timestamp time.Time
	HashPrev  [32]byte
	HashCurr  [32]byte
}

func AdvanceLineage(snapshot StateSnapshot, hPrev [32]byte) LineageEntry {
    return LineageEntry{Addr: snapshot.Addr}
}
