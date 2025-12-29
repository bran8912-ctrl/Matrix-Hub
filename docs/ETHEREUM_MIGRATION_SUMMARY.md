# Ethereum Mainnet Migration Summary

## Overview

This document describes the migration from Polygon to Ethereum Mainnet for the Matrix Hub MTX token and casino platform.

## Migration Date

December 29, 2024

## Changes Made

### 1. Smart Contracts

#### MatrixHubCoin (MTX Token)
- **Network**: Migrated from Polygon (Chain ID 137) to Ethereum Mainnet (Chain ID 1)
- **Token Standard**: ERC-20 (unchanged)
- **Owner Address**: `0xb248d5bd04f6fadee6146d0dac1da82b842a437b9c6444c4cbc1e7ee37033e7a`
- **Initial Supply**: 100,000,000 MTX
- **Exchange Rate**: 1 ETH = 1000 MTX (previously 1 MATIC = 1000 MTX)
- **Key Changes**:
  - Constructor now accepts `initialOwner` parameter
  - Updated comments and documentation to reference Ethereum
  - All MATIC references changed to ETH

#### CasinoCore Contract
- **Network**: Migrated to Ethereum Mainnet
- **Currency**: Updated from MATIC to ETH
- **MTX Integration**: Updated to use Ethereum-deployed MTX contract
- **Key Changes**:
  - Added comprehensive documentation comments
  - Updated constructor documentation for Ethereum
  - All MATIC references changed to ETH

#### CasinoModules (CasinoReserve, LiquidityRouter, RNGEngine)
- **Network**: Migrated to Ethereum Mainnet
- **DEX Integration**: Changed from QuickSwap to Uniswap
- **Key Changes**:
  - Updated documentation to reference Ethereum and Uniswap
  - All MATIC references changed to ETH
  - QuickSwap references changed to Uniswap

### 2. Configuration Files

#### hardhat.config.js
- Removed Polygon Mainnet and Amoy Testnet networks
- Added Ethereum Mainnet as primary network (Chain ID 1)
- Kept Ethereum Sepolia Testnet for testing
- Updated RPC URLs to Ethereum endpoints
- Changed etherscan API configuration from Polygonscan to Etherscan

#### package.json
- Updated npm scripts:
  - `deploy:polygon` → `deploy:mainnet`
  - `deploy:amoy` → `deploy:sepolia`
  - `verify:polygon` → `verify:mainnet`
  - `verify:amoy` → `verify:sepolia`

#### src/config/mtx.ts
- Updated `chainId` from 137 (Polygon) to 1 (Ethereum Mainnet)
- Updated `chainName` from "Polygon" to "Ethereum"
- Updated `nativeCurrency` from MATIC to ETH
- Updated `rpcUrls` to Ethereum RPC endpoints
- Updated `blockExplorerUrls` from Polygonscan to Etherscan
- Updated `uniswapUrl` from QuickSwap to Uniswap
- Added `owner` field with specified MetaMask address
- Removed `polygonscanAccount` field

### 3. Deployment Scripts

#### scripts/deploy_mtx.js
- Updated to deploy to Ethereum Mainnet
- Added `initialOwner` parameter with specified address
- Updated balance display from MATIC to ETH
- Updated explorer URLs to Etherscan
- Updated deployment instructions to reference Ethereum and Uniswap

#### scripts/deploy_casino.js
- Updated to deploy casino contracts to Ethereum Mainnet
- Updated balance display from MATIC to ETH
- Updated DEX references from QuickSwap to Uniswap
- Updated explorer URLs to Etherscan
- Updated deployment instructions and next steps for Ethereum

### 4. Frontend Components

#### src/components/BuyMTX.tsx
- Updated component documentation to reference ETH instead of MATIC
- Changed state variable from `maticAmount` to `ethAmount`
- Updated all UI text from "MATIC" to "ETH"
- Updated error messages to reference ETH
- Updated explorer links to Etherscan
- Updated warning message to reference Ethereum Mainnet

#### src/components/Wallet.jsx
- Already correctly referenced Uniswap (no changes needed)

#### src/utils/mtxTransfer.ts
- Updated comments to reference Ethereum network
- No functional changes needed (already network-agnostic)

### 5. Documentation

#### docs/MTX_Deployment_Guide.md
- Complete rewrite for Ethereum Mainnet
- Removed all Polygon/MATIC references
- Added Ethereum Mainnet deployment instructions
- Updated network information section
- Changed testnet from Polygon Amoy to Ethereum Sepolia
- Updated DEX from QuickSwap to Uniswap
- Updated explorer from Polygonscan to Etherscan
- Added owner address documentation

