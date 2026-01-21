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
| **Developer Wallet** | 2,000,000 MTX | Initial development allocation + 2% of bet winnings | 2% |
| **CasinoReserve** | 20,000,000 MTX | Casino operations and payouts | 20% |
| **LiquidityRouter** | 10,000,000 MTX | Initial DEX liquidity (QuickSwap) | 10% |
| **Public (buyMTX)** | 68,000,000 MTX | Direct mint purchases at 1 MATIC = 100k MTX | 68% |
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

### Developer Allocation (2M MTX - NEW)

**Purpose**: Development and ongoing maintenance rewards

- **Initial Allocation**: 2,000,000 MTX (2% of total supply)
- **Ongoing Revenue**: 2% of all casino bet winnings (configured in CasinoCore)
- **Usage**:
  - Platform development and maintenance
  - Infrastructure costs
  - Team compensation
  - Future development initiatives
- **Dual Income Model**: 
  - Initial allocation for immediate needs
  - Ongoing percentage ensures sustainable funding

**From CasinoCore Contract:**
```solidity
uint256 public devPercent = 2;  // 2% of every bet goes to dev wallet
```

Every casino bet is split:
- 85% - Payouts to winners
- 10% - Liquidity (DEX)
- 3% - Casino reserve
- **2% - Developer wallet** ✅

### Why 68% Public Access?

The README emphasizes:
> "USERS → Engage with modules → EARN MTX"
> "**1. EARN** → Users accumulate MTX through platform engagement"

**Our Distribution Reflects This:**
- **68% available via direct mint** - Ensures ample supply for genuine users
- **2% developer allocation** - Sustainable development funding
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

- **Purpose**: Initial QuickSwap liquidity
- **Usage**:
  - QuickSwap MTX/ETH pool
  - Enables open market trading
  - Price discovery mechanism
- **Philosophy**: Bootstrap liquidity, let market grow naturally
- **Paired with**: ~100 MATIC (at 1 MATIC = 100k MTX rate)

**From README:**
> "DEX provides access, not promises"  
> "Growth comes from usage"

### Public buyMTX (68M MTX - Adjusted)

**Previous**: 70M MTX  
**Now**: 68M MTX  
**Why**: 2% allocated to developer wallet for sustainable development

- **Purpose**: Fair public distribution
- **Usage**:
  - Users purchase directly with MATIC
  - Rate: 1 MATIC = 1,000 MTX (owner adjustable)
  - Transparent on-chain minting
- **Philosophy**: 
  - Low friction onboarding
  - No gatekeeping
  - Equal opportunity for all
  - Earn through engagement, buy when needed

**From README:**
> "Direct Mint: Send MATIC → Receive MTX (1 MATIC = 1,000 MTX)"  
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
User: Buy 1000 MTX with 0.01 MATIC
User: Play slots, spend 100 MTX
House Edge: CasinoCore collects 1 MTX (1%)
Winner Payout: Reserve pays 99 MTX to winner
Reserve: Receives 1 MTX from CasinoCore periodically
```

This creates a **sustainable loop** without large pre-allocations.

---

## Developer Revenue Model (Dual Income Stream)

### Initial Allocation: 2M MTX (2%)
- **Purpose**: Bootstrap development, infrastructure, and team compensation
- **One-time allocation** at deployment via `mintToEcosystem()`
- **Transparent**: On-chain allocation visible to all

### Ongoing Revenue: 2% of Casino Bets
- **Continuous income** from casino operations
- **Automatically distributed** via CasinoCore smart contract
- **Scales with usage**: More bets = more dev revenue

### Revenue Split Example

When a user places a 100 MTX bet in the casino:

| Allocation | Amount | Percentage |
|------------|--------|------------|
| Winner Payout | 85 MTX | 85% |
| DEX Liquidity | 10 MTX | 10% |
| Casino Reserve | 3 MTX | 3% |
| **Developer Wallet** | **2 MTX** | **2%** ✅ |

**From CasinoCore.sol:**
```solidity
uint256 public devPercent = 2;

function placeBet(uint256 amount, bytes calldata gameData) external {
    ...
    uint256 devAmount = amount * devPercent / 100;
    if (devAmount > 0) {
        if (!mtx.transfer(dev, devAmount)) revert DevPaymentFailed();
    }
    ...
}
```

### Why This Model Works

1. **Sustainable Funding**: Ongoing revenue ensures long-term development
2. **Usage Aligned**: Developer benefits when platform succeeds
3. **Fair Initial Allocation**: 2% upfront covers immediate needs
4. **Transparent**: All payments on-chain and auditable
5. **No Excessive Pre-mine**: Small initial allocation, earn through utility

**Total Developer Compensation:**
- Initial: 2,000,000 MTX (2% of supply)
- Ongoing: 2% of all casino bets (perpetual)
- **Aligned with project success** ✅

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
    emit MTXPurchased(to, 0, amount); // 0 MATIC indicates owner mint
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
3. Mint 2M MTX to Developer Wallet (2% of supply)
4. Mint 20M MTX to CasinoReserve
5. Mint 10M MTX to LiquidityRouter
6. Save distribution info for audit trail
7. Display transaction hashes

### Step 3: Verify Distributions

Check on Polygonscan that each contract received correct amount:

```bash
# Check Developer Wallet balance
cast call <MTX_ADDRESS> "balanceOf(address)(uint256)" <DEVELOPER_WALLET>
# Should be: 2,000,000,000,000,000,000,000,000 (2M * 10^18)

# Check CasinoReserve balance  
cast call <MTX_ADDRESS> "balanceOf(address)(uint256)" <CASINO_RESERVE_ADDRESS>
# Should be: 20,000,000,000,000,000,000,000,000 (20M * 10^18)

