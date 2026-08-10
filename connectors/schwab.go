package connectors

import (
    "context"
    "encoding/json"
    "net/http"
    "time"
)

type SchwabConnector struct {
    Symbol string
    Out    chan VenueQuote
    APIKey string
}

func (s *SchwabConnector) Start(ctx context.Context) {
    ticker := time.NewTicker(1 * time.Second)
    go func() {
        defer ticker.Stop()
        for {
            select {
            case <-ctx.Done():
                return
            case <-ticker.C:
                req, _ := http.NewRequest("GET",
                    "https://api.schwab.com/v1/market/quote/"+s.Symbol,
                    nil)
                req.Header.Set("Authorization", "Bearer "+s.APIKey)

                resp, err := http.DefaultClient.Do(req)
                if err != nil {
                    continue
                }
                var data struct {
                    Bid float64 `json:"bid"`
                    Ask float64 `json:"ask"`
                }
                if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
                    resp.Body.Close()
                    continue
                }
                resp.Body.Close()

                s.Out <- VenueQuote{
                    Venue:  VenueSchwab,
                    Symbol: s.Symbol,
                    Bid:    data.Bid,
                    Ask:    data.Ask,
                    Size:   1.0,
                    Time:   time.Now(),
                }
            }
        }
    }()
}