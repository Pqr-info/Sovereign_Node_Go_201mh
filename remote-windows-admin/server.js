const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Configurations
const SECURITY_MODE = process.env.SECURITY_MODE || 'safe'; // 'safe' | 'raw'
const ADMIN_PASSPHRASE = process.env.ADMIN_PASSPHRASE || "SovereignAdminSecret2026!";
const JWT_SECRET = crypto.randomBytes(32).toString('hex'); // Rotate cryptographic key on each boot

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Standard Error Envelope Helper
function sendError(res, statusCode, code, message, details = {}, req = null) {
  const traceId = req?.headers['x-trace-id'] || crypto.randomBytes(8).toString('hex');
  res.status(statusCode).json({
    error_code: code,
    message: message,
    details: details,
    trace_id: traceId,
    timestamp: new Date().toISOString()
  });
}

// Native JWT Issuance & Verification using Crypto Module
function generateToken() {
  const payload = {
    sub: 'admin',
    aud: 'remote-admin-gateway',
    exp: Date.now() + 30 * 60 * 1000 // 30 minutes expiration
  };
  const header = { alg: 'HS256', typ: 'JWT' };
  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET)
    .update(`${base64Header}.${base64Payload}`)
    .digest('base64url');
  return `${base64Header}.${base64Payload}.${signature}`;
}

function verifyToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');
    if (signature !== expectedSignature) return null;
    const parsedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (parsedPayload.exp < Date.now()) return null;
    return parsedPayload;
  } catch (e) {
    return null;
  }
}

// Authentication Middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, "ERR_UNAUTHORIZED", "Missing or invalid Bearer Authorization header.", {}, req);
  }
  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  if (!decoded) {
    return sendError(res, 403, "ERR_FORBIDDEN", "Token signature check failed or session has expired.", {}, req);
  }
  req.user = decoded;
  next();
};

// PowerShell executable path resolution (Windows vs WSL2 vs Linux)
let powershellCmd = 'powershell.exe';
if (process.platform === 'linux') {
  if (fs.existsSync('/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe')) {
    powershellCmd = '/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe';
  } else {
    powershellCmd = 'pwsh';
  }
}

// Translate Linux path to Windows UNC path when running powershell.exe under WSL
const { execSync } = require('child_process');
function toWindowsPath(linuxPath) {
  if (process.platform === 'linux' && powershellCmd.includes('WindowsPowerShell')) {
    try {
      return execSync(`wslpath -w "${linuxPath}"`).toString().trim();
    } catch (e) {
      return linuxPath;
    }
  }
  return linuxPath;
}

