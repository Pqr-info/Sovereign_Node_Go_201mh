import { ArbitrationDisputes } from "./ArbitrationDisputes";
import { ArbitrationJudgments } from "./ArbitrationJudgments";
import { GovernanceTelemetry } from "./GovernanceTelemetry";

export function applyJudgment(disputeId, judgment, operatorId = null) {
  const dispute = ArbitrationDisputes.getById(disputeId);
  if (!dispute) return { ok: false, error: "Dispute not found" };

  // Update dispute status
  ArbitrationDisputes.update(disputeId, {
    status: "RESOLVED",
    resolvedAt: Date.now()
  });

  const judgmentRecord = {
    ...judgment,
    id: `judg-${disputeId}-${Date.now()}`,
    disputeId,
    timestamp: Date.now(),
    operatorId
  };

  ArbitrationJudgments.record(judgmentRecord);

  // Emit telemetry
  GovernanceTelemetry.emit({
    id: `gov-arb-${disputeId}-${Date.now()}`,
    type: "GOV_ARBITRATION_JUDGMENT",
    agentId: dispute.agentId || null,
    clusterId: dispute.clusterId || null,
    timestamp: Date.now(),
    reason: `Arbitration outcome: ${judgment.outcome} - ${judgment.reason}`,
    ruleId: judgment.ruleId || null,
    reversible: true
  });

  // Future integration: Hook into governance engine to apply actual changes like restoring trust.

  return { ok: true, judgment: judgmentRecord };
}
