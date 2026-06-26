# WIKI: Swarm Communication Protocols

This document details the communication protocols, network boundaries, and messaging formats defined within the **SWEND** stack.

---

## 1. Network Layer Specifications

### 1.1. gRPC Control Plane (Port `1111`)
Exposes the core synchronization, user administration, and process teleportation functions. By default, it requires TLS encryption with client certificates distributed by HashiCorp Vault.

### 1.2. Neural Gossip Bus (Port `11111`)
A high-throughput, low-latency UDP/TCP channel dedicated to memory page swaps and node vitality checks. It operates utilizing a zero-copy buffer model to support sub-millisecond deliberation cycles.

### 1.3. iPN Stealth Multicast Backchannel (Port `9999`)
Enables zero-discovery peer routing using link-local IPv6 multicast:
* **Address**: `[ff02::c0ba:11]`
* **Protocol**: UDP6
* **Payload**: Rolling Pseudo-Noise (PN) challenge bytes.
* **Mechanism**: Nodes verify their timing constraints against a shared generator polynomial. Only nodes whose guesses match the rolling hash are allowed to write consensus state changes.

---

## 2. Main gRPC Signatures

### 2.1. `AgentSync` Service
```protobuf
service AgentSync {
    rpc Ping (PingRequest) returns (PingResponse);
    rpc HandshakeState (StatePayload) returns (SyncAck);
    rpc StreamInference (InferenceRequest) returns (stream InferenceChunk);
    rpc RemoteExecute (CommandPayload) returns (CommandResult);
    rpc TeleportProcess (TeleportProcessRequest) returns (TeleportProcessResponse);
    rpc ProposeSwarmMutation (MutationRequest) returns (MutationResponse);
}
```

### 2.2. `NeuralTraining` Service
```protobuf
service NeuralTraining {
    rpc InitiateTraining(TrainingRequest) returns (TrainingSession);
    rpc GetTrainingStatus(TrainingStatusRequest) returns (TrainingStatus);
}
```

### 2.3. `SovereignCity` Service
```protobuf
service SovereignCity {
    rpc RegisterCitizen(CitizenRegistration) returns (CitizenPassport);
    rpc RequestService(ServiceRequest) returns (ServiceAllocation);
}
```
