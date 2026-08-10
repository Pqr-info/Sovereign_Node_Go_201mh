$bundle = 'D:\pqr.info\wsl_repro_bundle'
if (-not (Test-Path $bundle)) {
    New-Item -ItemType Directory -Path $bundle | Out-Null
}
Set-Location $bundle
Get-Date | Set-Content '.\capture_timestamp3.txt' -Encoding utf8
Get-Host | Out-String | Set-Content '.\powershell_info.txt' -Encoding utf8
$PSVersionTable | Out-String | Set-Content '.\powershell_version.txt' -Encoding utf8
systeminfo 2>&1 | Set-Content '.\systeminfo3.txt' -Encoding utf8
wsl --version 2>&1 | Set-Content '.\wsl_version3.txt' -Encoding utf8
wsl --status 2>&1 | Set-Content '.\wsl_status3.txt' -Encoding utf8
wsl dmesg --boot 2>&1 | Set-Content '.\wsl_dmesg_boot3.txt' -Encoding utf8
Get-WinEvent -ListLog * | Select-Object LogName | Out-String | Set-Content '.\windows_event_log_list.txt' -Encoding utf8
try {
    Get-WinEvent -ListProvider *dxg* | Select-Object Name,Id | Out-String | Set-Content '.\windows_event_provider_dxg.txt' -Encoding utf8
} catch {
    $_.Exception.Message | Set-Content '.\windows_event_provider_dxg.txt' -Encoding utf8
}
try {
    Get-WinEvent -ListProvider *lxss* | Select-Object Name,Id | Out-String | Set-Content '.\windows_event_provider_lxss.txt' -Encoding utf8
} catch {
    $_.Exception.Message | Set-Content '.\windows_event_provider_lxss.txt' -Encoding utf8
}
Get-WinEvent -ListProvider *hyper* | Select-Object Name,Id | Out-String | Set-Content '.\windows_event_provider_hyper.txt' -Encoding utf8
