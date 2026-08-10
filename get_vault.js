import fetch from 'node-fetch';
import crypto from 'crypto';

const VAULT_URL = 'http://127.0.0.1:8200/v1/secret/data';
const TOTP_SECRET = process.env.VAULT_TOTP_SECRET || 'S27_SHARED_SECRET_KEY';

function generateTOTP(secret, interval = 300) {
  const time = Math.floor(Date.now() / 1000 / interval);
  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeUInt32BE(Math.floor(time / 0x100000000), 0);
  timeBuffer.writeUInt32BE(time & 0xffffffff, 4);
  const hmac = crypto.createHmac('sha1', secret).update(timeBuffer).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const code = (hmac.readUInt32BE(offset) & 0x7fffffff) % 1000000;
  return code.toString().padStart(6, '0');
}

async function getVaultSecret(secretPath) {
  try {
    const vRes = await fetch(`${VAULT_URL}/${secretPath}`, {
      headers: { 'X-Vault-Token': generateTOTP(TOTP_SECRET) }
    });
    if (vRes.ok) {
      const vData = await vRes.json();
      return vData.data?.data?.value || null;
    }
  } catch (e) {
    console.error(`Failed to fetch ${secretPath} from vault:`, e.message);
  }
  return null;
}

async function main() {
  console.log('API Token:', await getVaultSecret('sovereign/cloudflare_api_token'));
  console.log('Global Key:', await getVaultSecret('sovereign/cloudflare_global_api_key'));
}
main();
