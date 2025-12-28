import React, { useState } from 'react';
import WalletConnect from '../components/WalletConnect';
import GameTabs from './ui/GameTabs';

export default function CasinoSection() {
  const [wallet, setWallet] = useState({ address: '', balance: 0 });

  // WalletConnect should accept a callback to update wallet state
  return (
    <section style={{ margin: '2rem 0', padding: '2rem', background: '#101c10', border: '2px solid #22c55e', borderRadius: 12 }}>
      <h2 style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '2rem', marginBottom: 16 }}>MTX Casino</h2>
      <WalletConnect onWalletChange={setWallet} />
      <div style={{ marginTop: 32 }}>
        <GameTabs walletAddress={wallet.address} mtxBalance={wallet.balance} />
      </div>
    </section>
  );
}
