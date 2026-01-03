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
  console.error('  Hardhat expects your test files in a test/ directory (e.g. Mocha/Chai tests).');
  console.error('  Create a test/ directory and add at least one test file, for example test/placeholder.test.js.');
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
  // Only retry with automatic compilation if we don't have artifacts yet.
  // If artifacts already exist, a retry is unlikely to help and just re-runs failing tests.
  if (!hasArtifacts) {
    console.log('\nNo contract artifacts detected. Retrying with automatic compilation...');
    try {
      execSync('npx hardhat test', {
        cwd: projectRoot,
        stdio: 'inherit'
      });
      console.log('✓ Tests completed successfully');
      process.exit(0);
    } catch (retryError) {
      console.error('✗ Tests failed after retry with automatic compilation');
      console.error('  This may be due to network restrictions, compilation issues, or test failures.');
      console.error('  In CI environments, ensure artifacts/ and cache/ are available via CI caching or pre-build steps.');
      console.error('  If you choose to commit these directories, update .gitignore accordingly to match that workflow.');
      process.exit(1);
    }
  } else {
    console.error('✗ Tests failed with existing contract artifacts present.');
    console.error('  Skipping retry with automatic compilation because artifacts already exist.');
    console.error('  Investigate test failures in the output above.');
    process.exit(1);
  }
}
