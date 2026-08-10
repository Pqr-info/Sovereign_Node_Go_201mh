# Build script for compiling the SWEND MSI installer package using WiX Toolset 4
$ErrorActionPreference = "Stop"

Write-Host "Compiling SWEND Installer Suite MSI..." -ForegroundColor Cyan
wix build Product.wxs Features.wxs Components.wxs Services.wxs UI.wxs -o SWENDInstaller.msi

Write-Host "Compiling Bootstrapper Bundle..." -ForegroundColor Cyan
wix build Bundle.wxs -o SWENDInstaller.exe

Write-Host "✓ Installer packages created successfully." -ForegroundColor Green
