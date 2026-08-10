import React from 'react'
import ReactDOM from 'react-dom/client'

const App = () => (
  <div style={{ background: '#000', color: '#fff', fontFamily: 'Inter, sans-serif', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
      <h1>SpaceBook 5D</h1>
      <p>React SPA prototype. Connected to Zeta.mh (Threadripper / 128GB RAM)</p>
    </div>
  </div>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
