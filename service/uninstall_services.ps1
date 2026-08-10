$ErrorActionPreference = "Stop"

Stop-Service SWENDService -ErrorAction SilentlyContinue
Stop-Service VaultAgentService -ErrorAction SilentlyContinue

sc.exe delete SWENDService
sc.exe delete VaultAgentService

Write-Host "SWEND + Vault Agent services removed."
