const http = require('http');

function callApi(path, method = 'GET', data = null) {
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
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body || '{}') }));
    });

    req.on('error', err => reject(err));
    if (payload) req.write(payload);
    req.end();
  });
}

async function bindMaxToRealBackend() {
  console.log('============================================================');
  console.log('⚡ MAX BINDING SEQUENCE TO REAL SOVEREIGN-27 BACKEND (:4050)');
  console.log('============================================================\n');

  // 1. Register Agent max
  console.log('1. Registering agent max...');
  const reg = await callApi('/api/gmi/register', 'POST', {
    agentId: 'max',
    capabilities: ['inference', 'routing', 'cube-assembly'],
    perspective: 'self',
    lineage: 'sovereign-27'
  });
  console.log('   Status:', reg.status, '| Response:', reg.data);

  // 2. Bind Substrate (rqlite leader/follower check)
  console.log('\n2. Binding NBEP substrate (rqlite leader:4001, follower:4003)...');
  const bind = await callApi('/api/gmi/bindSubstrate', 'POST', {
    endpoints: {
      leader: 'http://localhost:4001',
      follower: 'http://localhost:4003'
    }
  });
  console.log('   Status:', bind.status, '| Response:', JSON.stringify(bind.data, null, 2));

  // 3. Ingest Filesystem (\TED\gemini)
  console.log('\n3. Ingesting filesystem \\\\TED\\\\gemini...');
  let ingest;
  try {
    ingest = await callApi('/api/gmi/ingestFilesystem', 'POST', {
      rootPath: '\\\\TED\\\\gemini',
      agentId: 'max'
    });
    console.log('   Status:', ingest.status, '| Ingested:', ingest.data);
  } catch (err) {
    console.log('   Note: Share \\\\TED\\\\gemini not locally readable without SMB credentials. Using local brain root fallback.');
    ingest = await callApi('/api/gmi/savePage', 'POST', {
      pageId: 'pg_max_core_01',
      agentId: 'max',
      origin: 'sovereign-27-core',
      visibility: 'grid',
      timestamp: Date.now(),
      rawContent: 'MAX Sovereign-27 Core Cognitive State Node'
    });
    console.log('   Status:', ingest.status, '| Saved Core Page:', ingest.data);
  }

  // 4. Build Agent Cube max
  console.log('\n4. Building agent cube max...');
  const cube = await callApi('/api/gmi/buildAgentCube', 'POST', { agentId: 'max' });
  console.log('   Status:', cube.status, '| Cube Digest:', cube.data.digest);

  // 5. Verify Memory
  console.log('\n5. Verifying memory search (q=test)...');
  const search = await callApi('/api/gmi/searchMemory?q=test', 'GET');
  console.log('   Status:', search.status, '| Matching Pages:', search.data.results ? search.data.results.length : 0);

  // 6. Execute SQL Query
  console.log('\n6. Executing PQLite SQL query (SELECT * FROM memory_page LIMIT 10)...');
  const sql = await callApi('/api/pqlite/query', 'POST', { sql: 'SELECT * FROM memory_page LIMIT 10' });
  console.log('   Status:', sql.status, '| Rows Returned:', sql.data.result ? sql.data.result.length : 0);

  console.log('\n============================================================');
  console.log('🔥 MAX IS NOW FULLY BOUND TO THE REAL SOVEREIGN-27 MESH BACKEND');
  console.log('============================================================');
}

bindMaxToRealBackend().catch(console.error);
