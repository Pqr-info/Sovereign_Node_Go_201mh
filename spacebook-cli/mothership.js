/**
 * mothership.js
 * The core SpaceBook CLI Mothership Server.
 * Implements the Teleportation Scheduler, Node capabilities scoring,
 * and the Role/Job/Talent formal taxonomy for PoUW delegation.
 */

const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const { PouwStratumServer } = require('./pouw_stratum');

// scoring weights based on Copilot's formal specification
const WEIGHTS = {
  throughput: 1.0,
  latency: 1.5,
  battery: 0.5,
  thermal: 0.8,
  reputation: 1.2,
  drift: 2.0
};
const TELEPORT_THRESHOLD = 50.0;

class Mothership {
  constructor(port = 8080) {
    this.port = port;
    this.nodes = new Map(); // node_id -> { ws, capabilities, status, roles, jobs }
    this.jobs = new Map(); // job_id -> { role_id, state, lifecycle, attempt_id, talent, lag }
    
    this.stratum = new PouwStratumServer(this);
    this.wss = new WebSocket.Server({ port: this.port });
    
    this.setupServer();
    this.startTeleportationScheduler();
  }

  setupServer() {
    this.wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        this.stratum.handleMessage(ws, message);
      });
      ws.on('close', () => {
        this.handleDisconnect(ws);
      });
    });
    console.log(`[Mothership] Started PoUW Stratum server on port ${this.port}`);
  }

  registerNode(ws, node_id, capabilities) {
    const node = {
      ws,
      node_id,
      capabilities,
      status: 'healthy',
      roles: new Set(),
      jobs: new Set(),
      score: this.calculateScore(capabilities)
    };
    this.nodes.set(node_id, node);
    ws.node_id = node_id;
    console.log(`[Mothership] Registered node ${node_id} (Score: ${node.score.toFixed(2)})`);
    return node;
  }

  handleDisconnect(ws) {
    if (ws.node_id) {
      const node = this.nodes.get(ws.node_id);
      if (node) {
        node.status = 'offline';
        console.log(`[Mothership] Node ${ws.node_id} went offline. Triggering teleportation...`);
        // Immediately try to reassign its jobs
        this.teleportNodeJobs(ws.node_id);
      }
    }
  }

  calculateScore(cap) {
    // score = w1 * throughput + w2 * (1 / latency) + w3 * battery + w4 * thermal_headroom + w5 * reputation - w6 * drift_budget_penalty
    const throughput = cap.throughput || 0;
    const latency = cap.latency || 100;
    const battery = cap.battery || 0;
    const thermal = cap.thermal_headroom || 0;
    const reputation = cap.reputation || 0;
    const drift = cap.drift_budget || 0;

    return (WEIGHTS.throughput * throughput) +
           (WEIGHTS.latency * (1000 / (latency || 1))) +
           (WEIGHTS.battery * battery) +
           (WEIGHTS.thermal * thermal) +
           (WEIGHTS.reputation * reputation) -
           (WEIGHTS.drift * drift);
  }

  scheduleJobs() {
    // Basic task dispatcher: finds unassigned or stalled jobs and assigns to highest scored node
    const pendingJobs = Array.from(this.jobs.values()).filter(j => 
      j.lifecycle === 'assigned' || j.lifecycle === 'stalled' || j.lifecycle === 'teleported'
    );

    if (pendingJobs.length === 0) return;

    const availableNodes = Array.from(this.nodes.values()).filter(n => n.status === 'healthy');
    if (availableNodes.length === 0) return;

    // Sort nodes by score descending
    availableNodes.sort((a, b) => b.score - a.score);

    pendingJobs.forEach(job => {
      const targetNode = availableNodes[0]; // greedily assign to best node
      job.lifecycle = 'running';
      job.attempt_id = uuidv4();
      targetNode.jobs.add(job.job_id);
      
      console.log(`[Mothership] Assigned job ${job.job_id} to node ${targetNode.node_id}`);
      this.stratum.sendWorkloadNotify(targetNode.ws, job);
    });
  }

  verifyAndCompleteJob(job_id, attempt_id, proof, result) {
    const job = this.jobs.get(job_id);
    if (!job || job.attempt_id !== attempt_id) return false;
    
    // In a real system, verify the proof against a quorum or deterministic model
    job.lifecycle = 'completed';
    job.result = result;
    console.log(`[Mothership] Job ${job_id} completed successfully.`);
    return true;
  }

  recordCheckpoint(job_id, attempt_id, state_delta, drift_signature) {
    const job = this.jobs.get(job_id);
    if (!job || job.attempt_id !== attempt_id) return false;

    job.state = { ...job.state, ...state_delta, drift_signature };
    job.lag = 0; // reset lag on successful checkpoint
    return true;
  }

  startTeleportationScheduler() {
    // Run every 5 seconds to detect degrading nodes or high lag jobs
    setInterval(() => {
      this.evaluateTeleportations();
    }, 5000);
  }

  evaluateTeleportations() {
    // Find healthy nodes to teleport to
    const healthyNodes = Array.from(this.nodes.values()).filter(n => n.status === 'healthy');
    if (healthyNodes.length === 0) return;
    
    // Check all jobs to see if they need teleporting due to node degradation or high lag
    for (const [node_id, node] of this.nodes.entries()) {
      if (node.status === 'degrading' || node.status === 'offline') {
        this.teleportNodeJobs(node_id);
        continue;
      }

      // Re-evaluate score and check if there's a much better node (Scheduler Optimization)
      const currentScore = node.score;
      healthyNodes.sort((a, b) => b.score - a.score);
      const bestTarget = healthyNodes[0];
      
      if (bestTarget && bestTarget.node_id !== node_id) {
        if (bestTarget.score > currentScore + TELEPORT_THRESHOLD) {
          console.log(`[Teleportation Scheduler] Better node found for jobs on ${node_id}. Initiating handoff.`);
          this.teleportNodeJobs(node_id, bestTarget);
        }
      }
    }
  }

  teleportNodeJobs(source_node_id, specific_target = null) {
    const sourceNode = this.nodes.get(source_node_id);
    if (!sourceNode || sourceNode.jobs.size === 0) return;

    for (const job_id of sourceNode.jobs) {
      const job = this.jobs.get(job_id);
      if (!job || job.lifecycle === 'completed') continue;

      // 1. Freeze Job on Node A
      job.lifecycle = 'teleported';
      
      // 2 & 3. In practice, we'd emit checkpoint and serialize here. 
      // We assume job.state is the most recent checkpoint.
      
      // 4. Transfer & 5. Replay 
      // We just mark it stalled/teleported and let scheduleJobs pick it up, 
      // or assign directly to specific_target.
      sourceNode.jobs.delete(job_id);
      
      // 6. Tombstone attempt
      const old_attempt = job.attempt_id;
      job.attempt_id = null; // will be regenerated on assign

      console.log(`[Atomic Handoff] Job ${job_id} teleported from ${source_node_id} (Attempt Tombstoned: ${old_attempt})`);
    }
    
    if (specific_target) {
      this.scheduleJobs(); // let the greedy scheduler assign to specific_target
    }
  }
}

module.exports = { Mothership };
