package connectors

import "time"

type Venue string

const (
    VenueBinance Venue = "binance"
    VenueSchwab  Venue = "schwab"
    VenueAlpaca  Venue = "alpaca"
)

type VenueQuote struct {
    Venue   Venue
    Symbol  string
    Bid     float64
    Ask     float64
    Size    float64
    Time    time.Time
}

type CrossVenueState struct {
    Quotes []VenueQuote
}

type Opportunity struct {
    ID         string
    Symbol     string
    Timestamp  time.Time
    CrossVenue CrossVenueState
}