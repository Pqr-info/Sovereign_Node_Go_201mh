package pikr

import (
    "encoding/hex"
    "encoding/json"
    "os"
    "path/filepath"
    "testing"
)

type vectorFile struct {
    Version string `json:"version"`
    Vectors []struct {
        Inputs struct {
            PSI string `json:"psi"`
            SFI string `json:"sfi"`
            TSI string `json:"tsi"`
            QII string `json:"qii"`
            QRI string `json:"qri"`
        } `json:"inputs"`
        Outputs struct {
            K1           string `json:"k1"`
            K2           string `json:"k2"`
            K3           string `json:"k3"`
            K4           string `json:"k4"`
            K5           string `json:"k5"`
            SovereignKey string `json:"sovereignKey"`
            IdentityName string `json:"identityName"`
            LineageName  string `json:"lineageName"`
        } `json:"outputs"`
    } `json:"vectors"`
}

func TestPIKRVectorsJSON(t *testing.T) {
    root := filepath.Join("..", "docs", "pikr", "test_vectors.json")
    data, err := os.ReadFile(root)
    if err != nil {
        t.Fatalf("failed to read vectors: %v", err)
    }

    var vf vectorFile
    if err := json.Unmarshal(data, &vf); err != nil {
        t.Fatalf("failed to parse vectors: %v", err)
    }

    for _, v := range vf.Vectors {
        psi, _ := hex.DecodeString(v.Inputs.PSI)
        sfi, _ := hex.DecodeString(v.Inputs.SFI)
        tsi, _ := hex.DecodeString(v.Inputs.TSI)
        qii, _ := hex.DecodeString(v.Inputs.QII)
        qri, _ := hex.DecodeString(v.Inputs.QRI)

        id, err := NewIdentity5(psi, sfi, tsi, qii, qri)
        if err != nil {
            t.Fatalf("NewIdentity5 error: %v", err)
        }
        rm := id.RecoveryMatrix()
        sk := rm.SovereignKey()

        assertHexEq(t, "K1", rm.K1, v.Outputs.K1)
        assertHexEq(t, "K2", rm.K2, v.Outputs.K2)
        assertHexEq(t, "K3", rm.K3, v.Outputs.K3)
        assertHexEq(t, "K4", rm.K4, v.Outputs.K4)
        assertHexEq(t, "K5", rm.K5, v.Outputs.K5)
        assertHexEq(t, "SovereignKey", sk, v.Outputs.SovereignKey)

        if got := id.IdentityName(); got != v.Outputs.IdentityName {
            t.Fatalf("IdentityName mismatch: got %s, want %s", got, v.Outputs.IdentityName)
        }
    }
}

func assertHexEq(t *testing.T, label string, got []byte, wantHex string) {
    t.Helper()
    want, _ := hex.DecodeString(wantHex)
    if hex.EncodeToString(got) != hex.EncodeToString(want) {
        t.Fatalf("%s mismatch: got %x, want %x", label, got, want)
    }
}
