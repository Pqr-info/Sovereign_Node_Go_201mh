<#
.SYNOPSIS
    Creates a synchronized JetWeb Time Machine checkpoint (Host System Restore Point + WSL Guest Snapshot).
.PARAMETER Name
    Name of the checkpoint.
#>
param(
    [Parameter(Mandatory=$true)]
    [string]$Name
)

$InstallDir = "C:\Program Files\JetWebTimeMachineOS"
$WSLDistroName = "JetWebTimeMachineOS"
$checkpointDir = Join-Path $InstallDir "checkpoints"

function Test-Admin {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-Admin)) {
    Write-Error "Administrator privileges are required to create system checkpoints. Restart console as Administrator."
    exit 1
}

if (-not (Test-Path $checkpointDir)) {
    New-Item -ItemType Directory -Path $checkpointDir -Force | Out-Null
}

Write-Host "[*] Creating JetWeb Time Machine Checkpoint: '$Name'..." -ForegroundColor Cyan

# 1. Create Host System Restore Point
Write-Host "[*] Registering Windows Host System Restore Point 'JetWeb_$Name'..." -ForegroundColor Cyan
Checkpoint-Computer -Description "JetWeb_$Name" -RestorePointType APPLICATION_INSTALL -ErrorAction SilentlyContinue

# 2. Create WSL Guest OS Snapshot (Incremental Restic Backup)
Write-Host "[*] Creating incremental guest filesystem snapshot tagged as '$Name'..." -ForegroundColor Cyan
$resticRepo = "/mnt/c/Program Files/JetWebTimeMachineOS/backup_repo"
$passwdFile = "$resticRepo/passwd.txt"
wsl.exe -d $WSLDistroName -u root -- ash -c "restic -r `"$resticRepo`" --password-file `"$passwdFile`" unlock 2>/dev/null && restic -r `"$resticRepo`" --password-file `"$passwdFile`" backup /opt /etc /home /root --tag $Name 2>/dev/null"

Write-Host "[+] Checkpoint '$Name' created successfully." -ForegroundColor Green
Write-Host "    -> Host Restore Point: JetWeb_$Name" -ForegroundColor Yellow
Write-Host "    -> Guest Incremental:  Restic Snapshot tagged '$Name'" -ForegroundColor Yellow
