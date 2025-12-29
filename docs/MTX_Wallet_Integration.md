# MTX Wallet and Transfer Utilities

This document describes the MTX wallet integration components and utilities added to the Matrix Hub project.

## MTX Contract Information

- **Contract Address**: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`
- **Network**: Ethereum Mainnet (ChainID: 1)
- **Symbol**: MTX
- **Decimals**: 18
- **Name**: Matrix Hub Coin

## Components

### Wallet.jsx

A React island component that provides wallet connection and MTX token balance management.

**Features:**
- Connect Ethereum wallet via Web3Modal
- Display connected wallet address
- Display MTX token balance
- Add MTX token to wallet (EIP-747)
- Buy MTX on Uniswap
- **NEW**: Buy MTX via Direct Mint
- Automatic network switching to Ethereum mainnet
- Handle account and network changes

**Usage in Astro pages:**
```astro
---
import Wallet from "../components/Wallet.jsx";
---

<Wallet client:load />
```

### BuyMTX.tsx

A React component for purchasing MTX directly with ETH using the direct mint feature.

**Features:**
- Display current ETH to MTX exchange rate
- Calculate MTX amount based on ETH input
- Send ETH to contract to mint MTX
- Transaction status feedback
- Security guidance and warnings
- Testnet/Mainnet compatibility

**Usage in Astro pages:**
```astro
---
import BuyMTX from "../components/BuyMTX.tsx";
---

<BuyMTX client:load />
```

## Purchasing MTX

Matrix Hub offers two ways to purchase MTX tokens:

### Option 1: Direct Mint (Recommended for Onboarding)

**How it works:**
1. User sends ETH directly to the MTX contract
2. Contract mints MTX at a fixed rate (1 ETH = 1000 MTX)
3. MTX tokens are instantly credited to user's wallet

**Advantages:**
- Lower gas costs (single transaction)
- Fixed, predictable pricing
- Instant minting
- Perfect for small purchases and first-time users
- No slippage or liquidity concerns

**How to use:**
1. Visit `/buy-mtx` page on Matrix Hub
2. Connect your Ethereum wallet
3. Enter amount of ETH to spend
4. Click "Buy MTX with ETH"
5. Confirm transaction in wallet
6. Receive MTX instantly

**Technical details:**
- Contract function: `buyMTX()` (payable)
- Fallback function: `receive()` also works (send ETH directly to contract)
- Rate can be updated by contract owner if needed
- Minting can be paused by owner (e.g., for transition to DEX-only)

**Code example:**
```typescript
import { BrowserProvider, Contract, parseEther } from 'ethers';
import { MTX } from '../config/mtx';
import mtxAbi from '../abi/mtx.json';

async function buyMTXDirectMint(ethAmount: string) {
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const mtxContract = new Contract(MTX.address, mtxAbi, signer);
  
  // Send ETH to buyMTX function
  const tx = await mtxContract.buyMTX({ value: parseEther(ethAmount) });
  await tx.wait();
  
  return tx.hash;
}
```

### Option 2: Uniswap DEX (Public Market)

**How it works:**
1. User swaps ETH or other tokens for MTX on Uniswap
2. Pricing determined by liquidity pool (market rates)
3. Instant settlement

**Advantages:**
- Market-based pricing
- High liquidity for large purchases
- Can swap from any ERC-20 token
- Trusted, battle-tested platform

**How to use:**
1. Visit Uniswap link from Matrix Hub
2. Connect wallet
3. Select input token and amount
4. Review swap details
5. Confirm transaction

## Utilities

### mtxTransfer.ts

Provides utility functions for MTX token transfers and network management.

#### spendMTX(to, amount)

Transfers MTX tokens from the connected wallet to a specified address.

**Parameters:**
- `to` (string): Recipient Ethereum address (e.g., casino vault address)
- `amount` (string): Amount of MTX to transfer in human-readable format (e.g., "10" for 10 MTX)

**Returns:**
- `Promise<string>`: Transaction hash on success

**Throws:**
- Error if wallet not found
- Error if insufficient MTX balance
- Error if user rejects transaction
- Error if transaction fails

**Example:**
```typescript
import { spendMTX } from '../utils/mtxTransfer';

