package connectors

import (
    "context"
    "encoding/json"
    "time"

    "github.com/gorilla/websocket"
)

type AlpacaConnector struct {
    Symbol string
    Out    chan VenueQuote
    APIKey string
    Secret string
}

func (a *AlpacaConnector) Start(ctx context.Context) error {
    conn, _, err := websocket.DefaultDialer.Dial(
        "wss://stream.data.alpaca.markets/v2/iex",
        nil,
    )
    if err != nil {
        return err
    }

    auth := map[string]string{
        "action": "auth",
        "key":    a.APIKey,
        "secret": a.Secret,
    }
    conn.WriteJSON(auth)

    sub := map[string]interface{}{
        "action": "subscribe",
        "quotes": []string{a.Symbol},
    }
    conn.WriteJSON(sub)

    go func() {
        defer conn.Close()
        for {
            select {
            case <-ctx.Done():
                return
            default:
                _, msg, err := conn.ReadMessage()
                if err != nil {
                    continue
                }
                var data []struct {
                    Bid float64 `json:"bp"`
                    Ask float64 `json:"ap"`
                }
                if err := json.Unmarshal(msg, &data); err != nil || len(data) == 0 {
                    continue
                }
                a.Out <- VenueQuote{
                    Venue:  VenueAlpaca,
                    Symbol: a.Symbol,
                    Bid:    data[0].Bid,
                    Ask:    data[0].Ask,
                    Size:   1.0,
                    Time:   time.Now(),
                }
            }
        }
    }()
    return nil
}