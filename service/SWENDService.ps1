$ServiceDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SwendDir = Split-Path -Parent $ServiceDir
$RenderedEnv = "$SwendDir\vault\swend.env"
$SwendBinary = "$SwendDir\swend.exe"

$ErrorActionPreference = "Stop"

Write-Output "Waiting for Vault Agent to render secrets..."

while (-not (Test-Path $RenderedEnv)) {
    Start-Sleep -Seconds 1
}

Write-Output "Loading secrets into environment..."

Get-Content $RenderedEnv | ForEach-Object {
    if ($_ -match "^(.*?)=(.*)$") {
        $env:$($matches[1]) = $matches[2]
    }
}

Write-Output "Starting SWEND daemon..."
Start-Process -FilePath $SwendBinary -NoNewWindow -Wait