# Check LiquidityRouter balance
cast call <MTX_ADDRESS> "balanceOf(address)(uint256)" <LIQUIDITY_ROUTER_ADDRESS>
# Should be: 10,000,000,000,000,000,000,000,000 (10M * 10^18)

# Check total supply
cast call <MTX_ADDRESS> "totalSupply()(uint256)"
# Should be: 32,000,000,000,000,000,000,000,000 (32M * 10^18)
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

Use LiquidityRouter's 20M MTX allocation to add QuickSwap liquidity:

```bash
# 1. Approve QuickSwap Router to spend MTX from LiquidityRouter
# 2. Add liquidity: 20M MTX + X ETH (determine appropriate ratio)
# 3. Receive LP tokens as proof of liquidity provision
```

Example liquidity ratios:
- Conservative: 20M MTX + 200 MATIC (10,000 MTX/ETH)
- Moderate: 20M MTX + 100 MATIC (200,000 MTX/ETH - matches buyMTX rate)
- Aggressive: 20M MTX + 50 MATIC (400,000 MTX/ETH)

### 3. Casino Activation

After distribution, casino can begin operations:

```bash
# Developer Wallet has 2M MTX (2% initial allocation)
# CasinoReserve has 20M MTX for payouts
# Developer also receives 2% of all casino bets
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
# Testnet (Amoy)
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

- ✅ All mints emit `MTXPurchased` event (with 0 MATIC)
- ✅ Distribution info saved to JSON file
- ✅ All transactions visible on Polygonscan
- ✅ Block explorer shows exact amounts and timestamps

### 4. Contract Validation

Before distribution, verify contracts are correct:

```bash
# Check casino contracts are deployed correctly
# Verify contract code on Polygonscan
# Test with small amounts on testnet first
```

---

## Testing on Amoy

**MANDATORY**: Test distribution on Amoy before mainnet

```bash
# 1. Deploy MTX to Amoy
npm run deploy:sepolia

# 2. Deploy casino to Amoy  
node scripts/deploy_casino.js --network sepolia

# 3. Distribute MTX on Amoy
node scripts/distribute_mtx.js --network sepolia

# 4. Verify all balances
# 5. Test casino operations
# 6. Test DEX liquidity
```

### Testnet Checklist

- [ ] MTX deployed to Amoy
- [ ] Casino contracts deployed to Amoy
- [ ] Distribution executed successfully
- [ ] Developer Wallet has 2M MTX
- [ ] CasinoReserve has 20M MTX
- [ ] LiquidityRouter has 10M MTX
- [ ] Total supply is 32M MTX
- [ ] Casino games functional
- [ ] Developer receives 2% of bet winnings
- [ ] Reserve can pay winners
- [ ] DEX liquidity added successfully
- [ ] No errors or reverts

---

## Mainnet Deployment

### Pre-Distribution Checklist

- [ ] All contracts deployed to mainnet
- [ ] All contracts verified on Polygonscan
- [ ] Owner wallet has sufficient ETH for gas (~0.01 MATIC)
- [ ] Distribution amounts confirmed (2M dev, 20M reserve, 10M liquidity)
- [ ] Developer wallet address confirmed
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
- [ ] Developer Wallet balance = 2M MTX
- [ ] CasinoReserve balance = 20M MTX
- [ ] LiquidityRouter balance = 10M MTX
- [ ] Total supply = 32M MTX
- [ ] Distribution JSON file created
- [ ] All transactions visible on Polygonscan
- [ ] No errors in any transaction
- [ ] Developer receives 2% on first test bet

---

## Adjusting Distribution Amounts

If you need different amounts, edit `scripts/distribute_mtx.js`:

```javascript
const DISTRIBUTIONS = {
  developerWallet: hre.ethers.parseEther("2000000"),   // 2M MTX (2%)
  casinoReserve: hre.ethers.parseEther("20000000"),    // 20M MTX (20%)
  liquidityRouter: hre.ethers.parseEther("10000000"),  // 10M MTX (10%)
};
```

**Constraints**:
- Total must not exceed 100M MTX
- Consider leaving sufficient supply for public buyMTX (currently 68M)
- Reserve should be adequately sized for casino operations
- Liquidity should be adequate for DEX trading
- Developer allocation funds ongoing development

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

- ✅ Test on Amoy first (MANDATORY)
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
A: Via `buyMTX()` function - users Send MATIC and receive MTX at configured rate.

**Q: Can users buy before distribution?**  
A: Yes, `buyMTX()` works immediately after MTX deployment. Distribution and public buying can happen in any order.

**Q: What if we run out of MTX for casino?**  
A: Reserve should be sized appropriately. Monitor levels and pause games if reserve gets low. Owner can mint more if capacity remains.

---

## Summary

1. **Deploy** MTX and casino contracts
2. **Distribute** 32M MTX to ecosystem contracts (2M dev + 20M reserve + 10M liquidity)
3. **Add** DEX liquidity from LiquidityRouter
4. **Enable** casino operations
5. **Open** buyMTX() for public access to remaining 68M MTX

This ensures:
- ✅ Developer has sustainable funding (2% initial + 2% ongoing)
- ✅ Casino has operational liquidity
- ✅ Reserve has safety buffer
- ✅ DEX has trading liquidity  
- ✅ Public has fair access (68% supply)
- ✅ Total supply capped at 100M MTX

**Developer Revenue Model:**
- **Initial**: 2M MTX (2% of supply) at deployment
- **Ongoing**: 2% of all casino bets (perpetual income)
- **Total alignment**: Developer succeeds when platform succeeds

---

**Prepared By**: GitHub Copilot Agent  
**Date**: January 6, 2026  
**Status**: Ready for execution after contract deployment
