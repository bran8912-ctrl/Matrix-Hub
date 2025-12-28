import React, { useState } from 'react';
import { CasinoEngine } from '../../casinoEngine';

export default function DiceGame({ walletAddress, mtxBalance }) {
  const [bet, setBet] = useState(10);
  const [target, setTarget] = useState(50);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function play() {
    setError('');
    setLoading(true);
    try {
      const response = await CasinoEngine.placeBet('DICE', bet, { target }, walletAddress);
      setResult(response);
    } catch (e) {
      setError('Failed to place bet.');
    }
    setLoading(false);
  }

  return (
    <div>
      <h3>Dice Game</h3>
      <div>MTX Balance: {mtxBalance}</div>
      <input type="number" value={bet} min={1} max={1000} onChange={e => setBet(Number(e.target.value))} /> Bet Amount<br />
      <input type="number" value={target} min={1} max={99} onChange={e => setTarget(Number(e.target.value))} /> Target (0-99)<br />
      <button onClick={play} disabled={loading || !walletAddress}>Roll</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {result && (
        <div>
          <div>Roll: {result.roll}</div>
          <div>{result.win ? 'You win!' : 'You lose.'}</div>
        </div>
      )}
    </div>
  );
}
