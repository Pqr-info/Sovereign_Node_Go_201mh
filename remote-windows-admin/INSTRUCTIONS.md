# AI Integration Guide - Sovereign Windows Administrative Gateway

This server exposes a secure HTTP API optimized for both human-in-the-loop operators and external AI agents. It allows automated monitoring, service management, diagnostics queries, and sandboxed PowerShell execution.

## Authentication
Every request must include the secret Bearer Token in the HTTP Authorization header:
```http
Authorization: Bearer AdminTokenSecured2026!#
```

## API Specification (`/openapi.json`)
The complete API schema, parameter descriptions, and structure are available directly at `/openapi.json`. 

### Key Endpoints

#### 1. Retrieve Telemetry (`GET /api/diagnostics`)
Returns a structured JSON payload containing real-time OS information, uptime, CPU load percentage, RAM telemetry, and local volume status.
- **Example Response:**
  ```json
  {
    "os_name": "Microsoft Windows 11 Enterprise",
    "os_version": "10.0.22631",
    "uptime_seconds": 34105,
    "cpu_load_pct": 14.5,
    "ram_total_kb": 16777216,
    "ram_free_kb": 8388608,
    "ram_used_kb": 8388608,
    "disks": [
      {
        "DriveLetter": "C",
        "FileSystemLabel": "System",
        "Size": 1024000000000,
        "SizeRemaining": 612000000000
      }
    ]
  }
  ```

#### 2. Capture Display Screenshot (`GET /api/screenshot`)
Generates a real-time screenshot of the host's primary display. Returns a binary `image/png` stream. Useful for debugging GUI anomalies, confirming deployment completions, or visual verification.
- **Usage Hint:** If running as a Windows service (Session 0) or if the screen is locked, this endpoint will return a JSON error (`500`) explaining the lockup.

#### 3. List Processes (`GET /api/processes`)
Retrieves the top 30 processes sorted by current CPU utilization.
- **Example Response:**
  ```json
  [
    {
      "Id": 1402,
      "Name": "node",
      "CPU": 4.12,
      "WorkingSet": 128.5,
      "Description": "Node.js JavaScript Runtime"
    }
  ]
  ```

#### 4. List Services (`GET /api/services`)
Retrieves a complete registry list of native Windows services.
- **Example Response:**
  ```json
  [
    {
      "Name": "sshd",
      "DisplayName": "OpenSSH SSH Server",
      "Status": "Running",
      "StartType": "Automatic"
    }
  ]
  ```

#### 5. Safe Execute PowerShell Block (`POST /api/execute`)
Executes the specified PowerShell code on the host using UAC-elevated privileges.
- **Payload Schema:**
  ```json
  {
    "command": "Restart-Service sshd"
  }
  ```
- **Example Response:**
  ```json
  {
    "exitCode": 0,
    "stdout": "sshd stopped and restarted successfully.",
    "stderr": ""
  }
  ```
- **Blocked Operations:** High-destructive operations (`Format-Volume`, recursive deletion commands) are blocked at the application level to prevent accidental data loss.
