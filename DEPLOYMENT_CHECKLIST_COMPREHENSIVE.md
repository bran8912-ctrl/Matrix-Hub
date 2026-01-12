# Matrix-Hub MTX Token - Comprehensive Deployment Checklist

**Version**: 1.0  
**Date**: January 6, 2026  
**Contract**: MatrixHubCoin (MTX) ERC20 Token  
**Target Network**: Ethereum Mainnet (Chain ID: 1)  
**Deployment Owner**: Repo Owner (with production keys)

---

## Overview

This checklist guides the secure deployment of the MatrixHubCoin (MTX) ERC20 token to Ethereum Mainnet. The deployment must be performed by the repository owner using their secured API keys and environment configuration stored in GitHub repository secrets or local .env files.

**CRITICAL**: This is a production smart contract deployment. Mistakes can result in permanent loss of funds. Follow each step carefully.

---

## Phase 1: Pre-Deployment Preparation

### 1.1 Environment Setup

- [ ] **Install Dependencies**
  ```bash
  npm install
  ```
  - Verify all packages installed successfully
  - Check for any security vulnerabilities: `npm audit`

- [ ] **Create .env File**
  ```bash
  cp .env.example .env
  ```
  - **NEVER commit .env to git**
  - Verify .env is in .gitignore

- [ ] **Configure Environment Variables**
  
  Edit `.env` and set:
  
  ```bash
  # Deployer wallet private key (NO 0x prefix)
  PRIVATE_KEY=your_actual_private_key_here
  
  # Ethereum RPC URL (free public RPC)
  MAINNET_RPC_URL=https://eth.llamarpc.com
  
  # Etherscan API key for contract verification
  ETHERSCAN_API_KEY=your_etherscan_api_key_here
  
  # Leave empty - will be filled after deployment
  MTX_CONTRACT_ADDRESS=
  ```
  
  **Security Notes**:
  - Use a dedicated deployer wallet, NOT your main wallet
  - Deployer wallet needs ~0.1 ETH for gas fees
  - Store private key securely after deployment
  - Consider using hardware wallet for mainnet deployment
  - Get Etherscan API key: https://etherscan.io/myapikey

### 1.2 Network Configuration Verification

- [ ] **Verify hardhat.config.cjs**
  ```javascript
  networks: {
    mainnet: {
      url: process.env.MAINNET_RPC_URL || "https://eth.llamarpc.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1
    }
  }
  ```

- [ ] **Verify src/config/mtx.ts**
  ```typescript
  chainId: 1, // Ethereum Mainnet
  chainName: "Ethereum",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 }
  ```

### 1.3 Contract Review

- [ ] **Review MatrixHubCoin.sol**
  - Constructor parameters: initialSupply = "100000000", initialOwner = "0x9fb4bb44d8d962d695fc93b3dc15f1b287391077"
  - Verify owner address is correct
  - Confirm initial supply (100M MTX)
  - Review all functions for expected behavior

- [ ] **Verify OpenZeppelin Imports**
  ```solidity
  import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
  import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
  ```
  - Check imports resolve correctly
  - Verify OpenZeppelin package installed: `npm list @openzeppelin/contracts`

### 1.4 Deployer Wallet Preparation

- [ ] **Create/Access Deployer Wallet**
  - Generate new wallet OR use existing burner wallet
  - **NEVER use main/personal wallet for deployment**
  - Record wallet address for reference

- [ ] **Fund Deployer Wallet**
  - Send ~0.1 ETH to deployer wallet for gas
  - Confirm receipt of funds
  - Check balance: `cast balance <address>` or use Etherscan

- [ ] **Backup Private Key Securely**
  - Store in password manager
  - Consider hardware backup
  - Test key can be imported/restored
  - Plan for secure deletion after deployment

---

## Phase 2: Testnet Deployment (MANDATORY)

**DO NOT SKIP TESTNET TESTING**

### 2.1 Sepolia Testnet Setup

- [ ] **Get Testnet ETH**
  - Visit: https://sepoliafaucet.com/
  - Send testnet ETH to deployer wallet
  - Confirm receipt (usually 2-5 minutes)

