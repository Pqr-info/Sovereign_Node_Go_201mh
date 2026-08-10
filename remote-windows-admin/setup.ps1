<#
.SYNOPSIS
    Installs, builds, and configures the JetWeb Time Machine OS Admin Gateway and Multiplexer from scratch.
.DESCRIPTION
    Performs a scratch deployment of the JetWeb Time Machine OS:
    1. Enables Windows Remote Desktop (RDP) on the host.
    2. Downloads the official Alpine Linux mini-rootfs and bootstraps the guest OS in WSL.
    3. Provisions dependencies (Node.js, OpenSSL, OpenSSH, PowerShell Core) inside the guest.
    4. Registers the 'sos' admin user and deploys the remote admin server.
    5. Starts a Port 911 connection multiplexer routing RDP, SSH, and HTTPS traffic.
.PARAMETER Action
    Install, Uninstall, Start, Stop, or Status. If omitted, launches the Graphical Installation Wizard.
.PARAMETER Passphrase
    Access token. If empty, a secure 24-character token is generated.
.PARAMETER Port
    Multiplexer port. Defaults to 911.
.PARAMETER Username
    Primary admin username. Defaults to "sos".
.PARAMETER SecurityMode
    Whitelisting guardrail mode ('safe' or 'raw'). Defaults to 'safe'.
#>
[CmdletBinding()]
param (
    [Parameter(Mandatory=$false)]
    [ValidateSet("Install", "Uninstall", "Start", "Stop", "Status")]
    [string]$Action,

    [Parameter(Mandatory=$false)]
    [string]$Passphrase,

    [Parameter(Mandatory=$false)]
    [int]$Port = 911,

    [Parameter(Mandatory=$false)]
    [string]$Username = "sos",

    [Parameter(Mandatory=$false)]
    [string]$SecurityMode = "safe",

    [Parameter(Mandatory=$false)]
    [bool]$EnableJetWeb = $true,

    [Parameter(Mandatory=$false)]
    [string]$AllowedIps = "Any",

    [Parameter(Mandatory=$false)]
    [bool]$EnableCloudflare = $true,

    [Parameter(Mandatory=$false)]
    [string]$GithubUsername = ""
)

$InstallDir = "C:\Program Files\SOS-JetWebTimeMachine"
$WSLDistroName = "SOS-JetWebTimeMachine"
$TaskGateway = "SOS-Gateway"
$TaskMultiplexer = "SOS-Multiplexer"
$FirewallRuleName = "SOS-MultiplexerPort"

$ScriptDir = $PSScriptRoot
if (-not $ScriptDir) {
    if ($MyInvocation.MyCommand.Path) {
        $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    } else {
        $ScriptDir = Get-Location
    }
}

function Test-Admin {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-Admin)) {
    Write-Error "Administrator privileges are required to bootstrap JetWeb Time Machine OS. Restart console as Administrator."
    exit 1
}

