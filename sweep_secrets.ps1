# SWEND Secret Sweeper - Securely migrates .env to Vault
$envFile = ".env"
$vaultAddr = "http://localhost:8200"
$vaultToken = $env:VAULT_TOKEN
if (-not $vaultToken) {
    $vaultToken = Read-Host "Enter Vault token"
}

if (-not (Test-Path $envFile)) {
    Write-Host "Error: .env file not found" -ForegroundColor Red
    exit 1
}

Write-Host "Reading secrets from $envFile..." -ForegroundColor Cyan
$secrets = @{}
Get-Content $envFile | ForEach-Object {
    if ($_ -match "^([^#\s][^=]*)=(.*)$") {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        $secrets[$key] = $value
    }
}

if ($secrets.Count -eq 0) {
    Write-Host "No secrets found in .env" -ForegroundColor Yellow
    exit 0
}

# Construct Vault JSON payload
$payload = @{
    data = $secrets
} | ConvertTo-Json

Write-Host "Sweeping secrets into Vault at secret/swend..." -ForegroundColor Green
$headers = @{
    "X-Vault-Token" = $vaultToken
}

try {
    $response = Invoke-RestMethod -Uri "$vaultAddr/v1/secret/data/swend" -Method Post -Headers $headers -Body $payload -ContentType "application/json"
    Write-Host "✓ Vault successfully updated" -ForegroundColor Green
    
    # Securely wipe .env
    Write-Host "Wiping .env file..." -ForegroundColor Yellow
    Clear-Content $envFile
    Remove-Item $envFile
    Write-Host "✓ .env removed. Secrets are now secure in the SWEND Vault." -ForegroundColor Green
}
catch {
    Write-Host "Error: Failed to connect to Vault. Ensure docker-compose is running." -ForegroundColor Red
    Write-Host $_.Exception.Message
}
