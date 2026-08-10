import crypto from 'crypto';
import fs from 'fs';

const MASTER_KEY_HEX = crypto.createHash('sha256').update('sub27-master-secret-key-2026').digest('hex');
const AES_KEY = Buffer.from(MASTER_KEY_HEX, 'hex');

function decryptStore(encObj) {
  const iv = Buffer.from(encObj.iv, 'hex');
  const tag = Buffer.from(encObj.tag, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', AES_KEY, iv);
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encObj.ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}

const encData = JSON.parse(fs.readFileSync('C:/pqr.info/mev/atlas-ui/src/engine/vault_substrate27_keystore.enc', 'utf8'));
console.log(JSON.stringify(decryptStore(encData), null, 2));