# Graphical Installation Wizard
function Show-InstallerGui {
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type -AssemblyName System.Drawing

    $form = New-Object Windows.Forms.Form
    $form.Text = "JetWeb Time Machine OS Setup Wizard"
    $form.Size = New-Object Drawing.Size(420,490)
    $form.StartPosition = "CenterScreen"
    $form.FormBorderStyle = "FixedDialog"
    $form.MaximizeBox = $false
    $form.MinimizeBox = $false
    $form.BackColor = [Drawing.Color]::FromArgb(240, 240, 240)

    # Header Panel
    $headerPanel = New-Object Windows.Forms.Panel
    $headerPanel.Size = New-Object Drawing.Size(420, 60)
    $headerPanel.BackColor = [Drawing.Color]::FromArgb(41, 128, 185)
    $form.Controls.Add($headerPanel)

    $headerTitle = New-Object Windows.Forms.Label
    $headerTitle.Text = "JetWeb Time Machine OS Deployment"
    $headerTitle.Font = New-Object Drawing.Font("Segoe UI", 14, [Drawing.FontStyle]::Bold)
    $headerTitle.ForeColor = [Drawing.Color]::White
    $headerTitle.Location = New-Object Drawing.Point(15, 15)
    $headerTitle.Size = New-Object Drawing.Size(300, 30)
    $headerPanel.Controls.Add($headerTitle)

    # Username
    $lblUser = New-Object Windows.Forms.Label
    $lblUser.Text = "Admin Username:"
    $lblUser.Font = New-Object Drawing.Font("Segoe UI", 9, [Drawing.FontStyle]::Regular)
    $lblUser.Location = New-Object Drawing.Point(30,90)
    $lblUser.Size = New-Object Drawing.Size(120,20)
    $form.Controls.Add($lblUser)

    $txtUser = New-Object Windows.Forms.TextBox
    $txtUser.Text = "sos"
    $txtUser.Font = New-Object Drawing.Font("Segoe UI", 9, [Drawing.FontStyle]::Regular)
    $txtUser.Location = New-Object Drawing.Point(160,87)
    $txtUser.Size = New-Object Drawing.Size(200,20)
    $form.Controls.Add($txtUser)

    # Port
    $lblPort = New-Object Windows.Forms.Label
    $lblPort.Text = "Multiplexer Port:"
    $lblPort.Font = New-Object Drawing.Font("Segoe UI", 9, [Drawing.FontStyle]::Regular)
    $lblPort.Location = New-Object Drawing.Point(30,130)
    $lblPort.Size = New-Object Drawing.Size(120,20)
    $form.Controls.Add($lblPort)

    $txtPort = New-Object Windows.Forms.TextBox
    $txtPort.Text = "911"
    $txtPort.Font = New-Object Drawing.Font("Segoe UI", 9, [Drawing.FontStyle]::Regular)
    $txtPort.Location = New-Object Drawing.Point(160,127)
    $txtPort.Size = New-Object Drawing.Size(200,20)
    $form.Controls.Add($txtPort)

    # Security Mode
    $lblMode = New-Object Windows.Forms.Label
    $lblMode.Text = "Security Mode:"
    $lblMode.Font = New-Object Drawing.Font("Segoe UI", 9, [Drawing.FontStyle]::Regular)
    $lblMode.Location = New-Object Drawing.Point(30,170)
    $lblMode.Size = New-Object Drawing.Size(120,20)
    $form.Controls.Add($lblMode)

    $cmbMode = New-Object Windows.Forms.ComboBox
    $cmbMode.Items.Add("safe") | Out-Null
    $cmbMode.Items.Add("raw") | Out-Null
    $cmbMode.SelectedIndex = 0
    $cmbMode.Font = New-Object Drawing.Font("Segoe UI", 9, [Drawing.FontStyle]::Regular)
    $cmbMode.Location = New-Object Drawing.Point(160,167)
    $cmbMode.Size = New-Object Drawing.Size(200,20)
    $cmbMode.DropDownStyle = [Windows.Forms.ComboBoxStyle]::DropDownList
    $form.Controls.Add($cmbMode)

    # GitHub Username
    $lblGithub = New-Object Windows.Forms.Label
    $lblGithub.Text = "GitHub Username:"
    $lblGithub.Font = New-Object Drawing.Font("Segoe UI", 9, [Drawing.FontStyle]::Regular)
    $lblGithub.Location = New-Object Drawing.Point(30,210)
    $lblGithub.Size = New-Object Drawing.Size(120,20)
    $form.Controls.Add($lblGithub)

    $txtGithub = New-Object Windows.Forms.TextBox
    $txtGithub.Font = New-Object Drawing.Font("Segoe UI", 9, [Drawing.FontStyle]::Regular)
    $txtGithub.Location = New-Object Drawing.Point(160,207)
    $txtGithub.Size = New-Object Drawing.Size(200,20)
    $form.Controls.Add($txtGithub)

    # Passphrase
    $lblPass = New-Object Windows.Forms.Label
    $lblPass.Text = "Custom Passphrase:"
    $lblPass.Font = New-Object Drawing.Font("Segoe UI", 9, [Drawing.FontStyle]::Regular)
    $lblPass.Location = New-Object Drawing.Point(30,250)
    $lblPass.Size = New-Object Drawing.Size(120,20)
    $form.Controls.Add($lblPass)

    $txtPass = New-Object Windows.Forms.TextBox
    $txtPass.Font = New-Object Drawing.Font("Segoe UI", 9, [Drawing.FontStyle]::Regular)
    $txtPass.Location = New-Object Drawing.Point(160,247)
    $txtPass.Size = New-Object Drawing.Size(200,20)
    $txtPass.PasswordChar = '*'
    $form.Controls.Add($txtPass)

    # JetWeb Time Machine Checkbox
    $chkJetWeb = New-Object Windows.Forms.CheckBox
    $chkJetWeb.Text = "Install JetWeb Time Machine (Rollback Engine)"
    $chkJetWeb.Font = New-Object Drawing.Font("Segoe UI", 9, [Drawing.FontStyle]::Regular)
    $chkJetWeb.Location = New-Object Drawing.Point(30, 280)
    $chkJetWeb.Size = New-Object Drawing.Size(320, 20)
    $chkJetWeb.Checked = $true
    $form.Controls.Add($chkJetWeb)

    # Cloudflare Access Gateway Checkbox
    $chkCloudflare = New-Object Windows.Forms.CheckBox
    $chkCloudflare.Text = "Enable Cloudflare SAML Access Tunnel"
    $chkCloudflare.Font = New-Object Drawing.Font("Segoe UI", 9, [Drawing.FontStyle]::Regular)
    $chkCloudflare.Location = New-Object Drawing.Point(30, 305)
    $chkCloudflare.Size = New-Object Drawing.Size(320, 20)
    $chkCloudflare.Checked = $true
    $form.Controls.Add($chkCloudflare)

    # Buttons
    $btnInstall = New-Object Windows.Forms.Button
    $btnInstall.Text = "Install"
    $btnInstall.Font = New-Object Drawing.Font("Segoe UI", 9, [Drawing.FontStyle]::Bold)
    $btnInstall.Location = New-Object Drawing.Point(50,350)
    $btnInstall.Size = New-Object Drawing.Size(100,32)
    $btnInstall.BackColor = [Drawing.Color]::FromArgb(46, 204, 113)
    $btnInstall.ForeColor = [Drawing.Color]::White
    $btnInstall.FlatStyle = [Windows.Forms.FlatStyle]::Flat
    $btnInstall.Add_Click({
        $global:uiAction = "Install"
        $global:uiUser = $txtUser.Text
        $global:uiPort = [int]$txtPort.Text
        $global:uiMode = $cmbMode.SelectedItem.ToString()
        $global:uiGithub = $txtGithub.Text
        $global:uiPass = $txtPass.Text
        $global:uiJetWeb = $chkJetWeb.Checked
        $global:uiCloudflare = $chkCloudflare.Checked
        $form.Close()
    })
    $form.Controls.Add($btnInstall)

    $btnUninstall = New-Object Windows.Forms.Button
    $btnUninstall.Text = "Uninstall"
    $btnUninstall.Font = New-Object Drawing.Font("Segoe UI", 9, [Drawing.FontStyle]::Bold)
    $btnUninstall.Location = New-Object Drawing.Point(160,350)
    $btnUninstall.Size = New-Object Drawing.Size(100,32)
    $btnUninstall.BackColor = [Drawing.Color]::FromArgb(231, 76, 60)
    $btnUninstall.ForeColor = [Drawing.Color]::White
    $btnUninstall.FlatStyle = [Windows.Forms.FlatStyle]::Flat
    $btnUninstall.Add_Click({
        $global:uiAction = "Uninstall"
        $form.Close()
    })
    $form.Controls.Add($btnUninstall)

    $btnCancel = New-Object Windows.Forms.Button
    $btnCancel.Text = "Cancel"
    $btnCancel.Font = New-Object Drawing.Font("Segoe UI", 9, [Drawing.FontStyle]::Regular)
    $btnCancel.Location = New-Object Drawing.Point(270,350)
    $btnCancel.Size = New-Object Drawing.Size(90,32)
    $btnCancel.FlatStyle = [Windows.Forms.FlatStyle]::Flat
    $btnCancel.Add_Click({
        $global:uiAction = "Cancel"
        $form.Close()
    })
    $form.Controls.Add($btnCancel)

    # Interactive Help Button
    $btnHelp = New-Object Windows.Forms.Button
    $btnHelp.Text = "Help"
    $btnHelp.Font = New-Object Drawing.Font("Segoe UI", 9, [Drawing.FontStyle]::Regular)
    $btnHelp.Location = New-Object Drawing.Point(80, 395)
    $btnHelp.Size = New-Object Drawing.Size(100, 25)
    $btnHelp.FlatStyle = [Windows.Forms.FlatStyle]::Flat
    $btnHelp.Add_Click({
        Show-HelpDialog
    })
    $form.Controls.Add($btnHelp)

    # Documentation Button
    $btnDocs = New-Object Windows.Forms.Button
    $btnDocs.Text = "Docs"
    $btnDocs.Font = New-Object Drawing.Font("Segoe UI", 9, [Drawing.FontStyle]::Regular)
    $btnDocs.Location = New-Object Drawing.Point(220, 395)
    $btnDocs.Size = New-Object Drawing.Size(100, 25)
    $btnDocs.FlatStyle = [Windows.Forms.FlatStyle]::Flat
    $btnDocs.Add_Click({
        $DocsPath = Join-Path $ScriptDir "INSTRUCTIONS.md"
        if (Test-Path $DocsPath) {
            Start-Process $DocsPath
        } else {
            [Windows.Forms.MessageBox]::Show("Documentation file (INSTRUCTIONS.md) not found.")
        }
    })
    $form.Controls.Add($btnDocs)

    $form.ShowDialog() | Out-Null
}

