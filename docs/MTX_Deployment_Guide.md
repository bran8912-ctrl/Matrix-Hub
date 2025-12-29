# MTX Contract Deployment Guide

## ⚠️ CRITICAL SECURITY WARNING

**The MTX contract is now configured for Ethereum Mainnet deployment with the specified owner address.**

**DO NOT:**
- Use testnet addresses in production
- Direct users to send funds to unverified addresses
- Reference unverified addresses in live documentation
- Enable the direct mint feature without proper testing

**This would result in complete loss of user funds!**

## Current Status

The MTX contract is currently configured with a placeholder address (`0x0000000000000000000000000000000000000000`) and **MUST** be properly deployed before any production use.

## Deployment Steps

### 1. Choose Network

The recommended deployment target is:
- **Ethereum Mainnet** (ChainID: 1) - Primary production network
- Alternative: **Ethereum Sepolia Testnet** (ChainID: 11155111) for testing

### 2. Prerequisites

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Edit `.env` file:
```
MAINNET_RPC_URL=https://eth.llamarpc.com
PRIVATE_KEY=YOUR_DEPLOYER_PRIVATE_KEY_HERE
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

**⚠️ SECURITY**: Never commit your private key! Keep `.env` in `.gitignore`.

### 3. Deploy Contract

#### Test Deployment (Ethereum Sepolia Testnet)

```bash
# Get testnet ETH from faucet: https://sepoliafaucet.com/

# Deploy to testnet
npm run deploy:sepolia
```

#### Production Deployment (Ethereum Mainnet)

```bash
# Ensure you have real ETH in your deployer wallet

# Deploy to mainnet
npm run deploy:mainnet
```

The script will output:
```
MTX deployed to: 0xYourActualContractAddress
Contract Owner: 0xb248d5bd04f6fadee6146d0dac1da82b842a437b9c6444c4cbc1e7ee37033e7a
```

**SAVE THIS ADDRESS IMMEDIATELY!**

### 4. Verify Contract on Etherscan

```bash
# Verify the contract (replace with your actual address and constructor args)
npm run verify:mainnet 0xYourActualContractAddress "100000000" "0xb248d5bd04f6fadee6146d0dac1da82b842a437b9c6444c4cbc1e7ee37033e7a"
```

This will make the contract publicly verifiable on Etherscan.

### 5. Update Configuration

Edit `src/config/mtx.ts`:

```typescript
export const MTX = {
  address: "0xYourActualContractAddress", // ✅ Real deployed address
  symbol: "MTX",
  decimals: 18,
  chainId: 1, // Ethereum Mainnet
  chainName: "Ethereum",
  name: "Matrix Hub Coin",
  ethToMtxRate: 1000,
  // ... rest of config
};
```

### 6. Test Everything

Before going live:

1. **Test wallet connection** on Ethereum Mainnet
2. **Test direct mint** with small amount (0.01 ETH)
3. **Test token display** and balance reading
4. **Test DEX integration** on Uniswap
5. **Verify contract** on Etherscan is readable
6. **Check EIP-747** (Add Token) functionality

### 7. Security Checklist

- [ ] Contract deployed to testnet first
- [ ] Contract verified on Etherscan
- [ ] Deployer wallet secured
- [ ] Private keys removed from code
- [ ] Contract ownership verified
- [ ] Rate and minting controls tested
- [ ] Emergency pause functionality tested
- [ ] Max supply limit verified
- [ ] Initial liquidity provided on Uniswap
- [ ] All documentation updated
- [ ] User-facing addresses match deployment

## Network Information

### Ethereum Mainnet
- **Chain ID**: 1
- **Currency**: ETH
- **RPC**: https://eth.llamarpc.com
- **Explorer**: https://etherscan.io/
- **DEX**: Uniswap

### Ethereum Sepolia Testnet
- **Chain ID**: 11155111  
- **Currency**: Test ETH
- **RPC**: https://rpc.sepolia.org/
- **Explorer**: https://sepolia.etherscan.io/
- **Faucet**: https://sepoliafaucet.com/

## Post-Deployment

### Add Liquidity to Uniswap

1. Go to https://app.uniswap.org/
2. Add ETH/MTX liquidity pool
3. This enables DEX trading for users

### Monitor Contract

- Track transactions on Etherscan
- Monitor minting activity
- Watch for any issues
- Keep emergency pause available

## Important Notes

- **Never deploy to mainnet without testnet testing first**
- **Always verify contracts on Etherscan**
- **Keep deployer private key secure**
- **Test with small amounts first**
- **Have emergency procedures ready**

## Current Status: NOT DEPLOYED ⚠️

The contract is currently using a placeholder address and is not functional on any live network. All mint and purchase features will fail until proper deployment is completed.
