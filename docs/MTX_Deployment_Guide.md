# MTX Contract Deployment Guide

## ⚠️ CRITICAL SECURITY WARNING

**The address `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` referenced in the problem statement is a Hardhat local testnet default address and is NOT deployed on any live blockchain network.**

**DO NOT:**
- Use this address in production
- Direct users to send funds to this address
- Reference this address in live documentation
- Enable the direct mint feature with this address

**This would result in complete loss of user funds!**

## Current Status

The MTX contract is currently configured with a placeholder address (`0x0000000000000000000000000000000000000000`) and **MUST** be properly deployed before any production use.

## Deployment Steps

### 1. Choose Network

Based on the Polygonscan account "MatrixHubOrg", the recommended deployment target is:
- **Polygon Mainnet** (ChainID: 137)
- Alternative: **Polygon Amoy Testnet** (ChainID: 80002) for testing

### 2. Prerequisites

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Edit `.env` file:
```
ETH_RPC_URL=https://polygon-rpc.com/
PRIVATE_KEY=YOUR_DEPLOYER_PRIVATE_KEY_HERE
POLYGONSCAN_API_KEY=YOUR_POLYGONSCAN_API_KEY
```

**⚠️ SECURITY**: Never commit your private key! Keep `.env` in `.gitignore`.

### 3. Update Hardhat Configuration

Update `hardhat.config.js`:

```javascript
import "dotenv/config";
import "@nomicfoundation/hardhat-toolbox";

export default {
  solidity: "0.8.20",
  networks: {
    polygon: {
      url: process.env.ETH_RPC_URL || "https://polygon-rpc.com/",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 137
    },
    amoy: {
      url: "https://rpc-amoy.polygon.technology/",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80002
    }
  },
  etherscan: {
    apiKey: {
      polygon: process.env.POLYGONSCAN_API_KEY,
      polygonAmoy: process.env.POLYGONSCAN_API_KEY
    }
  }
};
```

### 4. Deploy Contract

#### Test Deployment (Polygon Amoy Testnet)

```bash
# Get testnet MATIC from faucet: https://faucet.polygon.technology/

# Deploy to testnet
npx hardhat run scripts/deploy_mtx.js --network amoy
```

#### Production Deployment (Polygon Mainnet)

```bash
# Ensure you have real MATIC in your deployer wallet

# Deploy to mainnet
npx hardhat run scripts/deploy_mtx.js --network polygon
```

The script will output:
```
MTX deployed to: 0xYourActualContractAddress
```

**SAVE THIS ADDRESS IMMEDIATELY!**

### 5. Verify Contract on Polygonscan

```bash
# Verify the contract (replace with your actual address and constructor args)
npx hardhat verify --network polygon 0xYourActualContractAddress "100000000"
```

This will link the contract to your MatrixHubOrg Polygonscan account.

### 6. Update Configuration

Edit `src/config/mtx.ts`:

```typescript
export const MTX = {
  address: "0xYourActualContractAddress", // ✅ Real deployed address
  symbol: "MTX",
  decimals: 18,
  chainId: 137, // Polygon Mainnet
  chainName: "Polygon",
  name: "Matrix Hub Coin",
  ethToMtxRate: 1000,
  // ... rest of config
};
```

### 7. Update Contract Comments

Update `contracts/MatrixHubCoin.sol` and any other files that reference the old address.

### 8. Update Documentation

Update all documentation files with the real contract address:
- `README.md`
- `docs/MTX_Wallet_Integration.md`
- `docs/MTX_Tokenomics.md`
- `src/pages/buy-mtx.astro`

### 9. Test Everything

Before going live:

1. **Test wallet connection** on the correct network
2. **Test direct mint** with a small amount (0.01 MATIC)
3. **Test token display** and balance reading
4. **Test DEX integration** on QuickSwap
5. **Verify contract** on Polygonscan is readable
6. **Check EIP-747** (Add Token) functionality

### 10. Security Checklist

- [ ] Contract verified on Polygonscan
- [ ] Deployer wallet secured
- [ ] Private keys removed from code
- [ ] Contract ownership transferred if needed
- [ ] Rate and minting controls tested
- [ ] Emergency pause functionality tested
- [ ] Max supply limit verified
- [ ] Initial liquidity provided on DEX
- [ ] All documentation updated
- [ ] User-facing addresses match deployment

## Network Information

### Polygon Mainnet
- **Chain ID**: 137
- **Currency**: MATIC
- **RPC**: https://polygon-rpc.com/
- **Explorer**: https://polygonscan.com/
- **Polygonscan Account**: MatrixHubOrg

### Polygon Amoy Testnet
- **Chain ID**: 80002  
- **Currency**: Test MATIC
- **RPC**: https://rpc-amoy.polygon.technology/
- **Explorer**: https://amoy.polygonscan.com/
- **Faucet**: https://faucet.polygon.technology/

## Post-Deployment

### Add Liquidity to QuickSwap

1. Go to https://quickswap.exchange/
2. Add MATIC/MTX liquidity pool
3. This enables DEX trading for users

### Monitor Contract

- Track transactions on Polygonscan
- Monitor minting activity
- Watch for any issues
- Keep emergency pause available

## Support

If deployment fails or you need assistance:
1. Check Hardhat error messages
2. Verify you have enough MATIC for gas
3. Confirm RPC endpoint is working
4. Check network connectivity
5. Review Hardhat documentation

## Important Notes

- **Never deploy to mainnet without testnet testing first**
- **Always verify contracts on Polygonscan**
- **Keep deployer private key secure**
- **Test with small amounts first**
- **Have emergency procedures ready**

## Current Status: NOT DEPLOYED ⚠️

The contract is currently using a placeholder address and is not functional on any live network. All mint and purchase features will fail until proper deployment is completed.
