# MTX Token Deployment - Quick Reference

## Current Status

**⚠️ Contract Not Yet Deployed**

The MTX token contract is ready for deployment but has not been deployed to any live network yet. The current placeholder address (`0x0000000000000000000000000000000000000000`) will not work.

## Quick Deploy

### Prerequisites

1. Install dependencies: `npm install`
2. Create `.env` file: `cp .env.example .env`
3. Add your private key to `.env` (wallet with MATIC for gas)
4. Get testnet MATIC: https://faucet.polygon.technology/

### Deploy Commands

```bash
# Interactive deployment (recommended)
npm run deploy

# Or deploy directly to testnet
npm run deploy:amoy

# Or deploy directly to mainnet (after testing!)
npm run deploy:polygon
```

### After Deployment

1. **Verify Contract**
   ```bash
   # For testnet
   npx hardhat verify --network amoy YOUR_CONTRACT_ADDRESS "100000000"
   
   # For mainnet
   npx hardhat verify --network polygon YOUR_CONTRACT_ADDRESS "100000000"
   ```

2. **Update Configuration**
   - Update `src/config/mtx.ts` with the deployed contract address
   - Or set `MTX_CONTRACT_ADDRESS` environment variable

3. **Test Everything**
   - Connect wallet on correct network (Polygon)
   - Test direct mint with small amount
   - Verify token appears in wallet
   - Test DEX integration on QuickSwap

4. **Add Liquidity**
   - Go to https://quickswap.exchange/
   - Add MATIC/MTX liquidity pool
   - Enables DEX trading

## Network Information

### Polygon Mainnet (Production)
- **Chain ID**: 137
- **Currency**: MATIC
- **RPC**: https://polygon-rpc.com/
- **Explorer**: https://polygonscan.com/
- **DEX**: QuickSwap

### Polygon Amoy Testnet (Testing)
- **Chain ID**: 80002
- **Currency**: Test MATIC
- **RPC**: https://rpc-amoy.polygon.technology/
- **Explorer**: https://amoy.polygonscan.com/
- **Faucet**: https://faucet.polygon.technology/

## Verification on Polygonscan

After deployment, verify your contract to link it to the MatrixHubOrg Polygonscan account:

1. Get Polygonscan API key from: https://polygonscan.com/myapikey
2. Add to `.env`: `POLYGONSCAN_API_KEY=your_key_here`
3. Run verification command (see above)

## Security Checklist

Before going live:

- [ ] Contract deployed to testnet first
- [ ] All functions tested on testnet
- [ ] Contract verified on Polygonscan
- [ ] Private keys secured (never commit to Git)
- [ ] Contract ownership checked
- [ ] Rate and minting controls tested
- [ ] Emergency pause tested
- [ ] Max supply verified
- [ ] Initial DEX liquidity added
- [ ] All documentation updated
- [ ] Frontend tested with real contract
- [ ] User-facing addresses match deployment

## Troubleshooting

**"Cannot download compiler"**
- Check internet connection
- Try again in a few minutes
- Solidity compiler downloads from soliditylang.org

**"Insufficient funds"**
- Get more MATIC from faucet (testnet)
- Or buy MATIC on exchange (mainnet)

**"Transaction failed"**
- Check gas price
- Verify network is correct
- Ensure wallet has enough MATIC

**"Contract verification failed"**
- Check constructor arguments match deployment
- Verify Polygonscan API key is correct
- Wait a few minutes after deployment before verifying

## Support

For detailed instructions, see:
- [Full Deployment Guide](MTX_Deployment_Guide.md)
- [Wallet Integration Docs](MTX_Wallet_Integration.md)
- [Tokenomics](MTX_Tokenomics.md)

## Important Notes

- **Always test on testnet first**
- **Never share or commit private keys**
- **Verify contract address before directing users**
- **Keep emergency pause controls ready**
- **Monitor contract for unusual activity**

---

**Ready to deploy? Run: `npm run deploy`**
