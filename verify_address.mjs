// Decisive check: derive the address from the keyfile ON the machine and
// compare it against the two candidate spellings. Prints only a verdict
// word, so no address transcription is involved.
// Usage: node verify_address.mjs [keyfile]

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

const CANDIDATE_PHANTOM = 'CE4jU3LVonN4BF63G4SwMhSRrp5VBaVUzQK5hsDkob3A'; // spelling the user pasted from his wallet app
const CANDIDATE_REPORTED = 'CE4jU3LVonN4BFG3G4SwMhSRrp5VBaVUzQK5hsDkob3A'; // spelling in the deploy report

const keyfile = process.argv[2] || './keys/solana_burner.json';
const secret = Buffer.from(JSON.parse(readFileSync(keyfile, 'utf8')));
const derived = base58(secret.subarray(32, 64));

if (derived === CANDIDATE_PHANTOM) console.log('VERDICT: MATCHES_PHANTOM');
else if (derived === CANDIDATE_REPORTED) console.log('VERDICT: MATCHES_REPORTED');
else console.log('VERDICT: MATCHES_NEITHER');
