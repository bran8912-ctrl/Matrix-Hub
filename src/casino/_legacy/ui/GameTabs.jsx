import React, { useState } from 'react';
import DiceGame from './games/DiceGame';
import CoinFlipGame from './games/CoinFlipGame';
import NumberMatchGame from './games/NumberMatchGame';
import CrashGame from './games/CrashGame';

const TABS = [
  { label: 'Dice', component: DiceGame },
  { label: 'Coin Flip', component: CoinFlipGame },
  { label: 'Number Match', component: NumberMatchGame },
  { label: 'Crash', component: CrashGame },
];

export default function GameTabs({ walletAddress, mtxBalance }) {
  const [active, setActive] = useState(0);
  const ActiveComponent = TABS[active].component;
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {TABS.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            style={{
              padding: '0.5rem 1.5rem',
              background: i === active ? '#22c55e' : '#181818',
              color: i === active ? '#181818' : '#22c55e',
              border: '2px solid #22c55e',
              borderRadius: 6,
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ border: '2px solid #22c55e', borderRadius: 8, background: '#101c10', padding: 24 }}>
        <ActiveComponent walletAddress={walletAddress} mtxBalance={mtxBalance} />
      </div>
    </div>
  );
}
