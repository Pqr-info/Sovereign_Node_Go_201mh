$ErrorActionPreference = "Stop"
$ServiceDir = $PSScriptRoot

Write-Host "Installing VaultAgentService..." -ForegroundColor Cyan
New-Service `
    -Name "VaultAgentService" `
    -BinaryPathName "powershell.exe -ExecutionPolicy Bypass -File $ServiceDir\VaultAgentService.ps1" `
    -DisplayName "Vault Agent Service" `
    -StartupType Automatic

Write-Host "Installing SWENDService..." -ForegroundColor Cyan
New-Service `
    -Name "SWENDService" `
    -BinaryPathName "powershell.exe -ExecutionPolicy Bypass -File $ServiceDir\SWENDService.ps1" `
    -DisplayName "SWEND Daemon Service" `
    -StartupType Automatic

Write-Host "Starting services..." -ForegroundColor Green
Start-Service VaultAgentService
Start-Service SWENDService

Write-Host "SWEND + Vault Agent installed as Windows Services."
