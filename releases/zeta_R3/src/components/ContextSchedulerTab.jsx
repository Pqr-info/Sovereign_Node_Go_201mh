import React, { useState, useEffect } from 'react';
import './ContextSchedulerTab.css';

const ContextSchedulerTab = () => {
  const [windows, setWindows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(new Date().getTime());

  const fetchWindows = async () => {
    try {
      const res = await fetch('http://localhost:4052/api/scheduler/windows');
      const data = await res.json();
      if (data.status === 'OK') {
        setWindows(data.windows);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWindows();
    const interval = setInterval(fetchWindows, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date().getTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  const agents = ["MAX", "TED", "ZETA", "DeepSeek", "Qwen"];

  return (
    <div className="scheduler-tab-container">
      <h3>🌐 Mesh Context Scheduler (Phase-30)</h3>
      <p className="scheduler-desc">
        Distributed cognition matrix. This panel displays the active temporal context windows routed to each agent.
      </p>

      {error && <p className="error-text">Error: {error}</p>}
      
      <div className="windows-grid">
        {agents.map(agent => {
          const win = windows[agent];
          if (!win) {
            return (
              <div key={agent} className="window-card empty">
                <h4>{agent}</h4>
                <p>No active context window.</p>
              </div>
            );
          }

          const expiresAt = new Date(win.expires_at).getTime();
          const msLeft = expiresAt - now;
          const isExpired = msLeft <= 0;

          const mins = Math.max(0, Math.floor(msLeft / 60000));
          const secs = Math.max(0, Math.floor((msLeft % 60000) / 1000));
          const timeStr = isExpired ? "EXPIRED" : `${mins}m ${secs}s`;

          return (
            <div key={agent} className={`window-card ${isExpired ? 'expired' : ''}`}>
              <div className="window-header">
                <h4>{agent}</h4>
                <span className={`countdown ${isExpired ? 'text-red' : 'text-green'}`}>{timeStr}</span>
              </div>
              <div className="window-meta">
                <span><strong>Profile:</strong> {win.decay_profile}</span>
                <span><strong>Window ID:</strong> {win.window_id}</span>
              </div>
              
              <div className="sources-list">
                <h5>GeminiFS ({win.sources.geminifs.length})</h5>
                <ul>
                  {win.sources.geminifs.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
                
                <h5>CopilotFS ({win.sources.copilotfs.length})</h5>
                <ul>
                  {win.sources.copilotfs.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
                
                <h5>Fusion ({win.sources.fusion.length})</h5>
                <ul>
                  {win.sources.fusion.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContextSchedulerTab;
