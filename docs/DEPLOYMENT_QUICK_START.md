# MTX Token Deployment - Quick Reference

## Current Status

**⚠️ Contract Not Yet Deployed**

The MTX token contract is ready for deployment but has not been deployed to any live network yet. The current placeholder address (`0x0000000000000000000000000000000000000000`) will not work.

## Quick Deploy

### Prerequisites

1. Install dependencies: `npm install`
2. Create `.env` file: `cp .env.example .env`
3. Add your private key to `.env` (wallet with ETH for gas)
4. Get testnet ETH: https://sepoliafaucet.com/

### Deploy Commands

```bash
# Interactive deployment (recommended)
npm run deploy

# Or deploy directly to testnet
npm run deploy:sepolia

# Or deploy directly to mainnet (after testing!)
npm run deploy:mainnet
```

### After Deployment

1. **Verify Contract**
   ```bash
   # For testnet
   npm run verify:sepolia YOUR_CONTRACT_ADDRESS "100000000" "0xb248d5bd04f6fadee6146d0dac1da82b842a437b9c6444c4cbc1e7ee37033e7a"
   
   # For mainnet
   npm run verify:mainnet YOUR_CONTRACT_ADDRESS "100000000" "0xb248d5bd04f6fadee6146d0dac1da82b842a437b9c6444c4cbc1e7ee37033e7a"
   ```

2. **Update Configuration**
   - Update `src/config/mtx.ts` with the deployed contract address
   - Or set `MTX_CONTRACT_ADDRESS` environment variable

3. **Test Everything**
   - Connect wallet on correct network (Ethereum Mainnet)
   - Test direct mint with small amount (0.01 ETH)
   - Verify token appears in wallet
   - Test DEX integration on Uniswap

4. **Add Liquidity**
   - Go to https://app.uniswap.org/
   - Add ETH/MTX liquidity pool
   - Enables DEX trading

## Network Information

### Ethereum Mainnet (Production)
- **Chain ID**: 1
- **Currency**: ETH
- **RPC**: https://eth.llamarpc.com
- **Explorer**: https://etherscan.io/
- **DEX**: Uniswap

### Ethereum Sepolia Testnet (Testing)
- **Chain ID**: 11155111
- **Currency**: Test ETH
- **RPC**: https://rpc.sepolia.org/
- **Explorer**: https://sepolia.etherscan.io/
- **Faucet**: https://sepoliafaucet.com/

## Verification on Etherscan

After deployment, verify your contract on Etherscan:

1. Get Etherscan API key from: https://etherscan.io/myapikey
2. Add to `.env`: `ETHERSCAN_API_KEY=your_key_here`
3. Run verification command (see above)

## Security Checklist

Before going live:

- [ ] Contract deployed to testnet first
- [ ] All functions tested on testnet
- [ ] Contract verified on Etherscan
- [ ] Private keys secured (never commit to Git)
- [ ] Contract ownership checked
- [ ] Rate and minting controls tested
- [ ] Emergency pause tested
- [ ] Max supply verified
- [ ] Initial DEX liquidity added (Uniswap)
- [ ] All documentation updated
- [ ] Frontend tested with real contract
- [ ] User-facing addresses match deployment

## Troubleshooting

**"Cannot download compiler"**
- Check internet connection
- Try again in a few minutes
- Solidity compiler downloads from soliditylang.org

**"Insufficient funds"**
- Get more ETH from faucet (testnet)
- Or buy ETH on exchange (mainnet)

**"Transaction failed"**
- Check gas price
- Verify network is correct
- Ensure wallet has enough ETH

**"Contract verification failed"**
- Check constructor arguments match deployment
- Verify Etherscan API key is correct
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

**Ready to deploy? Run: `npm run deploy:sepolia` (testnet) or `npm run deploy:mainnet` (production)**
