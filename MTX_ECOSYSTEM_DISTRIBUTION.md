# MTX Ecosystem Distribution Guide

**Purpose**: Distribute MTX tokens to casino ecosystem contracts  
**Date**: January 6, 2026  
**Status**: Required for casino operations

---

## Overview

With **Option B** implementation (no initial minting), the MTX token contract starts with 0 total supply. To enable casino operations, we must distribute MTX tokens to the following ecosystem contracts:

1. **CasinoCore** - Handles game operations and player interactions
2. **CasinoReserve** - Holds reserves for paying winners
3. **LiquidityRouter** - Manages DEX liquidity

---

## Distribution Breakdown

### Total Supply: 100,000,000 MTX Maximum

**Philosophy**: Prioritize public access and earning through engagement over pre-distribution

| Allocation | Amount | Purpose | Percentage |
|------------|--------|---------|------------|
| **CasinoReserve** | 20,000,000 MTX | Casino operations and payouts | 20% |
| **LiquidityRouter** | 10,000,000 MTX | Initial DEX liquidity (Uniswap) | 10% |
| **Public (buyMTX)** | 70,000,000 MTX | Direct mint purchases at 1 ETH = 100k MTX | 70% |
| **TOTAL** | **100,000,000 MTX** | | **100%** |

---

## Why This Distribution?

### Design Philosophy from README.md

**Matrix-Hub's Core Principles:**
1. ✅ "Free base access" - No MTX required to use the platform
2. ✅ "Direct mint as primary onboarding" - Low friction user acquisition
3. ✅ "Earn through engagement" - Users accumulate MTX by contributing
4. ✅ "No dependency on hype cycles" - Value from utility, not speculation
5. ✅ "MTX is useful on-site, not theoretical" - Real utility drives demand

### Why 70% Public Access?

The README emphasizes:
> "USERS → Engage with modules → EARN MTX"
> "**1. EARN** → Users accumulate MTX through platform engagement"

**Our Distribution Reflects This:**
- **70% available via direct mint** - Ensures ample supply for genuine users
- **Low ecosystem pre-allocation** - Casino grows from house edge, not pre-mine
- **Earn-focused** - Users get MTX through usage, not token distribution
- **No "team allocation"** - Aligns with anti-hype philosophy

### CasinoReserve (20M MTX - Reduced)

**Previous**: 30M MTX  
**Now**: 20M MTX  
**Why**: Casino should grow organically from house edge

- **Purpose**: Initial casino liquidity for payouts
- **Usage**: 
  - Winner payouts
  - Initial game liquidity
  - Emergency reserve
- **Philosophy**: Start lean, grow from profits
- **House Edge**: Replenishes reserve over time

**From README:**
> "Casino: Win or Spend MTX"  
> "All transactions are on-chain and transparent"

Casino should be self-sustaining through house edge, not reliant on large pre-allocation.

### LiquidityRouter (10M MTX - Reduced)

**Previous**: 20M MTX  
**Now**: 10M MTX  
**Why**: Adequate for initial DEX seeding, grow organically

- **Purpose**: Initial Uniswap liquidity
- **Usage**:
  - Uniswap MTX/ETH pool
  - Enables open market trading
  - Price discovery mechanism
- **Philosophy**: Bootstrap liquidity, let market grow naturally
- **Paired with**: ~100 ETH (at 1 ETH = 100k MTX rate)

**From README:**
> "DEX provides access, not promises"  
> "Growth comes from usage"

### Public buyMTX (70M MTX - Increased)

**Previous**: 40M MTX  
**Now**: 70M MTX  
**Why**: Aligns with "direct mint as primary onboarding" philosophy

- **Purpose**: Fair public distribution
- **Usage**:
  - Users purchase directly with ETH
  - Rate: 1 ETH = 100,000 MTX (owner adjustable)
  - Transparent on-chain minting
- **Philosophy**: 
  - Low friction onboarding
  - No gatekeeping
  - Equal opportunity for all
  - Earn through engagement, buy when needed

