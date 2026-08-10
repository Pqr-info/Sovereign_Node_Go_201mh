$remoteName = "geminifs"
$sourcePath = "C:\Users\theal\geminifs-output"
$mountPath  = "C:\pqr.info\geminifs"

$RcloneConfigPath = "$env:APPDATA\rclone\rclone.conf"
$ConfigContent = @"
[geminifs]
type = local
nounc = true
"@

if (Test-Path $RcloneConfigPath) {
    $CurrentConfig = Get-Content $RcloneConfigPath -Raw
    if ($CurrentConfig -notmatch "\[geminifs\]") {
        Add-Content -Path $RcloneConfigPath -Value "`n$ConfigContent"
    }
} else {
    Set-Content -Path $RcloneConfigPath -Value $ConfigContent
}

if (!(Test-Path $mountPath)) {
    New-Item -ItemType Directory -Path $mountPath | Out-Null
}

Write-Host "Mounting GeminiFS from $sourcePath to $mountPath using rclone remote '$remoteName'..."

rclone mount "$remoteName:$sourcePath" "$mountPath" --vfs-cache-mode full --log-file "C:\pqr.info\logs\geminifs-mount.log" --log-level INFO
