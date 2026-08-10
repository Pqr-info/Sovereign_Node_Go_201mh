import React, { useState, useEffect } from 'react';
import { useDrift } from './DriftContext';
import { Activity, Network, Zap } from 'lucide-react';
import './glass.css';

const NPUStatusDashboard = () => {
  const { driftLevel, isDriftActive } = useDrift();
  const [tflops, setTflops] = useState(1450);
  const [nodes, setNodes] = useState(1284);
  const [latency, setLatency] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setTflops(prev => prev + Math.floor((Math.random() - 0.3) * 50));
      setNodes(prev => prev + Math.floor((Math.random() - 0.4) * 3));
      setLatency(prev => Math.max(1, prev + Math.floor((Math.random() - 0.5) * 5)));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const statBlockStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  };

  const labelStyle = {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const valStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--accent-cyan)'
  };

  return (
    <div className={`glass-panel ${isDriftActive ? 'drift-active' : ''}`} style={{ padding: '24px', display: 'flex', justifyContent: 'space-around', gap: '32px', margin: '40px auto', maxWidth: '600px' }}>
      <div className="glass-border"></div>
      <div className="glass-glow"></div>
      
      <div style={statBlockStyle}>
        <Activity size={24} color="var(--accent-purple)" />
        <span style={labelStyle}>Compute Power</span>
        <span className="mono" style={valStyle}>{tflops.toLocaleString()} TFLOPS</span>
      </div>

      <div style={statBlockStyle}>
        <Network size={24} color="var(--accent-cyan)" />
        <span style={labelStyle}>Active Nodes</span>
        <span className="mono" style={valStyle}>{nodes.toLocaleString()}</span>
      </div>

      <div style={statBlockStyle}>
        <Zap size={24} color={isDriftActive ? "var(--accent-magenta)" : "var(--accent-cyan)"} />
        <span style={labelStyle}>Temporal Drift</span>
        <span className="mono" style={{...valStyle, color: isDriftActive ? "var(--accent-magenta)" : "var(--accent-cyan)"}}>
          Φ {driftLevel.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default NPUStatusDashboard;
