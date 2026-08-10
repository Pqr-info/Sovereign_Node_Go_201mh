const net = require('net');

const MULTIPLEX_PORT = 911;
const TARGET_SSH = { host: '127.0.0.1', port: 22 };   // Routed to guest SSH via localhost mapping
const TARGET_RDP = { host: '127.0.0.1', port: 3389 }; // Routed to Windows host RDP
const TARGET_HTTPS = { host: '127.0.0.1', port: 3000 }; // Routed to Express Admin API

const server = net.createServer((clientSocket) => {
  // Slow-Loris DOS Protection: Close connection if no handshake data is received within 1500ms
  clientSocket.setTimeout(1500, () => clientSocket.destroy());

  clientSocket.once('data', (data) => {
    clientSocket.setTimeout(0); // Clear timeout once data is received
    clientSocket.pause();
    
    let target = TARGET_HTTPS; // Default routing
    
    if (data.length >= 2) {
      const prefixStr = data.toString('utf8', 0, 3);
      // RDP negotiation typically starts with TPKT protocol identifier (0x03 0x00)
      if (data[0] === 0x03 && data[1] === 0x00) {
        target = TARGET_RDP;
      }
      // SSH connection handshake begins with "SSH-"
      else if (prefixStr.startsWith('SSH')) {
        target = TARGET_SSH;
      }
    }
    
    const targetSocket = net.connect(target.port, target.host, () => {
      clientSocket.resume();
      targetSocket.write(data);
      clientSocket.pipe(targetSocket);
      targetSocket.pipe(clientSocket);
    });
    
    targetSocket.on('error', (err) => {
      clientSocket.destroy();
    });
    
    clientSocket.on('error', (err) => {
      targetSocket.destroy();
    });
  });
});

server.listen(MULTIPLEX_PORT, '0.0.0.0', () => {
  console.log(`[+] JetWeb Time Machine OS Multiplexer active on port ${MULTIPLEX_PORT}`);
  console.log(`    -> Routing RDP to localhost:3389`);
  console.log(`    -> Routing SSH to localhost:22`);
  console.log(`    -> Routing HTTPS to localhost:3000`);
});
