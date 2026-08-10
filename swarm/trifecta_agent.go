package swarm

import (
    "context"
    "math"

    "pqr.info/connectors"
)

type TrifectaAgent struct {
    id string
}

func NewTrifectaAgent(id string) *TrifectaAgent {
    return &TrifectaAgent{id: id}
}

func (a *TrifectaAgent) ID() string { return a.id }

func (a *TrifectaAgent) Analyze(ctx context.Context, opp connectors.Opportunity) (*BundleProposal, error) {
    q := opp.CrossVenue.Quotes
    var bestBuy, bestSell *connectors.VenueQuote

    for i := range q {
        if bestBuy == nil || q[i].Ask < bestBuy.Ask {
            bestBuy = &q[i]
        }
        if bestSell == nil || q[i].Bid > bestSell.Bid {
            bestSell = &q[i]
        }
    }
    if bestBuy == nil || bestSell == nil {
        return nil, nil
    }

    spread := bestSell.Bid - bestBuy.Ask
    if spread <= 0 {
        return nil, nil
    }

    size := math.Min(bestBuy.Size, bestSell.Size)
    ev := spread * size

    // Simple risk scoring: higher volatility between venues → higher risk
    risk := venueRisk(q)

    return &BundleProposal{
        OpportunityID: opp.ID,
        AgentID:       a.id,
        ExpectedValue: ev,
        Confidence:    confidenceFromSpread(spread, risk),
        RiskScore:     risk,
    }, nil
}

func venueRisk(quotes []connectors.VenueQuote) float64 {
    if len(quotes) < 2 {
        return 0.1
    }
    var maxBid, minBid float64
    maxBid = quotes[0].Bid
    minBid = quotes[0].Bid
    for _, q := range quotes[1:] {
        if q.Bid > maxBid {
            maxBid = q.Bid
        }
        if q.Bid < minBid {
            minBid = q.Bid
        }
    }
    spread := maxBid - minBid
    if spread <= 0 {
        return 0.1
    }
    return math.Min(1.0, spread/float64(len(quotes)))
}

func confidenceFromSpread(spread, risk float64) float64 {
    base := math.Min(1.0, spread/0.5)
    return math.Max(0.0, base*(1.0-risk))
}
