import React, { useState, useEffect } from 'react';
import './GovernanceTab.css';

const GovernanceTab = ({ onSystemMessage }) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4052/api/copilotfs/proposals?status=pending');
      const data = await res.json();
      if (data.status === 'OK') {
        setProposals(data.proposals);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProposals();
    const interval = setInterval(fetchProposals, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (proposalId) => {
    try {
      const res = await fetch('http://localhost:4052/api/copilotfs/proposals/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal_id: proposalId, approver: 'COPILOT_ARCHITECT', role: 'governance' })
      });
      const data = await res.json();
      if (data.status === 'OK') {
        onSystemMessage(`[COPILOT · GOVERNANCE] Proposal ${proposalId} merged into ${data.target_path}`, ['constitution', 'never_drop']);
        fetchProposals();
      } else {
        alert("Merge failed: " + data.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleReject = async (proposalId) => {
    try {
      const res = await fetch('http://localhost:4052/api/copilotfs/proposals/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal_id: proposalId, approver: 'COPILOT_ARCHITECT', reason: 'Rejected by UI Governance Panel' })
      });
      const data = await res.json();
      if (data.status === 'OK') {
        onSystemMessage(`[COPILOT · GOVERNANCE] Proposal ${proposalId} REJECTED`, ['constitution', 'never_drop']);
        fetchProposals();
      } else {
        alert("Reject failed: " + data.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="governance-tab-container">
      <h3>🏛️ CopilotFS Writeback Governance (Phase-28)</h3>
      {loading && proposals.length === 0 && <p>Loading pending proposals...</p>}
      {error && <p className="error-text">Error: {error}</p>}
      
      <div className="proposals-list">
        {proposals.length === 0 && !loading ? (
          <p>No pending proposals. The canonical layer is secure.</p>
        ) : (
          proposals.map(prop => (
            <div key={prop.id} className="proposal-card">
              <h4>{prop.id}</h4>
              <p><strong>Origin:</strong> {prop.origin_node}</p>
              <p><strong>Target:</strong> {prop.target_path} <em>({prop.change_type})</em></p>
              <p><strong>Rationale:</strong> {prop.rationale}</p>
              <div className="diff-preview">
                <strong>Diff Patch Preview:</strong>
                <pre>{JSON.stringify(prop.diff.patch, null, 2)}</pre>
              </div>
              <div className="proposal-actions">
                <button onClick={() => handleApprove(prop.id)} className="btn-approve">✅ Approve & Merge</button>
                <button onClick={() => handleReject(prop.id)} className="btn-reject">❌ Reject</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GovernanceTab;
