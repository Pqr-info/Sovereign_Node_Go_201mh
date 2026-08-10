export function detectDeadEnd(agentState) {
  return agentState.isStalled ||
         agentState.errorCount > 3 ||
         agentState.contextDepth > 48;
}
