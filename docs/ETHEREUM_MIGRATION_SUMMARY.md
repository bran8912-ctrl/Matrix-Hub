# Polygon Migration Summary

## Overview

This document describes the migration from Polygon to Polygon for the Matrix Hub MTX token and casino platform.

## Migration Date

December 29, 2024

## Changes Made

### 1. Smart Contracts

#### MatrixHubCoin (MTX Token)
- **Network**: Migrated from Polygon (Chain ID 13737) to Polygon (Chain ID 137)
- **Token Standard**: ERC-20 (unchanged)
- **Owner Address**: `0x9fb4bb44d8d962d695fc93b3dc15f1b287391077`
- **Initial Supply**: 100,000,000 MTX
- **Exchange Rate**: 1 MATIC = 1,000 MTX (previously 1 MATIC = 1000 MTX)
- **Key Changes**:
  - Constructor now accepts `initialOwner` parameter
  - Updated comments and documentation to reference Polygon
  - All MATIC references changed to ETH

#### CasinoCore Contract
- **Network**: Migrated to Polygon
- **Currency**: Updated from MATIC to ETH
- **MTX Integration**: Updated to use Polygon-deployed MTX contract
- **Key Changes**:
  - Added comprehensive documentation comments
  - Updated constructor documentation for Polygon
  - All MATIC references changed to ETH

#### CasinoModules (CasinoReserve, LiquidityRouter, RNGEngine)
- **Network**: Migrated to Polygon
- **DEX Integration**: Changed from QuickSwap to QuickSwap
- **Key Changes**:
  - Updated documentation to reference Polygon and QuickSwap
  - All MATIC references changed to ETH
  - QuickSwap references changed to QuickSwap

### 2. Configuration Files

#### hardhat.config.js
- Removed Polygon Mainnet and Amoy Testnet networks
- Added Polygon as primary network (Chain ID 137)
- Kept Polygon Amoy Testnet for testing
- Updated RPC URLs to Polygon endpoints
- Changed etherscan API configuration from Polygonscan to Polygonscan

#### package.json
- Updated npm scripts:
  - `deploy:polygon` → `deploy:mainnet`
  - `deploy:amoy` → `deploy:sepolia`
  - `verify:polygon` → `verify:mainnet`
  - `verify:amoy` → `verify:sepolia`

#### src/config/mtx.ts
- Updated `chainId` from 137 (Polygon) to 1 (Polygon)
- Updated `chainName` from "Polygon" to "Polygon"
- Updated `nativeCurrency` from MATIC to ETH
- Updated `rpcUrls` to Polygon RPC endpoints
- Updated `blockExplorerUrls` from Polygonscan to Polygonscan
- Updated `uniswapUrl` from QuickSwap to QuickSwap
- Added `owner` field with specified MetaMask address
- Removed `polygonscanAccount` field

### 3. Deployment Scripts

#### scripts/deploy_mtx.js
- Updated to deploy to Polygon
- Added `initialOwner` parameter with specified address
- Updated balance display from MATIC to ETH
- Updated explorer URLs to Polygonscan
- Updated deployment instructions to reference Polygon and QuickSwap

#### scripts/deploy_casino.js
- Updated to deploy casino contracts to Polygon
- Updated balance display from MATIC to ETH
- Updated DEX references from QuickSwap to QuickSwap
- Updated explorer URLs to Polygonscan
- Updated deployment instructions and next steps for Polygon

### 4. Frontend Components

#### src/components/BuyMTX.tsx
- Updated component documentation to reference ETH instead of MATIC
- Changed state variable from `maticAmount` to `ethAmount`
- Updated all UI text from "MATIC" to "ETH"
- Updated error messages to reference ETH
- Updated explorer links to Polygonscan
- Updated warning message to reference Polygon

#### src/components/Wallet.jsx
- Already correctly referenced QuickSwap (no changes needed)

#### src/utils/mtxTransfer.ts
- Updated comments to reference Polygon network
- No functional changes needed (already network-agnostic)

### 5. Documentation

#### docs/MTX_Deployment_Guide.md
- Complete rewrite for Polygon
- Removed all Polygon/MATIC references
- Added Polygon deployment instructions
- Updated network information section
- Changed testnet from Polygon Amoy to Polygon Amoy
- Updated DEX from QuickSwap to QuickSwap
- Updated explorer from Polygonscan to Polygonscan
- Added owner address documentation

