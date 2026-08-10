package substrate27

import (
    "crypto/sha256"
    "encoding/binary"
    "errors"
)

const (
    VectorLen   = 27
    MaxSymbol   = 26
    MaxState    = 2
)

type SymbolState struct {
    Symbol uint8 // 0–26
    State  uint8 // 0–2
}

type Address struct {
    Vector [VectorLen]SymbolState
}

// Encode to 54‑byte binary (symbol,state pairs)
func (a Address) Encode() []byte {
    out := make([]byte, VectorLen*2)
    for i, s := range a.Vector {
        out[i*2] = s.Symbol
        out[i*2+1] = s.State
    }
    return out
}

// Decode from 54‑byte binary
func Decode(data []byte) (Address, error) {
    if len(data) != VectorLen*2 {
        return Address{}, errors.New("invalid length")
    }
    var vec [VectorLen]SymbolState
    for i := 0; i < VectorLen; i++ {
        sym := data[i*2]
        st := data[i*2+1]
        if sym > MaxSymbol || st > MaxState {
            return Address{}, errors.New("invalid symbol/state")
        }
        vec[i] = SymbolState{Symbol: sym, State: st}
    }
    return Address{Vector: vec}, nil
}

// Hash (matches Rust Blake2_256 semantics via SHA‑256 stand‑in)
func (a Address) Hash() [32]byte {
    return sha256.Sum256(a.Encode())
}

// FromInts helper
func FromInts(symbols, states []int) (Address, error) {
    if len(symbols) != VectorLen || len(states) != VectorLen {
        return Address{}, errors.New("invalid vector length")
    }
    var vec [VectorLen]SymbolState
    for i := 0; i < VectorLen; i++ {
        s := symbols[i]
        st := states[i]
        if s < 0 || s > MaxSymbol || st < 0 || st > MaxState {
            return Address{}, errors.New("out of range")
        }
        vec[i] = SymbolState{Symbol: uint8(s), State: uint8(st)}
    }
    return Address{Vector: vec}, nil
}

// ToUint64 checksum (optional)
func (a Address) Checksum64() uint64 {
    h := a.Hash()
    return binary.LittleEndian.Uint64(h[:8])
}
