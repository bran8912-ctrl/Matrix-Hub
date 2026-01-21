import React, { useState, useEffect, useCallback } from 'react';
import { BrowserProvider, Contract, formatUnits } from 'ethers';
import { useAppKitProvider, useAppKitAccount, useAppKit } from '@reown/appkit/react'
import { MTX } from '../config/mtx';
import mtxAbi from '../abi/mtx.json';
import { ensureEthereum } from '../utils/mtxTransfer';

/**
 * Wallet component - React island for wallet connection and MTX balance display
 * Features:
 * - Connect wallet button (using Reown AppKit)
 * - Display connected address
 * - Display MTX token balance
 * - Add MTX to wallet button (EIP-747)
 * - Buy MTX on Uniswap button
 * - Automatic network switching
 */
const Wallet = () => {
  const { address, isConnected } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('eip155')
  const { open } = useAppKit()
  
  // State management
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [provider, setProvider] = useState(null);

  /**
   * Fetch MTX token balance for the connected address
   */
  const fetchBalance = useCallback(async (ethersProvider, userAddress) => {
    try {
      const mtxContract = new Contract(MTX.address, mtxAbi, ethersProvider);
      const rawBalance = await mtxContract.balanceOf(userAddress);
      const decimals = await mtxContract.decimals();
      const formattedBalance = formatUnits(rawBalance, decimals);
      setBalance(formattedBalance);
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError('Failed to fetch MTX balance.');
    }
  }, []);

  /**
   * Fetch balance when wallet is connected
   */
  useEffect(() => {
    const updateBalance = async () => {
      if (!isConnected || !address || !walletProvider) {
        setBalance(null)
        setProvider(null)
        return
      }

      try {
        const ethersProvider = new BrowserProvider(walletProvider)
        setProvider(ethersProvider)
        
        // Ensure we're on the correct network
        await ensureEthereum() // Ensure we're on the correct network (Polygon)
        
        await fetchBalance(ethersProvider, address)
      } catch (err) {
        console.error('Error setting up wallet:', err)
        setError(err.message || 'Failed to set up wallet connection.')
      }
    }

    updateBalance()
  }, [isConnected, address, walletProvider, fetchBalance])

  /**
   * Add MTX token to user's wallet using EIP-747 (wallet_watchAsset)
   */
  const addTokenToWallet = async () => {
    setError('');
    
    if (!window.ethereum) {
      setError('Polygon wallet not found.');
      return;
    }

    try {
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: MTX.address,
            symbol: MTX.symbol,
            decimals: MTX.decimals,
            // Optional: add image URL when available
            // image: 'https://matrix-hub.org/mtx-logo.png',
          },
        },
      });

      if (wasAdded) {
        console.log('MTX token successfully added to wallet');
      }
    } catch (err) {
      console.error('Error adding token to wallet:', err);
      setError('Failed to add MTX token to wallet.');
    }
  };

  /**
   * Handle account changes (when user switches accounts in wallet)
   */
  const handleAccountsChanged = useCallback(async (accounts) => {
    if (accounts.length === 0) {
      // User disconnected wallet
      setBalance(null);
      setProvider(null);
    } else if (accounts[0] !== address) {
      // User switched to a different account
      if (provider) {
        await fetchBalance(provider, accounts[0]);
      }
    }
  }, [address, provider, fetchBalance]);

  /**
   * Handle chain/network changes (reload to ensure consistency)
   */
  const handleChainChanged = useCallback(() => {
    window.location.reload();
  }, []);

  /**
   * Setup and cleanup event listeners when wallet is connected
   */
  useEffect(() => {
    // Only add event listeners if wallet is connected
    if (window.ethereum && address) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Cleanup listeners on unmount or when address changes
      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [address, provider, handleAccountsChanged, handleChainChanged]); // Include all dependencies

  return (
    <div className="wallet-container" style={{
      padding: '1.5rem',
      border: '1px solid #333',
      borderRadius: '8px',
      background: '#181818',
      color: '#fff',
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
        MTX Wallet
      </h3>

      {!isConnected || !address ? (
        // Not connected - show connect button
        <button
          onClick={() => open()}
          disabled={loading}
          className="wallet-connect-btn"
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        // Connected - show wallet info and actions
        <div>
          {/* Address Display */}
          <div style={{ marginBottom: '1rem' }}>
            <strong>Address:</strong>
            <div style={{
              marginTop: '0.25rem',
              padding: '0.5rem',
              background: '#222',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '0.875rem'
            }}>
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          </div>

          {/* MTX Balance Display */}
          <div style={{ marginBottom: '1.5rem' }}>
            <strong>MTX Balance:</strong>
            <div style={{
              marginTop: '0.25rem',
              padding: '0.75rem',
              background: '#222',
              borderRadius: '4px',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#00ff99'
            }}>
              {balance !== null ? Number(balance).toFixed(4) : 'Loading...'} MTX
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
            {/* Add MTX to Wallet Button */}
            <button
              onClick={addTokenToWallet}
              className="wallet-action-btn"
            >
              Add MTX to Wallet
            </button>

            {/* Buy MTX on QuickSwap Button */}
            <a
              href={MTX.uniswapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="wallet-uniswap-btn"
            >
              Buy MTX on QuickSwap
            </a>

            {/* Buy MTX Direct Mint Button */}
            <a
              href="/buy-mtx"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                background: '#00ff99',
                color: '#181818',
                textDecoration: 'none',
                border: 'none',
                borderRadius: '4px',
                textAlign: 'center',
                fontWeight: '500',
                display: 'block'
              }}
            >
              Buy MTX (Direct Mint)
            </a>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: '#ff000020',
          border: '1px solid #ff0000',
          borderRadius: '4px',
          color: '#ff6666',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Wallet;
