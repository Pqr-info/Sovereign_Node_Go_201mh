#!/usr/bin/env bash
set -euo pipefail

VAULT_ADDR="${VAULT_ADDR:?VAULT_ADDR not set}"
VAULT_TOKEN="${VAULT_TOKEN:?VAULT_TOKEN not set}"
SECRET_PATH="${1:-secret/data/swend}"
ENV_FILE="${2:-.env}"

resp=$(curl -s -H "X-Vault-Token: $VAULT_TOKEN" "$VAULT_ADDR/v1/$SECRET_PATH")
data=$(echo "$resp" | jq -r '.data.data')

> "$ENV_FILE"
echo "$data" | jq -r 'to_entries[] | "\(.key)=\(.value)"' | tee -a "$ENV_FILE" >/dev/null

# export into current shell (for `source load_vault_env.sh`)
while IFS='=' read -r k v; do
  export "$k=$v"
done < "$ENV_FILE"

echo "Loaded Vault secrets from $SECRET_PATH into $ENV_FILE and environment."
