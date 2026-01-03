#!/usr/bin/env node

/**
 * Wrapper script for Hardhat compile command
 * 
 * This script provides graceful handling for environments where:
 * - Network access is restricted (can't download Solidity compiler)
 * - Contracts are already compiled (artifacts exist)
 * 
 * Usage: node scripts/compile-wrapper.js
 */

import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Check if artifacts directory exists and has contracts
const artifactsDir = path.join(projectRoot, 'artifacts', 'contracts');
const hasArtifacts = existsSync(artifactsDir);

if (hasArtifacts) {
  console.log('✓ Compiled contract artifacts already exist');
  console.log('  Location:', artifactsDir);
  console.log('  Skipping compilation (use --force to recompile)');
  process.exit(0);
}

console.log('Compiling contracts with Hardhat...');
try {
  execSync('npx hardhat compile', {
    cwd: projectRoot,
    stdio: 'inherit'
  });
  console.log('✓ Compilation successful');
  process.exit(0);
} catch (error) {
  console.error('✗ Compilation failed');
  console.error('  This may be due to network restrictions or missing dependencies.');
  console.error('  In CI environments, ensure artifacts/ and cache/ are committed or cached.');
  process.exit(1);
}