// Helper function to run PowerShell commands with progress cleaning
function runPowerShell(cmd) {
  return new Promise((resolve, reject) => {
    // Prepends silently continue to avoid CLIXML progress pollution under WSL/SSH contexts
    const fullCmd = `$ProgressPreference = 'SilentlyContinue';\n` + cmd;
    const encodedCommand = Buffer.from(fullCmd, 'utf16le').toString('base64');
    exec(`${powershellCmd} -NoProfile -ExecutionPolicy Bypass -EncodedCommand ${encodedCommand}`, (error, stdout, stderr) => {
      let cleanStdout = stdout.trim();
      // Remove any CLIXML or progress stream pollution from stdout
      cleanStdout = cleanStdout.replace(/#<\s*CLIXML[\s\S]*?<\/Objs>/g, '');
      cleanStdout = cleanStdout.replace(/<Objs[\s\S]*?<\/Objs>/g, '');
      cleanStdout = cleanStdout.trim();

      resolve({
        exitCode: error ? error.code : 0,
        stdout: cleanStdout,
        stderr: stderr.trim()
      });
    });
  });
}

// Whitelist configuration for PowerShell cmdlets under Safe Mode
const ALLOWED_CMDLETS = [
  'get-service',
  'get-process',
  'get-volume',
  'get-date',
  'get-ciminstance',
  'start-service',
  'stop-service',
  'restart-service',
  'write-output',
  'select-object',
  'where-object',
  'measure-object',
  'convertto-json',
  'out-string',
  'get-eventlog',
  'sort-object',
  'measure-object'
];

const BLOCKED_OPERATORS = [
  'iex', 'invoke-expression', 'invoke-command', 'start-process',
  '&', '. ', 'cmd.exe', 'bash', 'sh', 'wsl', 'remove-item',
  'format-volume', 'del ', 'rmdir', 'rm -'
];

function isCommandSafe(command) {
  const lowerCmd = command.toLowerCase();
  
  // 1. Check for blocked operators/redirections
  for (const operator of BLOCKED_OPERATORS) {
    if (lowerCmd.includes(operator)) return false;
  }
  
  // 2. Validate all Verb-Noun patterns match allowed cmdlets
  const matches = command.match(/[a-zA-Z]+-[a-zA-Z]+/g) || [];
  for (const match of matches) {
    if (!ALLOWED_CMDLETS.includes(match.toLowerCase())) {
      return false;
    }
  }
  return true;
}

// --- API ENDPOINTS ---

const authAttempts = new Map();

function rateLimitAuth(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const limitWindow = 60000; // 1 minute
  const maxAttempts = 5;

  if (!authAttempts.has(ip)) {
    authAttempts.set(ip, []);
  }

  const attempts = authAttempts.get(ip).filter(timestamp => now - timestamp < limitWindow);
  attempts.push(now);
  authAttempts.set(ip, attempts);

  if (attempts.length > maxAttempts) {
    return sendError(res, 429, "ERR_TOO_MANY_ATTEMPTS", "Too many authentication attempts. Please wait 1 minute.", {}, req);
  }
  next();
}

// Token Issuance Endpoint (Handshake exchange)
app.post('/api/auth/token', rateLimitAuth, (req, res) => {
  const { passphrase } = req.body;
  if (!passphrase || passphrase !== ADMIN_PASSPHRASE) {
    return sendError(res, 401, "ERR_UNAUTHORIZED", "Authentication failed. Invalid passphrase.", {}, req);
  }
  const token = generateToken();
  res.json({ token, expires_in: 1800 }); // 30 minutes in seconds
});

// Self-Discoverable AI Capabilities Hints
app.get('/api/capabilities', (req, res) => {
  res.json({
    security_mode: SECURITY_MODE,
    supports_screenshots: true,
    supports_service_control: true,
    max_screenshot_rate_per_minute: 12
  });
});

// OpenAPI Spec Endpoint
app.get('/openapi.json', (req, res) => {
  res.json({
    openapi: "3.0.0",
    info: {
      title: "Hardened Remote Windows Admin API",
      version: "1.1.0",
      description: "Secure, JWT-validated remote administration API for Windows systems, optimized for human UI and AI agent automation."
    },
    paths: {
      "/api/auth/token": {
        post: {
          summary: "Exchanges the admin passphrase for a temporary JWT token (30m lifetime).",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { passphrase: { type: "string" } },
                  required: ["passphrase"]
                }
              }
            }
          },
          responses: { 200: { description: "Returns JWT access token." } }
        }
      },
      "/api/capabilities": {
        get: {
          summary: "Returns self-discoverable capabilities map for AI agents.",
          responses: { 200: { description: "Capabilities JSON schema." } }
        }
      },
      "/api/diagnostics": {
        get: {
          summary: "Retrieve key system telemetry details.",
          security: [{ BearerAuth: [] }]
        }
      },
      "/api/screenshot": {
        get: {
          summary: "Capture the primary Windows screen display as PNG.",
          security: [{ BearerAuth: [] }]
        }
      },
      "/api/services": {
        get: {
          summary: "Retrieve list of Windows services.",
          security: [{ BearerAuth: [] }]
        }
      },
      "/api/processes": {
        get: {
          summary: "Retrieve active system processes.",
          security: [{ BearerAuth: [] }]
        }
      },
      "/api/execute": {
        post: {
          summary: "Execute an administrative PowerShell command block securely.",
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { command: { type: "string" } },
                  required: ["command"]
                }
              }
            }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer"
        }
      }
    }
  });
});

