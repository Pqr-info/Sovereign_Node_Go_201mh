package manifest

import (
	"testing"
)

func TestValidateBytes(t *testing.T) {
	schema := []byte(`{
		"type": "object",
		"required": ["version"],
		"properties": {
			"version": { "type": "string" }
		}
	}`)

	validManifest := []byte(`{"version": "1.0.0"}`)
	invalidManifest := []byte(`{"version": 123}`)

	if err := ValidateBytes(validManifest, schema); err != nil {
		t.Errorf("expected valid manifest to pass, got error: %v", err)
	}

	if err := ValidateBytes(invalidManifest, schema); err == nil {
		t.Error("expected invalid manifest (integer version) to fail, but it passed")
	}
}

func TestDetectDrift(t *testing.T) {
	local := []byte(`{
		"version": "1.0.0",
		"environment": {
			"os": "windows",
			"hostname": "local-node"
		}
	}`)

	canonical := []byte(`{
		"version": "1.0.0",
		"environment": {
			"os": "windows",
			"hostname": "canonical-node"
		}
	}`)

	drifts, err := DetectDrift(local, canonical)
	if err != nil {
		t.Fatalf("unexpected drift detection error: %v", err)
	}

	expectedDrift := "mismatch at environment.hostname: runtime=local-node, canonical=canonical-node"
	found := false
	for _, d := range drifts {
		if d == expectedDrift {
			found = true
			break
		}
	}

	if !found {
		t.Errorf("expected drift message %q, got drifts: %v", expectedDrift, drifts)
	}
}
