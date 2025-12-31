#!/usr/bin/env node

/**
 * Generate SHA-256 hash for Owners Portal password
 * 
 * Usage:
 *   node scripts/generate-password-hash.js "your-password"
 * 
 * Then add the output to your .env file as:
 *   OWNERS_PASSWORD_HASH=sha256-your_hash_here
 */

import crypto from 'crypto';

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/generate-password-hash.js "your-password"');
  console.error('');
  console.error('Example:');
  console.error('  node scripts/generate-password-hash.js "my-secret-password"');
  process.exit(1);
}

const hash = crypto
  .createHash('sha256')
  .update(password)
  .digest('hex');

const fullHash = `sha256-${hash}`;

console.log('');
console.log('✅ Password hash generated successfully!');
console.log('');
console.log('Add this to your .env file:');
console.log('');
console.log(`OWNERS_PASSWORD_HASH=${fullHash}`);
console.log('');
console.log('⚠️  Keep this hash secret and never commit it to the repository!');
console.log('');
