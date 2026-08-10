package swarm

import (
    "context"
    "log"
    "time"

    "pqr.info/connectors"
)

func RunShadowTrifecta(ctx context.Context, symbol string) {
    binCh := make(chan connectors.VenueQuote, 128)
    schwCh := make(chan connectors.VenueQuote, 128)
    alpCh := make(chan connectors.VenueQuote, 128)
    oppCh := make(chan connectors.Opportunity, 128)
    propCh := make(chan BundleProposal, 128)

    bin := &connectors.BinanceConnector{Symbol: symbol, Out: binCh}
    schw := &connectors.SchwabConnector{Symbol: symbol, Out: schwCh, APIKey: "SCHWAB_KEY"}
    alp := &connectors.AlpacaConnector{Symbol: symbol, Out: alpCh, APIKey: "ALP_KEY", Secret: "ALP_SECRET"}

    agg := &connectors.Aggregator{
        InBinance: binCh,
        InSchwab:  schwCh,
        InAlpaca:  alpCh,
        OutOpp:    oppCh,
    }

    if err := bin.Start(ctx); err != nil {
        log.Println("binance start error:", err)
    }
    schw.Start(ctx)
    if err := alp.Start(ctx); err != nil {
        log.Println("alpaca start error:", err)
    }
    agg.Start(ctx, symbol)

    trifecta := NewTrifectaAgent("AGENT-TRIFECTA-1")
    swarm := &SwarmCoordinator{
        InOpp:   oppCh,
        Agents:  []Agent{trifecta},
        OutProp: propCh,
    }
    swarm.Start(ctx)

    go func() {
        for prop := range propCh {
            log.Printf("[SHADOW] opp=%s ev=%.4f risk=%.3f conf=%.3f\n",
                prop.OpportunityID, prop.ExpectedValue, prop.RiskScore, prop.Confidence)
        }
    }()

    <-ctx.Done()
    time.Sleep(500 * time.Millisecond)
}
