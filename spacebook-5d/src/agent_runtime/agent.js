import { detectDeadEnd } from './dead_end_detector.js';
import { requestFallbackPlan } from './fallback_client.js';

export async function recover(agentState) {
  if (!detectDeadEnd(agentState)) {
    console.log("No dead-end detected for agent:", agentState.ticketId);
    return false;
  }

  console.log("Dead-end detected! Triggering ADER Fallback Contract...");
  const { ticketId, x, y, z } = agentState;

  const plan = await requestFallbackPlan(ticketId, x, y, z);

  agentState.resolutionPaths = plan.resolutionPaths;
  agentState.remediationSteps = plan.bestSuccessPath?.steps || [];

  agentState.status = "recovering";
  console.log("Recovery initiated successfully with ADER.");
  return true;
}
