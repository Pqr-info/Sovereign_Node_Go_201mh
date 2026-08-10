import React, { useState, useEffect } from "react";
import { ArbitrationDisputes } from "../engine/ArbitrationDisputes";
import { ArbitrationJudgments } from "../engine/ArbitrationJudgments";
import { ArbitrationEngine } from "../engine/ArbitrationEngine";
import { applyJudgment } from "../engine/ArbitrationApplication";
import { Gavel, AlertCircle, CheckCircle } from 'lucide-react';

export default function ArbitrationPanel({ operatorId, onClose }) {
  const [selectedDisputeId, setSelectedDisputeId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const disputes = ArbitrationDisputes.getAll();
  const judgments = ArbitrationJudgments.getAll();

  // Polling to catch new disputes
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger(t => t + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const onEvaluate = () => {
    if (!selectedDisputeId) return;
    const judgment = ArbitrationEngine.evaluate(selectedDisputeId);
    if (!judgment) return;
    applyJudgment(selectedDisputeId, judgment, operatorId);
    setRefreshTrigger(t => t + 1);
    setSelectedDisputeId(null);
  };

  return (
    <div className="arbitration-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-purple)' }}>
          <Gavel size={20} /> <span style={{ fontWeight: 600 }}>Sovereign Arbitration</span>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>×</button>
      </div>

      <div className="panel-section" style={{ flex: 1, padding: '1rem', overflowY: 'auto', borderBottom: '1px solid var(--border)' }}>
        <div className="section-title" style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Open Disputes</div>
        <div className="dispute-list">
          {disputes.filter(d => d.status !== 'RESOLVED').map(d => (
            <div
              key={d.id}
              className={`dispute-row ${d.status.toLowerCase()}`}
              onClick={() => setSelectedDisputeId(d.id)}
              style={{
                background: selectedDisputeId === d.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                borderLeft: selectedDisputeId === d.id ? '3px solid var(--color-purple)' : '3px solid transparent'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', width: '100%' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                   <span style={{ fontWeight: 'bold' }}>{d.agentId || d.clusterId}</span>
                   <span className={`tag ${d.status === 'OPEN' ? 'open' : 'resolved'}`}>{d.status}</span>
                 </div>
                 <span style={{ color: 'var(--text-secondary)' }}>{d.reason}</span>
              </div>
            </div>
          ))}
          {disputes.filter(d => d.status !== 'RESOLVED').length === 0 && (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>No open disputes.</div>
          )}
        </div>
        
        <div style={{ marginTop: '1rem' }}>
          <button 
            onClick={onEvaluate} 
            disabled={!selectedDisputeId}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              background: selectedDisputeId ? 'rgba(168, 85, 247, 0.2)' : 'var(--bg-1)', 
              color: selectedDisputeId ? 'var(--color-purple)' : 'var(--text-secondary)', 
              border: `1px solid ${selectedDisputeId ? 'var(--color-purple)' : 'var(--border)'}`, 
              borderRadius: '4px', 
              cursor: selectedDisputeId ? 'pointer' : 'not-allowed',
              fontWeight: 600
            }}
          >
            Evaluate & Apply Judgment
          </button>
        </div>
      </div>

      <div className="panel-section" style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
        <div className="section-title" style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Recent Judgments</div>
        <div className="judgment-list">
          {judgments.slice(-10).reverse().map(j => {
             let color = 'var(--text-primary)';
             if (j.outcome === 'UPHOLD') color = 'var(--color-green)';
             if (j.outcome === 'MODIFY' || j.outcome === 'OVERTURN') color = 'var(--color-yellow)';
             if (j.outcome === 'ESCALATE') color = 'var(--color-red)';
             
             return (
              <div key={j.id} className="judgment-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontWeight: 'bold', color }}>{j.outcome}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{new Date(j.timestamp).toLocaleTimeString()}</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {j.reason}
                </div>
              </div>
             )
          })}
          {judgments.length === 0 && (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>No judgments rendered yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
