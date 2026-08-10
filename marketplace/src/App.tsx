import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import MintAnchor from './pages/MintAnchor'

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mint" element={<MintAnchor />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
