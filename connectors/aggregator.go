package connectors

import (
    "context"
    "time"
)

type Aggregator struct {
    InBinance chan VenueQuote
    InSchwab  chan VenueQuote
    InAlpaca  chan VenueQuote
    OutOpp    chan Opportunity
}

func latest(ch chan VenueQuote) VenueQuote {
	select {
	case q := <-ch:
		return q
	default:
		return VenueQuote{}
	}
}

func newID() string {
	return "dummy-id"
}

func (a *Aggregator) Start(ctx context.Context, symbol string) {
    go func() {
        for {
            select {
            case <-ctx.Done():
                return
            case <-a.InBinance:
                a.emit(symbol)
            case <-a.InSchwab:
                a.emit(symbol)
            case <-a.InAlpaca:
                a.emit(symbol)
            }
        }
    }()
}

func (a *Aggregator) emit(symbol string) {
    quotes := []VenueQuote{
        latest(a.InBinance),
        latest(a.InSchwab),
        latest(a.InAlpaca),
    }
    opp := Opportunity{
        ID:        newID(),
        Symbol:    symbol,
        Timestamp: time.Now(),
        CrossVenue: CrossVenueState{
            Quotes: quotes,
        },
    }
    a.OutOpp <- opp
}