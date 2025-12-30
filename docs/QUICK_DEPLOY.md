# 🚀 Quick Start: Deploy MTX to Sepolia

## Prerequisites (5 minutes)

1. **Get Sepolia Test ETH**
   - Visit: https://sepoliafaucet.com/
   - Request 0.5 test ETH

2. **Get Etherscan API Key**
   - Go to: https://etherscan.io/myapikey
   - Sign up/login → Create API key
   - Copy the key (e.g., `RG53PFV8R4C6GD9ERBERTI4U1IW1E2GQPQ`)

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   PRIVATE_KEY=your_burner_wallet_private_key_without_0x
   ETHERSCAN_API_KEY=RG53PFV8R4C6GD9ERBERTI4U1IW1E2GQPQ
   ```

## Deploy (2 minutes)

```bash
# Install dependencies (first time only)
npm install

# Compile contracts (first time only)
npm run compile

# Deploy to Sepolia testnet
npm run deploy:sepolia
```

**SAVE THE CONTRACT ADDRESS!**

## Verify (1 minute)

```bash
# Replace YOUR_CONTRACT_ADDRESS with the address from deployment
npm run verify:sepolia YOUR_CONTRACT_ADDRESS "100000000" "0x58e7893356002ac8f8f612f7b3d29d8b181d85b3"
```

## Done! ✅

Your contract is now:
- ✅ Deployed to Sepolia testnet
- ✅ Verified on Sepolia Etherscan
- ✅ Ready for testing

View on Etherscan: `https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS`

---

## Need Help?

- **Full Guide**: [SEPOLIA_DEPLOYMENT.md](SEPOLIA_DEPLOYMENT.md)
- **Checklist**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- **Troubleshooting**: See full guide above

## Troubleshooting

| Error | Solution |
|-------|----------|
| "Private key missing" | Add `PRIVATE_KEY` to `.env` (no 0x prefix) |
| "Insufficient funds" | Get more test ETH from faucet |
| "Verification failed" | Check `ETHERSCAN_API_KEY` is set correctly |
| "Cannot download compiler" | Artifacts may exist, try deploying anyway |

---

**Command:** `npm run deploy:sepolia` 🚀
