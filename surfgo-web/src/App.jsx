import React from 'react';
import { DriftProvider } from './DriftContext';
import HeroSection from './HeroSection';
import NPUStatusDashboard from './NPUStatusDashboard';
import GlassButton from './GlassButton';
import { Rocket } from 'lucide-react';
import './index.css';

const App = () => {
  return (
    <DriftProvider>
      <div className="app-container">
        <div className="background-grid"></div>
        
        <header style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'Space Grotesk' }}>
            <span style={{ color: 'var(--accent-cyan)' }}>surf</span>
            <span style={{ color: '#fff' }}>go.net</span>
          </div>
          <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Nodes</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Metrics</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Docs</a>
            <GlassButton onClick={() => alert('Initiating Gateway...')}>
              Connect Wallet
            </GlassButton>
          </nav>
        </header>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <HeroSection />
          <NPUStatusDashboard />
          
          <div style={{ marginTop: '20px' }}>
            <GlassButton onClick={() => alert('Starting Initialization Sequence')}>
              <Rocket size={18} /> Initialize Substrate
            </GlassButton>
          </div>
        </main>

        <footer style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          © 2026 SpaceBook 5D. Sovereign Mesh Architecture.
        </footer>
      </div>
    </DriftProvider>
  );
};

export default App;
