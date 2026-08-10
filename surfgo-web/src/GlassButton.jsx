import React from 'react';
import { useDrift } from './DriftContext';
import './glass.css';

const GlassButton = ({ children, onClick, variant = 'primary' }) => {
  const { isDriftActive } = useDrift();

  const buttonStyle = {
    padding: '12px 24px',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: 'transparent',
    outline: 'none',
  };

  return (
    <button 
      className={`glass-panel ${isDriftActive ? 'drift-active' : ''}`} 
      style={buttonStyle} 
      onClick={onClick}
    >
      <div className="glass-border"></div>
      <div className="glass-glow"></div>
      <span style={{ zIndex: 10 }}>{children}</span>
    </button>
  );
};

export default GlassButton;
