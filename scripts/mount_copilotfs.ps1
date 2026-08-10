$remoteName = "copilotfs"
$sourcePath = "C:\Users\theal\copilot-bridge\output"
$mountPath  = "C:\pqr.info\copilotfs"

if (!(Test-Path $mountPath)) {
    New-Item -ItemType Directory -Path $mountPath | Out-Null
}

Write-Host "Mounting CopilotFS from $sourcePath to $mountPath using rclone remote '$remoteName'..."

rclone mount "$remoteName:$sourcePath" "$mountPath" --vfs-cache-mode full --log-file "C:\pqr.info\logs\copilotfs-mount.log" --log-level INFO
