param(
    [string]$VaultAddr = $env:VAULT_ADDR,
    [string]$VaultToken = $env:VAULT_TOKEN,
    [string]$SecretPath = "secret/data/swend",
    [string]$EnvFile = ".env"
)

if (-not $VaultAddr) { throw "VAULT_ADDR not set" }
if (-not $VaultToken) { throw "VAULT_TOKEN not set" }

$headers = @{ "X-Vault-Token" = $VaultToken }
$uri = "$VaultAddr/v1/$SecretPath"

$response = Invoke-RestMethod -Uri $uri -Headers $headers -Method GET

$kv = $response.data.data

# Write .env (git-ignored) OR export directly
$lines = @()
foreach ($key in $kv.Keys) {
    $value = $kv[$key]
    $lines += "$key=$value"
    $env:$key = $value
}

Set-Content -Path $EnvFile -Value ($lines -join "`n")
Write-Host "Loaded Vault secrets from $SecretPath into $EnvFile and current session."