**From README:**
> "Direct Mint: Send ETH → Receive MTX (1 ETH = 100,000 MTX)"  
> "Lower gas, instant minting, perfect for onboarding"

**From Tokenomics:**
> "Direct Mint (Primary Onboarding Method)"  
> "Lower gas costs than DEX swaps"  
> "Perfect for small purchases"

---

## No CasinoCore Pre-Allocation

**Decision**: CasinoCore does NOT receive pre-allocated MTX

**Why**: 
1. **House Edge Model**: Casino profits from gameplay, not pre-mine
2. **Self-Sustaining**: House edge returns MTX to reserve
3. **Lean Start**: Casino starts with reserve backing only
4. **Organic Growth**: Grows through usage, not distribution

**How Casino Gets MTX:**
1. Users buy MTX via direct mint
2. Users spend MTX playing casino games
3. House edge (small % of bets) goes to CasinoCore
4. CasinoCore replenishes reserve from house edge
5. Reserve pays winners

**Example Flow:**
```
User: Buy 1000 MTX with 0.01 ETH
User: Play slots, spend 100 MTX
House Edge: CasinoCore collects 1 MTX (1%)
Winner Payout: Reserve pays 99 MTX to winner
Reserve: Receives 1 MTX from CasinoCore periodically
```

This creates a **sustainable loop** without large pre-allocations.

---

## Implementation: mintToEcosystem Function

### New Function in MatrixHubCoin.sol

```solidity
/**
 * @notice Owner-controlled mint for ecosystem contracts
 * @dev Only callable by contract owner, respects MAX_SUPPLY cap
 * @param to Address to receive the minted MTX
 * @param amount Amount of MTX to mint
 */
function mintToEcosystem(address to, uint256 amount) external onlyOwner {
    if (to == address(0)) revert ZeroAddress();
    if (amount == 0) revert ZeroAmount();
    if (totalSupply() + amount > MAX_SUPPLY) revert ExceedsMaxSupply();
    
    _mint(to, amount);
    emit MTXPurchased(to, 0, amount); // 0 ETH indicates owner mint
}
```

### Key Features
- ✅ Owner-only access (protected by `onlyOwner`)
- ✅ Respects MAX_SUPPLY cap (100M MTX)
- ✅ Validates addresses and amounts
- ✅ Emits events for transparency
- ✅ Cannot be called by anyone except contract owner

---

## Deployment Process

### Step 1: Deploy All Contracts

```bash
# 1. Deploy MTX token
npm run deploy:mainnet

# 2. Deploy casino ecosystem
node scripts/deploy_casino.js --network mainnet

# Result: All contracts deployed but MTX balances are 0
```

### Step 2: Distribute MTX Tokens

```bash
# Execute distribution script
node scripts/distribute_mtx.js --network mainnet
```

This script will:
1. Load deployment addresses from `deployments/` directory
2. Verify current supply and max supply
3. Mint 20M MTX to CasinoReserve
4. Mint 10M MTX to LiquidityRouter
5. Save distribution info for audit trail
6. Display transaction hashes

### Step 3: Verify Distributions

Check on Etherscan that each contract received correct amount:

```bash
# Check CasinoReserve balance  
cast call <MTX_ADDRESS> "balanceOf(address)(uint256)" <CASINO_RESERVE_ADDRESS>
# Should be: 20,000,000,000,000,000,000,000,000 (20M * 10^18)

# Check LiquidityRouter balance
cast call <MTX_ADDRESS> "balanceOf(address)(uint256)" <LIQUIDITY_ROUTER_ADDRESS>
# Should be: 10,000,000,000,000,000,000,000,000 (10M * 10^18)

# Check total supply
cast call <MTX_ADDRESS> "totalSupply()(uint256)"
# Should be: 30,000,000,000,000,000,000,000,000 (30M * 10^18)
```

---

## Post-Distribution Setup

### 1. CasinoReserve Funding

The CasinoReserve needs to be "activated" with its allocation:

