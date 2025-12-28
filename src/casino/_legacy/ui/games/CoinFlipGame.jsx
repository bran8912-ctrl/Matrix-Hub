import React, { useState } from 'react';
import { CasinoEngine } from '../../casinoEngine';

export default function CoinFlipGame({ walletAddress, mtxBalance }) {
  const [bet, setBet] = useState(10);
  const [choice, setChoice] = useState('heads');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function play() {
    setError('');
    setLoading(true);
    try {
      const response = await CasinoEngine.placeBet('COINFLIP', bet, { choice }, walletAddress);
      setResult(response);
    } catch (e) {
      setError('Failed to place bet.');
    }
    setLoading(false);
  }

  return (
    <div>
      <h3>Coin Flip</h3>
      <div>MTX Balance: {mtxBalance}</div>
      <input type="number" value={bet} min={1} max={1000} onChange={e => setBet(Number(e.target.value))} /> Bet Amount<br />
      <select value={choice} onChange={e => setChoice(e.target.value)}>
        <option value="heads">Heads</option>
        <option value="tails">Tails</option>
      </select> Choice<br />
      <button onClick={play} disabled={loading || !walletAddress}>Flip</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {result && (
        <div>
          <div>Result: {result.result}</div>
          <div>{result.win ? 'You win!' : 'You lose.'}</div>
        </div>
      )}
    </div>
  );
}
