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

// Check for environment variable to force compilation
const forceCompile = process.env.FORCE_COMPILE === 'true';

if (hasArtifacts && !forceCompile) {
  // Verify artifacts are not empty - check for actual contract JSON files
  const { readdirSync } = await import('fs');
  try {
    const files = readdirSync(artifactsDir, { recursive: true });
    const jsonFiles = files.filter(f => typeof f === 'string' && f.endsWith('.json'));
    
    if (jsonFiles.length === 0) {
      console.warn('⚠ Artifacts directory exists but appears empty');
      console.log('  Proceeding with compilation...');
    } else {
      console.log('✓ Compiled contract artifacts already exist');
      console.log(`  Location: ${artifactsDir}`);
      console.log(`  Found ${jsonFiles.length} artifact file(s)`);
      console.log('  Skipping compilation');
      console.log('  Note: Set FORCE_COMPILE=true to force recompilation');
      process.exit(0);
    }
  } catch (err) {
    console.warn('⚠ Could not verify artifacts:', err.message);
    console.log('  Proceeding with compilation...');
  }
} else if (forceCompile) {
  console.log('🔄 FORCE_COMPILE=true - forcing recompilation');
}

console.log('Compiling contracts with Hardhat...');
try {
  execSync('npx hardhat compile', {
    cwd: projectRoot,
    stdio: 'inherit'
  });
  console.log('✓ Compilation successful');
  process.exit(0);
} catch (_error) {
  console.error('✗ Compilation failed');
  console.error('  This may be due to network restrictions or missing dependencies.');
  console.error('  In CI environments, configure your workflow to cache the artifacts/ and cache/ directories.');
  process.exit(1);
}
