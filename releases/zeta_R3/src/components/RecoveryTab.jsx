import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, FileText, Play } from 'lucide-react';
import '../index.css';

const API_BASE = '/api';

export default function RecoveryTab() {
  const [cycles, setCycles] = useState([]);
  const [selectedCycleId, setSelectedCycleId] = useState(null);
  const [cycleDetails, setCycleDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forceLoading, setForceLoading] = useState(false);

  useEffect(() => {
    fetchCycles();
  }, []);

  useEffect(() => {
    if (selectedCycleId) {
      fetchCycleDetails(selectedCycleId);
    }
  }, [selectedCycleId]);

  const fetchCycles = async () => {
    try {
      const res = await fetch(`${API_BASE}/recovery/cycles`);
      if (res.ok) {
        const data = await res.json();
        // Sort descending by created_at
        const sorted = (data.cycles || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setCycles(sorted);
        if (sorted.length > 0 && !selectedCycleId) {
          setSelectedCycleId(sorted[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to fetch recovery cycles', e);
    }
  };

  const fetchCycleDetails = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/recovery/cycle/${id}/files`);
      if (res.ok) {
        const data = await res.json();
        setCycleDetails(data.files);
      } else {
        setCycleDetails(null);
      }
    } catch (e) {
      console.error('Failed to fetch cycle details', e);
      setCycleDetails(null);
    }
    setLoading(false);
  };

  const handleForceRecovery = async () => {
    setForceLoading(true);
    try {
      const res = await fetch(`${API_BASE}/recovery/force`, { method: 'POST' });
      if (res.ok) {
        await fetchCycles();
      }
    } catch (e) {
      console.error('Force recovery failed', e);
    }
    setForceLoading(false);
  };

  return (
    <div style={{ display: 'flex', height: '100%', gap: '1rem', padding: '1rem' }}>
      
      {/* Sidebar for cycles list */}
      <div className="glass-card side-panel" style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
        <div className="card-header">
          <div className="card-title">
            <ShieldAlert size={20} />
            Recovery Cycles
          </div>
        </div>

        <button 
          onClick={handleForceRecovery}
          disabled={forceLoading}
          style={{
            background: 'var(--color-blue)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '0.5rem',
            margin: '1rem 0',
            cursor: forceLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontWeight: 600
          }}
        >
          <Play size={16} />
          {forceLoading ? 'Running...' : 'Force Recovery Cycle'}
        </button>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {cycles.length === 0 && (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', marginTop: '2rem' }}>
              No recovery cycles found.
            </div>
          )}
          {cycles.map((cycle) => (
            <div 
              key={cycle.id}
              onClick={() => setSelectedCycleId(cycle.id)}
              className="list-item"
              style={{
                cursor: 'pointer',
                border: selectedCycleId === cycle.id ? '1px solid var(--color-blue)' : '1px solid transparent',
                background: selectedCycleId === cycle.id ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-1)'
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{cycle.id}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {new Date(cycle.created_at).toLocaleString()}
              </div>
              <div className="tag" style={{ marginTop: '0.5rem', display: 'inline-block' }}>
                {cycle.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content area for details */}
      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Activity className="live-pulse" size={48} color="var(--color-blue)" />
          </div>
        ) : !selectedCycleId || !cycleDetails ? (
          <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
            Select a recovery cycle to view details.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <div className="card-title" style={{ marginBottom: '1rem' }}>
                <FileText size={20} />
                Anomaly Report
              </div>
              <pre style={{ background: 'var(--bg-0)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '0.85rem', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                {cycleDetails.anomaly_report || 'No report found.'}
              </pre>
            </div>

            <div>
              <div className="card-title" style={{ marginBottom: '1rem' }}>
                <FileText size={20} />
                Actions Plan
              </div>
              <pre style={{ background: 'var(--bg-0)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '0.85rem', overflowX: 'auto' }}>
                {cycleDetails.actions_plan || 'No actions plan found.'}
              </pre>
            </div>

            <div>
              <div className="card-title" style={{ marginBottom: '1rem' }}>
                <FileText size={20} />
                Actions Log
              </div>
              <pre style={{ background: 'var(--bg-0)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '0.85rem', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                {cycleDetails.actions_log || 'No log found.'}
              </pre>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
