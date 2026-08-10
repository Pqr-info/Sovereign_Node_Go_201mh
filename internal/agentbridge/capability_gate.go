package agentbridge

import (
	"context"
	"fmt"
)

func ValidatePlannedActions(ctx context.Context, manifest ManifestClient, actions []string) error {
	services, nlMap, err := manifest.GetCapabilities(ctx)
	if err != nil {
		return err
	}

	allowed := map[string]bool{}
	for _, s := range services {
		allowed[s] = true
	}
	for _, v := range nlMap {
		allowed[v] = true
	}

	for _, act := range actions {
		if !allowed[act] {
			return fmt.Errorf("unauthorized action: %s", act)
		}
	}

	return nil
}
