import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { SubstrateProvider } from './context/SubstrateContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SubstrateProvider>
        <App />
      </SubstrateProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
