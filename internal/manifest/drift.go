package manifest

import (
	"encoding/json"
	"fmt"
	"reflect"
)

// DetectDrift compares a local/runtime manifest state with the canonical configuration.
// It returns a list of drift descriptions.
func DetectDrift(localData []byte, canonicalData []byte) ([]string, error) {
	var local map[string]interface{}
	var canonical map[string]interface{}

	if err := json.Unmarshal(localData, &local); err != nil {
		return nil, fmt.Errorf("local json unmarshal failed: %w", err)
	}

	if err := json.Unmarshal(canonicalData, &canonical); err != nil {
		return nil, fmt.Errorf("canonical json unmarshal failed: %w", err)
	}

	var drifts []string
	compareMaps("", local, canonical, &drifts)

	return drifts, nil
}

func compareMaps(prefix string, local map[string]interface{}, canonical map[string]interface{}, drifts *[]string) {
	for k, canonVal := range canonical {
		localVal, exists := local[k]
		path := k
		if prefix != "" {
			path = prefix + "." + k
		}

		if !exists {
			*drifts = append(*drifts, fmt.Sprintf("missing key: %s (expected: %v)", path, canonVal))
			continue
		}

		// Recurse on map types
		canonMap, isCanonMap := canonVal.(map[string]interface{})
		localMap, isLocalMap := localVal.(map[string]interface{})

		if isCanonMap && isLocalMap {
			compareMaps(path, localMap, canonMap, drifts)
		} else if !reflect.DeepEqual(localVal, canonVal) {
			*drifts = append(*drifts, fmt.Sprintf("mismatch at %s: runtime=%v, canonical=%v", path, localVal, canonVal))
		}
	}
}
