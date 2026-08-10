# mount_copilotfs.ps1
# Creates the rclone configuration for CopilotFS and mounts it as a live virtual mesh organ.

$RcloneConfigPath = "$env:APPDATA\rclone\rclone.conf"
$ConfigContent = @"
[copilotfs]
type = local
nounc = true
"@

# Ensure config directory exists
$ConfigDir = Split-Path -Parent $RcloneConfigPath
if (!(Test-Path $ConfigDir)) {
    New-Item -ItemType Directory -Force -Path $ConfigDir | Out-Null
}

# Append to rclone.conf if copilotfs is not present
if (Test-Path $RcloneConfigPath) {
    $CurrentConfig = Get-Content $RcloneConfigPath -Raw
    if ($CurrentConfig -notmatch "\[copilotfs\]") {
        Add-Content -Path $RcloneConfigPath -Value "`n$ConfigContent"
    }
} else {
    Set-Content -Path $RcloneConfigPath -Value $ConfigContent
}

# Create mount directory
$MountPath = "C:\pqr.info\copilotfs"
if (!(Test-Path $MountPath)) {
    New-Item -ItemType Directory -Force -Path $MountPath | Out-Null
}

Write-Host "Starting rclone mount for CopilotFS on $MountPath..."
# Start rclone daemon
Start-Process "rclone" -ArgumentList "mount copilotfs:C:\Users\theal\copilot-bridge\output $MountPath --vfs-cache-mode full" -NoNewWindow
Write-Host "CopilotFS registered and mounted successfully as a mesh-native organ."
