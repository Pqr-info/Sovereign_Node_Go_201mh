$ServiceDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SwendDir = Split-Path -Parent $ServiceDir
$ConfigPath = "$SwendDir\vault-agent.hcl"
$LogPath = "$SwendDir\vault\agent.log"

$ErrorActionPreference = "Stop"

Write-Output "Starting Vault Agent service..."

Start-Process `
    -FilePath "$SwendDir\vault.exe" `
    -ArgumentList "agent -config=$ConfigPath" `
    -RedirectStandardOutput $LogPath `
    -RedirectStandardError $LogPath `
    -WindowStyle Hidden `
    -Wait
