import React, { useState } from 'react';
import { BrowserProvider, formatUnits, Contract } from 'ethers';
import Web3Modal from 'web3modal';
import { MTX } from '../config/mtx';

// Deployed MTX token contract address and ABI
const MTX_TOKEN_ADDRESS = MTX.address;
const MTX_TOKEN_ABI = [
  // Minimal ABI for ERC-20 balanceOf
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

interface CasinoGameWrapperProps {
  children: (props: { walletAddress?: string; mtxBalance: number }) => React.ReactNode;
}

export default function CasinoGameWrapper({ children }: CasinoGameWrapperProps) {
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const connectWallet = async (): Promise<void> => {
    setError('');
    setLoading(true);
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new BrowserProvider(connection);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setAddress(userAddress);
      
      // Get MTX balance
      const token = new Contract(MTX_TOKEN_ADDRESS, MTX_TOKEN_ABI, provider);
      const rawBalance = await token.balanceOf(userAddress);
      const decimals = await token.decimals();
      const formatted = parseFloat(formatUnits(rawBalance, decimals));
      setBalance(formatted);
    } catch (err) {
      setError('Failed to connect wallet.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div>
      {!address ? (
        <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg border-2 border-green-500 text-center">
          <h3 className="text-2xl font-bold text-green-400 mb-4">Connect Your Wallet</h3>
          <p className="text-gray-300 mb-6">Connect your wallet to check your MTX balance and play casino games.</p>
          <button
            onClick={connectWallet}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
          {error && (
            <div className="mt-4 text-red-400">{error}</div>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-green-500">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-400">Wallet: </span>
                <span className="text-green-400 font-mono">{address.slice(0, 6)}...{address.slice(-4)}</span>
              </div>
              <div>
                <span className="text-gray-400">MTX Balance: </span>
                <span className="text-yellow-400 font-bold">{balance.toFixed(2)} MTX</span>
              </div>
            </div>
          </div>
          {children({ walletAddress: address, mtxBalance: balance })}
        </>
      )}
    </div>
  );
}
