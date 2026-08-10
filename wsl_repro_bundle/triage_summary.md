Triage Summary (for maintainers)

This issue documents a reproducible multi-layer regression affecting WSL2 + WSLg + Hyper-V VMBus:

- dxgkrnl triggers a FORTIFY memcpy field-spanning write (dxgvmbus.c:3095)
- WSL telemetry fails with ENOBUFS (StartTelemetryAgent)
- Host enters low virtual memory (Event 2004)
- Hyper-V NIC churn (Events 67, 69, 71, 233, 234, 291, 292)
- DxgKrnl-SysMm provider returns "The data is invalid"
- LxssManager provider is missing entirely
- No DxgKrnl/Lxss events emitted during the failure window

This indicates a Windows-side regression in:
- dxgkrnl GPU virtualization
- Hyper-V guest drivers (NetVSC, VmSwitch)
- Windows event provider registration
- WSLg initialization path

A full repro bundle (dmesg, systeminfo, WSL status, event logs) is attached above.
ETW/ETL capture instructions included.

This is ready for cross-team investigation (WSLg, Hyper-V, DirectX, WSL).
