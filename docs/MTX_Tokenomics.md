# MTX Tokenomics

## Contract Information
- **Address**: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`
- **Network**: Ethereum Mainnet (ChainID: 1)
- **Symbol**: MTX
- **Decimals**: 18

## Supply
- Fixed Max Supply
- No infinite minting (capped at deployment)
- No [rebasing](https://en.wikipedia.org/wiki/Rebase_token)
- Direct mint available at fixed rate until max supply reached

## Distribution
- [Liquidity](https://en.wikipedia.org/wiki/Market_liquidity) Bootstrap
- Ecosystem Reserve
- Development Allocation
- Community Incentives
- Direct mint purchases (ETH → MTX)

## Acquisition Methods

### 1. Direct Mint (Primary Onboarding Method)
- **Rate**: 1 ETH = 100,000 MTX (fixed)
- **Method**: Send ETH to contract, receive MTX instantly
- **Advantages**: 
  - Lower gas costs than DEX swaps
  - Predictable pricing
  - Perfect for small purchases
  - Instant settlement
- **Limitations**: Subject to max supply cap
- **Owner Controls**: Can pause minting or adjust rate if needed

### 2. Uniswap DEX (Public Market)
- **Rate**: Market-determined via liquidity pool
- **Method**: Swap ETH or any ERC-20 for MTX
- **Advantages**:
  - High liquidity
  - Trusted platform
  - Flexible amounts
  - Any token swap
- **Considerations**: Subject to slippage on large trades

### 3. Earn Through Platform (Free)
- Usage milestones
- Bug reports and testing
- GitHub contributions (merged PRs)
- Community participation
- Casino winnings

## Emissions
- No staking inflation
- No [yield farming](https://en.wikipedia.org/wiki/Yield_farming) emissions
- Circulation driven by usage
- Direct mint provides controlled token distribution
- Collected ETH can fund liquidity and operations

## Token Sinks (Supply Reduction)
- Burn mechanism on premium feature usage
- Lock mechanism for tier access
- Casino gameplay (balanced by casino payouts)

## Economic Design
- Direct mint provides onboarding liquidity while maintaining price stability
- DEX provides exit liquidity and market discovery
- Dual purchase options reduce friction for new users
- Fixed rate mint prevents speculative pumps during onboarding phase
- Owner can pause minting to transition to DEX-only if needed

MTX value is supported by [utility](https://en.wikipedia.org/wiki/Utility_token) and liquidity — not hype.

---

**Related Documentation:**
- [MTX Whitepaper](/docs/mtx-whitepaper)
- [MTX Wallet Integration](/docs/MTX_Wallet_Integration)
- [Casino Game Math](/docs/casino-game-math)
- [DAO Governance](/docs/dao-governance)