- [ ] **Configure Sepolia RPC**
  ```bash
  SEPOLIA_RPC_URL=https://rpc.sepolia.org/
  ```

### 2.2 Deploy to Sepolia

- [ ] **Compile Contracts**
  ```bash
  npx hardhat compile
  ```
  - Verify no compilation errors
  - Check artifacts generated in `artifacts/` directory

- [ ] **Deploy to Sepolia**
  ```bash
  npm run deploy:sepolia
  # OR
  ./scripts/deploy.sh
  # Select option 1 (Sepolia)
  ```

- [ ] **Record Deployment Info**
  - Contract Address: `____________________________`
  - Transaction Hash: `____________________________`
  - Block Number: `____________________________`
  - Deployment Time: `____________________________`
  - Gas Used: `____________________________`

### 2.3 Verify on Sepolia Etherscan

- [ ] **Verify Contract Source**
  ```bash
  npx hardhat verify --network sepolia <CONTRACT_ADDRESS> "100000000" "0x9fb4bb44d8d962d695fc93b3dc15f1b287391077"
  ```
  
- [ ] **Confirm Verification Success**
  - Visit: https://sepolia.etherscan.io/address/<CONTRACT_ADDRESS>
  - Check "Contract" tab shows verified source code
  - Review read/write contract functions

### 2.4 Test Contract Functions on Sepolia

- [ ] **Test Read Functions** (via Etherscan or script)
  - `name()` returns "Matrix-HubCoin"
  - `symbol()` returns "MTX"
  - `decimals()` returns 18
  - `totalSupply()` returns correct amount
  - `balanceOf(owner)` shows initial supply
  - `owner()` returns correct owner address
  - `ethToMtxRate()` returns 100000
  - `mintingPaused()` returns false
  - `MAX_SUPPLY()` returns expected value

- [ ] **Test Owner Functions**
  - `setEthToMtxRate(200000)` - Change rate (test revert on non-owner call)
  - `setMintingPaused(true)` - Pause minting
  - `setMintingPaused(false)` - Unpause minting
  - Verify events emitted correctly

- [ ] **Test buyMTX Function**
  - Send 0.01 test ETH to contract via `buyMTX()`
  - Verify MTX received (0.01 ETH * 100000 = 1000 MTX)
  - Check `totalSupply()` increased
  - Verify `MTXPurchased` event emitted

- [ ] **Test Burn Function**
  - Call `burn(100)` to burn 100 MTX
  - Verify balance decreased
  - Verify `totalSupply()` decreased

- [ ] **Test withdrawETH Function**
  - Owner calls `withdrawETH(recipient)`
  - Verify ETH transferred correctly
  - Check contract balance is zero

### 2.5 Test Wallet Integration on Testnet

- [ ] **Update Test Config**
  - Temporarily set Sepolia contract address in `src/config/mtx.ts`
  - Change chainId to 11155111 (Sepolia)

- [ ] **Test Frontend Connection**
  ```bash
  npm run dev
  ```
  - Connect wallet to Sepolia network
  - Verify MTX balance displays correctly
  - Test "Add MTX to Wallet" button (EIP-747)
  - Test direct mint via frontend
  - Verify transactions appear on Sepolia Etherscan

- [ ] **Revert Test Config**
  - Restore mainnet configuration in `src/config/mtx.ts`
  - Ensure placeholder address for production

### 2.6 Testnet Deployment Review

- [ ] **Review All Test Results**
  - All contract functions work as expected
  - No unexpected errors or reverts
  - Events emit correctly
  - Frontend integration successful
  - Gas costs reasonable

- [ ] **Document Issues Found**
  - List any bugs or unexpected behavior
  - Fix all issues before mainnet deployment
  - Re-test after fixes

---

## Phase 3: Mainnet Deployment

**⚠️ FINAL WARNING: This deploys to production Ethereum Mainnet with real ETH and real value**

### 3.1 Final Pre-Deployment Checks

- [ ] **All Testnet Tests Passed**
  - Every function tested and working
  - No outstanding bugs or issues
  - Gas costs acceptable

