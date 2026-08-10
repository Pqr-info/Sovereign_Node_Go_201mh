package main

import (
    "encoding/json"
    "fmt"
    "os"

    s27 "pqr.info/SUBSTRATE/tooling"
)

type Vec struct {
    Symbols []int `json:"symbols"`
    States  []int `json:"states"`
}

func main() {
    data, _ := os.ReadFile("test_vector.json")
    var v Vec
    json.Unmarshal(data, &v)

    addr, err := s27.FromInts(v.Symbols, v.States)
    if err != nil {
        panic(err)
    }

    fmt.Printf("Go Hash: %x\n", addr.Hash())
}
