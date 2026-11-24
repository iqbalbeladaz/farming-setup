// Generate a Solana burner wallet LOCALLY on the machine that will hold it.
// Safety design: the secret key is written to a 0600 file and NEVER printed.
// Only the public address is printed, so this can be run by an agent safely.
//
// Usage: node generate_solana_wallet.mjs [keyfile]
// Default keyfile: ./keys/solana_burner.json  (refuses to overwrite)

import { generateKeyPairSync } from 'node:crypto';
import { writeFileSync, existsSync, mkdirSync, chmodSync } from 'node:fs';
import { dirname } from 'node:path';

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function base58(buf) {
  let zeros = 0;
  while (zeros < buf.length && buf[zeros] === 0) zeros++;
  const digits = [];
  for (let i = zeros; i < buf.length; i++) {
    let carry = buf[i];
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) { digits.push(carry % 58); carry = (carry / 58) | 0; }
  }
  return '1'.repeat(zeros) + digits.reverse().map(d => B58[d]).join('');
}

const keyfile = process.argv[2] || './keys/solana_burner.json';
if (existsSync(keyfile)) {
  console.error(`REFUSED: ${keyfile} already exists. Delete it manually first if you really want a new wallet.`);
  process.exit(1);
}

const { publicKey, privateKey } = generateKeyPairSync('ed25519');
const spki = publicKey.export({ type: 'spki', format: 'der' });   // last 32 bytes = raw pubkey
const pkcs8 = privateKey.export({ type: 'pkcs8', format: 'der' }); // last 32 bytes = seed
const pub = spki.subarray(spki.length - 32);
const seed = pkcs8.subarray(pkcs8.length - 32);
const secret = Buffer.concat([seed, pub]); // 64-byte Solana secret key (CLI JSON format)

mkdirSync(dirname(keyfile), { recursive: true });
writeFileSync(keyfile, JSON.stringify([...secret]), { mode: 0o600 });
chmodSync(keyfile, 0o600);

console.log('Burner wallet created.');
console.log('Public address (safe to share):', base58(pub));
console.log('Secret stored at:', keyfile, '(mode 600, never printed)');