- [ ] **Deployer Wallet Ready**
  - Wallet has sufficient ETH (~0.1 ETH recommended)
  - Private key backed up securely
  - Wallet address recorded

- [ ] **Environment Variables Set**
  - `PRIVATE_KEY` - Deployer private key (no 0x)
  - `MAINNET_RPC_URL` - Ethereum RPC URL
  - `ETHERSCAN_API_KEY` - Etherscan API key
  - All values verified correct

- [ ] **Final Code Review**
  - No debug code or console.logs
  - No test addresses in production code
  - All constants correct (supply, owner, rate)
  - .env not committed to git

### 3.2 Deployment Execution

- [ ] **Compile for Production**
  ```bash
  npx hardhat compile
  ```
  - Clean compilation with no warnings
  - Verify artifacts generated

- [ ] **Final Confirmation**
  - [ ] I confirm I want to deploy to MAINNET
  - [ ] I have backed up all private keys
  - [ ] I have sufficient ETH for gas
  - [ ] I understand this is irreversible
  - [ ] All testnet tests passed successfully

- [ ] **Execute Deployment**
  ```bash
  npm run deploy:mainnet
  # OR for interactive:
  ./scripts/deploy.sh
  # Select option 2 (Mainnet)
  # Type "yes" when prompted
  ```

- [ ] **Monitor Deployment**
  - Watch transaction in Etherscan
  - Wait for confirmation (usually 15-30 seconds)
  - Verify no errors in output

### 3.3 Record Deployment Information

**IMMEDIATELY SAVE THIS INFORMATION**

```
Deployment Date/Time: ___________________________
Network: Ethereum Mainnet (Chain ID: 1)
Contract Address: ___________________________
Owner Address: 0x9fb4bb44d8d962d695fc93b3dc15f1b287391077
Deployer Address: ___________________________
Transaction Hash: ___________________________
Block Number: ___________________________
Gas Used: ___________________________
Gas Price (Gwei): ___________________________
Total Cost (ETH): ___________________________
Initial Supply: 100,000,000 MTX
```

- [ ] **Save to deployments/mtx-mainnet.json**
  - Automatically created by deployment script
  - Verify file exists and is accurate
  - Backup this file securely

---

## Phase 4: Post-Deployment Verification

### 4.1 Etherscan Verification

- [ ] **Verify Contract Source Code**
  ```bash
  npx hardhat verify --network mainnet <CONTRACT_ADDRESS> "100000000" "0x9fb4bb44d8d962d695fc93b3dc15f1b287391077"
  ```

- [ ] **Confirm Verification**
  - Visit: https://etherscan.io/address/<CONTRACT_ADDRESS>
  - "Contract" tab shows green checkmark
  - Source code visible and readable
  - Constructor arguments correct
  - Compiler version matches (0.8.20)
  - Optimization enabled (200 runs)

- [ ] **Review Contract on Etherscan**
  - Read Contract tab functional
  - Write Contract tab functional (for owner)
  - All functions visible
  - Events tab shows deployment
  - Token info correct (name, symbol, decimals)

### 4.2 Initial Contract State Verification

- [ ] **Verify Read Functions** (via Etherscan)
  - `name()` = "Matrix-HubCoin" ✓
  - `symbol()` = "MTX" ✓
  - `decimals()` = 18 ✓
  - `totalSupply()` = 100,000,000,000,000,000,000,000,000 (100M * 10^18) ✓
  - `balanceOf(owner)` = full initial supply ✓
  - `owner()` = 0x9fb4bb44d8d962d695fc93b3dc15f1b287391077 ✓
  - `ethToMtxRate()` = 100000 ✓
  - `mintingPaused()` = false ✓
  - `MAX_SUPPLY()` = 100,000,000,000,000,000,000,000,000 ✓

- [ ] **Verify Ownership**
  - Owner address matches expected value
  - Owner can call owner-only functions
  - Non-owner calls properly rejected

### 4.3 Update Configuration Files

- [ ] **Update .env**
  ```bash
  MTX_CONTRACT_ADDRESS=<DEPLOYED_ADDRESS>
  ```

