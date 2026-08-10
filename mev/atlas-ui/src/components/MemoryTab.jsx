import React, { useState, useEffect } from 'react';
import { Database, Check, X, FileText, PlusCircle } from 'lucide-react';
import './MemoryTab.css';

const MemoryTab = ({ onSystemMessage }) => {
  const [topics, setTopics] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMemoryState = async () => {
    try {
      const [topicsRes, propsRes] = await Promise.all([
        fetch('http://localhost:4052/api/memory/topics'),
        fetch('http://localhost:4052/api/memory/proposals')
      ]);
      const topicsData = await topicsRes.json();
      const propsData = await propsRes.json();
      
      if (topicsData.status === 'OK') setTopics(topicsData.topics);
      if (propsData.status === 'OK') setProposals(propsData.proposals);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMemoryState();
    const interval = setInterval(fetchMemoryState, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id) => {
    try {
      await fetch('http://localhost:4052/api/memory/proposals/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal_id: id, approver: 'COPILOT_ARCHITECT', role: 'governance' })
      });
      fetchMemoryState();
      if (onSystemMessage) {
        onSystemMessage(`Memory proposal ${id} has been APPROVED and merged into the Sovereign Memory Organ.`, ["memory", "governance", "never_drop"]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await fetch('http://localhost:4052/api/memory/proposals/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal_id: id, approver: 'COPILOT_ARCHITECT', reason: 'Rejected by UI Governance' })
      });
      fetchMemoryState();
      if (onSystemMessage) {
        onSystemMessage(`Memory proposal ${id} has been REJECTED.`, ["memory", "governance"]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // UI mock for testing
  const createMockProposal = async () => {
    try {
      await fetch('http://localhost:4052/api/memory/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin_node: 'MAX',
          target_topic_id: 'mesh_architecture',
          change_type: 'add_or_update',
          patch: [{ ReplacementContent: '# Sovereign-27 Mesh Architecture\n\n## 1. Canonical Summary\nThe mesh is a highly decoupled, deterministic multi-agent OS.\n' }],
          rationale: 'Initial architectural invariants distilled by MAX.'
        })
      });
      fetchMemoryState();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="memory-tab-container">
      <div className="memory-header">
        <div>
          <h3><Database size={20} className="inline-icon" /> Sovereign Memory Organ</h3>
          <p className="memory-desc">Curated, long-term knowledge substrate. All writes are governed by multi-agent consensus.</p>
        </div>
        <button className="btn-mock" onClick={createMockProposal}>
          <PlusCircle size={14} /> Test Proposal
        </button>
      </div>

      {error && <p className="error-text">Error: {error}</p>}

      <div className="memory-split">
        <div className="memory-topics">
          <h4>Durable Topics ({topics.length})</h4>
          {topics.length === 0 ? (
             <p className="empty-text">No memory topics found in index.</p>
          ) : (
            <div className="topic-grid">
              {topics.map(t => (
                <div key={t.id} className="topic-card">
                  <h5><FileText size={14} /> {t.title}</h5>
                  <div className="topic-tags">
                    {t.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                  </div>
                  <span className="topic-meta">Updated: {new Date(t.last_updated_at).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="memory-proposals">
          <h4>Pending Memory Proposals ({proposals.length})</h4>
          {proposals.length === 0 ? (
             <p className="empty-text">Governance queue is empty.</p>
          ) : (
            <div className="proposal-list">
              {proposals.map(p => (
                <div key={p.id} className="memory-proposal-card">
                  <div className="mp-header">
                    <span className="mp-id">{p.id}</span>
                    <span className="mp-node">{p.origin_node}</span>
                  </div>
                  <div className="mp-body">
                    <p><strong>Topic:</strong> {p.target_topic_id}</p>
                    <p><strong>Rationale:</strong> {p.rationale}</p>
                  </div>
                  <div className="mp-actions">
                    <button className="btn-approve" onClick={() => handleApprove(p.id)}><Check size={14}/> Approve</button>
                    <button className="btn-reject" onClick={() => handleReject(p.id)}><X size={14}/> Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryTab;
