import React, { useState } from 'react';
import { BrowserProvider, formatUnits, parseUnits, Contract } from 'ethers';
import Web3Modal from 'web3modal';

// Deployed MTX token contract address and ABI
const MTX_TOKEN_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
const MTX_TOKEN_ABI = [
  // Minimal ABI for ERC-20 balanceOf
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

const TIERS = [
  { name: 'Bronze', threshold: 0 },
  { name: 'Silver', threshold: 100 },
  { name: 'Gold', threshold: 1000 },
  { name: 'Platinum', threshold: 10000 },
];

interface WalletConnectProps {
  onWalletChange?: (wallet: { address: string; balance: number }) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onWalletChange }) => {
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<number | null>(null);
  const [tier, setTier] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [provider, setProvider] = useState<any>(null);
  // State declarations for locked and lockUntil already exist, remove duplicates.

  const getTier = (bal: number): string => {
    for (let i = TIERS.length - 1; i >= 0; i--) {
      if (bal >= TIERS[i].threshold) return TIERS[i].name;
    }
    return 'Bronze'; 
  };

  const connectWallet = async (): Promise<void> => {
    setError('');
    setLoading(true);
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const _provider = new BrowserProvider(connection);
      setProvider(_provider);
      const signer = await _provider.getSigner();
      const userAddress = await signer.getAddress();
      setAddress(userAddress);
      // Get MTX balance
      const token = new Contract(MTX_TOKEN_ADDRESS, MTX_TOKEN_ABI, _provider);
      const rawBalance = await token.balanceOf(userAddress);
      const decimals = await token.decimals();
      const formatted = parseFloat(formatUnits(rawBalance, decimals));
      setBalance(formatted);
      setTier(getTier(formatted));
      if (onWalletChange) {
        onWalletChange({ address: userAddress, balance: formatted });
      }
    } catch (err) {
      setError('Failed to connect wallet.');
    }
    setLoading(false);
  };

  // Deduct MTX for premium features with burn
  const deductMTX = async (amount: number): Promise<void> => {
    setError('');
    if (!provider || !address) {
      setError('Connect wallet first.');
      return;
    }
    if (balance !== null && balance < amount) {
      setError('Insufficient MTX balance.');
      return;
    }
    const burnPercent = 0.1; // 10% burn
    const burnAmount = amount * burnPercent;
    const spendAmount = amount - burnAmount;
    if (!window.confirm(`Deduct ${amount} MTX for this feature? (${spendAmount} spent, ${burnAmount} burned)`)) return;
    setLoading(true);
    try {
      const signer = await provider.getSigner();
      const token = new Contract(MTX_TOKEN_ADDRESS, MTX_TOKEN_ABI, signer);
      const decimals = await token.decimals();
      // Burn MTX
      if (burnAmount > 0) {
        const burnTx = await token.transfer('0x000000000000000000000000000000000000dead', parseUnits(burnAmount.toString(), decimals));
        await burnTx.wait();
      }
      // Spend MTX (simulate: send to platform address)
      if (spendAmount > 0) {
        const platformAddress = '0x000000000000000000000000000000000000beef'; // Replace with your platform address
        const spendTx = await token.transfer(platformAddress, parseUnits(spendAmount.toString(), decimals));
        await spendTx.wait();
      }
      // Refresh balance
      const rawBalance = await token.balanceOf(address);
      const formatted = parseFloat(formatUnits(rawBalance, decimals));
      setBalance(formatted);
      setTier(getTier(formatted));
      if (onWalletChange) {
        onWalletChange({ address, balance: formatted });
      }
    } catch (err) {
      setError('MTX deduction failed.');
    }
    setLoading(false);
  };

  // Lock/Unlock MTX for tier access (simulated client-side)
  const [locked, setLocked] = useState<number>(0);
  const [lockUntil, setLockUntil] = useState<number>(0);
  const lockMTX = async (amount: number, days: number = 30): Promise<void> => {
    setError('');
    if (!provider || !address) {
      setError('Connect wallet first.');
      return;
    }
    if (balance !== null && balance < amount) {
      setError('Insufficient MTX balance.');
      return;
    }
    if (!window.confirm(`Lock ${amount} MTX for ${days} days to access higher tier?`)) return;
    setLocked(amount);
    setLockUntil(Date.now() + days * 24 * 60 * 60 * 1000);
    if (balance !== null) {
      setBalance(balance - amount);
      setTier(getTier(balance - amount));
    }
  };
  const unlockMTX = (): void => {
    if (!lockUntil || Date.now() < lockUntil) {
      setError('Lock period not finished.');
      return;
    }
    if (balance !== null) {
      setBalance(balance + locked);
      setTier(getTier(balance + locked));
    }
    setLocked(0);
    setLockUntil(0);
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #333', borderRadius: '8px', background: '#181818', color: '#fff', maxWidth: 320 }}>
      <h3>Wallet Connect</h3>
      {address ? (
        <>
          <div><strong>Address:</strong> {address.slice(0, 6)}...{address.slice(-4)}</div>
          <div><strong>MTX Balance:</strong> {balance !== null ? balance : 'Loading...'}</div>
          <div><strong>Tier:</strong> {tier}</div>
          {locked > 0 && (
            <div style={{ color: '#ffd700', marginTop: '0.5rem' }}>
              <strong>Locked MTX:</strong> {locked} (Unlocks: {lockUntil ? new Date(lockUntil).toLocaleString() : ''})
              <button onClick={unlockMTX} disabled={!lockUntil || Date.now() < lockUntil} style={{ marginLeft: '1rem', padding: '0.25rem 0.75rem', background: '#444', color: '#fff', border: 'none', borderRadius: '4px', cursor: !lockUntil || Date.now() < lockUntil ? 'not-allowed' : 'pointer' }}>
                Unlock MTX
              </button>
            </div>
          )}
          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => deductMTX(10)} disabled={loading} style={{ padding: '0.5rem 1rem', fontSize: '1rem', background: '#ff0066', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}>
              Use Heavy Tool (-10 MTX)
            </button>
            <button onClick={() => deductMTX(5)} disabled={loading} style={{ padding: '0.5rem 1rem', fontSize: '1rem', background: '#00aaff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}>
              Priority Execution (-5 MTX)
            </button>
            <button onClick={() => deductMTX(1)} disabled={loading} style={{ padding: '0.5rem 1rem', fontSize: '1rem', background: '#ffaa00', color: '#181818', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}>
              Experimental Module (-1 MTX)
            </button>
            <button onClick={() => lockMTX(50, 30)} disabled={loading || locked > 0} style={{ padding: '0.5rem 1rem', fontSize: '1rem', background: '#00ff99', color: '#181818', border: 'none', borderRadius: '4px', cursor: locked > 0 ? 'not-allowed' : 'pointer', marginLeft: '0.5rem' }}>
              Lock 50 MTX (30 days)
            </button>
          </div>
        </>
      ) : (
        <button onClick={connectWallet} disabled={loading} style={{ padding: '0.5rem 1rem', fontSize: '1rem', background: '#00ff99', color: '#181818', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
      {error && <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>}
    </div>
  );
};

export default WalletConnect;
