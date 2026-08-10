# Sidecar: collect WSL/host diagnostics into a single JSON incident file
# Usage: powershell -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\emit_incident.ps1

$ErrorActionPreference = 'Stop'
$bundle = 'D:\pqr.info\wsl_repro_bundle'
if (-not (Test-Path $bundle)) { New-Item -ItemType Directory -Path $bundle | Out-Null }

function Invoke-WithTimeout {
    param(
        [scriptblock] $ScriptBlock,
        [int] $TimeoutSec = 15
    )
    $job = Start-Job -ScriptBlock $ScriptBlock
    $ok = Wait-Job $job -Timeout $TimeoutSec
    if ($ok) {
        $out = Receive-Job $job -ErrorAction SilentlyContinue
        Remove-Job $job -Force | Out-Null
        return $out
    } else {
        Stop-Job $job -ErrorAction SilentlyContinue | Out-Null
        Remove-Job $job -Force | Out-Null
        return "__TIMEOUT__"
    }
}

$ts = Get-Date -Format o
$rand = Get-Random -Maximum 10000
$prefix = "incident_{0}_{1}" -f ($ts -replace '[:.]','_'), $rand
$jsonPath = Join-Path $bundle ($prefix + '.json')

# Capture systeminfo
$systeminfo = Invoke-WithTimeout -ScriptBlock { systeminfo 2>&1 } -TimeoutSec 30
if ($systeminfo -is [array]) { $systeminfo = $systeminfo -join "`n" }

# Capture wsl --version
$wsl_version = Invoke-WithTimeout -ScriptBlock { wsl --version 2>&1 } -TimeoutSec 10
if ($wsl_version -is [array]) { $wsl_version = $wsl_version -join "`n" }

# Capture wsl --status
$wsl_status = Invoke-WithTimeout -ScriptBlock { wsl --status 2>&1 } -TimeoutSec 10
if ($wsl_status -is [array]) { $wsl_status = $wsl_status -join "`n" }

# Capture wsl dmesg --boot (may timeout if another process is stuck)
$wsl_dmesg_boot = Invoke-WithTimeout -ScriptBlock { wsl dmesg --boot 2>&1 } -TimeoutSec 20
if ($wsl_dmesg_boot -is [array]) { $wsl_dmesg_boot = $wsl_dmesg_boot -join "`n" }

# Get any wsl processes that look like they relate to dmesg/status/version
$wsl_procs = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match 'wsl.*dmesg|wsl.*--boot|wsl.*version|wsl.*--status' } | Select-Object ProcessId, CommandLine

# Check gh CLI
$gh_cmd = Get-Command gh -ErrorAction SilentlyContinue
$gh_installed = $null -ne $gh_cmd

# Collect current bundle file listing
$files = Get-ChildItem -Path $bundle | Select-Object Name, Length

# Normalize outputs for JSON (avoid inline conditionals in the literal)
$systeminfo_val = if ($systeminfo -eq '__TIMEOUT__') { 'TIMEOUT' } else { $systeminfo }
$wsl_version_val = if ($wsl_version -eq '__TIMEOUT__') { 'TIMEOUT' } else { $wsl_version }
$wsl_status_val = if ($wsl_status -eq '__TIMEOUT__') { 'TIMEOUT' } else { $wsl_status }
$wsl_dmesg_boot_val = if ($wsl_dmesg_boot -eq '__TIMEOUT__') { 'TIMEOUT' } else { $wsl_dmesg_boot }

$incident = [PSCustomObject]@{
    timestamp = $ts
    incident_id = $prefix
    systeminfo = $systeminfo_val
    wsl_version = $wsl_version_val
    wsl_status = $wsl_status_val
    wsl_dmesg_boot = $wsl_dmesg_boot_val
    wsl_related_processes = $wsl_procs
    gh_installed = $gh_installed
    bundle_files = $files
}

$incident | ConvertTo-Json -Depth 6 | Out-File -FilePath $jsonPath -Encoding utf8
Write-Output "Wrote incident JSON: $jsonPath"
