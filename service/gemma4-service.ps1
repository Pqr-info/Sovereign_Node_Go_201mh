param(
    [string]$ConfigDir,
    [string]$Binary
)

$ServiceDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SwendDir = Split-Path -Parent $ServiceDir

if (-not $ConfigDir) { $ConfigDir = "$SwendDir\gemma4\config" }
if (-not $Binary) { $Binary = "$SwendDir\gemma4\gemma4-e4b.exe" }

$ErrorActionPreference = "Stop"

# Retrieve mode from environment, or auto-detect
$mode = $env:GEMMA4_MODE  # "local-gpu" | "ryzen-npu" | "cloud" | "snapdragon"

function Test-RyzenNPU {
    # Check for AMD XDNA / NPU devices
    Get-PnpDevice | Where-Object { $_.FriendlyName -like "*NPU*" -or $_.FriendlyName -like "*XDNA*" }
}

if (-not $mode) {
    if (Test-RyzenNPU) {
        $mode = "ryzen-npu"
    } else {
        $mode = "local-gpu"  # Default fallback if GPU acceleration is present
    }
}

switch ($mode) {
    "local-gpu"   { $config = Join-Path $ConfigDir "gpu.local.yaml" }
    "ryzen-npu"   { $config = Join-Path $ConfigDir "npu.ryzen.yaml" }
    "cloud"       { $config = Join-Path $ConfigDir "cloud.yaml" }
    "snapdragon"  { $config = Join-Path $ConfigDir "snapdragon.yaml" }
    default       { $config = Join-Path $ConfigDir "gemma4-e4b.yaml" }
}

Write-Output "Starting Gemma-4-e4b Brain Agent in mode: $mode using config: $config"

Start-Process -FilePath $Binary -ArgumentList "--config `"$config`"" -NoNewWindow -Wait