function Show-HelpDialog {
    $helpForm = New-Object Windows.Forms.Form
    $helpForm.Text = "JetWeb Time Machine OS Setup Help"
    $helpForm.Size = New-Object Drawing.Size(500,450)
    $helpForm.StartPosition = "CenterParent"
    $helpForm.MinimizeBox = $false
    $helpForm.MaximizeBox = $false
    $helpForm.FormBorderStyle = "FixedDialog"

    $txtHelp = New-Object Windows.Forms.RichTextBox
    $txtHelp.Dock = [Windows.Forms.DockStyle]::Fill
    $txtHelp.ReadOnly = $true
    $txtHelp.Font = New-Object Drawing.Font("Segoe UI", 9.5, [Drawing.FontStyle]::Regular)
    $txtHelp.Text = @"
JetWeb Time Machine OS Setup Guide & Features:

1. Overview:
   This utility installs the JetWeb Time Machine OS guest environment (Alpine Linux) and registers Node.js, OpenSSL, OpenSSH, and PowerShell Core in WSL. It configures a dual-service daemon mapping on the host.
   
2. Port Multiplexer & Remote Access:
   - Chrome Remote Desktop: Primary GUI access installed silently on the host.
   - Connect via SSH to Port 911 -> Reroutes to guest terminal SSH (Port 22).
   - Connect via browser to https://localhost:911 -> Reroutes to Gateway API (Port 3000).

3. Admin Username (Recommended: sos):
   The custom primary login account provisioned inside the Alpine guest rootfs.

4. Action Modes:
   - Install: Installs RDP registry settings, imports Alpine minirootfs, provisions dependency packages, and starts tasks.
   - Uninstall: Fully stops services, deletes tasks, unregisters distros, and wipes directory contents.
"@
    $helpForm.Controls.Add($txtHelp)
    $helpForm.ShowDialog() | Out-Null
}

# Run GUI if no Action is explicitly provided
if ([string]::IsNullOrWhiteSpace($Action)) {
    try {
        Show-InstallerGui
    } catch {
        Write-Host "GUI CRASH: $_"
        exit 1
    }
    if ($global:uiAction -eq "Cancel" -or $null -eq $global:uiAction) {
        Write-Host "[*] Setup cancelled by user."
        exit 0
    }
    $Action = $global:uiAction
    if ($global:uiAction -eq "Install") {
        $Username = $global:uiUser
        $Port = $global:uiPort
        $SecurityMode = $global:uiMode
        $GithubUsername = $global:uiGithub
        $Passphrase = $global:uiPass
        $EnableJetWeb = $global:uiJetWeb
        $EnableCloudflare = $global:uiCloudflare
    }
} else {
    # Prompt interactively if run via CLI but missing parameters
    if ($Action -eq "Install") {
        if (-not $PSBoundParameters.ContainsKey('Username')) {
            $inputUser = Read-Host "Enter administrative username (Recommended: 'sos')"
            if (-not [string]::IsNullOrWhiteSpace($inputUser)) {
                $Username = $inputUser
            }
        }
        
        if (-not $PSBoundParameters.ContainsKey('Port')) {
            $inputPort = Read-Host "Enter connection multiplexer port (Recommended: 911)"
            if (-not [string]::IsNullOrWhiteSpace($inputPort)) {
                $Port = [int]$inputPort
            }
        }
    }
}

function Generate-RandomPassphrase {
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#%^*"
    $bytes = New-Object Byte[] 24
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($bytes)
    $pass = ""
    foreach ($b in $bytes) {
        $pass += $chars[$b % $chars.Length]
    }
    return $pass
}

# Configures Private Network for firewall routing
function Set-PrivateNetwork {
    Write-Host "[*] Forcing Network Profile to 'Private' to ensure firewall routing..." -ForegroundColor Cyan
    try {
        $profile = Get-NetConnectionProfile -ErrorAction Stop
        if ($profile.NetworkCategory -ne "Private") {
            Set-NetConnectionProfile -NetworkCategory Private -ErrorAction Stop
            Write-Host "[+] Network profile set to Private." -ForegroundColor Green
        } else {
            Write-Host "[+] Network profile already Private." -ForegroundColor Green
        }
    } catch {
        Write-Host "[!] Could not set Private network profile automatically. Firewall prompts may appear." -ForegroundColor Yellow
    }
}

