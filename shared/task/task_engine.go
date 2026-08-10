// task_engine.go
package task

import (
    "sort"
    "time"

    "pqr.info/shared/go_sidecar/state"
    "pqr.info/shared/go_sidecar/crypto5d"
)

type Task struct {
    Addr     crypto5d.FiveDAddress
    Payload  []byte
    Created  time.Time
}

type TaskResult struct {
    Addr        crypto5d.FiveDAddress
    Phase       uint16
    Lineage     uint16
    Canonical   crypto5d.FiveDAddress
    LineageHead state.LineageEntry
    Neighbors   []crypto5d.FiveDAddress
}

func ExecuteTask(t Task, prevHash [32]byte) TaskResult {
    // 1. Compute lineage
    lineage := state.AdvanceLineage(
        state.StateSnapshot{
            Addr:    t.Addr,
            Payload: t.Payload,
        },
        prevHash,
    )

    // 2. Compute 27^3 vertex grid
    neighbors := computeVertexGrid(t.Addr)

    // 3. Filter by phase
    phase := t.Addr.Phi
    phaseNeighbors := filterByPhase(neighbors, phase)

    // 4. Select canonical vertex (lowest base-27)
    canonical := selectCanonical(phaseNeighbors)

    return TaskResult{
        Addr:        t.Addr,
        Phase:       t.Addr.Phi,
        Lineage:     t.Addr.Lambda,
        Canonical:   canonical,
        LineageHead: lineage,
        Neighbors:   neighbors,
    }
}

func computeVertexGrid(addr crypto5d.FiveDAddress) []crypto5d.FiveDAddress {
    out := make([]crypto5d.FiveDAddress, 0, 19683)
    for dx := 0; dx < 27; dx++ {
        for dy := 0; dy < 27; dy++ {
            for dz := 0; dz < 27; dz++ {
                out = append(out, crypto5d.Offset(addr, dx, dy, dz))
            }
        }
    }
    return out
}

func filterByPhase(addrs []crypto5d.FiveDAddress, phase uint16) []crypto5d.FiveDAddress {
    out := []crypto5d.FiveDAddress{}
    for _, a := range addrs {
        if a.Phi == phase {
            out = append(out, a)
        }
    }
    return out
}

func selectCanonical(addrs []crypto5d.FiveDAddress) crypto5d.FiveDAddress {
    sort.Slice(addrs, func(i, j int) bool {
        return string(addrs[i].Base27[:]) < string(addrs[j].Base27[:])
    })
    return addrs[0]
}
