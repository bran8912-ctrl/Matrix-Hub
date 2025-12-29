import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract, formatUnits } from 'ethers';
import Web3Modal from 'web3modal';
import { MTX } from '../config/mtx';
import mtxAbi from '../abi/mtx.json';
import { ensureEthereum } from '../utils/mtxTransfer';

/**
 * Wallet component - React island for wallet connection and MTX balance display
 * Features:
 * - Connect wallet button
 * - Display connected address
 * - Display MTX token balance
 * - Add MTX to wallet button (EIP-747)
 * - Buy MTX on Uniswap button
 * - Automatic network switching
 */
const Wallet = () => {
  // State management
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [provider, setProvider] = useState(null);

  /**
   * Connect wallet using Web3Modal
   * Automatically ensures correct network after connection
   */
  const connectWallet = async () => {
    setError('');
    setLoading(true);

    try {
      // Initialize Web3Modal and connect
      const web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions: {},
      });
      
      const connection = await web3Modal.connect();
      const ethersProvider = new BrowserProvider(connection);
      
      // Ensure we're on the correct Ethereum network
      await ensureEthereum();
      
      setProvider(ethersProvider);
      
      // Get signer and user address
      const signer = await ethersProvider.getSigner();
      const userAddress = await signer.getAddress();
      setAddress(userAddress);
      
      // Fetch MTX balance
      await fetchBalance(ethersProvider, userAddress);
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch MTX token balance for the connected address
   */
  const fetchBalance = async (ethersProvider, userAddress) => {
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
  };

  /**
   * Add MTX token to user's wallet using EIP-747 (wallet_watchAsset)
   */
  const addTokenToWallet = async () => {
    setError('');
    
    if (!window.ethereum) {
      setError('Ethereum wallet not found.');
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
  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      // User disconnected wallet
      setAddress('');
      setBalance(null);
      setProvider(null);
    } else if (accounts[0] !== address) {
      // User switched to a different account
      setAddress(accounts[0]);
      if (provider) {
        await fetchBalance(provider, accounts[0]);
      }
    }
  };

  /**
   * Handle chain/network changes (reload to ensure consistency)
   */
  const handleChainChanged = () => {
    window.location.reload();
  };

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
  }, [address, provider]); // Re-run when address or provider changes

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

      {!address ? (
        // Not connected - show connect button
        <button
          onClick={connectWallet}
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            background: '#00ff99',
            color: '#181818',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            width: '100%',
            opacity: loading ? 0.6 : 1
          }}
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
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                background: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Add MTX to Wallet
            </button>

            {/* Buy MTX on Uniswap Button */}
            <a
              href={MTX.uniswapUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                background: '#FF007A',
                color: '#fff',
                textDecoration: 'none',
                border: 'none',
                borderRadius: '4px',
                textAlign: 'center',
                fontWeight: '500',
                display: 'block'
              }}
            >
              Buy MTX on Uniswap
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
