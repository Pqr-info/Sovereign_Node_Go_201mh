package main

import (
    "fmt"
    "net/http"
)

type agentController struct {
    bridgePort string
}

func (ac *agentController) serveExecute(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "OMNIBUS GSH SYSTEM ACTIVE")
}

func (ac *agentController) bootBridge() {
    http.HandleFunc("/rpc/execute", ac.serveExecute)
    http.ListenAndServe(ac.bridgePort, nil)
}

func main() {
    node := &agentController{bridgePort: ":8080"}
    node.bootBridge()
}
