# Force Go to use workspace temp directory
$env:GOTMPDIR = "C:\Users\theal\swend\tmp"
New-Item -ItemType Directory -Force -Path $env:GOTMPDIR | Out-Null

# Run Go build with structured output
$build = go build -o .\bin\swend-server.exe .\cmd\swend-server 2>&1

# Emit structured warnings for Antigravity
foreach ($line in $build) {
    if ($line -match "warning") {
        Write-Output "AG_EVENT:BUILD_WARNING:$line"
    }
    if ($line -match "error") {
        Write-Output "AG_EVENT:BUILD_ERROR:$line"
    }
}

# Exit with Go's exit code
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}
