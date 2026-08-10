package pikr

import (
	"encoding/hex"
	"errors"
	"fmt"

	"golang.org/x/crypto/blake2b"
)

const (
	PSILen  = 32
	SFILen  = 16
	TSILen  = 16
	QIILen  = 32
	QRILen  = 8
	ID5Len  = PSILen + SFILen + TSILen + QIILen + QRILen
	HashLen = 32
)

var ErrInvalidLength = errors.New("invalid dimension length for Identity5")

type Identity5 struct {
	PSI []byte // 32
	SFI []byte // 16
	TSI []byte // 16
	QII []byte // 32
	QRI []byte // 8
}

type RecoveryMatrix struct {
	K1 []byte
	K2 []byte
	K3 []byte
	K4 []byte
	K5 []byte
}

func NewIdentity5(psi, sfi, tsi, qii, qri []byte) (*Identity5, error) {
	if len(psi) != PSILen || len(sfi) != SFILen || len(tsi) != TSILen ||
		len(qii) != QIILen || len(qri) != QRILen {
		return nil, ErrInvalidLength
	}
	return &Identity5{psi, sfi, tsi, qii, qri}, nil
}

func (id *Identity5) ID5() []byte {
	out := make([]byte, 0, ID5Len)
	out = append(out, id.PSI...)
	out = append(out, id.SFI...)
	out = append(out, id.TSI...)
	out = append(out, id.QII...)
	out = append(out, id.QRI...)
	return out
}

func hashBlake256(data []byte) []byte {
	h, _ := blake2b.New256(nil)
	h.Write(data)
	return h.Sum(nil)
}

func (id *Identity5) RecoveryMatrix() *RecoveryMatrix {
	return &RecoveryMatrix{
		K1: hashBlake256(id.PSI),
		K2: hashBlake256(id.SFI),
		K3: hashBlake256(id.TSI),
		K4: hashBlake256(id.QII),
		K5: hashBlake256(id.QRI),
	}
}

func (rm *RecoveryMatrix) SovereignKey() []byte {
	buf := make([]byte, 0, HashLen*5)
	buf = append(buf, rm.K1...)
	buf = append(buf, rm.K2...)
	buf = append(buf, rm.K3...)
	buf = append(buf, rm.K4...)
	buf = append(buf, rm.K5...)
	return hashBlake256(buf)
}

// Nomenclature

func shortHex(b []byte, n int) string {
	h := hex.EncodeToString(b)
	if len(h) < n {
		return h
	}
	return h[:n]
}

func (id *Identity5) IdentityName() string {
	return "PI-" + shortHex(id.PSI, 6) + "-" + shortHex(id.QRI, 2)
}

func (id *Identity5) LineageName(generation int) string {
	return "LN-" + shortHex(id.PSI, 6) + "-" + shortHex(id.QII, 4) +
		"-" + fmt.Sprintf("%03d", max(0, generation))
}

func (rm *RecoveryMatrix) RecoveryName(dim string, k []byte) string {
	return "REC-" + dim + "-" + shortHex(k, 4)
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
