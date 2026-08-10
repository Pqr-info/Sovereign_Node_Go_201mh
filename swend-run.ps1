# Force Go to use workspace temp directory
$env:GOTMPDIR = "C:\Users\theal\swend\tmp"
New-Item -ItemType Directory -Force -Path $env:GOTMPDIR | Out-Null

# Run SWEND server and capture all output
$process = Start-Process -FilePath ".\bin\swend-server.exe" `
    -RedirectStandardOutput ".\runtime.out" `
    -RedirectStandardError ".\runtime.err" `
    -NoNewWindow `
    -PassThru

# Monitor runtime logs for Antigravity events
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