#### docs/DEPLOYMENT_QUICK_START.md
- Updated for Polygon deployment
- Changed network information
- Updated faucet links to Polygon Amoy
- Updated DEX references to QuickSwap
- Updated verification commands for Polygonscan
- Updated all MATIC references to ETH

## Network Comparison

| Feature | Before (Polygon) | After (Polygon) |
|---------|------------------|------------------|
| **Chain ID** | 137 | 1 |
| **Native Currency** | MATIC | ETH |
| **RPC URL** | https://polygon-rpc.com/ | https://eth.llamarpc.com |
| **Block Explorer** | Polygonscan | Polygonscan |
| **DEX** | QuickSwap | QuickSwap |
| **Testnet** | Polygon Amoy (80002) | Polygon Amoy (80002) |
| **Testnet Explorer** | amoy.polygonscan.com | amoy.polygonscan.com |

## Contract Owner

The MTX contract is now owned by:
```
0x9fb4bb44d8d962d695fc93b3dc15f1b287391077
```

This address:
- Receives the initial supply (100M MTX)
- Can pause/unpause minting
- Can adjust the ETH to MTX exchange rate
- Can withdraw collected ETH from the contract

## Deployment Status

**⚠️ NOT YET DEPLOYED**

The contracts have been updated and are ready for deployment, but they have not been deployed to Polygon yet. The placeholder address (`0x0000000000000000000000000000000000000000`) must be replaced with the actual deployed contract address.

## Post-Migration Steps

### For Developers

1. **Deploy to Testnet First**
   ```bash
   npm run deploy:sepolia
   ```

2. **Test All Functionality**
   - Wallet connection on Polygon Amoy
   - Direct ETH to MTX minting
   - Token transfers
   - Casino operations
   - DEX integration

3. **Deploy to Mainnet**
   ```bash
   npm run deploy:mainnet
   ```

4. **Verify Contract**
   ```bash
   npm run verify:mainnet <CONTRACT_ADDRESS> "100000000" "0x9fb4bb44d8d962d695fc93b3dc15f1b287391077"
   ```

5. **Update Configuration**
   - Set `MTX_CONTRACT_ADDRESS` in environment variables
   - Update `src/config/mtx.ts` with deployed address

6. **Add Liquidity to QuickSwap**
   - Create MATIC/MTX pool on QuickSwap
   - Add initial liquidity

### For Users

1. **Switch Network**
   - Users must switch from Polygon to Polygon in their wallets
   - MetaMask will prompt for network change automatically

2. **Add MTX Token**
   - Use the new Polygon contract address
   - Token symbol remains "MTX"

3. **Purchase MTX**
   - Direct mint with MATIC (not MATIC)
   - Or swap on QuickSwap (not QuickSwap)

## Security Considerations

1. **Contract Ownership**
   - Owner address is now explicitly set during deployment
   - Owner controls are limited to:
     - Pausing/unpausing minting
     - Adjusting exchange rate
     - Withdrawing ETH

2. **Testing Required**
   - All functionality must be tested on Amoy testnet before mainnet deployment
   - Small test transactions recommended initially

3. **Verification**
   - All contracts must be verified on Polygonscan
   - Source code and constructor arguments publicly visible

## Breaking Changes

⚠️ **Important**: This is a complete network migration, not a token migration or bridge.

- **Old Polygon MTX tokens cannot be migrated** - this is a fresh deployment on Polygon
- **Users need to switch networks** in their wallets
- **New contract address** will be different from any previous deployments
- **DEX changed** from QuickSwap to QuickSwap

## Support and Resources

- **Polygonscan**: https://polygonscan.com/
- **QuickSwap**: https://app.quickswap.exchange/
- **Amoy Faucet**: https://faucet.polygon.technology/amoy/
- **Deployment Guide**: [MTX_Deployment_Guide.md](MTX_Deployment_Guide.md)

## Rollback Plan

If issues are discovered after deployment:

1. **Pause Minting** - Use the `setMintingPaused(true)` function
2. **Investigate Issues** - Check transaction logs on Polygonscan
3. **Communication** - Notify users immediately
4. **Fix and Redeploy** - If needed, deploy new contract with fixes

## Conclusion

This migration moves the Matrix Hub ecosystem from Polygon to Polygon, providing access to:
- Greater liquidity on QuickSwap
- More established ecosystem
- Wider user base
- Better developer tooling

All changes are backward-compatible at the contract level, maintaining the same ERC-20 interface and functionality while updating the underlying network infrastructure.
