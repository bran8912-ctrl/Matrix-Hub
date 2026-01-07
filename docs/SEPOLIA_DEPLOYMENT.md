# Deploy MTX Token to Sepolia Testnet

This guide walks you through deploying the MTX token contract to Ethereum Sepolia testnet.

## Prerequisites

### 1. Get Sepolia Test ETH

You need Sepolia ETH to pay for gas fees:
- Visit: https://sepoliafaucet.com/
- Or: https://www.alchemy.com/faucets/ethereum-sepolia
- Request test ETH for your deployer wallet address

### 2. Get Etherscan API Key

**Required for contract verification:**

1. Go to https://etherscan.io/myapikey
2. Create an account or sign in
3. Click "Add" to create a new API key
4. Name it (e.g., "Matrix Hub Deployment")
5. Copy the generated API key

**Note**: The same API key works for both Mainnet and Sepolia Etherscan.

### 3. Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and add your values:

```env
# Your deployer wallet private key (WITHOUT the 0x prefix)
# ⚠️ Use a burner wallet with only test ETH, not your main wallet!
PRIVATE_KEY=your_private_key_without_0x

# Sepolia RPC URL (default provided, or use your own)
SEPOLIA_RPC_URL=https://rpc.sepolia.org/

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

**Security Reminder:**
- ✅ `.env` is already in `.gitignore` - never commit it
- ✅ Use a burner wallet for deployment
- ✅ Keep your API keys secret

## Deployment Steps

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Compile Contracts

```bash
npm run compile
```

This compiles the Solidity contracts and generates artifacts.

### Step 3: Deploy to Sepolia

```bash
npm run deploy:sepolia
```

This will:
1. Connect to Sepolia testnet
2. Deploy the MatrixHubCoin contract
3. Mint 100M MTX to the owner address: `0x9fb4bb44d8d962d695fc93b3dc15f1b287391077`
4. Save deployment info to `deployments/mtx-sepolia.json`

**Expected output:**
```
Starting MTX Token Deployment to Sepolia testnet...
Network: sepolia
Deploying with account: 0xYourDeployerAddress
Account balance: 1.0 ETH

Deployment parameters:
- Initial Supply: 100000000 MTX
- Initial Owner: 0x9fb4bb44d8d962d695fc93b3dc15f1b287391077
- Token Name: MatrixHubCoin
- Token Symbol: MTX
- Decimals: 18
- Network: Sepolia (Chain ID: 11155111)

Deploying MatrixHubCoin contract...

✅ MTX Token deployed successfully!
Contract Address: 0xYourContractAddress
Contract Owner: 0x9fb4bb44d8d962d695fc93b3dc15f1b287391077
Transaction Hash: 0xYourTxHash
Block Number: 12345

📄 Deployment info saved to: deployments/mtx-sepolia.json

📋 Next Steps:
1. Verify contract on Etherscan:
   npx hardhat verify --network sepolia 0xYourContractAddress "100000000" "0x9fb4bb44d8d962d695fc93b3dc15f1b287391077"

2. Update src/config/mtx.ts with the contract address:
   address: "0xYourContractAddress"

3. Add liquidity to Uniswap (ETH/MTX pair)

4. Test the contract thoroughly before announcing

🔍 View on Etherscan: https://sepolia.etherscan.io/address/0xYourContractAddress
```

**SAVE THE CONTRACT ADDRESS!** You'll need it for verification and configuration.

### Step 4: Verify Contract on Etherscan

After deployment, verify the contract to make it publicly readable:

```bash
npm run verify:sepolia 0xYourContractAddress "100000000" "0x9fb4bb44d8d962d695fc93b3dc15f1b287391077"
```

Replace `0xYourContractAddress` with your actual deployed contract address.

**What verification does:**
- Makes contract source code publicly readable on Etherscan
- Enables users to interact with contract directly on Etherscan
- Builds trust by showing the contract matches the source code
- Allows Etherscan to properly decode transactions and events

**Expected output:**
```
Successfully submitted source code for contract
contracts/MatrixHubCoin.sol:MatrixHubCoin at 0xYourContractAddress
for verification on the block explorer. Waiting for verification result...

