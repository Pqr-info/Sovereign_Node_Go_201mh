# ============================
# SWEND MASTER LIFECYCLE SCRIPT
# ============================

Write-Output "=== SWEND: BUILD PHASE ==="

# Force Go to use workspace temp directory
$env:GOTMPDIR = "C:\Users\theal\swend\tmp"
New-Item -ItemType Directory -Force -Path $env:GOTMPDIR | Out-Null

# Run governed build wrapper
$build = go build -o .\bin\swend-server.exe .\cmd\swend-server 2>&1

foreach ($line in $build) {
    if ($line -match "warning") {
        Write-Output "AG_EVENT:BUILD_WARNING:$line"
    }
    if ($line -match "error") {
        Write-Output "AG_EVENT:BUILD_ERROR:$line"
    }
}

if ($LASTEXITCODE -ne 0) {
    Write-Output "=== BUILD FAILED ==="
    exit $LASTEXITCODE
}

Write-Output "=== BUILD SUCCESS ==="
Write-Output "=== SWEND: RUNTIME PHASE ==="

# Start SWEND server with governed runtime monitoring
$process = Start-Process -FilePath ".\bin\swend-server.exe" `
    -RedirectStandardOutput ".\runtime.out" `
    -RedirectStandardError ".\runtime.err" `
    -NoNewWindow `
    -PassThru

while (-not $process.HasExited) {
    Start-Sleep -Milliseconds 200

    if (Test-Path ".\runtime.err") {
        $errors = Get-Content ".\runtime.err" -Raw
        if ($errors -match "panic" -or $errors -match "error" -or $errors -match "drift" -or $errors -match "violation") {
            Write-Output "AG_EVENT:RUNTIME_ERROR:$errors"
        }
    }

    if (Test-Path ".\runtime.out") {
        $out = Get-Content ".\runtime.out" -Raw
        if ($out -match "warning" -or $out -match "failed" -or $out -match "sync") {
            Write-Output "AG_EVENT:RUNTIME_WARNING:$out"
        }
    }
}

exit $process.ExitCode
