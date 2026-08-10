# ==============================================================================
# 🛡️ Sovereign-27 Windows Hosts Mapper for zeta.mh
# ==============================================================================
# Maps 'zeta.mh' in C:\Windows\System32\drivers\etc\hosts to target IP.

param (
    [string]$TargetIp = "46.224.219.174"
)

$hostsPath = "C:\Windows\System32\drivers\etc\hosts"
$entry = "$TargetIp`tzeta.mh"

Write-Host "[*] Mapping 'zeta.mh' -> $TargetIp in $hostsPath..."

$content = Get-Content $hostsPath -ErrorAction SilentlyContinue | Where-Object { $_ -notmatch "zeta\.mh" }
$content += $entry
Set-Content -Path $hostsPath -Value $content -Force

Write-Host "[+] Successfully mapped 'zeta.mh' -> $TargetIp in Windows hosts!"
