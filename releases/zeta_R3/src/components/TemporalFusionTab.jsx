import React, { useState, useEffect } from 'react';
import './TemporalFusionTab.css';

const TemporalFusionTab = ({ onSystemMessage }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [geminiPattern, setGeminiPattern] = useState("turn_*.md");
  const [copilotPaths, setCopilotPaths] = useState("");

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4052/api/fusion/sessions');
      const data = await res.json();
      if (data.status === 'OK') {
        setSessions(data.sessions);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleCreateFusion = async () => {
    try {
      const payload = {
        geminifs: {
          pattern: geminiPattern,
        },
        copilotfs: {
          paths: copilotPaths.split(',').map(p => p.trim()).filter(Boolean)
        }
      };

      const res = await fetch('http://localhost:4052/api/fusion/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status === 'OK') {
        fetchSessions();
        alert(`Fusion Session Created: ${data.fusion_id}`);
      } else {
        alert("Fusion failed: " + data.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleInject = (synthesisPath, fusionId) => {
    onSystemMessage(
      `[COPILOT · ARCHITECT] Temporal fusion completed: ${fusionId}\nSynthesis mapped to canonical layer: ${synthesisPath}`, 
      ['constitution', 'never_drop']
    );
  };

  return (
    <div className="fusion-tab-container">
      <h3>⏳ GeminiFS ↔ CopilotFS Temporal Fusion Engine (Phase-29)</h3>
      <p className="fusion-desc">
        Fuse ephemeral GeminiFS conversational state with canonical CopilotFS artifacts to build architect-grade synthesis documents.
      </p>

      <div className="fusion-form">
        <div className="form-group">
          <label>GeminiFS Target Pattern</label>
          <input 
            type="text" 
            value={geminiPattern} 
            onChange={e => setGeminiPattern(e.target.value)} 
            placeholder="e.g. turn_00*.md" 
          />
        </div>
        <div className="form-group">
          <label>CopilotFS Paths (comma separated)</label>
          <input 
            type="text" 
            value={copilotPaths} 
            onChange={e => setCopilotPaths(e.target.value)} 
            placeholder="e.g. spec_phase23.md, chains/chain_1.md" 
          />
        </div>
        <button className="btn-primary" onClick={handleCreateFusion}>
          ⚡ Ignite Fusion Session
        </button>
      </div>

      <h4>Active Fusion Sessions</h4>
      {loading && sessions.length === 0 && <p>Loading sessions...</p>}
      {error && <p className="error-text">Error: {error}</p>}
      
      <div className="sessions-list">
        {sessions.length === 0 && !loading ? (
          <p>No fusion sessions exist yet.</p>
        ) : (
          sessions.map(sess => (
            <div key={sess.id} className="session-card">
              <h5>{sess.id}</h5>
              <p><strong>Created:</strong> {new Date(sess.created_at).toLocaleString()}</p>
              <p><strong>GeminiFS Select:</strong> {sess.geminifs_selection.pattern || "N/A"}</p>
              <p><strong>CopilotFS Select:</strong> {(sess.copilotfs_selection.paths || []).join(', ') || "N/A"}</p>
              <p><strong>Synthesis Anchor:</strong> {sess.synthesis_path}</p>
              <div className="session-actions">
                <button onClick={() => handleInject(sess.synthesis_path, sess.id)} className="btn-inject">
                  📥 Inject Synthesis into Context
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TemporalFusionTab;
