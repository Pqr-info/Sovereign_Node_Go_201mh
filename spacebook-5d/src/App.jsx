import { useState, useEffect } from 'react';
import { Radar, Hexagon, ShieldAlert, Zap, Activity, Users, MapPin, Orbit } from 'lucide-react';
import './index.css';

function App() {
  const [mcf, setMcf] = useState(0);
  const [activeNodes, setActiveNodes] = useState(0);
  const [flux, setFlux] = useState(0);
  const [ati, setAti] = useState(0);
  const [feed, setFeed] = useState([
    { id: 1, type: 'ALERT', text: 'Solar Portal detected in sector 7G.', time: '2m ago' },
    { id: 2, type: 'NODE', text: 'Astral Node synthesized by @zeta_warden', time: '15m ago' }
  ]);
  const [agentId] = useState(`agent_${Math.floor(Math.random() * 10000)}`);
  const [coords] = useState({ lat: 40.7128 + (Math.random() * 0.01), lng: -74.0060 + (Math.random() * 0.01) });
  
  // Heartbeat to mock backend (L3 Redis Memorystore)
  useEffect(() => {
    const heartbeat = async () => {
      try {
        const res = await fetch('http://localhost:4075/api/mesh/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            agentId, 
            lat: coords.lat, 
            lng: coords.lng,
            phaseFrequency: 432.0 + Math.random()
          })
        });
        if (res.ok) fetchTopology();
      } catch (e) {
        console.error('L3 Memorystore unreachable', e);
      }
    };
    
    heartbeat();
    const iv = setInterval(heartbeat, 5000);
    return () => clearInterval(iv);
  }, [agentId]);

  const fetchTopology = async () => {
    try {
      const res = await fetch('http://localhost:4075/api/mesh/topology');
      if (res.ok) {
        const data = await res.json();
        setActiveNodes(data.active_nodes);
        setMcf(data.mcf);
      }
    } catch (e) {
      console.error('Topology fetch failed', e);
    }
  };

  const handleExtract = async () => {
    try {
      const res = await fetch('http://localhost:4075/api/mesh/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          targetAnomaly: 'Solar Portal - Alpha',
          frequencyMatch: 0.95,
          mcfAtTime: mcf
        })
      });
      const data = await res.json();
      if (data.ok) {
        setFlux(f => f + 10);
        setAti(data.ati);
        addFeedItem('HARVEST', `Extracted 10 Starlight Flux. ATI shifted to ${data.ati}. Block: ${data.l6_receipt.blockId.substring(0,10)}...`);
      } else {
        setAti(data.ati);
        addFeedItem('DECOHERENCE', data.message);
      }
    } catch(e) {
      addFeedItem('ERROR', 'Extraction failed. L3/L6 sync error.');
    }
  };

  const handleSpawn = async (type) => {
    try {
      const res = await fetch('http://localhost:4075/api/admin/spawn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anomalyType: type, lat: coords.lat, lng: coords.lng, durationMs: 120000 })
      });
      const data = await res.json();
      if (data.ok) addFeedItem('SPAWN', `Warden spawned ${type}!`);
    } catch (e) {
      addFeedItem('ERROR', 'Spawn failed.');
    }
  };

  const handleSynthesize = async () => {
    try {
      const res = await fetch('http://localhost:4075/api/mesh/synthesize-node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, lat: coords.lat, lng: coords.lng, name: 'Local Nexus', fluxSpent: 100, currentMcf: mcf })
      });
      const data = await res.json();
      if (data.ok) {
        setFlux(f => f - 100);
        setAti(data.ati);
        addFeedItem('NODE', `Astral Node Stabilized! ATI: ${data.ati}`);
      } else {
        setAti(data.ati);
        addFeedItem('RIFT', data.message);
      }
    } catch (e) {
      addFeedItem('ERROR', 'Synthesis failed.');
    }
  };

  const handleDiscover = async () => {
    try {
      const res = await fetch('http://localhost:4075/api/mesh/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, targetSector: 'Alpha', resonanceFrequency: 1.5 })
      });
      const data = await res.json();
      if (data.ok) {
        setAti(data.ati);
        addFeedItem('DISCOVERY', `Hidden dimensional layer uncovered. ATI: ${data.ati}`);
      } else {
        addFeedItem('INFO', data.message);
      }
    } catch (e) {
      addFeedItem('ERROR', 'Discovery failed.');
    }
  };

  const handleSovereignSync = async () => {
    try {
      const res = await fetch('http://localhost:4075/api/mesh/sovereign-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, consensusNodes: 3, mcfAtTime: mcf })
      });
      const data = await res.json();
      if (data.ok) {
        setAti(data.ati);
        addFeedItem('TRANSCEND', `Sovereign Sync Successful! Agent transcended.`);
      } else {
        setAti(data.ati);
        addFeedItem('REJECTED', data.message);
      }
    } catch (e) {
      addFeedItem('ERROR', 'Sync failed.');
    }
  };

  const addFeedItem = (type, text) => {
    setFeed(prev => [{ id: Date.now(), type, text, time: 'Just now' }, ...prev]);
  };

  return (
    <>
      <header className="app-header">
        <div className="logo">
          <Hexagon size={28} />
          <span>AETHERIA 5D</span>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '15px' }}>
            <Activity size={20} color="var(--text-primary)" />
            <span style={{ fontFamily: 'monospace', fontSize: '18px', color: 'var(--text-primary)' }}>ATI: {ati}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={20} color="var(--accent-color)" />
            <span style={{ fontFamily: 'monospace', fontSize: '18px', color: 'var(--accent-color)' }}>{flux} FLUX</span>
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>ID: {agentId}</div>
        </div>
      </header>

      <main className="main-container">
        {/* Left Column: Admin Control Panel */}
        <div className="glass-panel admin-section fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <ShieldAlert size={20} />
            Constellation Warden
          </h2>
          
          <div className="stat-row">
            <span>Active Zone</span>
            <span className="stat-value">Central Park</span>
          </div>
          <div className="stat-row">
            <span>Safe Radius</span>
            <span className="stat-value">1.2 km</span>
          </div>
          <div className="stat-row">
            <span>Hazard Exclusion</span>
            <span className="stat-value" style={{ color: '#ff4d4d' }}>ACTIVE</span>
          </div>

          <h3 style={{ marginTop: '24px', marginBottom: '16px', fontSize: '16px', color: 'var(--text-secondary)' }}>Event Orchestrator</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn-primary" onClick={() => handleSpawn('Solar Portal')}>
              Trigger Solar Portal
            </button>
            <button className="btn-primary" onClick={() => handleSpawn('Nebula Swarm')}>
              Spawn Nebula Swarm
            </button>
          </div>
        </div>

        {/* Center Column: Radar & Action */}
        <div className="glass-panel feed-section fade-in" style={{ animationDelay: '0.2s', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: '400px', marginBottom: '30px' }}>
            <div className="radar-container">
              <div className="radar-sweep"></div>
              {/* Fake blips */}
              <div className="radar-blip" style={{ top: '30%', left: '40%' }}></div>
              <div className="radar-blip" style={{ top: '60%', left: '70%', animationDelay: '0.5s' }}></div>
              <div className="radar-blip" style={{ top: '75%', left: '25%', animationDelay: '1s' }}></div>
              
              <Orbit size={48} color="rgba(102, 252, 241, 0.3)" style={{ position: 'absolute' }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <button className="btn-primary" style={{ padding: '16px', fontSize: '18px' }} onClick={handleExtract}>
              Initiate Frequency Extraction
            </button>
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button className="btn-primary" style={{ flex: 1, padding: '12px' }} onClick={handleSynthesize} disabled={flux < 100}>
                Synthesize Node (100 Flux)
              </button>
              <button className="btn-primary" style={{ flex: 1, padding: '12px' }} onClick={handleDiscover}>
                Dynamic Discovery
              </button>
            </div>
            <button className="btn-primary" style={{ padding: '12px', background: 'rgba(255, 215, 0, 0.1)', borderColor: '#ffd700', color: '#ffd700' }} onClick={handleSovereignSync}>
              Sovereign Orchestration
            </button>
          </div>

          <div style={{ width: '100%', marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '8px' }}>Live Mesh Feed</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
              {feed.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '12px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <div style={{ color: 'var(--accent-color)', fontFamily: 'monospace' }}>[{item.type}]</div>
                  <div style={{ flex: 1 }}>{item.text}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{item.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Telemetry & L6 Consensus */}
        <div className="glass-panel admin-section fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Activity size={20} />
            P2P Mesh Topology
          </h2>

          <div className="stat-row">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={16} /> Active Nodes (BLE/WiFi)</span>
            <span className="stat-value">{activeNodes}</span>
          </div>
          <div className="stat-row">
            <span>Mesh Cohesion (MCF)</span>
            <span className="stat-value">{(mcf * 100).toFixed(0)}%</span>
          </div>
          
          <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(102, 252, 241, 0.05)', borderRadius: '8px', border: '1px solid var(--panel-border)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>L6 Cryptographic Spine (Substrate 27)</div>
            <div style={{ fontSize: '10px', fontFamily: 'monospace', wordBreak: 'break-all', color: 'var(--accent-color)' }}>
              STATUS: SYNCED<br/>
              LATEST_ROOT: 0xe400f793a6d38b86a58d6c...
            </div>
          </div>

          <h3 style={{ marginTop: '30px', marginBottom: '16px', fontSize: '16px', color: 'var(--text-secondary)' }}>Nearby Astral Nodes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MapPin size={24} color="var(--accent-color)" />
              <div>
                <div style={{ fontWeight: 600 }}>Pioneer Square Node</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Yield: +2 Flux/hr</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
