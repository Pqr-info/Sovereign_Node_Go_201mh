<#
.SYNOPSIS
Secure Check-In (Tag-Out) script for Antigravity Session Synchronization.

.DESCRIPTION
Syncs the local Antigravity state back to the centralized Zeta vault and 
deletes the lock file, releasing the session for other nodes.
#>

$VaultPath = "\\zeta\c$\SovereignVault\antigravity_state"
$LocalDataPath = "$env:USERPROFILE\.gemini\antigravity"
$LockFile = "$VaultPath\.lock"

Write-Host "Checking in Antigravity State to Zeta Vault..." -ForegroundColor Cyan

# 1. Check if Vault exists
if (-not (Test-Path $VaultPath)) {
    Write-Host "Vault path $VaultPath not found! Please create it or update the script path." -ForegroundColor Red
    exit 1
}

# 2. Check if we own the lock
if (Test-Path $LockFile) {
    $LockedBy = Get-Content $LockFile
    if ($LockedBy.Trim() -ne $env:COMPUTERNAME) {
        Write-Host "WARNING: The lock is held by $LockedBy, not you ($env:COMPUTERNAME)!" -ForegroundColor Red
        Write-Host "Tag-Out aborted to prevent overwriting another node's state." -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "WARNING: No lock file found. Proceeding with sync anyway, but this is irregular." -ForegroundColor Yellow
}

# 3. Close Antigravity IDE (to ensure databases are flushed)
Write-Host "Closing Antigravity processes..." -ForegroundColor Cyan
Stop-Process -Name "Antigravity" -ErrorAction SilentlyContinue
Stop-Process -Name "Antigravity IDE" -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 4. Sync State (Push)
Write-Host "Pushing index and conversations from Local to Vault..." -ForegroundColor Cyan

# We use robocopy to mirror the Local conversations to Vault
robocopy "$LocalDataPath\conversations" "$VaultPath\conversations" /MIR /NFL /NDL /NJH /NJS /nc /ns /np

# Copy the index files
if (Test-Path "$LocalDataPath\agyhub_summaries_proto.pb") {
    Copy-Item "$LocalDataPath\agyhub_summaries_proto.pb" -Destination "$VaultPath\agyhub_summaries_proto.pb" -Force
}
if (Test-Path "$LocalDataPath\antigravity_state.pbtxt") {
    Copy-Item "$LocalDataPath\antigravity_state.pbtxt" -Destination "$VaultPath\antigravity_state.pbtxt" -Force
}

Write-Host "State successfully synchronized to Vault." -ForegroundColor Green

# 5. Release Lock
if (Test-Path $LockFile) {
    Remove-Item $LockFile -Force
    Write-Host "Lock released successfully." -ForegroundColor Green
}

Write-Host "Done! You are tagged out. Another node may now tag in." -ForegroundColor Green