```solidity
// CasinoReserve already has 30M MTX in its balance
// CasinoCore must transfer MTX to reserve via deposit()

// Example: CasinoCore sends 30M MTX to reserve
// This is done automatically when CasinoCore receives its allocation
```

### 2. DEX Liquidity Provision

Use LiquidityRouter's 20M MTX allocation to add Uniswap liquidity:

```bash
# 1. Approve Uniswap Router to spend MTX from LiquidityRouter
# 2. Add liquidity: 20M MTX + X ETH (determine appropriate ratio)
# 3. Receive LP tokens as proof of liquidity provision
```

Example liquidity ratios:
- Conservative: 20M MTX + 200 ETH (10,000 MTX/ETH)
- Moderate: 20M MTX + 100 ETH (200,000 MTX/ETH - matches buyMTX rate)
- Aggressive: 20M MTX + 50 ETH (400,000 MTX/ETH)

### 3. Casino Activation

After distribution, casino can begin operations:

```bash
# CasinoCore has 10M MTX for operations
# CasinoReserve has 30M MTX for payouts
# Games can now accept bets and pay winners
```

---

## Distribution Script Details

### Script Location
`scripts/distribute_mtx.js`

### Requirements
- MTX contract deployed
- Casino ecosystem contracts deployed
- Owner wallet with gas for transactions
- Deployment info files in `deployments/` directory

### Execution

```bash
# Testnet (Sepolia)
node scripts/distribute_mtx.js --network sepolia

# Mainnet (Production)
node scripts/distribute_mtx.js --network mainnet
```

### Output Files

Script creates: `deployments/mtx-distribution-{network}.json`

```json
{
  "network": "mainnet",
  "chainId": 1,
  "mtxContract": "0x...",
  "distributor": "0x...",
  "distributionTime": "2026-01-06T...",
  "distributions": [
    {
      "contract": "CasinoCore",
      "address": "0x...",
      "amount": "10000000",
      "txHash": "0x..."
    },
    ...
  ],
  "totalDistributed": "60000000",
  "finalSupply": "60000000",
  "remainingCapacity": "40000000"
}
```

---

## Security Considerations

### 1. Owner-Only Control

- ✅ Only contract owner can call `mintToEcosystem()`
- ✅ Multi-sig wallet recommended for owner address
- ✅ Distribution is one-time operation (cannot redistribute)

### 2. Supply Cap Protection

- ✅ Cannot mint more than MAX_SUPPLY (100M MTX)
- ✅ Total: 60M (distribution) + 40M (public) = 100M
- ✅ Attempting to exceed cap will revert transaction

### 3. Audit Trail

- ✅ All mints emit `MTXPurchased` event (with 0 ETH)
- ✅ Distribution info saved to JSON file
- ✅ All transactions visible on Etherscan
- ✅ Block explorer shows exact amounts and timestamps

### 4. Contract Validation

Before distribution, verify contracts are correct:

```bash
# Check casino contracts are deployed correctly
# Verify contract code on Etherscan
# Test with small amounts on testnet first
```

---

## Testing on Sepolia

**MANDATORY**: Test distribution on Sepolia before mainnet

```bash
# 1. Deploy MTX to Sepolia
npm run deploy:sepolia

# 2. Deploy casino to Sepolia  
node scripts/deploy_casino.js --network sepolia

# 3. Distribute MTX on Sepolia
node scripts/distribute_mtx.js --network sepolia

# 4. Verify all balances
# 5. Test casino operations
# 6. Test DEX liquidity
```

### Testnet Checklist

- [ ] MTX deployed to Sepolia
- [ ] Casino contracts deployed to Sepolia
- [ ] Distribution executed successfully
- [ ] CasinoCore has 10M MTX
- [ ] CasinoReserve has 30M MTX
- [ ] LiquidityRouter has 20M MTX
- [ ] Total supply is 60M MTX
- [ ] Casino games functional
- [ ] Reserve can pay winners
- [ ] DEX liquidity added successfully
- [ ] No errors or reverts

---

## Mainnet Deployment

### Pre-Distribution Checklist

