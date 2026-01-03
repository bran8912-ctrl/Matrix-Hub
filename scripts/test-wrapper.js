#!/usr/bin/env node

/**
 * Wrapper script for Hardhat test command
 * 
 * This script provides graceful handling for environments where:
 * - Network access is restricted (can't download Solidity compiler)
 * - Contracts may not be compiled yet
 * - Tests should still run if possible
 * 
 * Usage: node scripts/test-wrapper.js
 */

import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Check if test directory exists
const testDir = path.join(projectRoot, 'test');
if (!existsSync(testDir)) {
  console.error('✗ Test directory not found:', testDir);
  console.error('  Create test/ directory with test files to run tests.');
  process.exit(1);
}

// Check if artifacts exist
const artifactsDir = path.join(projectRoot, 'artifacts', 'contracts');
const hasArtifacts = existsSync(artifactsDir);

if (!hasArtifacts) {
  console.warn('⚠ Warning: Contract artifacts not found');
  console.warn('  Some tests may fail if they depend on compiled contracts.');
  console.warn('  Run `npm run compile` first if contract tests are needed.');
}

console.log('Running tests with Hardhat...');
try {
  // Use --no-compile to skip automatic compilation
  // This allows tests to run with existing artifacts
  execSync('npx hardhat test --no-compile', {
    cwd: projectRoot,
    stdio: 'inherit'
  });
  console.log('✓ Tests completed successfully');
  process.exit(0);
} catch (error) {
  // If --no-compile fails, try with normal compile (may succeed in environments with network)
  console.log('\nRetrying with automatic compilation...');
  try {
    execSync('npx hardhat test', {
      cwd: projectRoot,
      stdio: 'inherit'
    });
    console.log('✓ Tests completed successfully');
    process.exit(0);
  } catch (retryError) {
    console.error('✗ Tests failed');
    console.error('  This may be due to network restrictions, compilation issues, or test failures.');
    console.error('  In CI environments, ensure artifacts/ and cache/ are committed or cached.');
    process.exit(1);
  }
}
