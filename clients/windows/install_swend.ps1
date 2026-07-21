# install_swend.ps1
# =========================================================================================
# 🌀 SWEND - WINDOWS AUTO-INSTALLER & SERVICE CONFIGURATION
# =========================================================================================
# Run this script in an elevated PowerShell session to compile and install the SWEND daemon.
# =========================================================================================

# 1. Require Administrator Elevation
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "[ERROR] This installer requires Administrator privileges. Re-launching as Admin..." -ForegroundColor Red
    Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    Exit
}

Clear-Host
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "         🌀 SWEND (SWARM EXECUTION DAEMON) - WINDOWS INSTALLER       " -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

$InstallDir = $PSScriptRoot
if ($InstallDir -match "clients\\windows") {
    $InstallDir = (Get-Item $InstallDir).Parent.Parent.FullName
}

Write-Host "[SYSTEM] Setting installation root to: $InstallDir" -ForegroundColor Green
Set-Location $InstallDir

# 2. Check for Go installation
try {
    $null = Get-Command go -ErrorAction Stop
    Write-Host "[DETECTED] Go Compiler is available." -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Go runtime is not installed or not in System PATH." -ForegroundColor Red
    Write-Host "Please download and install Go from: https://go.dev/dl/" -ForegroundColor Yellow
    Exit
}

# 3. Compile the SWEND daemon executable
Write-Host "[SYSTEM] Compiling SWEND executable for Windows..." -ForegroundColor Cyan
go build -ldflags="-s -w" -o swend.exe ./cmd/swend/main.go

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] SWEND compilation failed." -ForegroundColor Red
    Exit
}
Write-Host "[SUCCESS] swend.exe built successfully!" -ForegroundColor Green

# 4. Create local state & log directory
$LogDir = Join-Path $InstallDir "logs"
if (-not (Test-Path $LogDir)) {
    $null = New-Item -ItemType Directory -Path $LogDir
}

# 5. Build start script for background task runner
$RunnerPath = Join-Path $InstallDir "run_swend.ps1"
$RunnerContent = @"
# Automated SWEND Task Runner
# Redirects output to local logs and sets environment

`$env:DATABASE_URL = "postgresql://root@localhost:26257/antigravity?sslmode=disable"
`$env:VAULT_ADDR = "http://localhost:8200"
`$env:SWEND_SWARM_ADDR = "localhost:1111"
`$env:SWEND_API_URL = "http://localhost:8196"

Set-Location "$InstallDir"
Start-Process -FilePath ".\swend.exe" -ArgumentList "menu" -NoNewWindow -Wait >> "$LogDir\swend_output.log" 2>&1
"@

Set-Content -Path $RunnerPath -Value $RunnerContent -Force
Write-Host "[SYSTEM] Service launcher configured at: $RunnerPath" -ForegroundColor Green

# 6. Register as a Scheduled Background Task (survives reboot)
$TaskName = "SwarmExecutionDaemon"
$TaskExists = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue

if ($TaskExists) {
    Write-Host "[SYSTEM] Found existing task '$TaskName', unregistering..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

$Action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$RunnerPath`""
$Trigger = New-ScheduledTaskTrigger -AtStartup
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -User "NT AUTHORITY\SYSTEM" | Out-Null

Write-Host ""
Write-Host "[SUCCESS] SWEND is successfully registered as a Windows startup service!" -ForegroundColor Green
Write-Host "Triggering service execution now..." -ForegroundColor Cyan
Start-ScheduledTask -TaskName $TaskName

Write-Host "=====================================================================" -ForegroundColor Green
Write-Host "  ✅ Installation Complete! Monitor logs at: $LogDir\swend_output.log" -ForegroundColor White
Write-Host "=====================================================================" -ForegroundColor Green
