Title: WSL2/WSLg: dxgkrnl memcpy field-spanning write + ENOBUFS telemetry; DxgKrnl-SysMm provider invalid, Lxss provider missing

Body:

Environment
----------
- Windows build: 10.0.26200 N/A Build 26200
- WSL version: 2.7.10.0
- Kernel: 6.18.33.2-microsoft-standard-WSL2
- Distro: docker-desktop / WSLg-enabled environment

Observed behavior
-----------------
- WSL guest boot logs show a kernel memory-safety issue in `dxgkrnl`:
  - `memcpy: detected field-spanning write (size 4) of single field "current_pos" at drivers/hv/dxgkrnl/dxgvmbus.c:3095`
  - `WARNING: CPU: 4 PID: 200 ... dxgvmb_send_wait_sync_object_gpu+0x271/0x290`
- Telemetry startup fails with `No buffer space available` from `StartTelemetryAgent` in `telemetry.cpp:190`.
- Host event provider discovery is inconsistent:
  - `Microsoft-Windows-DxgKrnl` exists.
  - `Microsoft-Windows-DxgKrnl-SysMm` reports invalid metadata.
  - `*lxss*` provider names are missing entirely.

Host-side issues seen during repro window
----------------------------------------
- Event 2004 low virtual memory warning.
- Hyper-V NIC churn and RSC offload state changes.

Expected behavior
-----------------
- GPU/hypervisor faults should surface correctly through DxgKrnl/DxgKrnl-SysMm and Lxss providers.
- Lxss-related ETW provider should be present for logging WSL boot/runtime events.
- WSL should not crash on dxgkrnl memcpy field-spanning writes.

Attachments / repro bundle
--------------------------
- Repro bundle path: `D:\pqr.info\wsl_repro_bundle`
- Captured files include `systeminfo.txt`, `wsl_version.txt`, and `wsl_status_from_debug_terminal.txt`.

Additional note
---------------
- `gh` CLI was not installed in this environment, so the issue was prepared locally but not submitted automatically.