// Telemetry Endpoint
app.get('/api/diagnostics', authenticate, async (req, res) => {
  const script = `
    $os = Get-CimInstance Win32_OperatingSystem
    $uptime = (Get-Date) - $os.LastBootUpTime
    $cpu = Get-CimInstance Win32_Processor | Measure-Object -Property LoadPercentage -Average | Select-Object -ExpandProperty Average
    
    $freeMem = $os.FreePhysicalMemory
    $totalMem = $os.TotalVisibleMemorySize
    $usedMem = $totalMem - $freeMem
    
    $disks = Get-Volume | Where-Object DriveLetter -ne $null | ForEach-Object {
      [PSCustomObject]@{
        DriveLetter = $_.DriveLetter
        FileSystemLabel = $_.FileSystemLabel
        Size = $_.Size
        SizeRemaining = $_.SizeRemaining
      }
    }

    $result = @{
      os_name = $os.Caption
      os_version = $os.Version
      uptime_seconds = [Math]::Round($uptime.TotalSeconds)
      cpu_load_pct = [Math]::Round($cpu, 1)
      ram_total_kb = $totalMem
      ram_free_kb = $freeMem
      ram_used_kb = $usedMem
      disks = $disks
    }

    $result | ConvertTo-Json -Depth 5
  `;
  try {
    const { stdout, stderr, exitCode } = await runPowerShell(script);
    if (exitCode !== 0) {
      return sendError(res, 500, "ERR_POWERSHELL_FAILURE", "PowerShell error retrieving telemetry", { stderr }, req);
    }
    res.json(JSON.parse(stdout));
  } catch (err) {
    sendError(res, 500, "ERR_POWERSHELL_FAILURE", err.message, {}, req);
  }
});

// Screenshot Capture with Timeout
app.get('/api/screenshot', authenticate, async (req, res) => {
  const tempPath = path.join(__dirname, 'temp_screenshot.png');
  const script = `
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type -AssemblyName System.Drawing
    $screen = [System.Windows.Forms.Screen]::PrimaryScreen
    $bounds = $screen.Bounds
    $bitmap = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    try {
      $graphics.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size)
      $bitmap.Save("${toWindowsPath(tempPath).replace(/\\/g, '\\\\')}", [System.Drawing.Imaging.ImageFormat]::Png)
      Write-Output "SUCCESS"
    } catch {
      Write-Error $_.Exception.Message
    } finally {
      $graphics.Dispose()
      $bitmap.Dispose()
    }
  `;

  // Start execution with 3 seconds timeout
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("TIMEOUT")), 3000);
  });

  try {
    await Promise.race([runPowerShell(script), timeoutPromise]);
    if (!fs.existsSync(tempPath)) {
      return sendError(res, 500, "ERR_POWERSHELL_FAILURE", "Failed to save screenshot capture display file.", {}, req);
    }
    res.setHeader('Content-Type', 'image/png');
    fs.createReadStream(tempPath).pipe(res);
  } catch (err) {
    if (err.message === "TIMEOUT") {
      sendError(res, 504, "ERR_SCREENSHOT_TIMEOUT", "Screenshot capture task execution timed out.", {}, req);
    } else {
      sendError(res, 500, "ERR_POWERSHELL_FAILURE", err.message, {}, req);
    }
  }
});

// Services List
app.get('/api/services', authenticate, async (req, res) => {
  const script = `
    Get-Service | ForEach-Object {
      [PSCustomObject]@{
        Name = $_.Name
        DisplayName = $_.DisplayName
        Status = $_.Status.ToString()
        StartType = $_.StartType.ToString()
      }
    } | ConvertTo-Json -Compress
  `;
  try {
    const { stdout, stderr, exitCode } = await runPowerShell(script);
    if (exitCode !== 0) {
      return sendError(res, 500, "ERR_POWERSHELL_FAILURE", "PowerShell services fetch failure", { stderr }, req);
    }
    res.json(JSON.parse(stdout));
  } catch (err) {
    sendError(res, 500, "ERR_POWERSHELL_FAILURE", err.message, {}, req);
  }
});

// Processes List
app.get('/api/processes', authenticate, async (req, res) => {
  const script = `
    Get-Process | Sort-Object CPU -Descending | Select-Object -First 30 | ForEach-Object {
      [PSCustomObject]@{
        Id = $_.Id
        Name = $_.ProcessName
        CPU = [Math]::Round($_.CPU, 2)
        WorkingSet = [Math]::Round($_.WorkingSet / 1MB, 2)
        Description = $_.Description
      }
    } | ConvertTo-Json -Compress
  `;
  try {
    const { stdout, stderr, exitCode } = await runPowerShell(script);
    if (exitCode !== 0) {
      return sendError(res, 500, "ERR_POWERSHELL_FAILURE", "PowerShell processes fetch failure", { stderr }, req);
    }
    res.json(JSON.parse(stdout));
  } catch (err) {
    sendError(res, 500, "ERR_POWERSHELL_FAILURE", err.message, {}, req);
  }
});

