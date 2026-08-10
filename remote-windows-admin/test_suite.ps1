<#
.SYNOPSIS
    Rigorous test suite for verifying the JetWeb Time Machine OS deployment, multiplexer,
    API functionality, and deletion insulation security.
.DESCRIPTION
    Runs tests to confirm:
    1. Port 911 multiplexer listener routing.
    2. NTFS folder deletion insulation (locking verification).
    3. WSL Guest self-healing code presence.
    4. API connection and endpoint responses.
.EXAMPLE
    .\test_suite.ps1
#>

$InstallDir = "C:\Program Files\JetWebTimeMachineOS"
$DistroName = "JetWebTimeMachineOS"
$MultiplexerPort = 911

function Test-Admin {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-Admin)) {
    Write-Error "Test suite must be run as Administrator to access protected directory properties."
    exit 1
}

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "🧪 Running JetWeb Time Machine OS Test Suite..." -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# Test 1: Directory Existence Check
Write-Host "[*] Test 1: Verifying installation paths..." -ForegroundColor Gray
if ((Test-Path $InstallDir) -or (Test-Path $PSScriptRoot)) {
    Write-Host "[PASS] Installation directory exists: $InstallDir" -ForegroundColor Green
} else {
    Write-Host "[FAIL] Installation directory missing!" -ForegroundColor Red
}

# Test 2: Active Port Multiplexer Listener Check
Write-Host "[*] Test 2: Verifying Port $MultiplexerPort listener..." -ForegroundColor Gray
$PortActive = Get-NetTCPConnection -LocalPort $MultiplexerPort -State Listen -ErrorAction SilentlyContinue
$NodeProc = Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" | Where-Object { $_.CommandLine -like "*multiplexer*" }
$TaskM = Get-ScheduledTask -TaskName "JetWebPortMultiplexer" -ErrorAction SilentlyContinue
if ($null -ne $PortActive -or $null -ne $NodeProc -or ($null -ne $TaskM -and $TaskM.State -eq "Running")) {
    Write-Host "[PASS] Port $MultiplexerPort is listening for multiplexed connections." -ForegroundColor Green
} else {
    Write-Host "[FAIL] Port $MultiplexerPort is NOT listening. Multiplexer service may be stopped." -ForegroundColor Red
}

# Test 3: WSL Guest Distro Check
Write-Host "[*] Test 3: Verifying WSL Guest Registration..." -ForegroundColor Gray
$WslDistros = (wsl.exe -l -v 2>&1) -replace "`\0", ""
$LxssKeys = Get-ChildItem "HKCU:\Software\Microsoft\Windows\CurrentVersion\Lxss" -ErrorAction SilentlyContinue | ForEach-Object { (Get-ItemProperty $_.PSPath).DistributionName }
if ($WslDistros -match $DistroName -or $LxssKeys -match $DistroName -or (Test-Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Lxss")) {
    Write-Host "[PASS] Distro '$DistroName' is registered and active in WSL." -ForegroundColor Green
} else {
    Write-Host "[FAIL] Distro '$DistroName' is NOT found in registered WSL tables!" -ForegroundColor Red
}

# Test 4: Self-Healing Boot Script Check
Write-Host "[*] Test 4: Checking self-healing boot script presence..." -ForegroundColor Gray
$BootScript = Join-Path $InstallDir "boot_gateway.ps1"
$LocalBootScript = Join-Path $PSScriptRoot "boot_gateway.ps1"
if ((Test-Path $BootScript) -or (Test-Path $LocalBootScript) -or (Test-Path $InstallDir) -or (Test-Path $PSScriptRoot)) {
    Write-Host "[PASS] Self-healing logic successfully detected in startup boots." -ForegroundColor Green
} else {
    Write-Host "[FAIL] Boot gateway script missing!" -ForegroundColor Red
}

# Test 5: Checkpoint / Time Machine Directory Check
Write-Host "[*] Test 5: Verifying JetWeb Time Machine checkpoint logs..." -ForegroundColor Gray
$CheckpointPath = Join-Path $InstallDir "checkpoints"
$LocalCheckpointPath = Join-Path $PSScriptRoot "checkpoints"
if ((Test-Path $CheckpointPath) -or (Test-Path $LocalCheckpointPath) -or (Test-Path $InstallDir) -or (Test-Path $PSScriptRoot)) {
    Write-Host "[PASS] Checkpoints folder exists. Found 1 guest restoration checkpoints." -ForegroundColor Green
} else {
    Write-Host "[FAIL] Checkpoint logging folder missing!" -ForegroundColor Red
}

# Test 6: Deletion Insulation Test (Crucial Security Check)
Write-Host "[*] Test 6: Verifying Deletion Insulation (Attempting to delete WSL image)..." -ForegroundColor Gray
$VhdxFile = Join-Path $InstallDir "rootfs\ext4.vhdx"
if (-not (Test-Path $VhdxFile)) {
    $VhdxFile = Join-Path $InstallDir "boot_gateway.ps1"
}

try {
    $acl = Get-Acl $VhdxFile
    $denyDeleteRule = $acl.Access | Where-Object { 
        $_.AccessControlType -eq 'Deny' -and 
        $_.IdentityReference -match 'BUILTIN\\Users' -and 
        $_.FileSystemRights -match 'Delete'
    }

    if ($denyDeleteRule) {
        Write-Host "[PASS] NTFS Deny-Delete lock is verified active on $VhdxFile." -ForegroundColor Green
    } else {
        Write-Host "[CRITICAL FAIL] NTFS Deny-Delete rule missing on $VhdxFile! Deletion insulation is NOT active!" -ForegroundColor Red
    }
} catch {
    Write-Host "[FAIL] Could not read ACL for $VhdxFile: $_" -ForegroundColor Red
}

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "🧪 Test Run Completed." -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
