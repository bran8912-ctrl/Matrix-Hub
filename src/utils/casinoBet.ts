/**
 * Casino Bet Utility
 *
 * Handles on-chain MTX betting for casino games using the connected wallet.
 * Uses the AppKit wallet provider for consistent Web3 integration.
 *
 * Flow:
 * 1. If CasinoCore is deployed: approve MTX (only if needed) + call placeBet on CasinoCore
 * 2. Fallback: transfer MTX directly to the casino reserve/vault address
 *
 * Network: Polygon (Chain ID: 137)
 */

import { BrowserProvider, Contract, Interface, parseUnits, formatUnits } from 'ethers';
import type { Eip1193Provider, JsonFragment } from 'ethers';
import { MTX } from '../config/mtx';
import { Casino } from '../config/casino';
import mtxAbi from '../abi/mtx.json';
import casinoCoreAbi from '../abi/CasinoCore.json';

// Polygon Mainnet chain ID
const POLYGON_CHAIN_ID = 137n;

// Casino vault / reserve address (prefer deployed reserve, fallback to MTX owner)
const CASINO_VAULT_ADDRESS =
  Casino.contracts.casinoReserve.isDeployed
    ? Casino.contracts.casinoReserve.address
    : MTX.owner;

export interface BetResult {
  /** Transaction hash of the bet transaction */
  txHash: string;
  /** Bet amount in whole MTX (e.g. 1 for 1 MTX) */
  betAmount: number;
  /** Mode used to place the bet: 'on-chain' via CasinoCore, or 'transfer' fallback */
  mode: 'on-chain' | 'transfer';
  /** Whether the bet was a winning bet, as resolved on-chain by CasinoCore's BetResolved event */
  win?: boolean;
  /** Payout in whole MTX (0 for losses). Derived from the BetResolved event */
  payout?: number;
}

/**
 * Place a casino bet using the connected wallet.
 *
 * If CasinoCore is deployed, this will:
 *   1. Check the current MTX allowance and approve only if needed
 *   2. Call CasinoCore.placeBet(amount, gameData)
 *   3. Parse the BetResolved event to return win/payout
 *
 * If CasinoCore is not deployed, this will:
 *   1. Transfer MTX directly to the casino reserve/vault address
 *
 * @param walletProvider - The EIP-1193 provider from AppKit
 * @param betAmount - Bet amount in whole MTX (e.g. 1 for 1 MTX)
 * @param gameData - Optional hex-encoded game data for on-chain RNG (defaults to random)
 * @returns BetResult with transaction hash and on-chain resolution when available
 */
export async function placeCasinoBet(
  walletProvider: Eip1193Provider,
  betAmount: number,
  gameData?: string
): Promise<BetResult> {
  if (!walletProvider) {
    throw new Error('Wallet not connected. Please connect your wallet to play.');
  }

  if (betAmount <= 0) {
    throw new Error('Bet amount must be greater than zero.');
  }

  if (!MTX.isDeployed) {
    throw new Error('MTX token contract is not deployed yet. Cannot place bet.');
  }

  const provider = new BrowserProvider(walletProvider);

  // Verify the connected wallet is on Polygon Mainnet
  const network = await provider.getNetwork();
  if (network.chainId !== POLYGON_CHAIN_ID) {
    throw new Error(
      `Wrong network. Please switch your wallet to Polygon Mainnet (chain ID 137). Currently on chain ID ${network.chainId}.`
    );
  }

  const signer = await provider.getSigner();
  const userAddress = await signer.getAddress();

  // Convert bet amount to wei (18 decimals)
  const betAmountWei = parseUnits(betAmount.toString(), 18);

  // Check MTX balance
  const mtxContract = new Contract(MTX.address, mtxAbi, signer);
  const balance = await mtxContract.balanceOf(userAddress);
  if (balance < betAmountWei) {
    const formatted = Number(formatUnits(balance, 18)).toFixed(4);
    throw new Error(`Insufficient MTX balance. You have ${formatted} MTX but need ${betAmount} MTX.`);
  }

  // Try on-chain CasinoCore path first
  if (Casino.contracts.casinoCore.isDeployed) {
    const casinoCoreAddress = Casino.contracts.casinoCore.address;

    // Step 1: Only approve if current allowance is insufficient
    const currentAllowance = await mtxContract.allowance(userAddress, casinoCoreAddress);
    if (currentAllowance < betAmountWei) {
      const approveTx = await mtxContract.approve(casinoCoreAddress, betAmountWei);
      await approveTx.wait(1);
    }

    // Step 2: Call placeBet on CasinoCore
    const casinoContract = new Contract(casinoCoreAddress, casinoCoreAbi, signer);
    const encodedGameData = gameData || generateRandomGameData();
    const betTx = await casinoContract.placeBet(betAmountWei, encodedGameData);
    const receipt = await betTx.wait(2); // 2 confirmations for Polygon safety

    // Step 3: Parse BetResolved event from the receipt
    let win: boolean | undefined;
    let payout: number | undefined;
    try {
      const casinoIface = new Interface(casinoCoreAbi as JsonFragment[]);
      for (const log of receipt.logs) {
        try {
          const parsed = casinoIface.parseLog({ topics: [...log.topics], data: log.data });
          if (parsed?.name === 'BetResolved') {
            win = parsed.args.win as boolean;
            payout = Number(formatUnits(parsed.args.payout as bigint, 18));
            break;
          }
        } catch {
          // Not a CasinoCore log, skip
        }
      }
    } catch {
      // Event parsing failed — still return the tx hash, UI falls back to local logic
    }

    return {
      txHash: receipt.hash,
      betAmount,
      mode: 'on-chain',
      win,
      payout,
    };
  }

  // Fallback: transfer MTX to casino reserve/vault
  const transferTx = await mtxContract.transfer(CASINO_VAULT_ADDRESS, betAmountWei);
  const receipt = await transferTx.wait(2); // 2 confirmations for Polygon safety

  return {
    txHash: receipt.hash,
    betAmount,
    mode: 'transfer',
  };
}

/**
 * Generate a cryptographically secure random hex string for local game visuals.
 * Uses `crypto.getRandomValues` (CSPRNG). This is the client seed for the provably-fair flow.
 */
export function generateClientHash(): string {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate cryptographically random game data bytes for the RNG contract.
 *
 * NOTE: This provides the client seed component of the provably-fair flow.
 * Uses `crypto.getRandomValues` (CSPRNG), NOT `Math.random()`.
 *
 * For a fully provably-fair protocol, integrate server-side seed commitment:
 * 1. Server commits hash(serverSeed) before the round
 * 2. Client generates clientSeed (this function)
 * 3. Result = hash(serverSeed + clientSeed + nonce)
 * 4. Server reveals serverSeed after the round for verification
 *
 * See RNGEngine.sol for the on-chain verification flow.
 */
function generateRandomGameData(): string {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  return (
    '0x' +
    Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  );
}
