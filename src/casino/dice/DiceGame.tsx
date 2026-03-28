import React, { useState } from 'react';
import { DiceEngine, type DiceResult } from './DiceEngine';
import { generateClientHash, type BetResult } from '../../utils/casinoBet';

interface DiceGameProps {
  walletAddress?: string;
  mtxBalance: number;
  placeBet?: (amount: number, gameData?: string) => Promise<BetResult>;
  refreshBalance?: () => void;
  onBetPlaced?: (amount: number) => void;
}

export default function DiceGame({ walletAddress, mtxBalance = 0, placeBet, refreshBalance: _refreshBalance, onBetPlaced }: DiceGameProps) {
  const [betAmount, setBetAmount] = useState(DiceEngine.BET_AMOUNT);
  const [target, setTarget] = useState(50);
  const [result, setResult] = useState<DiceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');

  const multiplier = DiceEngine.calculateMultiplier(target);
  const winChance = ((target - 1) / 100) * 100;

  async function handleRoll() {
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    if (Number(mtxBalance) <= 0) {
      setError('You need MTX to play. Buy MTX first.');
      return;
    }

    const betError = DiceEngine.validateBet(betAmount, target);
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
          const rollResult = DiceEngine.roll(hash, target, betAmount);
          // Override win/payout with on-chain outcome
          setResult({ ...rollResult, win: betResult.win, payout: betResult.payout ?? 0 });
          return;
        }
      }

      // Derive game result from a provably fair hash (transfer mode or no placeBet)
      const hash = generateClientHash();

      const rollResult = DiceEngine.roll(hash, target, betAmount);
      setResult(rollResult);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to roll. Please try again.';
      setError(msg);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg border-2 border-green-500">
      <h2 className="text-3xl font-bold text-green-400 mb-4 text-center">🎲 Dice</h2>
      
      <div className="mb-6 text-center">
        <p className="text-gray-300 mb-2">Minimum bet: {DiceEngine.BET_AMOUNT} MTX</p>
        <p className="text-yellow-400 font-semibold">Your balance: {mtxBalance.toFixed(2)} MTX</p>
      </div>

      {/* Dice Display */}
      <div className="bg-black p-8 rounded-lg mb-6">
        <div className="text-center">
          <div className="text-8xl mb-4">🎲</div>
          {result ? (
            <div className="text-6xl font-bold text-white animate-bounce">
              {result.roll}
            </div>
          ) : (
            <div className="text-6xl font-bold text-gray-600">?</div>
          )}
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className={`text-center mb-4 p-4 rounded ${result.win ? 'bg-green-900' : 'bg-red-900'}`}>
          {result.win ? (
            <>
              <p className="text-2xl font-bold text-green-300">🎉 YOU WIN! 🎉</p>
              <p className="text-xl text-green-200">
                Rolled {result.roll} (under {result.target})
              </p>
              <p className="text-lg text-green-100">
                Won {result.payout.toFixed(2)} MTX
              </p>
            </>
          ) : (
            <>
              <p className="text-xl font-semibold text-red-300">Too high!</p>
              <p className="text-lg text-red-200">
                Rolled {result.roll} (needed under {result.target})
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
      <div className="bg-gray-800 p-4 rounded-lg mb-4 space-y-4">
        {/* Bet Amount */}
        <div>
          <label className="block text-gray-300 mb-2">Bet Amount (MTX)</label>
          <input
            type="number"
            min={DiceEngine.BET_AMOUNT}
            step={0.5}
            value={betAmount}
            onChange={(e) => setBetAmount(Math.max(DiceEngine.BET_AMOUNT, Number(e.target.value)))}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
          />
        </div>

        {/* Target Selection */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-gray-300">Roll Under: {target}</label>
            <span className="text-green-400 font-semibold">{multiplier.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min={DiceEngine.MIN_TARGET}
            max={DiceEngine.MAX_TARGET}
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{DiceEngine.MIN_TARGET}</span>
            <span className="text-yellow-400">Win Chance: {winChance.toFixed(1)}%</span>
            <span>{DiceEngine.MAX_TARGET}</span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900 text-red-200 p-3 rounded mb-4 text-center">
          {error}
        </div>
      )}

      {/* Roll Button */}
      <button
        onClick={handleRoll}
        disabled={loading || !walletAddress}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors"
      >
        {loading ? 'Processing...' : walletAddress ? `🎲 ROLL DICE (${betAmount} MTX)` : 'Connect Wallet to Play'}
      </button>

      {/* Info */}
      <div className="mt-6 p-4 bg-gray-800 rounded">
        <h3 className="text-lg font-semibold text-green-400 mb-2">How to Play</h3>
        <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
          <li>Choose your bet amount</li>
          <li>Set your target number (2-98)</li>
          <li>Win if you roll under your target</li>
          <li>Lower target = higher payout but harder to win</li>
          <li>Higher target = lower payout but easier to win</li>
        </ul>
      </div>
    </div>
  );
}
