import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Atlas Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100vw',
          background: 'var(--bg-0)',
          color: '#f8fafc',
          padding: '2rem',
          fontFamily: 'monospace'
        }}>
          <div style={{
            background: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid #dc2626',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '800px',
            width: '100%',
            boxShadow: '0 10px 40px rgba(220, 38, 38, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444', marginBottom: '1.5rem' }}>
              <AlertTriangle size={32} />
              <h1 style={{ margin: 0, fontSize: '1.5rem' }}>UI Degraded State Detected</h1>
            </div>
            
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
              The Atlas Dashboard encountered an unhandled rendering error. This failover renderer has engaged to prevent a complete application crash.
            </p>

            <div style={{ background: '#000', padding: '1rem', borderRadius: '8px', overflowX: 'auto', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#ef4444', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{this.state.error?.toString()}</h3>
              <pre style={{ color: '#38bdf8', fontSize: '0.8rem', margin: 0 }}>
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>

            <button
              onClick={() => window.location.reload()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#dc2626',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              <RefreshCw size={16} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
