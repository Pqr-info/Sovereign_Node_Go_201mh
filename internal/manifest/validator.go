package manifest

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/santhosh-tekuri/jsonschema/v5"
	"io"
	"os"
)

// ValidateJson validates a manifest JSON reader against a schema JSON reader.
func ValidateJson(manifestReader io.Reader, schemaReader io.Reader) error {
	schemaBytes, err := io.ReadAll(schemaReader)
	if err != nil {
		return fmt.Errorf("failed to read schema: %w", err)
	}

	sch, err := jsonschema.CompileString("schema.json", string(schemaBytes))
	if err != nil {
		return fmt.Errorf("schema compile error: %w", err)
	}

	manifestBytes, err := io.ReadAll(manifestReader)
	if err != nil {
		return fmt.Errorf("failed to read manifest: %w", err)
	}

	var val interface{}
	if err := json.Unmarshal(manifestBytes, &val); err != nil {
		return fmt.Errorf("json parse error: %w", err)
	}

	if err := sch.Validate(val); err != nil {
		return fmt.Errorf("manifest validation failed: %w", err)
	}

	return nil
}

// ValidateManifest validates a local manifest file against a local JSON schema file.
func ValidateManifest(manifestPath string, schemaPath string) error {
	mFile, err := os.Open(manifestPath)
	if err != nil {
		return fmt.Errorf("failed to open manifest: %w", err)
	}
	defer mFile.Close()

	sFile, err := os.Open(schemaPath)
	if err != nil {
		return fmt.Errorf("failed to open schema: %w", err)
	}
	defer sFile.Close()

	return ValidateJson(mFile, sFile)
}

// ValidateBytes validates raw manifest bytes against raw schema bytes.
func ValidateBytes(manifestData []byte, schemaData []byte) error {
	return ValidateJson(bytes.NewReader(manifestData), bytes.NewReader(schemaData))
}
