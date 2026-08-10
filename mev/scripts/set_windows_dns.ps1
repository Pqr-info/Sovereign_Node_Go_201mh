# ==============================================================================
# 🌐 Sovereign-27 Windows DNS Server Configuration
# ==============================================================================
# Points primary DNS to zeta.pqr.info (46.224.219.174) with fallback 1.1.1.1

param (
    [string]$PrimaryDns = "46.224.219.174",
    [string]$SecondaryDns = "1.1.1.1"
)

Write-Host "[*] Locating active network interfaces..."
$adapters = Get-NetAdapter | Where-Object { $_.Status -eq "Up" }

foreach ($adapter in $adapters) {
    Write-Host "    [+] Configuring DNS on $($adapter.Name) ($($adapter.InterfaceDescription))..."
    Set-DnsClientServerAddress -InterfaceAlias $adapter.Name -ServerAddresses ($PrimaryDns, $SecondaryDns)
}

Write-Host "\n[+] Primary DNS set to $PrimaryDns (Secondary: $SecondaryDns) across all active adapters!"