// Secure Whitelisted Execution Command Endpoint
app.post('/api/execute', authenticate, async (req, res) => {
  const { command } = req.body;
  if (!command) {
    return sendError(res, 400, "ERR_INVALID_PAYLOAD", "Missing 'command' body field.", {}, req);
  }

  // Enforce Sandbox Whitelist Guardrails in Safe Mode
  if (SECURITY_MODE === 'safe' && !isCommandSafe(command)) {
    return sendError(
      res,
      403,
      "ERR_BLOCKED_BY_GUARDRAIL",
      "PowerShell block blocked by sandbox guardrails. Input contains unauthorized cmdlets or redirect operators.",
      { command, mode: SECURITY_MODE },
      req
    );
  }

  try {
    const result = await runPowerShell(command);
    res.json(result);
  } catch (err) {
    sendError(res, 500, "ERR_POWERSHELL_FAILURE", err.message, {}, req);
  }
});

// JetWeb Time Machine Endpoints
app.post('/api/time-machine/checkpoint', authenticate, async (req, res) => {
  const { name } = req.body;
  if (!name) return sendError(res, 400, "ERR_INVALID_PAYLOAD", "Missing checkpoint 'name'.", {}, req);
  
  const script = `
    Checkpoint-Computer -Description "JetWeb_${name}" -RestorePointType APPLICATION_INSTALL -ErrorAction SilentlyContinue
    wsl.exe -d JetWebTimeMachineOS -u root -- ash -c "restic -r \\"/mnt/c/Program Files/JetWebTimeMachineOS/backup_repo\\" --password-file \\"/mnt/c/Program Files/JetWebTimeMachineOS/backup_repo/passwd.txt\\" backup /opt /etc /home /root --tag ${name} 2>/dev/null"
    Write-Output "SUCCESS"
  `;
  
  try {
    const { stdout, exitCode } = await runPowerShell(script);
    if (exitCode !== 0) return sendError(res, 500, "ERR_CHECKPOINT_FAILURE", "Failed to create checkpoints.", {}, req);
    res.json({ status: "CREATED", checkpoint: name, timestamp: new Date().toISOString() });
  } catch (err) {
    sendError(res, 500, "ERR_CHECKPOINT_FAILURE", err.message, {}, req);
  }
});

app.post('/api/time-machine/rollback', authenticate, async (req, res) => {
  const { name } = req.body;
  if (!name) return sendError(res, 400, "ERR_INVALID_PAYLOAD", "Missing checkpoint 'name'.", {}, req);
  
  const script = `
    wsl.exe -d JetWebTimeMachineOS -u root -- ash -c "restic -r \\"/mnt/c/Program Files/JetWebTimeMachineOS/backup_repo\\" --password-file \\"/mnt/c/Program Files/JetWebTimeMachineOS/backup_repo/passwd.txt\\" restore --target / tags:${name} 2>/dev/null"
    Write-Output "SUCCESS"
  `;
  
  try {
    const { stdout, exitCode } = await runPowerShell(script);
    res.json({ status: "RESTORED", checkpoint: name, info: "WSL Guest restored. For Host, use Windows System Restore matching 'JetWeb_" + name + "'" });
  } catch (err) {
    sendError(res, 500, "ERR_ROLLBACK_FAILURE", err.message, {}, req);
  }
});

const https = require('https');
const http = require('http');

const sslCertPath = path.join(__dirname, 'ssl.crt');
const sslKeyPath = path.join(__dirname, 'ssl.key');
let server;

if (fs.existsSync(sslCertPath) && fs.existsSync(sslKeyPath)) {
  const options = {
    key: fs.readFileSync(sslKeyPath),
    cert: fs.readFileSync(sslCertPath)
  };
  server = https.createServer(options, app);
  console.log(`[+] SSL/TLS configuration loaded successfully.`);
} else {
  server = http.createServer(app);
}

server.listen(PORT, () => {
  const protocol = fs.existsSync(sslCertPath) && fs.existsSync(sslKeyPath) ? 'https' : 'http';
  console.log(`===================================================`);
  console.log(`🚀 Hardened Sovereign Windows Admin Gateway`);
  console.log(`🌐 Dashboard running at: ${protocol}://localhost:${PORT}`);
  console.log(`🔑 Admin Passphrase: ${ADMIN_PASSPHRASE}`);
  console.log(`🛡️  Security Mode: ${SECURITY_MODE.toUpperCase()}`);
  console.log(`👉 OpenAPI Doc: ${protocol}://localhost:${PORT}/openapi.json`);
  console.log(`===================================================`);
});
