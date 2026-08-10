const WebSocket = require('ws');
const net = require('net');

const WORKER_TUNNEL_URL = 'wss://relay.jetweb.workers.dev/tunnel';
const TUNNEL_SECRET = 'SuperSecretKey2026!';
const LOCAL_MULTIPLEXER_PORT = 911;

function connectTunnel() {
  console.log(`[*] Connecting outbound tunnel to ${WORKER_TUNNEL_URL}...`);

  const ws = new WebSocket(WORKER_TUNNEL_URL, {
    headers: {
      'X-Tunnel-Secret': TUNNEL_SECRET
    }
  });

  let tcpSocket = null;

  ws.on('open', () => {
    console.log('[+] Outbound Tunnel active. Listening for remote data frames...');
    
    // Connect to host TCP Multiplexer
    tcpSocket = net.connect(LOCAL_MULTIPLEXER_PORT, '127.0.0.1', () => {
      console.log('[+] Forwarded tunnel stream mapped to local multiplexer Port 911.');
    });

    tcpSocket.on('data', (data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });

    tcpSocket.on('error', (err) => {
      console.error(`[-] TCP Multiplexer connection error: ${err.message}`);
      ws.close();
    });

    tcpSocket.on('close', () => {
      console.log('[-] TCP Multiplexer closed socket.');
      ws.close();
    });
  });

  ws.on('message', (data) => {
    if (tcpSocket && !tcpSocket.destroyed) {
      tcpSocket.write(data);
    }
  });

  ws.on('close', () => {
    console.log('[-] Tunnel closed. Reconnecting in 5 seconds...');
    if (tcpSocket) tcpSocket.destroy();
    setTimeout(connectTunnel, 5000);
  });

  ws.on('error', (err) => {
    console.error(`[-] WebSocket error: ${err.message}`);
  });
}

connectTunnel();