#### docs/DEPLOYMENT_QUICK_START.md
- Updated for Ethereum Mainnet deployment
- Changed network information
- Updated faucet links to Ethereum Sepolia
- Updated DEX references to Uniswap
- Updated verification commands for Etherscan
- Updated all MATIC references to ETH

## Network Comparison

| Feature | Before (Polygon) | After (Ethereum) |
|---------|------------------|------------------|
| **Chain ID** | 137 | 1 |
| **Native Currency** | MATIC | ETH |
| **RPC URL** | https://polygon-rpc.com/ | https://eth.llamarpc.com |
| **Block Explorer** | Polygonscan | Etherscan |
| **DEX** | QuickSwap | Uniswap |
| **Testnet** | Polygon Amoy (80002) | Ethereum Sepolia (11155111) |
| **Testnet Explorer** | amoy.polygonscan.com | sepolia.etherscan.io |

## Contract Owner

The MTX contract is now owned by:
```
0xb248d5bd04f6fadee6146d0dac1da82b842a437b9c6444c4cbc1e7ee37033e7a
```

This address:
- Receives the initial supply (100M MTX)
- Can pause/unpause minting
- Can adjust the ETH to MTX exchange rate
- Can withdraw collected ETH from the contract

## Deployment Status

**⚠️ NOT YET DEPLOYED**

The contracts have been updated and are ready for deployment, but they have not been deployed to Ethereum Mainnet yet. The placeholder address (`0x0000000000000000000000000000000000000000`) must be replaced with the actual deployed contract address.

## Post-Migration Steps

### For Developers

1. **Deploy to Testnet First**
   ```bash
   npm run deploy:sepolia
   ```

2. **Test All Functionality**
   - Wallet connection on Ethereum Sepolia
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
   npm run verify:mainnet <CONTRACT_ADDRESS> "100000000" "0xb248d5bd04f6fadee6146d0dac1da82b842a437b9c6444c4cbc1e7ee37033e7a"
   ```

5. **Update Configuration**
   - Set `MTX_CONTRACT_ADDRESS` in environment variables
   - Update `src/config/mtx.ts` with deployed address

6. **Add Liquidity to Uniswap**
   - Create ETH/MTX pool on Uniswap
   - Add initial liquidity

### For Users

1. **Switch Network**
   - Users must switch from Polygon to Ethereum Mainnet in their wallets
   - MetaMask will prompt for network change automatically

2. **Add MTX Token**
   - Use the new Ethereum Mainnet contract address
   - Token symbol remains "MTX"

3. **Purchase MTX**
   - Direct mint with ETH (not MATIC)
   - Or swap on Uniswap (not QuickSwap)

## Security Considerations

1. **Contract Ownership**
   - Owner address is now explicitly set during deployment
   - Owner controls are limited to:
     - Pausing/unpausing minting
     - Adjusting exchange rate
     - Withdrawing ETH

2. **Testing Required**
   - All functionality must be tested on Sepolia testnet before mainnet deployment
   - Small test transactions recommended initially

3. **Verification**
   - All contracts must be verified on Etherscan
   - Source code and constructor arguments publicly visible

## Breaking Changes

⚠️ **Important**: This is a complete network migration, not a token migration or bridge.

- **Old Polygon MTX tokens cannot be migrated** - this is a fresh deployment on Ethereum
- **Users need to switch networks** in their wallets
- **New contract address** will be different from any previous deployments
- **DEX changed** from QuickSwap to Uniswap

## Support and Resources

- **Etherscan**: https://etherscan.io/
- **Uniswap**: https://app.uniswap.org/
- **Sepolia Faucet**: https://sepoliafaucet.com/
- **Deployment Guide**: [MTX_Deployment_Guide.md](MTX_Deployment_Guide.md)

## Rollback Plan

If issues are discovered after deployment:

1. **Pause Minting** - Use the `setMintingPaused(true)` function
2. **Investigate Issues** - Check transaction logs on Etherscan
3. **Communication** - Notify users immediately
4. **Fix and Redeploy** - If needed, deploy new contract with fixes

## Conclusion

This migration moves the Matrix Hub ecosystem from Polygon to Ethereum Mainnet, providing access to:
- Greater liquidity on Uniswap
- More established ecosystem
- Wider user base
- Better developer tooling

All changes are backward-compatible at the contract level, maintaining the same ERC-20 interface and functionality while updating the underlying network infrastructure.
