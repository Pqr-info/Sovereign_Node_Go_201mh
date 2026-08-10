const http = require('http');

function requestJson(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : '';
    const req = http.request({
      hostname: 'localhost',
      port: 4050,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body || '{}') }));
    });

    req.on('error', err => reject(err));
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('=== 1. Health Check ===');
  const health = await requestJson('/api/health', 'GET');
  console.log('Health Response:', health);

  console.log('\n=== 2. Register Agent max ===');
  const reg = await requestJson('/api/gmi/register', 'POST', { agentId: 'max', capabilities: ['inference', 'routing', 'cube-assembly'], lineage: 'sovereign-27' });
  console.log('Register Response:', reg);

  console.log('\n=== 3. Bind Substrate Check (Expect 503 if rqlite :4001 & :4003 offline) ===');
  const bind = await requestJson('/api/gmi/bindSubstrate', 'POST', { endpoints: { leader: 'http://localhost:4001', follower: 'http://localhost:4003' } });
  console.log('Bind Substrate Response Status:', bind.status);
  console.log('Bind Substrate Body:', JSON.stringify(bind.body, null, 2));

  console.log('\n=== 4. Save Page to Disk SQLite ===');
  const page = await requestJson('/api/gmi/savePage', 'POST', { pageId: 'pg_real_101', agentId: 'max', origin: 'test', rawContent: 'Real Sovereign-27 page written to data/pqlite_gmi_mesh.db' });
  console.log('Save Page Response:', page);

  console.log('\n=== 5. Build Agent Cube max ===');
  const cube = await requestJson('/api/gmi/buildAgentCube', 'POST', { agentId: 'max' });
  console.log('Build Agent Cube Response:', cube);

  console.log('\n=== 6. Execute PQLite SQL Query against Disk DB ===');
  const sqlRes = await requestJson('/api/pqlite/query', 'POST', { sql: 'SELECT * FROM memory_page' });
  console.log('PQLite Query Response:', sqlRes);
}

runTests().catch(console.error);
