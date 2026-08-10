import React, { useState, useEffect } from 'react';
import { Eye, Clock, Activity, Settings, RefreshCw, Layers, Zap } from 'lucide-react';
import './ArchitectLoopTab.css';

const ArchitectLoopTab = ({ onSystemMessage }) => {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCycles = async () => {
    try {
      const res = await fetch('http://localhost:4052/api/architect/cycles');
      const data = await res.json();
      if (data.status === 'OK') {
        // Sort newest first
        const sorted = data.cycles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setCycles(sorted);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCycles();
    const interval = setInterval(fetchCycles, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerCycle = async () => {
    try {
      await fetch('http://localhost:4052/api/architect/cycle/trigger', { method: 'POST' });
      fetchCycles();
      if (onSystemMessage) {
        onSystemMessage(`Architect Temporal Cycle executed. Structural scan and deterministic triggers generated.`, ["architect_loop", "constitution"]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="architect-tab-container">
      <div className="atrl-header">
        <div>
          <h3><Eye size={20} className="inline-icon" /> Architect-Grade Temporal Reasoning Loop</h3>
          <p className="atrl-desc">Autonomic nervous system. Periodically scans all mesh organs and generates deterministic operational triggers.</p>
        </div>
        <button className="btn-trigger" onClick={handleTriggerCycle}>
          <RefreshCw size={14} /> Force Cycle
        </button>
      </div>

      {error && <p className="error-text">Error: {error}</p>}

      <div className="atrl-grid">
        {cycles.length === 0 ? (
          <p className="empty-text">No temporal cycles have run yet. Wait for interval or force a cycle.</p>
        ) : (
          cycles.map(cycle => (
            <div key={cycle.id} className="cycle-card">
              <div className="cycle-header">
                <span className="cycle-id">{cycle.id}</span>
                <span className="cycle-status"><Activity size={12}/> {cycle.status.toUpperCase()}</span>
              </div>
              <p className="cycle-meta">Executed: {new Date(cycle.created_at).toLocaleString()}</p>
              
              <div className="cycle-report">
                <h4><FileTextIcon size={14}/> Scan Report</h4>
                <pre>{cycle.scan_report || "No scan report available."}</pre>
              </div>

              <div className="cycle-actions">
                <button className="btn-action fusion"><Layers size={14} /> Ignite Fusion Sessions</button>
                <button className="btn-action negotiation"><UsersIcon size={14} /> Start Negotiations</button>
                <button className="btn-action memory"><Settings size={14} /> Review Proposals</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Quick helper icons since I missed importing a couple
const FileTextIcon = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const UsersIcon = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;

export default ArchitectLoopTab;
