// Print the burner wallet's private key in base58 (Phantom import format).
// RUN THIS YOURSELF, in your own terminal session only.
// Anyone who sees the output controls the wallet. After importing, clear
// the terminal (type: clear) and close the tab.
//
// Usage: node export_private_key.mjs [keyfile]

import { readFileSync } from 'node:fs';

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
const secret = Buffer.from(JSON.parse(readFileSync(keyfile, 'utf8')));
console.log('Public address :', base58(secret.subarray(32, 64)));
console.log('PRIVATE KEY (base58, for Phantom import):');
console.log(base58(secret));
console.log('');
console.log('WARNING: anyone with this key controls the wallet. Store it in your');
console.log('password manager, never send it in any chat, then type: clear');
