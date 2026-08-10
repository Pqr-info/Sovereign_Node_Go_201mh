<#
.SYNOPSIS
Secure Checkout (Tag-In) script for Antigravity Session Synchronization.

.DESCRIPTION
Checks if another node is currently running Antigravity. If not, acquires a lock,
pulls the global index and conversation history from the centralized Zeta vault, 
and launches the Antigravity IDE locally for maximum speed.
#>

$VaultPath = "\\zeta\c$\SovereignVault\antigravity_state"
$LocalDataPath = "$env:USERPROFILE\.gemini\antigravity"
$LockFile = "$VaultPath\.lock"

Write-Host "Checking out Antigravity State from Zeta Vault..." -ForegroundColor Cyan

# 1. Check if Vault exists
if (-not (Test-Path $VaultPath)) {
    Write-Host "Vault path $VaultPath not found! Please create it or update the script path." -ForegroundColor Red
    exit 1
}

# 2. Check for Lock
if (Test-Path $LockFile) {
    $LockedBy = Get-Content $LockFile
    Write-Host "ACCESS DENIED: Antigravity is currently checked out by node: $LockedBy" -ForegroundColor Red
    Write-Host "Please Tag-Out on that node before trying again." -ForegroundColor Yellow
    exit 1
}

# 3. Acquire Lock
$env:COMPUTERNAME | Out-File -FilePath $LockFile -Encoding UTF8
Write-Host "Lock acquired successfully for $env:COMPUTERNAME." -ForegroundColor Green

# 4. Sync State (Pull)
Write-Host "Pulling index and conversations from Vault to Local..." -ForegroundColor Cyan

# We use robocopy to mirror the Vault's conversations to Local
# (This ensures deleted files on the vault are also deleted locally, preventing ghost DBs)
robocopy "$VaultPath\conversations" "$LocalDataPath\conversations" /MIR /NFL /NDL /NJH /NJS /nc /ns /np

# Copy the index files
if (Test-Path "$VaultPath\agyhub_summaries_proto.pb") {
    Copy-Item "$VaultPath\agyhub_summaries_proto.pb" -Destination "$LocalDataPath\agyhub_summaries_proto.pb" -Force
}
if (Test-Path "$VaultPath\antigravity_state.pbtxt") {
    Copy-Item "$VaultPath\antigravity_state.pbtxt" -Destination "$LocalDataPath\antigravity_state.pbtxt" -Force
}

Write-Host "State successfully synchronized." -ForegroundColor Green

# 5. Launch Antigravity
Write-Host "Launching Antigravity..." -ForegroundColor Cyan
$AgyPath = "$env:LOCALAPPDATA\Programs\Antigravity\Antigravity.exe"
if (-not (Test-Path $AgyPath)) {
    $AgyPath = "$env:LOCALAPPDATA\Programs\Antigravity IDE\Antigravity IDE.exe"
}

if (Test-Path $AgyPath) {
    Start-Process -FilePath $AgyPath
} else {
    Write-Host "Antigravity executable not found!" -ForegroundColor Red
}

Write-Host "Done! You are tagged in." -ForegroundColor Green
