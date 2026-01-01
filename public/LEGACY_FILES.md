# Legacy Files in public/

## Overview

This directory contains some legacy files from earlier development that are not currently used by the main Astro-based site.

## Files

### casino-bundle.js
- **Status**: Legacy - Not used by Astro build
- **Issue**: Contains outdated Hardhat testnet addresses
- **Source**: Originally built from `src/casino/_legacy/` components
- **Note**: The current site uses Astro pages and React components directly, not this pre-built bundle
- **Action**: This file can be safely ignored or removed as the main site doesn't reference it

### index.html
- **Status**: Legacy - Not used by Astro build
- **Issue**: References casino-bundle.js which contains outdated addresses
- **Note**: The actual homepage is generated from `src/pages/index.astro`
- **Action**: This file can be safely ignored or removed

## Current Architecture

The Matrix Hub site uses:
- **Astro** for static site generation
- **React components** (`.tsx` files) loaded dynamically via Astro islands
- **MTX config** (`src/config/mtx.ts`) for contract addresses
- **Environment variables** for production contract addresses

All active source files are in the `src/` directory and are free of hardcoded Hardhat addresses.

## Deployment Status

The MTX token contract is not yet deployed to mainnet. See:
- `/docs/MTX_Deployment_Guide.md` for deployment instructions
- `/docs/SEPOLIA_DEPLOYMENT.md` for testnet deployment
- `src/config/mtx.ts` for configuration

## Recommendations

1. **Do not use files in this directory** for contract addresses
2. **Use `src/config/mtx.ts`** for the canonical MTX contract configuration
3. **Rebuild casino-bundle.js** if needed, or remove it
4. **Remove index.html** if not needed for backward compatibility

---

**Last Updated**: 2026-01-01
**Related**: See `CONTRACT_DETAILS_AUDIT.md` for the full security audit