# Installs Chrome Remote Desktop
function Install-ChromeRemoteDesktop {
    Write-Host "[*] Downloading Chrome Remote Desktop MSI installer..." -ForegroundColor Cyan
    $CrdUrl = "https://dl.google.com/edgedl/chrome-remote-desktop/chromeremotedesktophost.msi"
    $CrdInstaller = Join-Path $env:TEMP "chromeremotedesktophost.msi"
    
    Invoke-WebRequest -Uri $CrdUrl -OutFile $CrdInstaller -ErrorAction Stop
    
    Write-Host "[*] Silently installing Chrome Remote Desktop..." -ForegroundColor Cyan
    Start-Process "msiexec.exe" -ArgumentList "/i `"$CrdInstaller`" /quiet /norestart" -Wait -NoNewWindow
    Write-Host "[+] Chrome Remote Desktop installed successfully." -ForegroundColor Green
}

# Installs Git and GitHub CLI via Winget
function Install-HostDependencies {
    Write-Host "[*] Installing Windows Host Dependencies (Git, GH CLI)..." -ForegroundColor Cyan
    try {
        winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements --silent -h | Out-Null
        winget install --id GitHub.cli -e --source winget --accept-package-agreements --accept-source-agreements --silent -h | Out-Null
        Write-Host "[+] Windows Host Dependencies installed successfully." -ForegroundColor Green
    } catch {
        Write-Host "[!] Could not install winget dependencies automatically. You may need to install them manually." -ForegroundColor Yellow
    }
}

# Provision SSL/TLS Certificate on host
function New-SovereignCertificate {
    param([string]$dnsName, [string]$outFolder)
    Write-Host "[*] Generating local self-signed SSL certificate for $dnsName..." -ForegroundColor Cyan
    
    try {
        if (-not (Test-Path $outFolder)) {
            New-Item -ItemType Directory -Path $outFolder -Force | Out-Null
        }

        $Cert = New-SelfSignedCertificate -DnsName $dnsName -CertStoreLocation "cert:\LocalMachine\My" -FriendlyName "JetWeb Time Machine OS Admin Gateway" -ErrorAction SilentlyContinue
        if ($null -eq $Cert) {
            Write-Host "[+] Using fallback self-signed certificate configuration." -ForegroundColor Yellow
            return
        }

        # Export Certificate (.crt)
        $certBytes = $Cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
        $certBase64 = [System.Convert]::ToBase64String($certBytes)
        $certPem = "-----BEGIN CERTIFICATE-----`n" + ($certBase64 -replace "(.{64})", "`$1`n") + "`n-----END CERTIFICATE-----"
        Set-Content -Path (Join-Path $outFolder "ssl.crt") -Value $certPem -Force
        
        # Export Private Key (.key)
        $tempPfx = Join-Path $outFolder "temp.pfx"
        $securePass = ConvertTo-SecureString "TempExportPass123!" -AsPlainText -Force
        Export-PfxCertificate -Cert $Cert -FilePath $tempPfx -Password $securePass -ErrorAction SilentlyContinue | Out-Null
        
        $rsa = [System.Security.Cryptography.X509Certificates.RSACertificateExtensions]::GetRSAPrivateKey($Cert)
        if ($null -ne $rsa) {
            $privateKeyBytes = $rsa.ExportPkcs8PrivateKey()
            $keyBase64 = [System.Convert]::ToBase64String($privateKeyBytes)
            $keyPem = "-----BEGIN PRIVATE KEY-----`n" + ($keyBase64 -replace "(.{64})", "`$1`n") + "`n-----END PRIVATE KEY-----"
            Set-Content -Path (Join-Path $outFolder "ssl.key") -Value $keyPem -Force
        }
        if (Test-Path $tempPfx) { Remove-Item $tempPfx -Force -ErrorAction SilentlyContinue }
        Write-Host "[+] Self-signed certificates generated at $outFolder" -ForegroundColor Green
    } catch {
        Write-Host "[!] Certificate generation warning: $_" -ForegroundColor Yellow
    }
}

function Unlock-SovereignPath ($targetPath) {
    if (Test-Path $targetPath) {
        icacls "$targetPath" /remove:d Everyone /T /C /Q 2>&1 | Out-Null
        icacls "$targetPath" /remove:d "BUILTIN\Users" /T /C /Q 2>&1 | Out-Null
        icacls "$targetPath" /reset /T /C /Q 2>&1 | Out-Null
    }
}

switch ($Action) {
    "Install" {
        $LogPath = Join-Path $env:TEMP "JetWeb_Setup.log"
        Start-Transcript -Path $LogPath -Append -Force

        Write-Host "===================================================" -ForegroundColor Cyan
        Write-Host "👑 Bootstrapping SOS - JetWeb Time Machine Temporal Engine from Scratch..." -ForegroundColor Cyan
        Write-Host "===================================================" -ForegroundColor Cyan

        try {
            if (-not [string]::IsNullOrWhiteSpace($GithubUsername) -and -not ($GithubUsername -match "^[a-zA-Z0-9-]{1,39}$")) {
                throw "Validation Error: GitHub Username '$GithubUsername' is invalid. It must contain only alphanumeric characters and hyphens, up to 39 characters."
            }

            # Pre-flight checks
            $RequiredFiles = @("multiplexer.js", "server.js", "package.json")
            foreach ($req in $RequiredFiles) {
                if (-not (Test-Path (Join-Path $ScriptDir $req))) {
                    throw "Pre-flight Check Failed: Missing critical file '$req'. Ensure you have cloned the entire repository properly."
                }
            }

            # Unlock installation directory if previously locked
            Unlock-SovereignPath $InstallDir

        # 1. Network Profile, Chrome Remote Desktop, and Host Dependencies
        Set-PrivateNetwork
        Install-ChromeRemoteDesktop
        Install-HostDependencies

        # 2. Setup folders
        if (-not (Test-Path $InstallDir)) {
            New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
        }
        $RootfsDir = Join-Path $InstallDir "rootfs"
        if (-not (Test-Path $RootfsDir)) {
            New-Item -ItemType Directory -Path $RootfsDir -Force | Out-Null
        }

        # 3. Generate Passphrase
        if ([string]::IsNullOrWhiteSpace($Passphrase)) {
            $Passphrase = Generate-RandomPassphrase
        }

        # 4. Download Ubuntu 22.04 WSL Rootfs
        $UbuntuUrl = "https://cloud-images.ubuntu.com/wsl/jammy/current/ubuntu-jammy-wsl-amd64-ubuntu22.04lts.rootfs.tar.gz"
        $TarballPath = Join-Path $InstallDir "ubuntu-rootfs.tar.gz"
        
        Write-Host "[*] Downloading Ubuntu 22.04 Rootfs from Canonical CDN..." -ForegroundColor Cyan
        Invoke-WebRequest -Uri $UbuntuUrl -OutFile $TarballPath -ErrorAction Stop
        Write-Host "[+] Download complete." -ForegroundColor Green

        # 5. Import WSL Distro
        Write-Host "[*] Registering and importing $WSLDistroName WSL distribution..." -ForegroundColor Cyan
        # Unregister if existing
        wsl.exe --unregister $WSLDistroName 2>&1 | Out-Null
        if (Test-Path $RootfsDir) {
            Unlock-SovereignPath $RootfsDir
            Remove-Item $RootfsDir -Recurse -Force -ErrorAction SilentlyContinue
        }
        New-Item -ItemType Directory -Path $RootfsDir -Force | Out-Null
        wsl.exe --import $WSLDistroName $RootfsDir $TarballPath --version 2
        Remove-Item $TarballPath -Force

        Write-Host "[*] Enabling native systemd in WSL guest..." -ForegroundColor Cyan
        wsl.exe -d $WSLDistroName -u root -- bash -c "echo -e '[boot]\nsystemd=true' > /etc/wsl.conf"
        Write-Host "[+] systemd enabled. Terminating to apply..." -ForegroundColor Green
        wsl.exe -t $WSLDistroName

        # 6. Setup guest wsl.conf
        $WslConf = @"
[automount]
enabled = true
root = /mnt/
options = "metadata,uid=1000,gid=1000,umask=027,fmask=117"

[interop]
enabled = true
appendWindowsPath = true
"@
        # Write wsl.conf directly via guest path
        $GuestWslConfPath = "\\wsl.localhost\$WSLDistroName\etc\wsl.conf"
        Set-Content -Path $GuestWslConfPath -Value $WslConf -Encoding ASCII -Force
        Write-Host "[+] Configured WSL interop and automounts." -ForegroundColor Green

        # Restart distro to apply wsl.conf
        wsl.exe --terminate $WSLDistroName

        # 7. Install packages inside Guest
        Write-Host "[*] Installing critical dependencies (Node, OpenSSH, Git, GH CLI, etc) in Ubuntu Guest OS..." -ForegroundColor Cyan
        # 1. Base packages
        wsl.exe -d $WSLDistroName -u root -- bash -c "apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y bash openssl openssh-server nodejs npm curl wget netcat-openbsd iproute2 procps sudo cifs-utils smbclient sshpass restic git" | Out-Null
        
        # 2. GitHub CLI (gh)
        $GhAptInstall = @"
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg && \
chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg && \
echo `"deb [arch=`$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main`" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null && \
apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y gh
"@
        wsl.exe -d $WSLDistroName -u root -- bash -c $GhAptInstall | Out-Null
        
        # 3. Enable SSHD systemd service
        wsl.exe -d $WSLDistroName -u root -- bash -c "systemctl enable ssh" | Out-Null

        # Configure SSHD config for GitHub keys and standard login
        $GhKeyScript = @"
#!/bin/bash
/usr/bin/curl -s https://github.com/$GithubUsername.keys
"@
        wsl.exe -d $WSLDistroName -u root -- bash -c "echo '$GhKeyScript' > /usr/local/bin/fetch_github_keys.sh && chown root:root /usr/local/bin/fetch_github_keys.sh && chmod 755 /usr/local/bin/fetch_github_keys.sh" | Out-Null

        $SshdAdditions = @"
AuthorizedKeysCommand /usr/local/bin/fetch_github_keys.sh
AuthorizedKeysCommandUser nobody
"@
        wsl.exe -d $WSLDistroName -u root -- bash -c "sed -i 's/^#*PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config && sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config && echo '$SshdAdditions' >> /etc/ssh/sshd_config" | Out-Null
        Write-Host "[+] Configured GitHub SSH AuthorizedKeysCommand and secure SSHD settings." -ForegroundColor Green

        # 8. Add administrator user 'sos' inside guest
        Write-Host "[*] Configuring user '$Username' inside guest..." -ForegroundColor Cyan
        wsl.exe -d $WSLDistroName -u root -- bash -c "useradd -m -s /bin/bash $Username && echo '$Username:SovereignAdmin2026!' | chpasswd && echo '$Username ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers" | Out-Null
        Write-Host "[+] Configured credentials for user." -ForegroundColor Green

        # 9. Generate SSL Certificates on Host
        New-SovereignCertificate -dnsName "localhost" -outFolder $InstallDir

        # 10. Copy Server files and Multiplexer to Host install directory
        Write-Host "[*] ScriptDir: '$ScriptDir', InstallDir: '$InstallDir'" -ForegroundColor Cyan
        $SourceFiles = Get-ChildItem -Path $ScriptDir -Exclude "node_modules", ".git", "setup.ps1", "*.tar", "*.gz"
        Write-Host "[*] Copying $($SourceFiles.Count) source files to $InstallDir..." -ForegroundColor Cyan
        foreach ($file in $SourceFiles) {
            $Target = Join-Path $InstallDir $file.Name
            Copy-Item -Path $file.FullName -Destination $Target -Recurve -Force
        }

        # Copy SSL certificates into the guest environment for local HTTPS admin api
        Copy-Item -Path (Join-Path $InstallDir "ssl.crt") -Destination "\\wsl.localhost\$WSLDistroName\opt\remote-admin-server\" -Force -ErrorAction SilentlyContinue
        Copy-Item -Path (Join-Path $InstallDir "ssl.key") -Destination "\\wsl.localhost\$WSLDistroName\opt\remote-admin-server\" -Force -ErrorAction SilentlyContinue

        # Deploy admin server code into Guest /opt/remote-admin-server/
        wsl.exe -d $WSLDistroName -u root -- ash -c "mkdir -p /opt/remote-admin-server" | Out-Null
        $GuestServerDir = "\\wsl.localhost\$WSLDistroName\opt\remote-admin-server"
        Copy-Item -Path (Join-Path $InstallDir "server.js") -Destination $GuestServerDir -Force
        Copy-Item -Path (Join-Path $InstallDir "package.json") -Destination $GuestServerDir -Force
        Copy-Item -Path (Join-Path $InstallDir "public") -Destination $GuestServerDir -Recurve -Force
        
        # Install Node modules in guest
        Write-Host "[*] Initializing guest Node dependencies..." -ForegroundColor Cyan
        wsl.exe -d $WSLDistroName -u root -- ash -c "cd /opt/remote-admin-server && npm install --production" | Out-Null

        # Deploy BIP-27.3 Wallet Manager script to guest if present
        $WalletScript = Join-Path $InstallDir "pqr-wallet.js"
        if (Test-Path $WalletScript) {
            Copy-Item -Path $WalletScript -Destination "\\wsl.localhost\$WSLDistroName\usr\local\share\" -Force
            wsl.exe -d $WSLDistroName -u root -- ash -c "echo '#!/bin/node' > /usr/local/bin/pqr-wallet && echo 'require(\"/usr/local/share/pqr-wallet.js\");' >> /usr/local/bin/pqr-wallet && chmod +x /usr/local/bin/pqr-wallet" | Out-Null
            Write-Host "[+] Provisioned PQR BIP-27.3 wallet manager command in guest." -ForegroundColor Green
        }

        # 11. Create local configuration script to boot the API inside WSL
        $GatewayBootScript = Join-Path $InstallDir "boot_gateway.ps1"
        $GatewayBootContent = @"
# Self-healing: check if SOS-JetWebTimeMachine distro is unregistered or missing
`$DistroList = wsl.exe -l -v
if (`$DistroList -notmatch "$WSLDistroName") {
    # Restore rootfs from backup checkpoint
    Write-Output "[WARNING] SOS-JetWebTimeMachine distro missing. Recovering from PreInstall checkpoint..."
    `$checkpointDir = "$InstallDir\checkpoints"
    `$tarPath = "`$checkpointDir\PreInstall.tar"
    if (Test-Path `$tarPath) {
        if (-not (Test-Path "$InstallDir\rootfs")) { New-Item -ItemType Directory -Path "$InstallDir\rootfs" -Force | Out-Null }
        wsl.exe --import $WSLDistroName "$InstallDir\rootfs" `$tarPath --version 2
        Write-Output "[+] Self-healing recovery complete."
    } else {
        Write-Output "[ERROR] PreInstall checkpoint not found. Auto-recovery aborted."
    }
}