// Transfer 10 MTX to casino vault
try {
  const txHash = await spendMTX('0xCasinoVaultAddress', '10');
  console.log('Transaction successful:', txHash);
} catch (error) {
  console.error('Transfer failed:', error.message);
}
```

#### ensureEthereum()

Ensures the user is connected to the correct Ethereum network (based on config). Automatically attempts to switch networks if needed.

**Returns:**
- `Promise<void>`

**Throws:**
- Error if wallet not found
- Error if network not added to wallet
- Error if user rejects network switch

**Example:**
```typescript
import { ensureEthereum } from '../utils/mtxTransfer';

// Ensure correct network before performing operations
try {
  await ensureEthereum();
  // Proceed with blockchain operations
} catch (error) {
  console.error('Network check failed:', error.message);
}
```

## ABI (src/abi/mtx.json)

The MTX token ABI includes the following methods:

**ERC-20 Standard:**
- `balanceOf(address account)`: Read token balance
- `transfer(address to, uint256 amount)`: Transfer tokens
- `decimals()`: Get token decimals (18 for MTX)
- `symbol()`: Get token symbol ("MTX")
- `name()`: Get token name ("Matrix Hub Coin")
- `totalSupply()`: Get total MTX supply
- `burn(uint256 amount)`: Burn MTX tokens

**Direct Mint Features:**
- `buyMTX()`: Purchase MTX with ETH (payable)
- `ethToMtxRate()`: Get current ETH to MTX exchange rate
- `mintingPaused()`: Check if direct minting is paused
- `MAX_SUPPLY()`: Get maximum MTX supply
- `receive()`: Fallback function for direct ETH sends

**Events:**
- `MTXPurchased(address indexed buyer, uint256 ethAmount, uint256 mtxAmount)`: Emitted on successful purchase

## Configuration

The MTX token configuration is located in `src/config/mtx.ts`:

```typescript
export const MTX = {
  address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", // Live contract address
  symbol: "MTX",
  decimals: 18,
  chainId: 1, // Ethereum mainnet
  name: "Matrix Hub Coin",
  ethToMtxRate: 1000, // 1 ETH = 1000 MTX
  get uniswapUrl() {
    return `https://app.uniswap.org/#/swap?outputCurrency=${this.address}&chain=ethereum`;
  }
};
```

## Integration Example: Casino Betting

Here's an example of how to integrate MTX transfers in a casino game:

```typescript
import { spendMTX } from '../utils/mtxTransfer';
import { MTX } from '../config/mtx';

const CASINO_VAULT_ADDRESS = '0xCasinoVaultAddress'; // Replace with actual vault

async function placeBet(betAmount: number) {
  try {
    // Transfer MTX to casino vault
    const txHash = await spendMTX(CASINO_VAULT_ADDRESS, betAmount.toString());
    
    // Once transaction is confirmed, proceed with game logic
    console.log('Bet placed successfully. TX:', txHash);
    
    // Call backend to record bet and start game
    // ...
    
    return txHash;
  } catch (error) {
    console.error('Failed to place bet:', error.message);
    throw error;
  }
}
```

## Security Considerations

1. **Balance Checking**: The `spendMTX` function checks the user's balance before attempting a transfer to provide better error messages.

2. **Transaction Confirmation**: Transactions wait for 1 block confirmation before returning, ensuring the transaction is mined.

3. **Error Handling**: All functions include comprehensive error handling for common scenarios (wallet not found, insufficient balance, user rejection).

4. **Network Verification**: The `ensureEthereum` function ensures users are on the correct network before performing operations.

5. **No Private Keys**: The utilities never request or handle private keys; all signing is done through the user's wallet.

## Browser Compatibility

Requires:
- Modern browser with ES2020+ support
- MetaMask or compatible Ethereum wallet extension
- User approval for wallet connection and transactions

## Dependencies

- ethers.js v6.16.0
- web3modal v1.9.12
- React 19.2.3
