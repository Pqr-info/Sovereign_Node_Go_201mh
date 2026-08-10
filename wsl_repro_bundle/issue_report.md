Title: WSL2/WSLg: dxgkrnl memcpy field-spanning write + ENOBUFS telemetry; DxgKrnl-SysMm provider invalid, Lxss provider missing

Environment
----------
- Windows build: 10.0.26200 N/A Build 26200
- WSL version: WSL (1 - ): WSL version 2.7.10.0
- Kernel: 6.18.33.2-microsoft-standard-WSL2
- Distro(s): docker-desktop / WSLg distribution

Symptoms
--------
- WSL dmesg shows a guest kernel memory-safety violation in dxgkrnl:
  - `memcpy: detected field-spanning write (size 4) of single field "current_pos" at drivers/hv/dxgkrnl/dxgvmbus.c:3095`
  - `WARNING: CPU: 4 PID: 200 ... dxgvmb_send_wait_sync_object_gpu+0x271/0x290`
- WSL telemetry reports ENOBUFS:
  - `WSL (159) ERROR: No buffer space available @telemetry.cpp:190 (StartTelemetryAgent)`
- The guest VM terminates after the failure.

Host logging surface anomalies
------------------------------
- `Get-WinEvent -ListProvider *dxg*` returns:
  - `Microsoft-Windows-DxgKrnl 802ec45a-1e99-4b83-9920-87c98277ba9d`
- But `DxgKrnl-SysMm` is invalid:
  - `Could not retrieve information about the Microsoft-Windows-DxgKrnl-SysMm provider. Error: The data is invalid.`
- No Lxss provider exists:
  - `Get-WinEvent -ListProvider *lxss*` -> no provider found.
- Host System log in the same time window shows:
  - Event 2004: low virtual memory condition.
  - Heavy Hyper-V NIC churn with ports and NICs created/deleted and RSC offload modified.

Expected
--------
- DxgKrnl and WSLg faults should be logged via DxgKrnl and LxssManager providers.
- DxgKrnl-SysMm provider should be valid.
- Lxss provider should exist on a WSL2+WSLg system.

Actual
------
- Guest kernel reports a dxgkrnl memcpy field-spanning write and ENOBUFS telemetry.
- Host shows Hyper-V NIC churn and low virtual memory.
- DxgKrnl-SysMm provider is invalid (`The data is invalid`).
- No Lxss provider is present.

Repro bundle
------------
- Bundle saved at `D:\pqr.info\wsl_repro_bundle`
- Key files:
  - `systeminfo.txt`
  - `wsl_version.txt`
  - `wsl_status_from_debug_terminal.txt` (contains the captured dmesg and event-provider query output)
  - `issue_report.md`

MSRC guidance
-------------
Issue type: reliability + potential security impact.
Surface: Windows kernel / dxgkrnl / Hyper-V / WSLg.
Key points:
- Memory-safety violation in dxgkrnl (`memcpy field-spanning write`).
- Telemetry ENOBUFS and resource exhaustion.
- Broken event provider surface means kernel faults may not be logged.

Note: `gh` CLI is not installed in this environment, so the issue draft is saved locally for manual submission.