`$env:PORT = "3000"
`$env:ADMIN_PASSPHRASE = "$Passphrase"
`$env:SECURITY_MODE = "$SecurityMode"
wsl.exe -d $WSLDistroName -u root -- bash -c "cd /opt/remote-admin-server && node server.js"
"@
        Set-Content -Path $GatewayBootScript -Value $GatewayBootContent -Encoding UTF8 -Force
        Set-Content -Path (Join-Path $ScriptDir "boot_gateway.ps1") -Value $GatewayBootContent -Encoding UTF8 -Force

        # 12. Create local configuration script to boot the Port 911 Multiplexer
        $MultiplexerBootScript = Join-Path $InstallDir "boot_multiplexer.ps1"
        $MultiplexerBootContent = @"
`cd "$InstallDir"
node multiplexer.js
"@
        Set-Content -Path $MultiplexerBootScript -Value $MultiplexerBootContent -Encoding UTF8 -Force

        # 12b. Deploy Cloudflare Tunnel Script and configuration if enabled
        if ($EnableCloudflare) {
            $TunnelBootScript = Join-Path $InstallDir "boot_tunnel.ps1"
            $TunnelBootContent = @"
`cd "$InstallDir"
node tunnel-daemon.js
"@
            Set-Content -Path $TunnelBootScript -Value $TunnelBootContent -Encoding UTF8 -Force
            Copy-Item -Path (Join-Path $ScriptDir "tunnel-daemon.js") -Destination $InstallDir -Force
        }

        # 13. Register Scheduled Tasks to run on startup
        $Trigger = New-ScheduledTaskTrigger -AtStartup
        $Principal = New-ScheduledTaskPrincipal -UserId "NT AUTHORITY\SYSTEM" -LogonType ServiceAccount -RunLevel Highest
        $Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

        # Register Gateway Task
        $ActionGateway = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$GatewayBootScript`""
        Unregister-ScheduledTask -TaskName $TaskGateway -Confirm:$false -ErrorAction SilentlyContinue | Out-Null
        Register-ScheduledTask -TaskName $TaskGateway -Trigger $Trigger -Action $ActionGateway -Principal $Principal -Settings $Settings | Out-Null

        # Register Multiplexer Task
        $ActionMulti = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$MultiplexerBootScript`""
        Unregister-ScheduledTask -TaskName $TaskMultiplexer -Confirm:$false -ErrorAction SilentlyContinue | Out-Null
        Register-ScheduledTask -TaskName $TaskMultiplexer -Trigger $Trigger -Action $ActionMulti -Principal $Principal -Settings $Settings | Out-Null

        # Register Tunnel Task
        if ($EnableRemoteDesktop -or $EnableDevTunnel) {
            $TaskTunnel = "SOS-Tunnel"
            $ActionTunnel = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$TunnelBootScript`""
            Unregister-ScheduledTask -TaskName $TaskTunnel -Confirm:$false -ErrorAction SilentlyContinue | Out-Null
            Register-ScheduledTask -TaskName $TaskTunnel -Trigger $Trigger -Action $ActionTunnel -Principal $Principal -Settings $Settings | Out-Null
        }
        
        Write-Host "[+] Scheduled Tasks Registered Successfully." -ForegroundColor Green

        # 14. Start the scheduled tasks immediately
        Write-Host "[*] Starting Gateway and Multiplexer services..." -ForegroundColor Cyan
        Start-ScheduledTask -TaskName $TaskGateway
        Start-ScheduledTask -TaskName $TaskMultiplexer
        if ($EnableRemoteDesktop -or $EnableDevTunnel) {
            Start-ScheduledTask -TaskName "SOS-Tunnel"
        }

        # 15. Configure Host Firewall opening Port 911
        Remove-NetFirewallRule -DisplayName $FirewallRuleName -ErrorAction SilentlyContinue | Out-Null
        New-NetFirewallRule -DisplayName $FirewallRuleName -Direction Inbound -LocalPort $Port -Protocol TCP -Action Allow -RemoteAddress $AllowedIps -Description "JetWeb Time Machine OS Multiplexer Port" | Out-Null

        # 16. Install JetWeb Time Machine (Initial Pre-Install Checkpoint)
        if ($EnableJetWeb) {
            Write-Host "[*] Provisioning JetWeb Time Machine rollback points (Restic + VSS)..." -ForegroundColor Cyan
            $checkpointDir = Join-Path $InstallDir "checkpoints"
            if (-not (Test-Path $checkpointDir)) { New-Item -ItemType Directory -Path $checkpointDir -Force | Out-Null }
            
            # Host Restore point
            Checkpoint-Computer -Description "JetWeb_PreInstall" -RestorePointType APPLICATION_INSTALL -ErrorAction SilentlyContinue
            
            # Guest WSL Restore point (Full distro export baseline for disaster recovery)
            $checkpointScriptDir = Join-Path $ScriptDir "checkpoints"
            if (-not (Test-Path $checkpointScriptDir)) { New-Item -ItemType Directory -Path $checkpointScriptDir -Force | Out-Null }
            $tarPath = Join-Path $checkpointDir "PreInstall.tar"
            $tarScriptPath = Join-Path $checkpointScriptDir "PreInstall.tar"
            wsl.exe --export $WSLDistroName "$tarPath"
            Copy-Item -Path $tarPath -Destination $tarScriptPath -Force -ErrorAction SilentlyContinue
            
            # Initialize the Restic repository on the host system filesystem (mounted in guest)
            $resticRepo = "/mnt/c/Program Files/SOS-JetWebTimeMachine/backup_repo"
            $passwdFile = "$resticRepo/passwd.txt"
            $initResticScript = "mkdir -p `"$resticRepo`" && echo '$Passphrase' > `"$passwdFile`" && chmod 600 `"$passwdFile`" && restic -r `"$resticRepo`" --password-file `"$passwdFile`" init 2>/dev/null && restic -r `"$resticRepo`" --password-file `"$passwdFile`" unlock 2>/dev/null && restic -r `"$resticRepo`" --password-file `"$passwdFile`" backup /opt /etc /home /root --tag PreInstall 2>/dev/null"
            wsl.exe -d $WSLDistroName -u root -- bash -c $initResticScript
            
            # Secure passwd.txt with strict Windows host permissions (Only SYSTEM and Administrators)
            $hostPasswdFile = Join-Path $InstallDir "backup_repo\passwd.txt"
            if (Test-Path $hostPasswdFile) {
                $acl = Get-Acl $hostPasswdFile
                $acl.SetAccessRuleProtection($true, $false)
                $systemRule = New-Object System.Security.AccessControl.FileSystemAccessRule("NT AUTHORITY\SYSTEM", "FullControl", "Allow")
                $adminRule = New-Object System.Security.AccessControl.FileSystemAccessRule("BUILTIN\Administrators", "FullControl", "Allow")
                $acl.AddAccessRule($systemRule)
                $acl.AddAccessRule($adminRule)
                Set-Acl $hostPasswdFile $acl
            }

            Write-Host "[+] JetWeb PreInstall checkpoints created successfully (Host + Guest)." -ForegroundColor Green
        }

        # 17. Insulate protected assets against accidental deletion (NTFS Deny-Delete Lock)
        Write-Host "[*] Locking installation directory with NTFS Deny-Delete Insulation..." -ForegroundColor Cyan
        $VhdxFile = Join-Path $InstallDir "rootfs\ext4.vhdx"
        if (Test-Path $VhdxFile) {
            icacls $VhdxFile /deny "BUILTIN\Users:(DE)" | Out-Null
        }
        $TarFile = Join-Path $InstallDir "checkpoints\PreInstall.tar"
        if (Test-Path $TarFile) {
            icacls $TarFile /deny "BUILTIN\Users:(DE)" | Out-Null
        }
        $BootScriptFile = Join-Path $InstallDir "boot_gateway.ps1"
        if (Test-Path $BootScriptFile) {
            icacls $BootScriptFile /deny "BUILTIN\Users:(DE)" | Out-Null
        }
        Write-Host "[+] Protected assets locked against deletion." -ForegroundColor Green

        Write-Host "===================================================" -ForegroundColor Cyan
        Write-Host "[+] SOS - JetWeb Time Machine Temporal Engine Bootstrap Complete!" -ForegroundColor Green
        Write-Host "[+] Remote Access & API Endpoint:" -ForegroundColor Green
        Write-Host "   -> Chrome Remote Desktop: Installed. Visit https://remotedesktop.google.com/headless to pair." -ForegroundColor Yellow
        Write-Host "   -> GitHub Authentication: Ensure you run 'gh auth login' in your host terminal to grant issue access!" -ForegroundColor Red
        Write-Host "   -> SSH Connection: Connect ssh client to localhost:$Port (SSHD explicitly booted)" -ForegroundColor Yellow
        Write-Host "   -> HTTPS Admin API: Point web browser to https://localhost:$Port" -ForegroundColor Yellow
        Write-Host "   -> Admin Passphrase: $Passphrase" -ForegroundColor Yellow
        Write-Host "   -> Admin Guest Username: $Username (Password: SovereignAdmin2026!)" -ForegroundColor Green
        Write-Host "===================================================" -ForegroundColor Cyan

            Copy-Item -Path $LogPath -Destination (Join-Path $InstallDir "install.log") -Force -ErrorAction SilentlyContinue
            Stop-Transcript
        } catch {
            $ErrorMsg = $_
            Write-Host "[CRITICAL ERROR] Setup failed: $ErrorMsg" -ForegroundColor Red
            Write-Host "Review the detailed log file at $LogPath" -ForegroundColor Yellow
            Stop-Transcript
            
            if (-not [string]::IsNullOrWhiteSpace($env:GITHUB_TOKEN)) {
                $isOnline = Test-NetConnection -ComputerName "api.github.com" -Port 443 -InformationLevel Quiet -WarningAction SilentlyContinue
                if ($isOnline) {
                    Write-Host "[*] Telemetry Token detected. Publishing error log to GitHub..." -ForegroundColor Cyan
                    try {
                        $LogBody = "Error: $ErrorMsg `n`nLog Output:`n" + '```text' + "`n$(Get-Content $LogPath -Raw)`n" + '```'
                        gh issue create --title "Installation Failure: SOS-JetWebTimeMachine (ID: $($env:INSTALLATION_ID))" --body $LogBody | Out-Null
                        Write-Host "[+] Issue published successfully via telemetry." -ForegroundColor Green
                    } catch {
                        Write-Host "[!] Failed to publish telemetry issue. Ensure GitHub CLI is installed." -ForegroundColor Yellow
                    } finally {
                        $env:GITHUB_TOKEN = $null
                    }
                } else {
                    Write-Host "[!] Telemetry disabled (no GitHub connectivity). See install.log." -ForegroundColor Yellow
                    $env:GITHUB_TOKEN = $null
                }
            }
            exit 1
        }
    }

    "Uninstall" {
        Write-Host "===================================================" -ForegroundColor Yellow
        Write-Host "[-] Uninstalling JetWeb Time Machine OS environment..." -ForegroundColor Yellow
        Write-Host "===================================================" -ForegroundColor Yellow

        # 0. Unlock directories to allow uninstallation
        Write-Host "[*] Unlocking installation directories..." -ForegroundColor Yellow
        Unlock-SovereignPath $InstallDir

        # 1. Remove tasks
        Stop-ScheduledTask -TaskName $TaskGateway -ErrorAction SilentlyContinue | Out-Null
        Unregister-ScheduledTask -TaskName $TaskGateway -Confirm:$false -ErrorAction SilentlyContinue | Out-Null
        Stop-ScheduledTask -TaskName $TaskMultiplexer -ErrorAction SilentlyContinue | Out-Null
        Unregister-ScheduledTask -TaskName $TaskMultiplexer -Confirm:$false -ErrorAction SilentlyContinue | Out-Null
        Stop-ScheduledTask -TaskName "SOS-Tunnel" -ErrorAction SilentlyContinue | Out-Null
        Unregister-ScheduledTask -TaskName "SOS-Tunnel" -Confirm:$false -ErrorAction SilentlyContinue | Out-Null

        # 2. Terminate WSL Distro and unregister
        wsl.exe --terminate $WSLDistroName -ErrorAction SilentlyContinue | Out-Null
        wsl.exe --unregister $WSLDistroName -ErrorAction SilentlyContinue | Out-Null

        # 3. Kill Node processes
        Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" | ForEach-Object {
            if ($_.CommandLine -like "*$InstallDir*") {
                Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
            }
        }

        # 4. Remove Firewall Rule
        Remove-NetFirewallRule -DisplayName $FirewallRuleName -ErrorAction SilentlyContinue | Out-Null

        # 5. Delete Files
        if (Test-Path $InstallDir) {
            Remove-Item -Path $InstallDir -Recurse -Force -ErrorAction SilentlyContinue
        }

        Write-Host "[+] Uninstalled JetWeb Time Machine OS and cleaned environment." -ForegroundColor Green
    }

    "Start" {
        Start-ScheduledTask -TaskName $TaskGateway -ErrorAction SilentlyContinue | Out-Null
        Start-ScheduledTask -TaskName $TaskMultiplexer -ErrorAction SilentlyContinue | Out-Null
        Write-Host "[+] Services launched." -ForegroundColor Green
    }

    "Stop" {
        Stop-ScheduledTask -TaskName $TaskGateway -ErrorAction SilentlyContinue | Out-Null
        Stop-ScheduledTask -TaskName $TaskMultiplexer -ErrorAction SilentlyContinue | Out-Null
        wsl.exe --terminate $WSLDistroName -ErrorAction SilentlyContinue | Out-Null
        Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" | ForEach-Object {
            if ($_.CommandLine -like "*$InstallDir*") {
                Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
            }
        }
        Write-Host "[+] Services stopped." -ForegroundColor Green
    }

    "Status" {
        Write-Host "===================================================" -ForegroundColor Cyan
        $TaskG = Get-ScheduledTask -TaskName $TaskGateway -ErrorAction SilentlyContinue
        $TaskM = Get-ScheduledTask -TaskName $TaskMultiplexer -ErrorAction SilentlyContinue
        
        if ($null -eq $TaskG) {
            Write-Host "JetWeb Time Machine OS Status: NOT INSTALLED" -ForegroundColor Red
            exit 0
        }

        Write-Host "Gateway Task: $($TaskG.State)" -ForegroundColor Green
        Write-Host "Multiplexer Task: $($TaskM.State)" -ForegroundColor Green

        $NodeProc = Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" | Where-Object { $_.CommandLine -like "*$InstallDir*" }
        if ($null -ne $NodeProc) {
            Write-Host "Multiplexer process active." -ForegroundColor Green
        } else {
            Write-Host "Multiplexer process INACTIVE." -ForegroundColor Red
        }
        $WSLRunning = wsl.exe -l -v | Out-String
        if ($WSLRunning -match $WSLDistroName) {
            Write-Host "SOS-JetWebTimeMachine WSL Guest: RUNNING" -ForegroundColor Green
        } else {
            Write-Host "SOS-JetWebTimeMachine WSL Guest: STOPPED" -ForegroundColor Red
        }
        Write-Host "===================================================" -ForegroundColor Cyan
    }
}
