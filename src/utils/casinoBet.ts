/**
 * Casino Bet Utility
 *
 * Handles on-chain MTX betting for casino games using the connected wallet.
 * Uses the AppKit wallet provider for consistent Web3 integration.
 *
 * Flow:
 * 1. If CasinoCore is deployed: approve MTX + call placeBet on CasinoCore
 * 2. Fallback: transfer MTX directly to the casino vault (owner address)
 *
 * Network: Polygon (Chain ID: 137)
 */

import { BrowserProvider, Contract, parseUnits, formatUnits } from 'ethers';
import type { Eip1193Provider } from 'ethers';
import { MTX } from '../config/mtx';
import { Casino } from '../config/casino';
import mtxAbi from '../abi/mtx.json';
import casinoCoreAbi from '../abi/CasinoCore.json';

// Casino owner / vault address (fallback if CasinoCore not deployed)
const CASINO_VAULT_ADDRESS = MTX.owner;

export interface BetResult {
  txHash: string;
  betAmount: number;
  mode: 'on-chain' | 'transfer';
}

/**
 * Place a casino bet using the connected wallet.
 *
 * If CasinoCore is deployed, this will:
 *   1. Approve CasinoCore to spend the bet amount in MTX
 *   2. Call CasinoCore.placeBet(amount, gameData)
 *
 * If CasinoCore is not deployed, this will:
 *   1. Transfer MTX directly to the casino vault address
 *
 * @param walletProvider - The EIP-1193 provider from AppKit
 * @param betAmount - Bet amount in whole MTX (e.g. 1 for 1 MTX)
 * @param gameData - Optional hex-encoded game data for on-chain RNG (defaults to random)
 * @returns BetResult with transaction hash
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

    // Step 1: Approve CasinoCore to spend MTX
    const approveTx = await mtxContract.approve(casinoCoreAddress, betAmountWei);
    await approveTx.wait(1);

    // Step 2: Call placeBet on CasinoCore
    const casinoContract = new Contract(casinoCoreAddress, casinoCoreAbi, signer);
    const encodedGameData = gameData || generateRandomGameData();
    const betTx = await casinoContract.placeBet(betAmountWei, encodedGameData);
    const receipt = await betTx.wait(2); // 2 confirmations for Polygon safety

    return {
      txHash: receipt.hash,
      betAmount,
      mode: 'on-chain',
    };
  }

  // Fallback: transfer MTX to casino vault
  const transferTx = await mtxContract.transfer(CASINO_VAULT_ADDRESS, betAmountWei);
  const receipt = await transferTx.wait(2); // 2 confirmations for Polygon safety

  return {
    txHash: receipt.hash,
    betAmount,
    mode: 'transfer',
  };
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
