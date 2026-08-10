import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/atlas5D/',
  plugins: [react()],
  server: {
    port: 9080,
    host: '0.0.0.0',
    proxy: {
      '/sos': 'http://127.0.0.1:4052',
      '/lpv': 'http://127.0.0.1:4050',
      '/api/mev': 'http://127.0.0.1:4052',
      '/api/marketplace': 'http://127.0.0.1:4052',
      '/api/ledger': 'http://127.0.0.1:4052',
      '/api/tickets': 'http://127.0.0.1:4052',
      '/api/credentials': 'http://127.0.0.1:4052',
      '/api/mesh/auditor': 'http://127.0.0.1:4052',
      '/api/l6': 'http://127.0.0.1:4052',
      '/api/governance': 'http://127.0.0.1:4052',
      '/api': 'http://127.0.0.1:4052',
      '/antigravity': 'http://127.0.0.1:4052',
      '/v1': 'http://127.0.0.1:8200'
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        portal: resolve(__dirname, 'portal.html'),
        swarm: resolve(__dirname, 'swarm/index.html')
      }
    }
  }
})
