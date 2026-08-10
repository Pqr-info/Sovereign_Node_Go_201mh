/**
 * pouw_stratum.js
 * Implements the JSON-RPC Stratum protocol adapted for Proof-of-Useful-Work (PoUW).
 */

const { v4: uuidv4 } = require('uuid');

class PouwStratumServer {
  constructor(mothership) {
    this.mothership = mothership; // Reference to the core Mothership engine
  }

  handleMessage(ws, message) {
    try {
      const rpc = JSON.parse(message);
      
      if (!rpc.method || !rpc.id) {
        return this.sendError(ws, null, -32600, "Invalid Request");
      }

      switch (rpc.method) {
        case 'pouw.authorize':
          this.handleAuthorize(ws, rpc);
          break;
        case 'pouw.subscribe':
          this.handleSubscribe(ws, rpc);
          break;
        case 'pouw.submit_proof':
          this.handleSubmitProof(ws, rpc);
          break;
        case 'pouw.checkpoint':
          this.handleCheckpoint(ws, rpc);
          break;
        default:
          this.sendError(ws, rpc.id, -32601, "Method not found");
      }
    } catch (e) {
      this.sendError(ws, null, -32700, "Parse error");
    }
  }

  handleAuthorize(ws, rpc) {
    const { node_id, capabilities } = rpc.params;
    // Register the node with the Mothership
    const registeredNode = this.mothership.registerNode(ws, node_id, capabilities);
    
    this.sendResponse(ws, rpc.id, true);
  }

  handleSubscribe(ws, rpc) {
    // Client is ready to receive workload notifications
    const session_id = uuidv4();
    ws.session_id = session_id;
    this.sendResponse(ws, rpc.id, session_id);
    
    // Immediately attempt to schedule tasks to this newly subscribed node
    this.mothership.scheduleJobs();
  }

  handleSubmitProof(ws, rpc) {
    const { job_id, attempt_id, proof, result } = rpc.params;
    const success = this.mothership.verifyAndCompleteJob(job_id, attempt_id, proof, result);
    
    if (success) {
      this.sendResponse(ws, rpc.id, true);
    } else {
      this.sendError(ws, rpc.id, -32001, "Proof rejected or Job invalid");
    }
  }
  
  handleCheckpoint(ws, rpc) {
    const { job_id, attempt_id, state_delta, drift_signature } = rpc.params;
    const success = this.mothership.recordCheckpoint(job_id, attempt_id, state_delta, drift_signature);
    
    if (success) {
      this.sendResponse(ws, rpc.id, true);
    } else {
      this.sendError(ws, rpc.id, -32002, "Checkpoint rejected");
    }
  }

  sendWorkloadNotify(ws, job) {
    const rpc = {
      jsonrpc: "2.0",
      method: "pouw.workload_notify",
      params: {
        job_id: job.job_id,
        attempt_id: job.attempt_id,
        role_id: job.role_id,
        talent: job.talent,
        state: job.state // serialized state to replay if teleported
      }
    };
    ws.send(JSON.stringify(rpc));
  }

  sendResponse(ws, id, result) {
    ws.send(JSON.stringify({ jsonrpc: "2.0", id, result }));
  }

  sendError(ws, id, code, message) {
    ws.send(JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } }));
  }
}

module.exports = { PouwStratumServer };
