import type { Eip1193Provider } from 'ethers';
import { MTX } from '../config/mtx';
import { Casino } from '../config/casino';
import mtxAbi from '../abi/mtx.json';
import casinoCoreAbi from '../abi/CasinoCore.json';

// Polygon Mainnet chain ID as bigint for robust comparison
const POLYGON_CHAIN_ID = 137n;
const CASINO_VAULT_ADDRESS = Casino.contracts.casinoReserve.isDeployed ? Casino.contracts.casinoReserve.address : MTX.owner;

export interface BetResult {
  txHash: string;
  betAmount: number;
  mode: 'on-chain' | 'transfer';
  win?: boolean;
  payout?: number;
}

export function generateClientHash(): string {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function placeCasinoBet(
  walletProvider: Eip1193Provider,
  betAmount: number,
  gameData?: string
): Promise<BetResult> {
  if (!walletProvider) throw new Error('Wallet not connected. Please connect your wallet to play.');
  if (betAmount <= 0) throw new Error('Bet amount must be greater than zero.');
  if (!MTX.isDeployed) throw new Error('MTX token contract is not deployed yet. Cannot place bet.');

  const { BrowserProvider, Contract, Interface, parseUnits, formatUnits } = await import('ethers');
  const provider = new BrowserProvider(walletProvider as any);

  const network = await provider.getNetwork();
  if (BigInt(network.chainId as any) !== POLYGON_CHAIN_ID) {
    throw new Error(`Wrong network. Please switch your wallet to Polygon Mainnet (chain ID 137). Currently on chain ID ${network.chainId}.`);
  }

  const signer = await provider.getSigner();
  const userAddress = await signer.getAddress();

  const mtxContract = new Contract(MTX.address, mtxAbi, signer);
  const decimals = await mtxContract.decimals();
  const betAmountWei = parseUnits(betAmount.toString(), decimals);

  // Check MTX balance
  const balance = await mtxContract.balanceOf(userAddress);
  if (balance < betAmountWei) {
    const formatted = Number(formatUnits(balance, decimals)).toFixed(4);
    throw new Error(`Insufficient MTX balance. You have ${formatted} MTX but need ${betAmount} MTX.`);
  }

  // If CasinoCore is deployed, prefer the on-chain flow (approve -> placeBet -> parse BetResolved)
  if (Casino.contracts.casinoCore.isDeployed) {
    const casinoCoreAddress = Casino.contracts.casinoCore.address;

    // Allowance check/approve
    const currentAllowance = await mtxContract.allowance(userAddress, casinoCoreAddress);
    if (currentAllowance < betAmountWei) {
      const approveTx = await mtxContract.approve(casinoCoreAddress, betAmountWei);
      await approveTx.wait(1);
    }

    // Place bet on CasinoCore
    const casinoContract = new Contract(casinoCoreAddress, casinoCoreAbi, signer);
    const encodedGameData = gameData || '0x' + generateClientHash();
    const betTx = await casinoContract.placeBet(betAmountWei, encodedGameData);
    const receipt = await betTx.wait(2);

    // Parse BetResolved event from receipt (if available)
    let win: boolean | undefined;
    let payout: number | undefined;
    try {
      const casinoIface = new Interface(casinoCoreAbi as any);
      for (const log of receipt.logs) {
        try {
          const parsed = casinoIface.parseLog({ topics: [...(log.topics || [])], data: log.data });
          if (parsed?.name === 'BetResolved') {
            win = parsed.args.win as boolean;
            // payout may be bigint - convert using decimals
            payout = Number(formatUnits(parsed.args.payout as any, decimals));
            break;
          }
        } catch {
          // not a CasinoCore log
        }
      }
    } catch (err) {
      // parsing failed, but return tx info anyway
      console.warn('Failed to parse BetResolved event:', err);
    }

    return {
      txHash: receipt.transactionHash || (receipt as any).hash,
      betAmount,
      mode: 'on-chain',
      win,
      payout,
    };
  }

  // Fallback: transfer MTX to casino vault/reserve
  const tx = await mtxContract.transfer(CASINO_VAULT_ADDRESS, betAmountWei);
  const receipt = await tx.wait(2);

  return {
    txHash: receipt.transactionHash || (receipt as any).hash,
    betAmount,
    mode: 'transfer',
  };
}
