import React, { useState } from 'react';
import { SlotsEngine, type SlotsResult } from './SlotsEngine';

interface SlotsGameProps {
  walletAddress?: string;
  mtxBalance: number;
  onBetPlaced?: (amount: number) => void;
}

export default function SlotsGame({ walletAddress, mtxBalance, onBetPlaced }: SlotsGameProps) {
  const [result, setResult] = useState<SlotsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSpin() {
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    const betError = SlotsEngine.validateBet(SlotsEngine.BET_AMOUNT);
    if (betError) {
      setError(betError);
      return;
    }

    if (mtxBalance < SlotsEngine.BET_AMOUNT) {
      setError('Insufficient MTX balance');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Simulate a provably fair hash (in production, this would come from backend/contract)
      const hash = Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');

      const spinResult = SlotsEngine.spin(hash);
      setResult(spinResult);
      
      if (onBetPlaced) {
        onBetPlaced(SlotsEngine.BET_AMOUNT);
      }
    } catch (e) {
      setError('Failed to spin. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg border-2 border-green-500">
      <h2 className="text-3xl font-bold text-green-400 mb-4 text-center">🎰 Slots</h2>
      
      <div className="mb-6 text-center">
        <p className="text-gray-300 mb-2">Spin costs: {SlotsEngine.BET_AMOUNT} MTX</p>
        <p className="text-yellow-400 font-semibold">Your balance: {mtxBalance} MTX</p>
      </div>

      {/* Reels Display */}
      <div className="bg-black p-8 rounded-lg mb-6 flex justify-center items-center gap-4">
        {result ? (
          result.reels.map((symbol, i) => (
            <div key={i} className="text-6xl animate-bounce">{symbol}</div>
          ))
        ) : (
          <>
            <div className="text-6xl">❓</div>
            <div className="text-6xl">❓</div>
            <div className="text-6xl">❓</div>
          </>
        )}
      </div>

      {/* Result Display */}
      {result && (
        <div className={`text-center mb-4 p-4 rounded ${result.win ? 'bg-green-900' : 'bg-red-900'}`}>
          {result.win ? (
            <>
              <p className="text-2xl font-bold text-green-300">🎉 WIN! 🎉</p>
              <p className="text-xl text-green-200">You won {result.payout} MTX!</p>
            </>
          ) : (
            <p className="text-xl font-semibold text-red-300">No match. Try again!</p>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-900 text-red-200 p-3 rounded mb-4 text-center">
          {error}
        </div>
      )}

      {/* Spin Button */}
      <button
        onClick={handleSpin}
        disabled={loading || !walletAddress}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors"
      >
        {loading ? 'Spinning...' : walletAddress ? '🎰 SPIN' : 'Connect Wallet to Play'}
      </button>

      {/* Payout Table */}
      <div className="mt-6 p-4 bg-gray-800 rounded">
        <h3 className="text-lg font-semibold text-green-400 mb-2">Payouts</h3>
        <div className="text-sm text-gray-300 space-y-1">
          <div>7️⃣ 7️⃣ 7️⃣ → 100 MTX</div>
          <div>💎 💎 💎 → 50 MTX</div>
          <div>🍇 🍇 🍇 → 20 MTX</div>
          <div>🍊 🍊 🍊 → 15 MTX</div>
          <div>🍋 🍋 🍋 → 10 MTX</div>
          <div>🍒 🍒 🍒 → 5 MTX</div>
        </div>
      </div>
    </div>
  );
}
