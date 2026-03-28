import React, { useState } from 'react';
import { PlinkoEngine, type PlinkoResult } from './PlinkoEngine';
import { generateClientHash, type BetResult } from '../../utils/casinoBet';

interface PlinkoGameProps {
  walletAddress?: string;
  mtxBalance: number;
  placeBet?: (amount: number, gameData?: string) => Promise<BetResult>;
  refreshBalance?: () => void;
  onBetPlaced?: (amount: number) => void;
}

export default function PlinkoGame({ walletAddress, mtxBalance = 0, placeBet, refreshBalance: _refreshBalance, onBetPlaced }: PlinkoGameProps) {
  const [betAmount, setBetAmount] = useState(PlinkoEngine.BET_AMOUNT);
  const [result, setResult] = useState<PlinkoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');

  const multipliers = [5.6, 2.1, 1.1, 1.0, 0.5, 1.0, 1.1, 2.1, 5.6];

  function getSlotColor(multiplier: number): string {
    if (multiplier >= 5) return 'bg-purple-600';
    if (multiplier >= 2) return 'bg-blue-600';
    if (multiplier >= 1) return 'bg-green-600';
    return 'bg-red-600';
  }

  async function handleDrop() {
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    if (Number(mtxBalance) <= 0) {
      setError('You need MTX to play. Buy MTX first.');
      return;
    }

    const betError = PlinkoEngine.validateBet(betAmount);
    if (betError) {
      setError(betError);
      return;
    }

    if (mtxBalance < betAmount) {
      setError(`Insufficient MTX balance. Need ${betAmount} MTX.`);
      return;
    }

    setError('');
    setTxHash('');
    setLoading(true);

    try {
      // Place the on-chain MTX bet
      if (placeBet) {
        const betResult = await placeBet(betAmount);
        setTxHash(betResult.txHash);
        if (onBetPlaced) onBetPlaced(betAmount);

        // If CasinoCore resolved the bet on-chain, use that as the source of truth
        if (betResult.mode === 'on-chain' && betResult.win !== undefined) {
          const hash = generateClientHash();
          const dropResult = PlinkoEngine.dropBall(hash, betAmount);
          // Override payout with on-chain outcome
          setResult({ ...dropResult, payout: betResult.payout ?? 0 });
          return;
        }
      }

      // Derive game result from a provably fair hash (transfer mode or no placeBet)
      const hash = generateClientHash();

      const dropResult = PlinkoEngine.dropBall(hash, betAmount);
      setResult(dropResult);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to drop ball. Please try again.';
      setError(msg);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg border-2 border-green-500">
      <h2 className="text-3xl font-bold text-green-400 mb-4 text-center">🎯 Plinko</h2>
      
      <div className="mb-6 text-center">
        <p className="text-gray-300 mb-2">Minimum bet: {PlinkoEngine.BET_AMOUNT} MTX</p>
        <p className="text-yellow-400 font-semibold">Your balance: {mtxBalance.toFixed(2)} MTX</p>
      </div>

      {/* Plinko Board Visualization */}
      <div className="bg-black p-6 rounded-lg mb-6">
        <div className="text-center mb-4">
          <div className="inline-block bg-yellow-500 rounded-full w-8 h-8 animate-pulse"></div>
        </div>
        
        {/* Pegs representation */}
        <div className="mb-4 space-y-2">
          {Array.from({ length: PlinkoEngine.ROWS }, (_, row) => (
            <div key={row} className="flex justify-center gap-8" style={{ paddingLeft: `${(PlinkoEngine.ROWS - row) * 16}px` }}>
              {Array.from({ length: row + 2 }, (_, i) => (
                <div key={i} className="w-2 h-2 bg-gray-500 rounded-full"></div>
              ))}
            </div>
          ))}
        </div>

        {/* Slots at bottom */}
        <div className="flex justify-center gap-1">
          {multipliers.map((mult, i) => (
            <div
              key={i}
              className={`${getSlotColor(mult)} ${result?.finalSlot === i ? 'ring-4 ring-yellow-400 animate-pulse' : ''} text-white text-xs font-bold px-2 py-3 rounded text-center min-w-[50px]`}
            >
              {mult}x
            </div>
          ))}
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className={`text-center mb-4 p-4 rounded ${result.payout >= betAmount ? 'bg-green-900' : 'bg-red-900'}`}>
          {result.payout >= betAmount ? (
            <>
              <p className="text-2xl font-bold text-green-300">
                {result.multiplier >= 5 ? '🎉 BIG WIN! 🎉' : '✅ WIN!'}
              </p>
              <p className="text-xl text-green-200">
                {result.multiplier}x multiplier → {result.payout.toFixed(2)} MTX
              </p>
            </>
          ) : (
            <>
              <p className="text-xl font-semibold text-red-300">
                {result.multiplier}x multiplier
              </p>
              <p className="text-lg text-red-200">
                Payout: {result.payout.toFixed(2)} MTX
              </p>
            </>
          )}
        </div>
      )}

      {/* Transaction Hash */}
      {txHash && (
        <div className="bg-gray-800 text-green-400 p-3 rounded mb-4 text-center text-sm">
          ✅ Bet confirmed on-chain!{' '}
          <a
            href={`https://polygonscan.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View TX
          </a>
        </div>
      )}

      {/* Betting Controls */}
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <label className="block text-gray-300 mb-2">Bet Amount (MTX)</label>
        <input
          type="number"
          min={PlinkoEngine.BET_AMOUNT}
          step={0.5}
          value={betAmount}
          onChange={(e) => setBetAmount(Math.max(PlinkoEngine.BET_AMOUNT, Number(e.target.value)))}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900 text-red-200 p-3 rounded mb-4 text-center">
          {error}
        </div>
      )}

      {/* Drop Button */}
      <button
        onClick={handleDrop}
        disabled={loading || !walletAddress}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors"
      >
        {loading ? 'Processing...' : walletAddress ? `🎯 DROP BALL (${betAmount} MTX)` : 'Connect Wallet to Play'}
      </button>

      {/* Info */}
      <div className="mt-6 p-4 bg-gray-800 rounded">
        <h3 className="text-lg font-semibold text-green-400 mb-2">How to Play</h3>
        <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
          <li>Drop a ball from the top</li>
          <li>Ball bounces off pegs randomly</li>
          <li>Land in a slot to get that multiplier</li>
          <li>Purple slots (5.6x) are the jackpots!</li>
        </ul>
      </div>
    </div>
  );
}
