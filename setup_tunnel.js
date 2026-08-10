const https = require('https');
const crypto = require('crypto');

const API_TOKEN = 'cfut_UEEaNW07HauKcw7WP7aacTG6u32ChLyqu0G6jglKc8b2c7df';
const EMAIL = 'thealanphipps@gmail.com';
const DOMAIN = 'pqr.info';
const TUNNEL_NAME = 'zeta-mesh';

const SUBDOMAINS = [
    { name: 'atlas.zeta', port: 9080 },
    { name: 'l7.zeta', port: 4052 },
    { name: 'stadium.zeta', port: 4054 }
];

function request(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.cloudflare.com',
            port: 443,
            path: path,
            method: method,
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(parsed);
                    } else {
                        reject(new Error(`API Error ${res.statusCode}: ${JSON.stringify(parsed)}`));
                    }
                } catch (e) {
                    reject(new Error(`Failed to parse response: ${body}`));
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function main() {
    try {
        console.log("Fetching Account ID...");
        const accountsRes = await request('GET', '/client/v4/accounts');
        if (!accountsRes.result || accountsRes.result.length === 0) {
            throw new Error("No accounts found for this token.");
        }
        const accountId = accountsRes.result[0].id;
        console.log(`Account ID: ${accountId}`);

        console.log("Fetching Zone ID...");
        const zonesRes = await request('GET', `/client/v4/zones?name=${DOMAIN}`);
        if (!zonesRes.result || zonesRes.result.length === 0) {
            throw new Error(`Zone ${DOMAIN} not found.`);
        }
        const zoneId = zonesRes.result[0].id;
        console.log(`Zone ID: ${zoneId}`);

        console.log(`Creating Tunnel: ${TUNNEL_NAME}...`);
        const tunnelSecret = crypto.randomBytes(32).toString('base64');
        const createTunnelRes = await request('POST', `/client/v4/accounts/${accountId}/cfd_tunnel`, {
            name: TUNNEL_NAME,
            tunnel_secret: tunnelSecret
        });
        const tunnelId = createTunnelRes.result.id;
        console.log(`Tunnel ID: ${tunnelId}`);

        // Construct the tunnel token
        // Token is base64 of JSON: {"a":"<account_id>","t":"<tunnel_id>","s":"<tunnel_secret_base64>"}
        const tokenData = { a: accountId, t: tunnelId, s: tunnelSecret };
        const tunnelToken = Buffer.from(JSON.stringify(tokenData)).toString('base64');
        console.log(`\nTunnel Token:\n${tunnelToken}\n`);

        console.log("Creating DNS Records...");
        for (const sub of SUBDOMAINS) {
            const fqdn = `${sub.name}.${DOMAIN}`;
            console.log(`Creating CNAME for ${fqdn} -> ${tunnelId}.cfargotunnel.com`);
            
            try {
                await request('POST', `/client/v4/zones/${zoneId}/dns_records`, {
                    type: 'CNAME',
                    name: sub.name,
                    content: `${tunnelId}.cfargotunnel.com`,
                    proxied: true
                });
                console.log(`  Success for ${fqdn}`);
            } catch(e) {
                console.log(`  Failed for ${fqdn} (might already exist?): ${e.message}`);
            }
        }

        console.log("\nConfiguring Remote Tunnel Routing...");
        const ingress = SUBDOMAINS.map(sub => ({
            hostname: `${sub.name}.${DOMAIN}`,
            service: `http://localhost:${sub.port}`
        }));
        ingress.push({ service: 'http_status:404' });

        const configPayload = {
            config: {
                ingress: ingress
            }
        };

        try {
            await request('PUT', `/client/v4/accounts/${accountId}/cfd_tunnel/${tunnelId}/configurations`, configPayload);
            console.log("  Successfully configured Remote Routing!");
        } catch(e) {
            console.log(`  Remote config via API failed: ${e.message}. You will need to use a local config.yml.`);
        }

        console.log("\n--- DONE ---");
    } catch (err) {
        console.error("Error:", err);
    }
}

main();
