const http = require('http');

const data = JSON.stringify({
  model: 'qwen/qwen3-coder-next',
  messages: [{ role: 'user', content: 'Write a simple hello world in Rust.' }],
  temperature: 0.7
});

const options = {
  hostname: '192.168.12.234',
  port: 1234,
  path: '/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(body));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
