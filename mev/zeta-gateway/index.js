const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 80;

app.use(cors());
app.use(morgan('combined'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'zeta-gateway' });
});

// Proxy /atlas5D to the local Atlas UI (assuming it's running on port 9080 via vite, or 5173 depending on config)
// If we want to serve the built assets, we can use express.static, but since we deployed it to Cloudflare,
// the user might still want to access it locally. Let's proxy to the vite dev server (port 5173 or 9080).
// Since the dev server crashed earlier and I don't know the port, let's proxy to 9080 and we will start it there.
app.use('/atlas5D', createProxyMiddleware({ 
  target: 'http://127.0.0.1:9080', 
  changeOrigin: true
}));

// Proxy /vault to the local Vault Emulator (8200)
app.use('/vault', createProxyMiddleware({ 
  target: 'http://127.0.0.1:8200', 
  changeOrigin: true,
  pathRewrite: { '^/vault': '' }
}));

// Proxy /api to the Core MEV API (4052)
app.use('/api', createProxyMiddleware({ 
  target: 'http://127.0.0.1:4052', 
  changeOrigin: true,
  pathRewrite: { '^/api': '/api' }
}));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Zeta Gateway (Administrative Backend) listening on http://0.0.0.0:${PORT}`);
  console.log(` - /atlas5D -> http://127.0.0.1:9080`);
  console.log(` - /vault -> http://127.0.0.1:8200`);
  console.log(` - /api -> http://127.0.0.1:4052`);
});
