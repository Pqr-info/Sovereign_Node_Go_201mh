# Swarm Proxy Sidecar

`proxy` is the network proxy and discovery sidecar for the PQR sovereign node system. It handles local service discovery, network mapping, and local reverse proxy routing to coordinate node communication.

## Core Capabilities
* **Local Service Discovery**: Probes standard ports to automatically locate and bind neighbor nodes (such as target Ollama model servers on Node YOGA).
* **WebSocket Broadcasting**: Listens on port `8081/ws` to broadcast real-time swarm messages and routing updates.
* **Gemma/Ollama Routing**: Forwards requests from local ports to designated models:
  * Local port `1234` proxies to local LLM endpoint on `1233` (e.g. LM Studio model google/gemma-4-e4b).
  * Local port `11434` proxies to discovered neighbor GPUs (e.g. Ollama service on host Ryzen laptop).

## Usage

Start the proxy daemon process:
```bash
go run ./main.go
```

Logs will detail discovery sequences:
```text
Starting Swarm Proxy Daemon...
[Broadcaster] Listening on :8081/ws
Discovering Yoga Laptop (Ollama) on port 11434...
Found Yoga Laptop at 192.168.1.45
[Gemma Proxy] Listening on 127.0.0.1:1234 -> forwarding to 127.0.0.1:1233
[Ollama Proxy] Listening on 127.0.0.1:11434 -> forwarding to http://192.168.1.45:11434
```
