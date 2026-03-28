import React, { useState } from 'react';
import { RouletteEngine, type RouletteBet, type RouletteResult, type BetType } from './RouletteEngine';
import { generateClientHash, type BetResult } from '../../utils/casinoBet';

interface RouletteGameProps {
  walletAddress?: string;
  mtxBalance: number;
  placeBet?: (amount: number, gameData?: string) => Promise<BetResult>;
  refreshBalance?: () => void;
  onBetPlaced?: (amount: number) => void;
}

export default function RouletteGame({ walletAddress, mtxBalance = 0, placeBet, refreshBalance: _refreshBalance, onBetPlaced }: RouletteGameProps) {
  const [betAmount, setBetAmount] = useState(1);
  const [betType, setBetType] = useState<BetType>('red');
  const [betNumber, setBetNumber] = useState<number>(0);
  const [result, setResult] = useState<RouletteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');

  function getColorClass(color: 'red' | 'black' | 'green') {
    if (color === 'red') return 'bg-red-600';
    if (color === 'black') return 'bg-gray-900';
    return 'bg-green-600';
  }

  async function handleSpin() {
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    if (Number(mtxBalance) <= 0) {
      setError('You need MTX to play. Buy MTX first.');
      return;
    }

    const bet: RouletteBet = {
      type: betType,
      value: betType === 'number' ? betNumber : undefined,
      amount: betAmount,
    };

    const betError = RouletteEngine.validateBet(bet);
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
          const spinResult = RouletteEngine.spin(hash, bet);
          // Override win/payout with on-chain outcome
          setResult({ ...spinResult, win: betResult.win, payout: betResult.payout ?? 0 });
          return;
        }
      }

      // Derive game result from a provably fair hash (transfer mode or no placeBet)
      const hash = generateClientHash();

      const spinResult = RouletteEngine.spin(hash, bet);
      setResult(spinResult);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to spin. Please try again.';
      setError(msg);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg border-2 border-green-500">
      <h2 className="text-3xl font-bold text-green-400 mb-4 text-center">🎡 Roulette</h2>
      
      <div className="mb-6 text-center">
        <p className="text-gray-300 mb-2">Minimum bet: {RouletteEngine.MIN_BET} MTX</p>
        <p className="text-yellow-400 font-semibold">Your balance: {mtxBalance.toFixed(2)} MTX</p>
      </div>

      {/* Result Display */}
      {result && (
        <div className="mb-6">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className={`${getColorClass(result.color)} text-white text-6xl font-bold rounded-full w-32 h-32 flex items-center justify-center shadow-2xl animate-bounce`}>
              {result.number}
            </div>
          </div>
          <div className={`text-center p-4 rounded ${result.win ? 'bg-green-900' : 'bg-red-900'}`}>
            {result.win ? (
              <>
                <p className="text-2xl font-bold text-green-300">🎉 YOU WIN! 🎉</p>
                <p className="text-xl text-green-200">Payout: {result.payout} MTX</p>
              </>
            ) : (
              <p className="text-xl font-semibold text-red-300">No win this time. Try again!</p>
            )}
          </div>
        </div>
      )}

      {/* Betting Controls */}
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold text-green-400 mb-3">Place Your Bet</h3>
        
        {/* Bet Amount */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Bet Amount (MTX)</label>
          <input
            type="number"
            min={RouletteEngine.MIN_BET}
            value={betAmount}
            onChange={(e) => setBetAmount(Math.max(RouletteEngine.MIN_BET, Number(e.target.value)))}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
          />
        </div>

        {/* Bet Type */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Bet Type</label>
          <select
            value={betType}
            onChange={(e) => setBetType(e.target.value as BetType)}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
          >
            <option value="red">Red (1:1)</option>
            <option value="black">Black (1:1)</option>
            <option value="even">Even (1:1)</option>
            <option value="odd">Odd (1:1)</option>
            <option value="low">Low (1-18) (1:1)</option>
            <option value="high">High (19-36) (1:1)</option>
            <option value="number">Specific Number (35:1)</option>
          </select>
        </div>

        {/* Number Selection for Specific Number Bet */}
        {betType === 'number' && (
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Choose Number (0-36)</label>
            <input
              type="number"
              min={0}
              max={36}
              value={betNumber}
              onChange={(e) => setBetNumber(Math.min(36, Math.max(0, Number(e.target.value))))}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
            />
          </div>
        )}
      </div>

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
        {loading ? 'Processing...' : walletAddress ? `🎡 SPIN (${betAmount} MTX)` : 'Connect Wallet to Play'}
      </button>

      {/* Payout Table */}
      <div className="mt-6 p-4 bg-gray-800 rounded">
        <h3 className="text-lg font-semibold text-green-400 mb-2">Payouts</h3>
        <div className="text-sm text-gray-300 space-y-1">
          <div>Specific Number → 35:1</div>
          <div>Red/Black → 1:1</div>
          <div>Even/Odd → 1:1</div>
          <div>Low/High → 1:1</div>
        </div>
      </div>
    </div>
  );
}
