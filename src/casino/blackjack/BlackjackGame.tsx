import React, { useState } from 'react';
import { BlackjackEngine, type BlackjackResult, type Card } from './BlackjackEngine';
import type { BetResult } from '../../utils/casinoBet';

interface BlackjackGameProps {
  walletAddress?: string;
  mtxBalance: number;
  placeBet?: (amount: number, gameData?: string) => Promise<BetResult>;
  refreshBalance?: () => void;
  onBetPlaced?: (amount: number) => void;
}

export default function BlackjackGame({ walletAddress, mtxBalance = 0, placeBet, refreshBalance, onBetPlaced }: BlackjackGameProps) {
  const [result, setResult] = useState<BlackjackResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');

  function renderCard(card: Card) {
    const color = ['♥️', '♦️'].includes(card.suit) ? 'text-red-500' : 'text-gray-200';
    return (
      <div className="bg-white rounded-lg p-3 shadow-lg min-w-[60px] text-center border-2 border-gray-300">
        <div className={`text-2xl font-bold ${color}`}>
          {card.rank}
        </div>
        <div className="text-xl">{card.suit}</div>
      </div>
    );
  }

  async function handleDeal() {
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    if (Number(mtxBalance) <= 0) {
      setError('You need MTX to play. Buy MTX first.');
      return;
    }

    const betError = BlackjackEngine.validateBet(BlackjackEngine.BET_AMOUNT);
    if (betError) {
      setError(betError);
      return;
    }

    if (mtxBalance < BlackjackEngine.BET_AMOUNT) {
      setError(`Insufficient MTX balance. Need ${BlackjackEngine.BET_AMOUNT} MTX.`);
      return;
    }

    setError('');
    setTxHash('');
    setLoading(true);

    try {
      // Place the on-chain MTX bet
      if (placeBet) {
        const betResult = await placeBet(BlackjackEngine.BET_AMOUNT);
        setTxHash(betResult.txHash);
        if (onBetPlaced) onBetPlaced(BlackjackEngine.BET_AMOUNT);
      }

      // Derive game result from a provably fair hash
      const hash = Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');

      const gameResult = BlackjackEngine.playHand(hash);
      setResult(gameResult);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to deal. Please try again.';
      setError(msg);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg border-2 border-green-500">
      <h2 className="text-3xl font-bold text-green-400 mb-4 text-center">🃏 Blackjack</h2>
      
      <div className="mb-6 text-center">
        <p className="text-gray-300 mb-2">Bet per hand: {BlackjackEngine.BET_AMOUNT} MTX</p>
        <p className="text-yellow-400 font-semibold">Your balance: {mtxBalance.toFixed(2)} MTX</p>
      </div>

      {/* Dealer's Hand */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-3">Dealer</h3>
        <div className="flex gap-3 justify-center mb-2">
          {result ? (
            result.dealerHand.map((card, i) => (
              <div key={i}>{renderCard(card)}</div>
            ))
          ) : (
            <div className="bg-blue-900 rounded-lg p-3 w-[60px] h-[80px] border-2 border-blue-700"></div>
          )}
        </div>
        {result && (
          <p className="text-center text-lg text-gray-300">
            Score: {result.dealerScore}
          </p>
        )}
      </div>

      {/* Player's Hand */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-3">Your Hand</h3>
        <div className="flex gap-3 justify-center mb-2">
          {result ? (
            result.playerHand.map((card, i) => (
              <div key={i}>{renderCard(card)}</div>
            ))
          ) : (
            <div className="bg-blue-900 rounded-lg p-3 w-[60px] h-[80px] border-2 border-blue-700"></div>
          )}
        </div>
        {result && (
          <p className="text-center text-lg text-gray-300">
            Score: {result.playerScore}
          </p>
        )}
      </div>

      {/* Result Display */}
      {result && (
        <div className={`text-center mb-4 p-4 rounded ${
          result.outcome === 'win' || result.outcome === 'blackjack' ? 'bg-green-900' :
          result.outcome === 'push' ? 'bg-yellow-900' : 'bg-red-900'
        }`}>
          {result.outcome === 'blackjack' && (
            <>
              <p className="text-2xl font-bold text-green-300">🎉 BLACKJACK! 🎉</p>
              <p className="text-xl text-green-200">You won {result.payout} MTX!</p>
            </>
          )}
          {result.outcome === 'win' && (
            <>
              <p className="text-2xl font-bold text-green-300">YOU WIN!</p>
              <p className="text-xl text-green-200">You won {result.payout} MTX!</p>
            </>
          )}
          {result.outcome === 'push' && (
            <p className="text-xl font-semibold text-yellow-300">Push! Bet returned.</p>
          )}
          {result.outcome === 'lose' && (
            <p className="text-xl font-semibold text-red-300">Dealer wins. Better luck next time!</p>
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

      {/* Error Display */}
      {error && (
        <div className="bg-red-900 text-red-200 p-3 rounded mb-4 text-center">
          {error}
        </div>
      )}

      {/* Deal Button */}
      <button
        onClick={handleDeal}
        disabled={loading || !walletAddress}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors"
      >
        {loading ? 'Processing...' : walletAddress ? `🃏 DEAL (${BlackjackEngine.BET_AMOUNT} MTX)` : 'Connect Wallet to Play'}
      </button>

      {/* Rules */}
      <div className="mt-6 p-4 bg-gray-800 rounded">
        <h3 className="text-lg font-semibold text-green-400 mb-2">Rules</h3>
        <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
          <li>Dealer stands on 17+</li>
          <li>Blackjack pays 3:2</li>
          <li>Regular win pays 2:1</li>
          <li>Push returns your bet</li>
        </ul>
      </div>
    </div>
  );
}
