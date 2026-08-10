import React from "react";
import { ArbitrationDisputes } from "../engine/ArbitrationDisputes";
import { AlertCircle } from 'lucide-react';

export default function AgentDisputeButton({ agentId, lastGovernanceEvent }) {
  const onRaiseDispute = () => {
    if (!lastGovernanceEvent) {
      alert("No recent governance event to dispute.");
      return;
    }
    const dispute = {
      id: `disp-${agentId}-${Date.now()}`,
      type: "AGENT_DISPUTE",
      agentId,
      clusterId: null,
      governanceEventId: lastGovernanceEvent.id || lastGovernanceEvent.event_id,
      reason: "Agent computationally disputes recent governance action",
      timestamp: Date.now(),
      status: "OPEN",
      requestedOutcome: "MODIFY",
      context: {}
    };
    ArbitrationDisputes.create(dispute);
    alert(`Dispute raised for event ${dispute.governanceEventId}`);
  };

  return (
    <button 
      onClick={onRaiseDispute}
      style={{
        background: 'rgba(239, 68, 68, 0.1)',
        color: 'var(--color-red)',
        border: '1px solid var(--color-red)',
        padding: '0.25rem 0.5rem',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        marginTop: '0.5rem'
      }}
    >
      <AlertCircle size={14} /> Raise Dispute
    </button>
  );
}
