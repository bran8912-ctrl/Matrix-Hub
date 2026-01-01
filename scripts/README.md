# Scripts

This directory contains scripts for deploying and managing Matrix Hub smart contracts, as well as utility scripts for configuration and administration.

## Utility Scripts

### `generate-password-hash.js`
Generates a SHA-256 hash for the Owners Portal password authentication.

**Usage:**
```bash
node scripts/generate-password-hash.js "your-secure-password"
```

**Purpose:**
- Creates a secure hash for protecting the `/owners` portal
- Hash is stored in environment variables and embedded at build time
- Enables client-side authentication without exposing the actual password

**Example:**
```bash
$ node scripts/generate-password-hash.js "MySecureP@ssw0rd123"

✅ Password hash generated successfully!

Add this to your .env file:

OWNERS_PASSWORD_HASH=sha256-5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8

⚠️  Keep this hash secret and never commit it to the repository!
```

**Next Steps:**
1. Copy the generated hash to your `.env` file
2. Rebuild the site with `npm run build`
3. Deploy the site

**Documentation:**
- See [docs/OWNERS_PORTAL_AUTH.md](../docs/OWNERS_PORTAL_AUTH.md) for complete setup instructions
- See `.env.example` for configuration template

## Main Deployment Scripts

### `deploy_mtx.js`
Deploys the MTX (Matrix-HubCoin) token contract to Ethereum networks.

**Usage:**
```bash
# Deploy to Sepolia testnet
npm run deploy:sepolia

# Deploy to Mainnet
npm run deploy:mainnet
```

**Requirements:**
- `.env` file with `PRIVATE_KEY` (deployer wallet private key without 0x)
- Sufficient ETH in deployer wallet for gas fees
- `ETHERSCAN_API_KEY` (recommended for contract verification)

**Configuration:**
- Initial Supply: 100,000,000 MTX
- Initial Owner: 0x58e7893356002ac8f8f612f7b3d29d8b181d85b3
- Token Name: Matrix-HubCoin
- Token Symbol: MTX
- Decimals: 18

**Output:**
- Deploys contract and prints contract address
- Saves deployment info to `deployments/mtx-{network}.json`
- Provides verification command for Etherscan

### `deploy_casino.js`
Deploys casino-related smart contracts.

**Note:** Casino contracts are currently under development.

## Environment Setup

### Required Environment Variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Deployer wallet private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# RPC URLs (defaults provided if not set)
MAINNET_RPC_URL=https://eth.llamarpc.com
SEPOLIA_RPC_URL=https://rpc.sepolia.org/

# Etherscan API key for contract verification
# Get from: https://etherscan.io/myapikey
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

**Security Notes:**
- ✅ `.env` is in `.gitignore` - never commit it!
- ✅ Use a burner wallet, not your main wallet
- ✅ Keep your private keys and API keys secret

## Deployment Flow

### 1. Prepare Environment

```bash
# Install dependencies
npm install

# Set up .env file
cp .env.example .env
# Edit .env with your private key and API key

# Get test ETH (for Sepolia)
# Visit: https://sepoliafaucet.com/
```

### 2. Compile Contracts

```bash
npm run compile
```

This generates the contract artifacts needed for deployment.

### 3. Deploy to Testnet (Recommended First)

```bash
npm run deploy:sepolia
```

**Save the contract address!**

### 4. Verify Contract

```bash
npm run verify:sepolia YOUR_CONTRACT_ADDRESS "100000000" "0x58e7893356002ac8f8f612f7b3d29d8b181d85b3"
```

Replace `YOUR_CONTRACT_ADDRESS` with the deployed contract address.

### 5. Test Thoroughly

- Check contract on Sepolia Etherscan
- Verify token balance of initial owner
- Test contract functions
- Test wallet integration

### 6. Deploy to Mainnet (After Testing)

```bash
npm run deploy:mainnet
```

### 7. Verify on Mainnet

```bash
npm run verify:mainnet YOUR_CONTRACT_ADDRESS "100000000" "0x58e7893356002ac8f8f612f7b3d29d8b181d85b3"
```

## Networks

### Sepolia Testnet
- **Chain ID**: 11155111
- **RPC**: https://rpc.sepolia.org/
- **Explorer**: https://sepolia.etherscan.io/
- **Faucet**: https://sepoliafaucet.com/
- **Purpose**: Testing before mainnet deployment

### Ethereum Mainnet
- **Chain ID**: 1
- **RPC**: https://eth.llamarpc.com
- **Explorer**: https://etherscan.io/
- **Purpose**: Production deployment

## Deployment Artifacts

After deployment, artifacts are saved to `deployments/`:
- `mtx-sepolia.json` - Sepolia deployment info
- `mtx-mainnet.json` - Mainnet deployment info

Each file contains:
- Contract address
- Deployer address
- Owner address
- Deployment timestamp
- Transaction hash
- Block number
- Network information

## Troubleshooting

### "Private key missing"
- Ensure `PRIVATE_KEY` is set in `.env`
- Private key should NOT include `0x` prefix
- Use a 64-character hex string

### "Insufficient funds"
- Get test ETH from faucet (Sepolia)
- Buy ETH on exchange (Mainnet)
- Ensure deployer wallet has enough ETH for gas

### "Cannot download compiler"
- Check internet connection
- Hardhat downloads Solidity compiler from soliditylang.org
- If artifacts exist, deployment may still work

### "Verification failed"
- Ensure `ETHERSCAN_API_KEY` is set in `.env`
- Wait 1-2 minutes after deployment before verifying
- Check constructor arguments match deployment exactly
- Verify API key is valid at https://etherscan.io/myapikey

## Documentation

For detailed deployment instructions, see:
- [Sepolia Deployment Guide](../docs/SEPOLIA_DEPLOYMENT.md)
- [Full Deployment Guide](../docs/MTX_Deployment_Guide.md)
- [Quick Start Guide](../docs/DEPLOYMENT_QUICK_START.md)

## Support

For questions or issues:
1. Check the documentation
2. Review Hardhat documentation: https://hardhat.org/
3. Check Etherscan API docs: https://docs.etherscan.io/

---

**Quick Deploy: `npm run deploy:sepolia` (testnet) or `npm run deploy:mainnet` (production)**
