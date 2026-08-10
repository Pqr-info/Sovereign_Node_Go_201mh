import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, AlertCircle, PlayCircle, PlusCircle } from 'lucide-react';
import './NegotiationTab.css';

const NegotiationTab = ({ onSystemMessage }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSessions = async () => {
    try {
      const res = await fetch('http://localhost:4052/api/negotiation/sessions');
      const data = await res.json();
      if (data.status === 'OK') setSessions(data.sessions);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStartNegotiation = async () => {
    try {
      await fetch('http://localhost:4052/api/negotiation/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_id: 'mesh_architecture',
          participants: ['MAX', 'TED', 'ZETA', 'DeepSeek', 'Qwen']
        })
      });
      fetchSessions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMockResolve = async (id) => {
    try {
      await fetch('http://localhost:4052/api/negotiation/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          negotiation_id: id,
          status: 'converged',
          agreed_invariants: [
            "Context windows must be deterministic and stateless.",
            "All invariants must be compatible with Phase-28 writeback rules."
          ],
          implementation_notes: ["Qwen updates specs.", "MAX aligns reasoning."]
        })
      });
      fetchSessions();
      if (onSystemMessage) {
        onSystemMessage(`Negotiation ${id} has CONVERGED. A Sovereign Memory Organ proposal was automatically queued.`, ["negotiation", "consensus"]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="negotiation-tab-container">
      <div className="neg-header">
        <div>
          <h3><Users size={20} className="inline-icon" /> Multi-Agent Negotiation Engine</h3>
          <p className="neg-desc">Auditable decision-making layer. Forces deterministic convergence before canonical writes.</p>
        </div>
        <button className="btn-start" onClick={handleStartNegotiation}>
          <PlayCircle size={14} /> Start Session
        </button>
      </div>

      {error && <p className="error-text">Error: {error}</p>}

      <div className="neg-grid">
        {sessions.length === 0 ? (
          <p className="empty-text">No active or historical negotiations found.</p>
        ) : (
          sessions.map(s => (
            <div key={s.id} className="neg-card">
              <div className="neg-card-header">
                <span className="neg-id">{s.id}</span>
                <span className={`neg-status ${s.status === 'converged' ? 'status-green' : 'status-yellow'}`}>
                  {s.status === 'converged' ? <CheckCircle size={12}/> : <AlertCircle size={12}/>} {s.status.toUpperCase()}
                </span>
              </div>
              
              <div className="neg-card-body">
                <p><strong>Topic:</strong> {s.topic_id}</p>
                <p><strong>Participants:</strong> {s.participants.join(", ")}</p>
                <p className="neg-meta">Created: {new Date(s.created_at).toLocaleString()}</p>
              </div>

              {s.status === 'in_progress' && (
                <div className="neg-card-actions">
                  <button className="btn-resolve" onClick={() => handleMockResolve(s.id)}>
                    <CheckCircle size={14} /> Resolve & Converge
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NegotiationTab;