Successfully verified contract MatrixHubCoin on Etherscan.
https://sepolia.etherscan.io/address/0xYourContractAddress#code
```

### Step 5: Update Configuration

Update `src/config/mtx.ts` with your deployed contract address:

```typescript
export const MTX = {
  address: "0xYourActualContractAddress", // ✅ Your Sepolia contract address
  symbol: "MTX",
  decimals: 18,
  chainId: 11155111, // Sepolia testnet
  chainName: "Sepolia",
  // ... rest of config
};
```

### Step 6: Test the Deployment

1. **View on Etherscan**: Visit the Etherscan URL from the deployment output
2. **Check Contract**: Verify the contract shows as verified with green checkmark
3. **Check Balance**: Confirm initial owner has 100M MTX tokens
4. **Test Transactions**: Try reading contract values on Etherscan

## Troubleshooting

### "Error: private key missing"
- Make sure `PRIVATE_KEY` is set in `.env`
- Private key should NOT include the `0x` prefix
- Example: `PRIVATE_KEY=1234567890abcdef...` (64 characters)

### "Error: insufficient funds"
- Get more Sepolia test ETH from a faucet
- Deployment typically costs 0.01-0.05 test ETH

### "Cannot download compiler"
- This happens when Hardhat can't reach the internet
- If artifacts already exist, you may be able to deploy anyway
- Otherwise, check your internet connection and try again

### "Etherscan verification failed"
- Make sure `ETHERSCAN_API_KEY` is set in `.env`
- Verify the API key is valid (check https://etherscan.io/myapikey)
- Wait 1-2 minutes after deployment before verifying
- Ensure constructor arguments match exactly: `"100000000"` and `"0x9fb4bb44d8d962d695fc93b3dc15f1b287391077"`

### "Error: already verified"
- Contract was already verified successfully
- You can view it on Etherscan

## Network Information

### Sepolia Testnet
- **Chain ID**: 11155111
- **Currency**: Sepolia ETH (test ETH)
- **RPC URL**: https://rpc.sepolia.org/
- **Block Explorer**: https://sepolia.etherscan.io/
- **Faucets**: 
  - https://sepoliafaucet.com/
  - https://www.alchemy.com/faucets/ethereum-sepolia

### Contract Details
- **Name**: Matrix-HubCoin
- **Symbol**: MTX
- **Decimals**: 18
- **Initial Supply**: 100,000,000 MTX
- **Initial Owner**: 0x9fb4bb44d8d962d695fc93b3dc15f1b287391077

## After Deployment

### Testing Checklist
- [ ] Contract appears on Sepolia Etherscan
- [ ] Contract is verified (green checkmark)
- [ ] Initial owner has 100M MTX balance
- [ ] Can read contract values on Etherscan
- [ ] Token shows correct name, symbol, decimals
- [ ] All contract functions are visible on Etherscan

### Next Steps for Production
1. Test all contract functions thoroughly on Sepolia
2. Test wallet integration with Sepolia contract
3. Test buying MTX with test ETH
4. Once confident, deploy to Mainnet using `npm run deploy:mainnet`
5. Add liquidity to Uniswap after mainnet deployment

## Important Notes

- **Never commit your `.env` file** - it's protected by `.gitignore`
- **Use a burner wallet** for deployment, not your main wallet
- **Test on Sepolia first** before deploying to mainnet
- **Save your contract address** immediately after deployment
- **Verify on Etherscan** to build trust and enable public interaction
- **Keep your Etherscan API key secret** - treat it like a password

## Support

For more information:
- [Full Deployment Guide](MTX_Deployment_Guide.md)
- [Quick Start Guide](QUICK_DEPLOY.md)
- [Wallet Integration](MTX_Wallet_Integration.md)

---

**Ready to deploy? Run: `npm run deploy:sepolia`**