- [ ] All contracts deployed to mainnet
- [ ] All contracts verified on Etherscan
- [ ] Owner wallet has sufficient ETH for gas (~0.01 ETH)
- [ ] Distribution amounts confirmed (10M, 30M, 20M)
- [ ] Testnet testing completed successfully
- [ ] Team ready to monitor transactions

### Distribution Execution

```bash
# Execute distribution
node scripts/distribute_mtx.js --network mainnet

# Monitor transactions
# - Watch for confirmations
# - Verify no errors
# - Check balances immediately
```

### Post-Distribution Checklist

- [ ] All 3 transactions confirmed
- [ ] CasinoCore balance = 10M MTX
- [ ] CasinoReserve balance = 30M MTX
- [ ] LiquidityRouter balance = 20M MTX
- [ ] Total supply = 60M MTX
- [ ] Distribution JSON file created
- [ ] All transactions visible on Etherscan
- [ ] No errors in any transaction

---

## Adjusting Distribution Amounts

If you need different amounts, edit `scripts/distribute_mtx.js`:

```javascript
const DISTRIBUTIONS = {
  casinoCore: hre.ethers.parseEther("10000000"),      // Change as needed
  casinoReserve: hre.ethers.parseEther("30000000"),   // Change as needed
  liquidityRouter: hre.ethers.parseEther("20000000"), // Change as needed
};
```

**Constraints**:
- Total must not exceed 100M MTX
- Consider leaving sufficient supply for public buyMTX
- Reserve should be largest allocation for safety
- Liquidity should be adequate for DEX trading

---

## Emergency Procedures

### If Distribution Fails

1. **Transaction Reverts**:
   - Check gas limit sufficient
   - Verify owner is calling function
   - Ensure total supply + amount ≤ MAX_SUPPLY
   - Check contract addresses are correct

2. **Wrong Amount Distributed**:
   - **Cannot undo** - minting is permanent
   - Owner can transfer excess MTX if needed
   - Use `transfer()` to redistribute if necessary

3. **Contract Address Wrong**:
   - **Cannot undo** - tokens sent to wrong address
   - If contract, may be able to recover
   - If EOA, tokens lost (unless owned by team)

### Prevention

- ✅ Test on Sepolia first (MANDATORY)
- ✅ Double-check all contract addresses
- ✅ Verify amounts add up correctly
- ✅ Have team review distribution plan
- ✅ Monitor transactions in real-time

---

## FAQ

**Q: Why not mint all tokens at deployment?**  
A: Option B (gradual distribution) provides:
- Fair launch mechanism
- No centralized pre-mine
- Transparent on-chain minting
- Equal opportunity for all users

**Q: Can we change distribution amounts later?**  
A: No, minting is permanent. Choose amounts carefully before execution.

**Q: What if casino needs more MTX?**  
A: Owner can use `mintToEcosystem()` again, up to MAX_SUPPLY cap. Consider keeping some capacity reserved for this.

**Q: How does public access remaining 40M MTX?**  
A: Via `buyMTX()` function - users send ETH and receive MTX at configured rate.

**Q: Can users buy before distribution?**  
A: Yes, `buyMTX()` works immediately after MTX deployment. Distribution and public buying can happen in any order.

**Q: What if we run out of MTX for casino?**  
A: Reserve should be sized appropriately. Monitor levels and pause games if reserve gets low. Owner can mint more if capacity remains.

---

## Summary

1. **Deploy** MTX and casino contracts
2. **Distribute** 60M MTX to ecosystem contracts  
3. **Add** DEX liquidity from LiquidityRouter
4. **Enable** casino operations
5. **Open** buyMTX() for public access to remaining 40M MTX

This ensures:
- ✅ Casino has operational funds
- ✅ Reserve has safety buffer
- ✅ DEX has trading liquidity  
- ✅ Public has fair access
- ✅ Total supply capped at 100M MTX

---

**Prepared By**: GitHub Copilot Agent  
**Date**: January 6, 2026  
**Status**: Ready for execution after contract deployment
