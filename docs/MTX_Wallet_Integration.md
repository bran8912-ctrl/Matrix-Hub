# MTX Wallet and Transfer Utilities

This document describes the MTX wallet integration components and utilities added to the Matrix Hub project.

## Components

### Wallet.jsx

A React island component that provides wallet connection and MTX token balance management.

**Features:**
- Connect Ethereum wallet via Web3Modal
- Display connected wallet address
- Display MTX token balance
- Add MTX token to wallet (EIP-747)
- Buy MTX on Uniswap
- Automatic network switching to Ethereum mainnet
- Handle account and network changes

**Usage in Astro pages:**
```astro
---
import Wallet from "../components/Wallet.jsx";
---

<Wallet client:load />
```

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

The MTX token ABI includes the following ERC-20 methods:

- `balanceOf(address account)`: Read token balance
- `transfer(address to, uint256 amount)`: Transfer tokens
- `decimals()`: Get token decimals (18 for MTX)
- `symbol()`: Get token symbol ("MTX")
- `name()`: Get token name ("Matrix Hub Coin")

## Configuration

The MTX token configuration is located in `src/config/mtx.ts`:

```typescript
export const MTX = {
  address: "0xYOUR_MTX_CONTRACT_ADDRESS", // Update before deployment
  symbol: "MTX",
  decimals: 18,
  chainId: 1, // Ethereum mainnet
  name: "Matrix Hub Coin",
  get uniswapUrl() {
    return `https://app.uniswap.org/#/swap?outputCurrency=${this.address}&chain=ethereum`;
  }
};
```

**Note:** Update `address` with the actual deployed MTX contract address before production deployment.

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
