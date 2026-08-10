# Summary

WSL2 with WSLg enabled is encountering a dxgkrnl memory-safety violation, followed by Hyper-V VMBus instability, WSL telemetry ENOBUFS, and host-side event provider failures (DxgKrnl-SysMm invalid, LxssManager missing).

This appears to be a Windows update regression affecting WSLg GPU virtualization, Hyper-V guest drivers, and Windows event provider registration.

The failure chain is multi-layer and reproducible.

# Environment

- Windows build: 10.0.26100.8655
- WSL version: 2.7.10.0
- WSL2 kernel: 6.18.33.2-microsoft-standard-WSL2
- Host: Hyper-V (WSL2 backend)
- WSLg: Enabled (dxgkrnl path active)
- Location: Quitman, TX (for timestamp correlation)

# Guest Kernel Evidence (WSL2)

Two lines from the WSL kernel log show the core failure:

> "hv_vmbus: registering driver dxgkrnl"
> "memcpy: detected field-spanning write (size 4) of single field 'current_pos' at drivers/hv/dxgkrnl/dxgvmbus.c:3095"

This is a FORTIFY memory-safety violation inside dxgkrnl's VMBus sync-object path.

Shortly afterward:

> "WSL (159) ERROR: No buffer space available @telemetry.cpp:190 (StartTelemetryAgent)"

This indicates host-side buffer exhaustion (ENOBUFS).

# Host-Side Evidence (Windows)

## 1. DxgKrnl provider anomaly

Get-WinEvent -ListProvider *dxg*
Microsoft-Windows-DxgKrnl
Microsoft-Windows-DxgKrnl-SysMm -> "The data is invalid."

This provider should never return "The data is invalid."

## 2. LxssManager provider missing

Get-WinEvent -ListProvider *lxss*
-> "There is not an event provider... matching '*lxss*'."

WSL2 cannot operate normally without LxssManager logging.

## 3. Hyper-V VMBus instability

System log shows dozens of NIC disconnect/create events and RSC offload changes in the exact minute of the dxgkrnl crash:

Port DD0D6C13-C045-4E0F-A79D-D7F85E2CAC98 successfully deleted
NIC 327EB823-5892-431F-A5F1-FD1BCB7478AF successfully disconnected
RSC offload modified for NIC ...

This is classic VMBus instability.

## 4. Resource exhaustion

Event 2004: Windows successfully diagnosed a low virtual memory condition.

This correlates with WSL telemetry ENOBUFS.

# Expected Behavior

- dxgkrnl should not trigger memory-safety violations.
- DxgKrnl and LxssManager providers should exist and emit events.
- VMBus should remain stable.
- WSL telemetry should not fail with ENOBUFS.
- Hyper-V NIC churn should not occur under normal load.

# Actual Behavior

- dxgkrnl triggers a memcpy field-spanning write.
- DxgKrnl-SysMm provider is invalid.
- LxssManager provider is missing.
- Hyper-V VMBus resets repeatedly.
- WSL telemetry fails with ENOBUFS.
- WSL services are terminated by mini_init.
- Host logging subsystem fails to record dxgkrnl/Lxss events.

# Repro Steps

1. Boot WSL2 with WSLg enabled.
2. Observe dxgkrnl registration in dmesg.
3. Observe dxgvmbus.c:3095 memcpy warning.
4. Observe telemetry ENOBUFS.
5. Query Windows event providers — DxgKrnl-SysMm invalid, Lxss missing.
6. Check System log — Hyper-V NIC churn and resource exhaustion.
7. Capture ETW trace.

# Recommended ETW/ETL Attachments

To assist triage, please collect ETW traces from:

## Hyper-V guest + VMBus
- Microsoft-Windows-Hyper-V-Guest-Drivers-Vmbus
- Microsoft-Windows-Hyper-V-Netvsc
- Microsoft-Windows-Hyper-V-VmSwitch
- Microsoft-Windows-Hyper-V-Compute
- Microsoft-Windows-Hyper-V-Worker

## dxgkrnl / WSLg graphics
- Microsoft-Windows-DxgKrnl
- Microsoft-Windows-DXGI
- Microsoft.Windows.HyperV.GpupVDev

## WSL subsystem
- Microsoft-Windows-LxssManager (missing — this is part of the regression.)

## TCP/IP + memory pressure
- Microsoft-Windows-TCPIP
- Microsoft-Windows-Resource-Exhaustion-Detector

## Capture command

wpr -start generalprofile -filemode
# reproduce or wait for the failure window
wpr -stop wslg_dxgkrnl_vmbus.etl

Attach:
- wslg_dxgkrnl_vmbus.etl
- System log export
- WSL kernel boot log

# Jetweb Sovereign Organism Heuristic Signature

JETWEB.HV.VMBUS.DXGKRNL.ENOBUFS.MEMLOW

Trigger:
- dxgkrnl memcpy field-spanning write
- Hyper-V NIC churn (Events 67, 69, 71, 233, 234, 291, 292)
- WSL telemetry ENOBUFS
- Event 2004 (low virtual memory)
- DxgKrnl-SysMm provider invalid
- LxssManager provider missing

# Symbolic Architecture Diagram

WSL2 Userspace
    ↓
WSL2 Linux Kernel (hv_vmbus, dxgkrnl)
    ↓
Hyper-V VMBus
    ↓
Hyper-V Guest Drivers (NetVSC, VmSwitch)
    ↓
Windows TCP/IP Stack
    ↓
Resource-Exhaustion Detector (Event 2004)
    ↓
Host Logging Subsystem (DxgKrnl-SysMm invalid, Lxss missing)
    ↓
Symptoms: ENOBUFS, NIC churn, WSLg instability

# Labels Requested
- area-wslg
- area-hyperv
- area-kernel
- needs-investigation
- regression
- telemetry
- networking
- graphics

# Assignee Mentions
- @benhillis
- @craigloewen-msft
- @microsoft/wslg
- @microsoft/hyperv
- @microsoft/directx-team

# Impact

This regression destabilizes WSL2, WSLg, Hyper-V VMBus, and host logging. It suppresses diagnostic visibility for kernel faults and causes cascading failures across networking, graphics, and telemetry.

A fix is needed in:
- dxgkrnl
- Hyper-V guest drivers
- Windows event provider registration
- WSLg initialization path
