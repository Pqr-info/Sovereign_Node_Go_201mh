package pikr

import (
	"bytes"
	"testing"
)

func TestIdentity5Lengths(t *testing.T) {
	psi := make([]byte, PSILen)
	sfi := make([]byte, SFILen)
	tsi := make([]byte, TSILen)
	qii := make([]byte, QIILen)
	qri := make([]byte, QRILen)

	id, err := NewIdentity5(psi, sfi, tsi, qii, qri)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(id.ID5()) != ID5Len {
		t.Fatalf("ID5 length = %d, want %d", len(id.ID5()), ID5Len)
	}
}

func TestRecoveryAndSovereignKey(t *testing.T) {
	psi := bytes.Repeat([]byte{0x01}, PSILen)
	sfi := bytes.Repeat([]byte{0x02}, SFILen)
	tsi := bytes.Repeat([]byte{0x03}, TSILen)
	qii := bytes.Repeat([]byte{0x04}, QIILen)
	qri := bytes.Repeat([]byte{0x05}, QRILen)

	id, _ := NewIdentity5(psi, sfi, tsi, qii, qri)
	rm := id.RecoveryMatrix()
	sk := rm.SovereignKey()

	if len(sk) != HashLen {
		t.Fatalf("sovereign key length = %d, want %d", len(sk), HashLen)
	}
}

func TestNomenclature(t *testing.T) {
	psi := bytes.Repeat([]byte{0x0A}, PSILen)
	sfi := make([]byte, SFILen)
	tsi := make([]byte, TSILen)
	qii := bytes.Repeat([]byte{0x0B}, QIILen)
	qri := bytes.Repeat([]byte{0x0C}, QRILen)

	id, _ := NewIdentity5(psi, sfi, tsi, qii, qri)

	if got := id.IdentityName(); !bytes.HasPrefix([]byte(got), []byte("PI-")) {
		t.Fatalf("IdentityName = %s, want prefix PI-", got)
	}

	if got := id.LineageName(4); !bytes.HasPrefix([]byte(got), []byte("LN-")) {
		t.Fatalf("LineageName = %s, want prefix LN-", got)
	}
}
