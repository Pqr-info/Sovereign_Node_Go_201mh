# JetWeb Time Machine – Self-Optimizing Upgrade Wireframe

This document defines how JetWeb Time Machine evolves over time without breaking existing Antigravity installs.

## 1. Environment Detection Layer

On startup, the module will:

- Detect Hyper-V availability
- Detect WSL presence and configured distros
- Detect IDE fingerprints (VS Code, Visual Studio, JetBrains, Unity, Unreal)

Behavior:

- If Hyper-V is available → use VhdxSnapshotEngine
- If Hyper-V is unavailable → fall back to MockSnapshotEngine (safe mode)
- Log the chosen engine in jetweb-time-machine.log

## 2. Engine Selection & Future Upgrades

SnapshotEngine implementations:

- VhdxSnapshotEngine (current, production)
- MockSnapshotEngine (fallback)
- Future: AppDataSnapshotEngine, CloudSnapshotEngine

Upgrade rule:

- New engines must implement the existing SnapshotEngine interface.
- The menu and recovery funnel remain unchanged.

## 3. Self-Optimization Strategy

Over time, the module will:

- Prefer native VHDX snapshots when stable
- Add per-IDE/AppData snapshot engines
- Optimize checkpoint frequency based on mutation triggers
- Never auto-enable destructive rollback without explicit user choice

## 4. Backward Compatibility

- Existing checkpoints remain valid across upgrades.
- New versions must read old JSON metadata.
- Rollback semantics (destructive rollback) stay deterministic.

## 5. Versioning & Marketplace Updates

- Semantic versioning: 1.0.x for engine improvements, 1.x.0 for new capabilities.
- Marketplace description will be updated to reflect new engines, but the core promise remains:
  “Deterministic temporal protection with a strict Post-Pay recovery funnel.”
