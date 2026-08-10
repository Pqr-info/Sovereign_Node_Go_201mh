<#
.SYNOPSIS
    Launches Vault Agent + SWEND daemon without Docker.
#>

$ErrorActionPreference = "Stop"

# --- CONFIG ---
$VaultAgentConfig = ".\vault-agent.hcl"
$RenderedEnvFile  = ".\vault\swend.env"
$SwendBinary      = ".\swend.exe"
$VaultAgentLog    = ".\vault\agent.log"

# Ensure directories exist
if (-not (Test-Path ".\vault")) { New-Item -ItemType Directory -Path ".\vault" | Out-Null }

Write-Host "Starting Vault Agent..." -ForegroundColor Cyan

# Start Vault Agent in background
Start-Process `
    -FilePath "vault.exe" `
    -ArgumentList "agent -config=$VaultAgentConfig" `
    -RedirectStandardOutput $VaultAgentLog `
    -WindowStyle Hidden

# Wait for Vault Agent to render secrets
Write-Host "Waiting for Vault Agent to render secrets..." -ForegroundColor Yellow

$timeout = 30
$elapsed = 0

while (-not (Test-Path $RenderedEnvFile)) {
    Start-Sleep -Seconds 1
    $elapsed++

    if ($elapsed -ge $timeout) {
        Write-Host "ERROR: Vault Agent did not render $RenderedEnvFile" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Secrets rendered successfully." -ForegroundColor Green

# Load secrets into environment
Write-Host "Loading secrets into environment..." -ForegroundColor Cyan

Get-Content $RenderedEnvFile | ForEach-Object {
    if ($_ -match "^(.*?)=(.*)$") {
        $key = $matches[1].Trim()
        $val = $matches[2].Trim()
        [System.Environment]::SetEnvironmentVariable($key, $val, "Process")
    }
}

Write-Host "Environment variables loaded." -ForegroundColor Green

# Start SWEND daemon
Write-Host "Starting SWEND daemon..." -ForegroundColor Cyan

Start-Process `
    -FilePath $SwendBinary `
    -NoNewWindow

Write-Host "SWEND is now running." -ForegroundColor Green
