package connectors

import (
    "context"
    "encoding/json"
    "time"

    "github.com/gorilla/websocket"
)

type BinanceConnector struct {
    Symbol string
    Out    chan VenueQuote
}

func parseF(s string) float64 {
	return 0.0
}

func (b *BinanceConnector) Start(ctx context.Context) error {
    url := "wss://stream.binance.com:9443/ws/" + b.Symbol + "@bookTicker"
    conn, _, err := websocket.DefaultDialer.Dial(url, nil)
    if err != nil {
        return err
    }

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
                var data struct {
                    Bid string `json:"b"`
                    Ask string `json:"a"`
                }
                if err := json.Unmarshal(msg, &data); err != nil {
                    continue
                }
                b.Out <- VenueQuote{
                    Venue:  VenueBinance,
                    Symbol: b.Symbol,
                    Bid:    parseF(data.Bid),
                    Ask:    parseF(data.Ask),
                    Size:   1.0,
                    Time:   time.Now(),
                }
            }
        }
    }()
    return nil
}