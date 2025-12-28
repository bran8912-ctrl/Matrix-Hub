import React, { useState } from 'react';
import { CasinoEngine } from '../../casinoEngine';

export default function CrashGame({ walletAddress, mtxBalance }) {
  const [bet, setBet] = useState(10);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function play() {
    setError('');
    setLoading(true);
    try {
      const response = await CasinoEngine.placeBet('CRASH', bet, {}, walletAddress);
      setResult(response);
    } catch (e) {
      setError('Failed to place bet.');
    }
    setLoading(false);
  }

  return (
    <div>
      <h3>Crash Game</h3>
      <div>MTX Balance: {mtxBalance}</div>
      <input type="number" value={bet} min={1} max={1000} onChange={e => setBet(Number(e.target.value))} /> Bet Amount<br />
      <button onClick={play} disabled={loading || !walletAddress}>Play</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {result && (
        <div>
          <div>Crash Point: {result.crashPoint}</div>
          <div>{result.win ? 'You win!' : 'You lose.'}</div>
        </div>
      )}
    </div>
  );
}
