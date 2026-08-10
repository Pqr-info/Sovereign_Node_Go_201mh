// mesh_supervisor.go
package supervisor

import (
    "time"

    "pqr.info/shared/go_sidecar/state"
    "pqr.info/shared/go_sidecar/crypto5d"
)

type Ticket struct {
    ID        string
    Epic      string
    Assigned  string // agent name
    Addr      crypto5d.FiveDAddress
    Status    string
    Created   time.Time
    Updated   time.Time
}

type TicketResult struct {
    TicketID string
    Addr     crypto5d.FiveDAddress
    Lineage  state.LineageEntry
    Output   []byte
}

func AssignTicket(t Ticket, agent string) Ticket {
    t.Assigned = agent
    t.Status = "assigned"
    t.Updated = time.Now()
    return t
}

func CompleteTicket(t Ticket, output []byte, prevHash [32]byte) TicketResult {
    snapshot := state.StateSnapshot{
        Addr:    t.Addr,
        Payload: output,
    }

    lineage := state.AdvanceLineage(snapshot, prevHash)

    return TicketResult{
        TicketID: t.ID,
        Addr:     t.Addr,
        Lineage:  lineage,
        Output:   output,
    }
}
