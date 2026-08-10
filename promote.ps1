# Sovereign-27 Atomic Promotion Script (PowerShell)
# Usage: .\promote.ps1 <service> <release-id>

param (
    [Parameter(Mandatory=$true)][string]$Service,
    [Parameter(Mandatory=$true)][string]$ReleaseId
)

$PQR_ROOT = "C:\pqr.info"
$RELEASE_DIR = Join-Path $PQR_ROOT "releases\$ReleaseId"
$LOCK_FILE = Join-Path $PQR_ROOT "releases\.lock"
$MANIFEST_FILE = Join-Path $PQR_ROOT "manifest.json"
$RUNTIME_SERVICE_DIR = Join-Path $PQR_ROOT "runtime\$Service"
$CURRENT_PTR = Join-Path $RUNTIME_SERVICE_DIR "current.ptr"
$LKG_PTR = Join-Path $RUNTIME_SERVICE_DIR "last_known_good.ptr"
$GENESIS_PTR = Join-Path $RUNTIME_SERVICE_DIR "genesis.ptr"
$BOOTLOADER_KICK_URL = "http://localhost:4053/api/kick"
$BOOTLOADER_HEALTH_URL = "http://localhost:4053/api/health"

Write-Host "[Promote] Initiating promotion for service '$Service' -> release '$ReleaseId'..."

if (-not (Test-Path $RELEASE_DIR)) {
    Write-Host "[Promote] Target release '$ReleaseId' not found locally. Pulling from Hetzner Master..."
    python C:\pqr.info\mev\scripts\hetzner_master_sync.py pull $ReleaseId
}

if (-not (Test-Path $RELEASE_DIR)) {
    Write-Host "[Promote] ERROR: Target release directory does not exist locally or on Hetzner Master: $RELEASE_DIR"
    exit 1
}

if (Test-Path $LOCK_FILE) {
    Write-Host "[Promote] Rail lock exists. Waiting 2 seconds..."
    Start-Sleep -Seconds 2
}

"LOCKED" | Out-File -FilePath $LOCK_FILE -Encoding utf8

try {
    $prevCurrent = if (Test-Path $CURRENT_PTR) { (Get-Content $CURRENT_PTR).Trim() } else { "../../releases/$ReleaseId" }
    
    # 1. Update runtime pointers
    $prevCurrent | Out-File -FilePath $LKG_PTR -Encoding utf8 -NoNewline
    Write-Host "[Promote] Pointer updated: last_known_good -> $prevCurrent"

    "../../releases/$ReleaseId" | Out-File -FilePath $CURRENT_PTR -Encoding utf8 -NoNewline
    Write-Host "[Promote] Pointer updated: current -> ../../releases/$ReleaseId"

    if (-not (Test-Path $GENESIS_PTR)) {
        "../../releases/evolved_genesis_R1" | Out-File -FilePath $GENESIS_PTR -Encoding utf8 -NoNewline
    }

    # 2. Update operative manifest.json with rail_state audit block
    if (Test-Path $MANIFEST_FILE) {
        $manifestJson = Get-Content $MANIFEST_FILE -Raw | ConvertFrom-Json
        if (-not $manifestJson.sovereign.services.$Service) {
            $manifestJson.sovereign.services | Add-Member -MemberType NoteProperty -Name $Service -Value @{ current = $ReleaseId; last_known_good = $prevCurrent; genesis = "evolved_genesis_R1"; run_counter = 1 }
        } else {
            $manifestJson.sovereign.services.$Service.last_known_good = $prevCurrent.Replace("../../releases/", "")
            $manifestJson.sovereign.services.$Service.current = $ReleaseId
        }
        
        # Update rail_state audit trail
        $manifestJson.sovereign.rail_state = @{
            service = $Service
            current = $ReleaseId
            last_known_good = $prevCurrent.Replace("../../releases/", "")
            timestamp = [DateTimeOffset]::Now.ToUnixTimeMilliseconds()
            status = "healthy"
        }

        $manifestJson | ConvertTo-Json -Depth 10 | Out-File -FilePath $MANIFEST_FILE -Encoding utf8
        Write-Host "[Promote] Operative manifest.json & rail_state updated for '$Service'."
    }

    # 3. Trigger Bootloader KICK
    Write-Host "[Promote] Sending KICK trigger to Bootloader ($BOOTLOADER_KICK_URL)..."
    $kickObj = @{ service = $Service; release = $ReleaseId }
    $kickJson = ConvertTo-Json -InputObject $kickObj
    $kickResp = Invoke-RestMethod -Uri $BOOTLOADER_KICK_URL -Method Post -ContentType "application/json" -Body $kickJson -ErrorAction SilentlyContinue

    Start-Sleep -Seconds 1
    Write-Host "[Promote] Verifying service health..."
    $health = Invoke-RestMethod -Uri $BOOTLOADER_HEALTH_URL -Method Get -ErrorAction SilentlyContinue

    if ($health -and ($health.status -eq "ok" -or $health.status -eq "HEALTHY")) {
        Write-Host "[Promote] PROMOTION SUCCESSFUL! Service '$Service' running release '$ReleaseId'."
        python C:\pqr.info\mev\scripts\stadium_telemetry_emitter.py broadcast --speaker promote_script --category GOVERNANCE_SIGNAL --message "Promoted $Service to $ReleaseId (manifest_hash=$($health.manifest_hash))" | Out-Null
    } else {
        Write-Host "[Promote] HEALTH CHECK FAILED! Triggering automatic rollback to last_known_good..."
        $prevCurrent | Out-File -FilePath $CURRENT_PTR -Encoding utf8 -NoNewline
        $rollbackObj = @{ service = $Service; rollback = $true }
        $rollbackJson = ConvertTo-Json -InputObject $rollbackObj
        Invoke-RestMethod -Uri $BOOTLOADER_KICK_URL -Method Post -ContentType "application/json" -Body $rollbackJson -ErrorAction SilentlyContinue | Out-Null
        python C:\pqr.info\mev\scripts\stadium_telemetry_emitter.py broadcast --speaker promote_script --category ANOMALY_WARNING --message "Health check failed on $ReleaseId! Rolled back to $prevCurrent" | Out-Null
        exit 1
    }
} finally {
    if (Test-Path $LOCK_FILE) {
        Remove-Item $LOCK_FILE -Force
    }
}
