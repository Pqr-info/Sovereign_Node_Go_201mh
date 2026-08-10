import { ArbitrationDisputes } from "./ArbitrationDisputes";
import { GovernanceRules } from "./GovernanceRules";
import { GovernanceTelemetry } from "./GovernanceTelemetry";

export const ArbitrationEngine = {
  evaluate(disputeId) {
    const dispute = ArbitrationDisputes.getById(disputeId);
    if (!dispute) return null;

    const relatedEvent = GovernanceTelemetry.events.find(
      evt => (evt.event_id || evt.id) === dispute.governanceEventId
    );

    const rule = relatedEvent && relatedEvent.ruleId
      ? GovernanceRules.getById(relatedEvent.ruleId)
      : null;

    const judgment = this.computeJudgment(dispute, relatedEvent, rule);

    return judgment;
  },

  computeJudgment(dispute, event, rule) {
    if (!event) {
      return {
        outcome: "ESCALATE",
        reason: "Missing governance event context"
      };
    }

    if (!rule) {
      return {
        outcome: "ESCALATE",
        reason: "Event triggered without an identifiable rule; requires operator arbitration."
      };
    }

    const constraints = rule.constraints || {};
    if (!constraints.reversible) {
      return {
        outcome: "MODIFY",
        reason: "Non-reversible rule applied; modifying to mitigate irreversible impacts."
      };
    }

    // Default: uphold
    return {
      outcome: "UPHOLD",
      reason: "Governance rule and action were consistent with constitutional constraints."
    };
  }
};