- [ ] **Update src/config/mtx.ts**
  ```typescript
  const contractAddress = process.env?.MTX_CONTRACT_ADDRESS 
    ? process.env.MTX_CONTRACT_ADDRESS 
    : "<DEPLOYED_ADDRESS>"; // Replace placeholder with actual address
  ```
  
  OR (preferred for production):
  - Keep env variable approach
  - Set `MTX_CONTRACT_ADDRESS` in production environment

- [ ] **Commit Configuration Updates**
  ```bash
  git add src/config/mtx.ts
  git commit -m "Update MTX contract address after mainnet deployment"
  git push
  ```
  
  **⚠️ WARNING**: DO NOT commit .env file!

### 4.4 Update Documentation

- [ ] **Update docs/MTX_Deployment_Guide.md**
  - Add "Deployed to Mainnet" section
  - Include deployment date and address
  - Update status from "NOT DEPLOYED" to "DEPLOYED"

- [ ] **Update README.md**
  - Add contract address if mentioned
  - Update deployment status
  - Add Etherscan link

- [ ] **Update CONTRACT_DETAILS_AUDIT.md**
  - Mark deployment status as "DEPLOYED"
  - Add deployment date and details
  - Update any placeholder warnings

- [ ] **Create DEPLOYMENT_RECORD.md**
  ```markdown
  # MTX Token Mainnet Deployment Record
  
  Date: <DATE>
  Contract: <ADDRESS>
  Network: Ethereum Mainnet
  Owner: 0x9fb4bb44d8d962d695fc93b3dc15f1b287391077
  Initial Supply: 100,000,000 MTX
  Etherscan: https://etherscan.io/address/<ADDRESS>
  ```

---

## Phase 5: Testing and Integration

### 5.1 Frontend Integration Testing

- [ ] **Build Production Site**
  ```bash
  npm run build
  ```
  - Verify build succeeds
  - Check for warnings or errors
  - Ensure contract address used correctly

- [ ] **Test Wallet Connection**
  - Connect wallet to Ethereum Mainnet
  - Verify MTX balance reads correctly
  - Check network switching works
  - Test "Add MTX to Wallet" (EIP-747)

- [ ] **Test Direct Mint (Small Amount)**
  - Use 0.01 ETH first for safety
  - Call `buyMTX()` or send ETH directly
  - Verify MTX received (1000 MTX for 0.01 ETH)
  - Check transaction on Etherscan
  - Verify balance updates in wallet

- [ ] **Test Transfer Function**
  - Transfer small amount to test address
  - Verify transfer completes
  - Check balances updated correctly
  - Confirm transaction on Etherscan

### 5.2 Owner Function Testing

**⚠️ ONLY OWNER CAN PERFORM THESE**

- [ ] **Test Rate Adjustment**
  - Call `setEthToMtxRate(newRate)` via Etherscan
  - Verify rate changed
  - Confirm event emitted
  - Test mint with new rate

- [ ] **Test Pause Functionality**
  - Call `setMintingPaused(true)`
  - Attempt to buy MTX (should fail)
  - Call `setMintingPaused(false)`
  - Verify buying works again

- [ ] **Test ETH Withdrawal**
  - Ensure contract has ETH balance
  - Call `withdrawETH(recipient)`
  - Verify ETH transferred
  - Check contract balance is zero

### 5.3 Security Verification

- [ ] **Private Key Management**
  - Deployer private key backed up securely
  - Private key removed from .env (or .env deleted)
  - No private keys in any source files
  - No private keys in git history

- [ ] **Access Control Testing**
  - Non-owner cannot call owner functions
  - Owner can call all protected functions
  - Ownership transfer works if needed

- [ ] **Emergency Procedures**
  - Document how to pause minting
  - Document how to change ownership
  - Test emergency procedures work

---

## Phase 6: Liquidity and Launch

### 6.1 Uniswap Liquidity Pool

- [ ] **Approve MTX for Uniswap**
  - Call `approve(UniswapRouter, amount)`
  - Amount = desired liquidity amount

