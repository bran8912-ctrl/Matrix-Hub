# Matrix-Hub.org Smart Contract Deployment Guide

This guide provides comprehensive, step-by-step instructions for safely deploying Matrix-Hub.org smart contracts to testnets and mainnet.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Deployment Scripts](#deployment-scripts)
- [Testnet Deployment (Automated)](#testnet-deployment-automated)
- [Mainnet Deployment (Manual Only)](#mainnet-deployment-manual-only)
- [Post-Deployment Verification](#post-deployment-verification)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)

---

## Overview

Matrix-Hub.org uses three primary deployment scripts:

1. **`deploy_mtx.js`** - Deploys the MTX token contract
2. **`deploy_casino.js`** - Deploys casino contracts (RNGEngine, CasinoReserve, LiquidityRouter, CasinoCore)
3. **`distribute_mtx.js`** - Distributes MTX tokens to ecosystem contracts

### Deployment Order

The scripts **must** be run in this order:

```
1. deploy_mtx.js      → Deploy MTX token first
2. deploy_casino.js   → Deploy casino contracts (requires MTX address)
3. distribute_mtx.js  → Distribute tokens to ecosystem (requires both deployments)
```

---

## Prerequisites

### Required Software

- **Node.js** v18.14 or higher
- **npm** or **yarn**
- **Hardhat** (installed via npm)
- **Git** (for version control)

### Required Accounts & Keys

#### For Testnet (Sepolia)

- [ ] Ethereum wallet with testnet ETH (get from [Sepolia Faucet](https://sepoliafaucet.com/))
- [ ] Wallet private key (for deployment)
- [ ] Sepolia RPC URL (free from [Infura](https://infura.io/) or [Alchemy](https://www.alchemy.com/))
- [ ] Etherscan API key (optional, for contract verification)

#### For Mainnet

- [ ] Ethereum wallet with sufficient ETH for deployment (~0.5-1 ETH recommended)
- [ ] **Hardware wallet strongly recommended** (Ledger, Trezor)
- [ ] Mainnet RPC URL (Infura, Alchemy, or your own node)
- [ ] Etherscan API key (for contract verification)

### Environment Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/bran8912-ctrl/Matrix-Hub.org.git
   cd Matrix-Hub.org
   ```

2. **Install dependencies:**

   ```bash
   npm ci
   ```

3. **Create `.env` file:**

   Copy `.env.example` to `.env` and fill in your values:

   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**

   Edit `.env` with your values:

   ```env
   # Testnet Configuration
   TESTNET_PRIVATE_KEY="your-testnet-private-key-here"
   SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR-PROJECT-ID"
   
   # Mainnet Configuration (for manual deployment only)
   MAINNET_RPC_URL="https://mainnet.infura.io/v3/YOUR-PROJECT-ID"
   # NEVER commit mainnet private keys - use hardware wallet
   
   # Etherscan (for contract verification)
   ETHERSCAN_API_KEY="your-etherscan-api-key"
   
   # Developer Wallet (receives 2% MTX allocation)
   DEVELOPER_WALLET="0x9fb4bb44d8d962d695fc93b3dc15f1b287391077"
   ```

   ⚠️ **Security Warning:** Never commit `.env` file or share private keys!

---

## Deployment Scripts

### Script Locations

All deployment scripts are in the `scripts/` directory:

```
scripts/
├── deploy_mtx.js         # Deploy MTX token
├── deploy_casino.js      # Deploy casino contracts
└── distribute_mtx.js     # Distribute MTX to ecosystem
```

### NPM Scripts

Quick commands available in `package.json`:

```json
{
  "deploy:testnet:mtx": "hardhat run scripts/deploy_mtx.js --network sepolia",
  "deploy:testnet:casino": "hardhat run scripts/deploy_casino.js --network sepolia",
  "deploy:testnet:distribute": "hardhat run scripts/distribute_mtx.js --network sepolia",
  "deploy:testnet:full": "npm run deploy:testnet:mtx && npm run deploy:testnet:casino && npm run deploy:testnet:distribute"
}
```

---

## Testnet Deployment (Automated)

### Option 1: GitHub Actions Workflow (Recommended)

The easiest way to deploy to testnet is using GitHub Actions:

1. **Set up GitHub Secrets:**

   Go to repository Settings → Secrets and variables → Actions, and add:

   - `TESTNET_PRIVATE_KEY`: Your testnet wallet private key
   - `SEPOLIA_RPC_URL`: Your Sepolia RPC endpoint URL
   - `ETHERSCAN_API_KEY`: Your Etherscan API key (optional)

2. **Run the workflow:**

   - Navigate to **Actions** tab in GitHub
   - Select **"Contract Deployment - Testnet"** workflow
   - Click **"Run workflow"**
   - Choose deployment options:
     - **Deployment type:** `full-deployment` (or individual components)
     - **Network:** `sepolia`
     - **Skip compilation:** `false` (unless reusing cached artifacts)
   - Click **"Run workflow"**

3. **Monitor progress:**

   - Watch the workflow run in real-time
   - Each job shows detailed progress and outputs
   - Download artifacts after completion

4. **Download deployment artifacts:**

   - Scroll to bottom of workflow run page
   - Download deployment JSON files from artifacts
   - Save to local `deployments/` directory

### Option 2: Local Deployment

Deploy from your local machine using npm scripts:

#### Step 1: Deploy MTX Token

```bash
npm run deploy:testnet:mtx
```

**Expected Output:**
```
Starting MTX Token Deployment to Ethereum Sepolia...
Network: sepolia
Deploying with account: 0x...
Account balance: 1.5 ETH

Deployment parameters:
- Maximum Supply Cap: 100000000 MTX
- Initial Minting: NONE (gradual distribution via buyMTX)
- Contract Owner: 0x9fb4bb44d8d962d695fc93b3dc15f1b287391077

✅ MTX Token deployed successfully!
Contract Address: 0x...
📄 Deployment info saved to: deployments/mtx-sepolia.json
```

#### Step 2: Deploy Casino Contracts

```bash
npm run deploy:testnet:casino
```

**Expected Output:**
```
Starting Casino Contracts Deployment to Ethereum Sepolia...
📋 Using MTX Token: 0x...

🎰 Deploying Casino Contracts on Ethereum...
1️⃣ Deploying RNGEngine...
✅ RNGEngine deployed: 0x...
2️⃣ Deploying CasinoReserve...
✅ CasinoReserve deployed: 0x...
3️⃣ Deploying LiquidityRouter...
✅ LiquidityRouter deployed: 0x...
4️⃣ Deploying CasinoCore...
✅ CasinoCore deployed: 0x...

🎉 All Casino Contracts Deployed Successfully!
📄 Deployment info saved to: deployments/casino-sepolia.json
```

#### Step 3: Distribute MTX Tokens

```bash
npm run deploy:testnet:distribute
```

**Expected Output:**
```
MTX Ecosystem Distribution
📋 MTX Contract Address: 0x...
📋 Casino Ecosystem Contracts:
   CasinoCore: 0x...
   CasinoReserve: 0x...
   LiquidityRouter: 0x...

📊 Distribution Plan:
   Developer Wallet: 2000000 MTX (2%)
   CasinoReserve:   20000000 MTX (20%)
   LiquidityRouter: 10000000 MTX (10%)
   Total Ecosystem: 32000000 MTX (32%)
   Public (buyMTX): 68000000 MTX (68%)

🚀 Starting MTX distribution...
💰 Distributing to Developer Wallet...
   ✅ Confirmed
💰 Distributing to CasinoReserve...
   ✅ Confirmed
💰 Distributing to LiquidityRouter...
   ✅ Confirmed

📊 Distribution Complete!
📄 Distribution info saved to: deployments/mtx-distribution-sepolia.json
```

#### Full Deployment (All Steps)

Run all three steps sequentially:

```bash
npm run deploy:testnet:full
```

---

## Mainnet Deployment (Manual Only)

### ⚠️ CRITICAL: Mainnet Deployment Policy

**MAINNET DEPLOYMENTS MUST BE DONE MANUALLY**

- ❌ **DO NOT** use GitHub Actions for mainnet deployment
- ❌ **DO NOT** store mainnet private keys in GitHub Secrets
- ✅ **USE** hardware wallet (Ledger, Trezor) for mainnet
- ✅ **TEST** thoroughly on testnet first
- ✅ **VERIFY** all deployment parameters before proceeding
- ✅ **BACKUP** deployment artifacts immediately

### Pre-Deployment Checklist

Before deploying to mainnet, ensure:

- [ ] All contracts tested thoroughly on testnet
- [ ] Smart contracts audited by reputable firm
- [ ] Deployment parameters reviewed and confirmed
- [ ] Hardware wallet connected and verified
- [ ] Sufficient ETH in deployer wallet (~0.5-1 ETH)
- [ ] Backup of deployment scripts and configs
- [ ] Team members ready to verify deployment
- [ ] Block explorer verification prepared

### Manual Deployment Steps

#### 1. Final Environment Check

```bash
# Verify you're on correct network
npx hardhat console --network mainnet

# Check deployer balance
> (await ethers.provider.getBalance("YOUR_ADDRESS")).toString()

# Exit console
> .exit
```

#### 2. Deploy MTX Token

```bash
# Deploy MTX to mainnet
npx hardhat run scripts/deploy_mtx.js --network mainnet

# IMMEDIATELY verify the output
# SAVE the contract address
# BACKUP deployments/mtx-mainnet.json
```

**Review the output carefully:**
- Contract address
- Transaction hash
- Owner address
- Max supply
- Initial minting (should be NONE)

#### 3. Deploy Casino Contracts

```bash
# Deploy casino contracts to mainnet
npx hardhat run scripts/deploy_casino.js --network mainnet

# IMMEDIATELY verify all contract addresses
# SAVE all addresses
# BACKUP deployments/casino-mainnet.json
```

**Review the output carefully:**
- All 5 contract addresses (RNGEngine, CasinoReserve, LiquidityRouter, CasinoCore, MTX)
- Transaction hashes
- Configuration parameters

#### 4. Distribute MTX Tokens

⚠️ **WARNING:** This step is IRREVERSIBLE. Tokens will be minted and distributed.

```bash
# Distribute MTX to ecosystem
npx hardhat run scripts/distribute_mtx.js --network mainnet

# IMMEDIATELY verify all distributions
# SAVE transaction hashes
# BACKUP deployments/mtx-distribution-mainnet.json
```

**Verify distributions:**
- Developer wallet received 2M MTX
- CasinoReserve received 20M MTX
- LiquidityRouter received 10M MTX
- Total distributed: 32M MTX
- Remaining supply: 68M MTX

#### 5. Verify Contracts on Etherscan

After deployment, verify all contracts on Etherscan:

```bash
# Verify MTX token
npx hardhat verify --network mainnet <MTX_ADDRESS> "100000000" "0x9fb4bb44d8d962d695fc93b3dc15f1b287391077"

# Verify RNGEngine
npx hardhat verify --network mainnet <RNG_ADDRESS>

# Verify CasinoReserve
npx hardhat verify --network mainnet <RESERVE_ADDRESS> "<MTX_ADDRESS>" "<RESERVE_CAP>" "<CASINO_CORE_ADDRESS>"

# Verify LiquidityRouter
npx hardhat verify --network mainnet <LIQUIDITY_ADDRESS> "<MTX_ADDRESS>" "<DEX_POOL_ADDRESS>"

# Verify CasinoCore (complex, see verification docs)
npx hardhat verify --network mainnet <CASINO_CORE_ADDRESS> [constructor args...]
```

---

## Post-Deployment Verification

After deploying contracts, verify everything is working correctly:

### 1. Check Contract Deployment

```bash
# View deployment files
cat deployments/mtx-sepolia.json
cat deployments/casino-sepolia.json
cat deployments/mtx-distribution-sepolia.json
```

### 2. Verify on Block Explorer

For Sepolia testnet:
- Visit: https://sepolia.etherscan.io/address/<CONTRACT_ADDRESS>
- Verify contract is deployed
- Check contract source code (if verified)

For Mainnet:
- Visit: https://etherscan.io/address/<CONTRACT_ADDRESS>
- Verify contract is deployed and verified
- Check all transactions

### 3. Test Contract Functions

```bash
# Start Hardhat console
npx hardhat console --network sepolia

# Connect to MTX contract
> const MTX = await ethers.getContractAt("MatrixHubCoin", "MTX_ADDRESS")

# Check total supply
> (await MTX.totalSupply()).toString()

# Check max supply
> (await MTX.MAX_SUPPLY()).toString()

# Check owner
> await MTX.owner()

# Check balance of CasinoReserve
> (await MTX.balanceOf("CASINO_RESERVE_ADDRESS")).toString()
```

### 4. Update Frontend Configuration

Update contract addresses in your application:

1. **Update `src/config/mtx.ts`:**

   ```typescript
   export const MTX_CONFIG = {
     address: "0x...", // New MTX address
     network: "sepolia", // or "mainnet"
     chainId: 11155111, // or 1 for mainnet
   };
   ```

2. **Update casino configuration:**

   ```typescript
   export const CASINO_CONFIG = {
     casinoCore: "0x...",
     casinoReserve: "0x...",
     rngEngine: "0x...",
     liquidityRouter: "0x...",
   };
   ```

3. **Update environment variables:**

   ```env
   VITE_MTX_CONTRACT_ADDRESS=0x...
   VITE_CASINO_CORE_ADDRESS=0x...
   VITE_NETWORK=sepolia
   ```

---

## Troubleshooting

### Common Issues

#### Issue: "MTX deployment file not found"

**Cause:** Trying to run `deploy_casino.js` or `distribute_mtx.js` before deploying MTX.

**Solution:**
```bash
# Deploy MTX first
npm run deploy:testnet:mtx

# Then proceed with casino deployment
npm run deploy:testnet:casino
```

#### Issue: "Casino deployment file not found"

**Cause:** Trying to run `distribute_mtx.js` before deploying casino contracts.

**Solution:**
```bash
# Deploy casino contracts first
npm run deploy:testnet:casino

# Then proceed with distribution
npm run deploy:testnet:distribute
```

#### Issue: "insufficient funds for intrinsic transaction cost"

**Cause:** Deployer wallet doesn't have enough ETH.

**Solution:**
- For testnet: Get more testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
- For mainnet: Transfer more ETH to deployer wallet

#### Issue: "nonce has already been used"

**Cause:** Transaction nonce conflict.

**Solution:**
```bash
# Clear Hardhat cache
rm -rf cache/
rm -rf artifacts/

# Recompile
npm run compile

# Try deployment again
```

#### Issue: "ETHERSCAN_API_KEY not set"

**Cause:** Etherscan API key not configured.

**Solution:**
- Get API key from: https://etherscan.io/myapikey
- Add to `.env`: `ETHERSCAN_API_KEY=your-key-here`

#### Issue: Contract verification failed

**Cause:** Various reasons (wrong constructor args, flattening issues, etc.)

**Solution:**
```bash
# Try verifying with flattened contract
npx hardhat flatten contracts/MatrixHubCoin.sol > flattened.sol

# Manually verify on Etherscan using flattened source
```

### Getting Help

If you encounter issues:

1. Check the deployment logs for error messages
2. Review the [Hardhat documentation](https://hardhat.org/docs)
3. Check [Etherscan](https://etherscan.io/) for transaction status
4. Open an issue on [GitHub](https://github.com/bran8912-ctrl/Matrix-Hub.org/issues)

---

## Security Best Practices

### Private Key Management

1. **Never commit private keys** to version control
2. **Use `.env` files** for local development (git-ignored)
3. **Use hardware wallets** for mainnet deployments
4. **Rotate keys regularly** for long-term projects
5. **Use separate keys** for testnet and mainnet

### Deployment Safety

1. **Test on testnet first** - Always deploy and test on Sepolia before mainnet
2. **Verify all parameters** - Double-check all deployment parameters
3. **Use multi-sig wallets** - Consider multi-sig for contract ownership
4. **Implement timelock** - Add timelock for critical functions
5. **Audit contracts** - Get professional audit before mainnet deployment

### Post-Deployment

1. **Backup deployment artifacts** - Save all JSON files and logs
2. **Verify contracts immediately** - Verify on Etherscan right after deployment
3. **Transfer ownership** - Transfer to secure multi-sig if needed
4. **Monitor contracts** - Set up monitoring for unusual activity
5. **Document everything** - Keep detailed records of all deployments

### Emergency Procedures

If something goes wrong:

1. **Do NOT panic** - Stay calm and assess the situation
2. **Pause if possible** - Use pause functions if implemented
3. **Document the issue** - Take screenshots and save logs
4. **Notify team** - Alert team members immediately
5. **Seek expert help** - Contact security professionals if needed

---

## Additional Resources

### Documentation

- [Matrix-Hub.org README](./README.md)
- [MTX Tokenomics](./docs/MTX_Tokenomics.md)
- [Casino Architecture](./docs/MTX_Casino_Architecture.md)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)

### Tools

- [Hardhat](https://hardhat.org/) - Development environment
- [Etherscan](https://etherscan.io/) - Block explorer
- [Sepolia Faucet](https://sepoliafaucet.com/) - Get testnet ETH
- [Remix IDE](https://remix.ethereum.org/) - Online Solidity IDE

### Community

- [GitHub Issues](https://github.com/bran8912-ctrl/Matrix-Hub.org/issues)
- [GitHub Discussions](https://github.com/bran8912-ctrl/Matrix-Hub.org/discussions)

---

## License

MIT License - see [LICENSE](./LICENSE) file for details.

---

**Matrix-Hub.org** - Signal Over Noise 🌟

Last Updated: 2026-01-06
