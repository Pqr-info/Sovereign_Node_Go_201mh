package agentbridge

import "context"

type PQRClient interface {
	GetTicket(ctx context.Context, id TicketID) (Ticket, error)
	GetParent(ctx context.Context, id TicketID) (Ticket, bool, error)
	GetChildren(ctx context.Context, id TicketID) ([]Ticket, error)
	GetMemory(ctx context.Context, id TicketID) ([]MemoryBlock, error)
	StoreMemoryEvent(ctx context.Context, evt MemoryPageEvent) error
}

type Ticket struct {
	ID           TicketID
	Relationship string
	Layer        int
}

type MemoryBlock struct {
	Content string
	Score   float64
}

type ContextWindow struct {
	Layers map[string]LayerContext
}

type LayerContext struct {
	Tickets []Ticket
	Memory  map[TicketID][]MemoryBlock
}

func BuildContextWindow(ctx context.Context, pqr PQRClient, id TicketID) (ContextWindow, error) {
	window := ContextWindow{Layers: make(map[string]LayerContext)}

	// Layer 0 - Local Ticket
	current, err := pqr.GetTicket(ctx, id)
	if err != nil {
		return window, err
	}
	window.Layers["Layer0"] = LayerContext{
		Tickets: []Ticket{current},
		Memory:  map[TicketID][]MemoryBlock{id: mustMemory(ctx, pqr, id)},
	}

	// Upward lineage (parent -> grandparent -> root)
	parent, ok, err := pqr.GetParent(ctx, id)
	if err == nil && ok {
		window.Layers["Layer-1"] = LayerContext{
			Tickets: []Ticket{parent},
			Memory:  map[TicketID][]MemoryBlock{parent.ID: mustMemory(ctx, pqr, parent.ID)},
		}
		gp, ok2, err2 := pqr.GetParent(ctx, parent.ID)
		if err2 == nil && ok2 {
			window.Layers["Layer-2"] = LayerContext{
				Tickets: []Ticket{gp},
				Memory:  map[TicketID][]MemoryBlock{gp.ID: mustMemory(ctx, pqr, gp.ID)},
			}
			gg, ok3, err3 := pqr.GetParent(ctx, gp.ID)
			if err3 == nil && ok3 {
				window.Layers["Layer-3"] = LayerContext{
					Tickets: []Ticket{gg},
					Memory:  map[TicketID][]MemoryBlock{gg.ID: mustMemory(ctx, pqr, gg.ID)},
				}
			}
		}
	}

	// Downward lineage (children)
	children, err := pqr.GetChildren(ctx, id)
	if err == nil && len(children) > 0 {
		lc := LayerContext{Tickets: children, Memory: map[TicketID][]MemoryBlock{}}
		for _, c := range children {
			lc.Memory[c.ID] = mustMemory(ctx, pqr, c.ID)
		}
		window.Layers["Layer+1"] = lc
	}

	return window, nil
}

func mustMemory(ctx context.Context, pqr PQRClient, id TicketID) []MemoryBlock {
	m, _ := pqr.GetMemory(ctx, id)
	return m
}