- [ ] **Add Liquidity on Uniswap**
  - Visit: https://app.uniswap.org/add
  - Select ETH and MTX pair
  - Add initial liquidity (e.g., 1 ETH + 100,000 MTX)
  - Confirm transaction
  - Save liquidity pool address

- [ ] **Verify Pool Created**
  - Find pool on Uniswap
  - Verify correct ratio
  - Check liquidity displayed
  - Test small swap

### 6.2 Token Listings

- [ ] **CoinGecko Submission**
  - Submit listing request
  - Provide contract address, logo, links
  - Wait for approval

- [ ] **CoinMarketCap Submission**
  - Submit listing request
  - Provide required information
  - Monitor application status

- [ ] **Other DEX Listings**
  - Consider listing on other DEXs
  - Sushiswap, Balancer, etc.

### 6.3 Public Announcement

- [ ] **Prepare Announcement**
  - Contract address verified
  - Etherscan link
  - Uniswap trading link
  - Token information
  - How to buy/add to wallet

- [ ] **Update Website**
  - Deploy updated site with real contract address
  - Test all functionality live
  - Verify no placeholder addresses shown

- [ ] **Social Media Announcement**
  - Twitter/X post
  - Discord announcement
  - GitHub release notes
  - Community channels

---

## Phase 7: Ongoing Monitoring

### 7.1 First 24 Hours

- [ ] **Monitor Transactions**
  - Watch all contract interactions
  - Check for any errors or issues
  - Monitor gas prices
  - Track minting activity

- [ ] **User Support**
  - Answer questions in community
  - Help users add token to wallet
  - Assist with purchase issues
  - Monitor for scam attempts

### 7.2 First Week

- [ ] **Daily Balance Checks**
  - Monitor total supply
  - Check liquidity pool health
  - Watch for unusual activity
  - Track holder count

- [ ] **Security Monitoring**
  - Check for any exploit attempts
  - Monitor contract events
  - Review all owner transactions
  - Verify no unauthorized access

### 7.3 Ongoing Maintenance

- [ ] **Regular Audits**
  - Review transaction history weekly
  - Check holder distribution
  - Monitor liquidity levels
  - Track token metrics

- [ ] **Owner Key Security**
  - Periodically verify owner key security
  - Consider multi-sig if high value
  - Plan for owner succession if needed

- [ ] **Community Updates**
  - Regular status updates
  - Transparency reports
  - Token metrics sharing
  - Roadmap progress

---

## Emergency Procedures

### If Something Goes Wrong

1. **Immediately Pause Minting**
   ```solidity
   setMintingPaused(true)
   ```

2. **Investigate Issue**
   - Review recent transactions
   - Check contract state
   - Identify root cause

3. **Communicate with Community**
   - Transparent explanation
   - Proposed solution
   - Timeline for fix

4. **Implement Fix (if possible)**
   - If bug in external integration, fix and redeploy frontend
   - If contract bug, minting pause prevents new issues
   - Existing token holders are safe (ERC20 transfers still work)

### Contact Information

- **Contract Owner**: 0x9fb4bb44d8d962d695fc93b3dc15f1b287391077
- **Repository**: https://github.com/bran8912-ctrl/Matrix-Hub.org
- **Documentation**: See docs/ directory

---

## Sign-Off

**This checklist must be completed by the repository owner who has access to:**
- Production private keys
- Etherscan API keys
- Sufficient ETH for deployment
- Authority to deploy to mainnet

**Deployment Performed By**: ______________________________

**Date**: ______________________________

**Signature/Confirmation**: ______________________________

---

## Final Reminders

- ✅ Testnet deployment and testing is MANDATORY
- ✅ Never commit private keys or .env files
- ✅ Use burner wallet for deployment, not main wallet
- ✅ Verify contract on Etherscan immediately after deployment
- ✅ Test with small amounts before large transactions
- ✅ Monitor contract activity closely after launch
- ✅ Keep owner private key secure at all times
- ✅ Have emergency procedures ready
- ✅ Maintain transparency with community

**Deployment is irreversible. Once deployed, the contract cannot be changed. Follow this checklist carefully.**
