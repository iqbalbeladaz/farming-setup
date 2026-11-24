// Print the burner wallet's public address and SOL balance.
// Reads the secret file only to derive the address; prints no secret material.
// Usage: node check_balance.mjs [keyfile]

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
const address = base58(secret.subarray(32, 64));
console.log('Address:', address);

const res = await fetch('https://api.mainnet-beta.solana.com', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getBalance', params: [address] }),
});
const data = await res.json();
if (data.error) { console.error('RPC error:', data.error.message); process.exit(1); }
console.log('Balance:', data.result.value / 1e9, 'SOL');
