import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract, parseEther } from 'ethers';
import { MTX } from '../config/mtx';
import mtxAbi from '../abi/mtx.json';

/**
 * BuyMTX Component - Direct ETH→MTX mint interface
 * 
 * Features:
 * - Shows current ETH to MTX exchange rate
 * - Input field for ETH amount
 * - Calculates and displays MTX amount to receive
 * - Buy button that sends ETH to contract
 * - Transaction status feedback
 * - Security messaging and guidance
 * 
 * Network: Ethereum Mainnet
 */
const BuyMTX: React.FC = () => {
  const [ethAmount, setEthAmount] = useState('0.01');
  const [mtxAmount, setMtxAmount] = useState('0');
  const [rate, setRate] = useState(MTX.ethToMtxRate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [txHash, setTxHash] = useState('');
  const [mintingPaused, setMintingPaused] = useState(false);

  // Calculate MTX amount whenever ETH amount or rate changes
  useEffect(() => {
    const eth = parseFloat(ethAmount) || 0;
    const mtx = eth * rate;
    setMtxAmount(mtx.toFixed(4));
  }, [ethAmount, rate]);

  // Fetch current rate and minting status from contract
  useEffect(() => {
    const fetchContractInfo = async () => {
      try {
        if (!window.ethereum) return;
        
        const provider = new BrowserProvider(window.ethereum);
        const mtxContract = new Contract(MTX.address, mtxAbi, provider);
        
        // Fetch rate
        const contractRate = await mtxContract.ethToMtxRate();
        setRate(Number(contractRate));
        
        // Fetch minting status
        const paused = await mtxContract.mintingPaused();
        setMintingPaused(paused);
      } catch (err) {
        console.error('Error fetching contract info:', err);
      }
    };
    
    fetchContractInfo();
  }, []);

  const handleBuyMTX = async () => {
    setError('');
    setSuccess('');
    setTxHash('');
    
    if (!window.ethereum) {
      setError('Ethereum wallet not found. Please install MetaMask or a compatible wallet.');
      return;
    }

    const eth = parseFloat(ethAmount);
    if (!eth || eth <= 0) {
      setError('Please enter a valid ETH amount greater than 0');
      return;
    }

    if (mintingPaused) {
      setError('Direct minting is currently paused. Please use Uniswap instead.');
      return;
    }

    setLoading(true);

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const mtxContract = new Contract(MTX.address, mtxAbi, signer);

      // Send transaction to buyMTX function
      const tx = await mtxContract.buyMTX({ value: parseEther(ethAmount) });
      
      setSuccess(`Transaction sent! Waiting for confirmation...`);
      setTxHash(tx.hash);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        setSuccess(`Success! You received ${mtxAmount} MTX. Transaction confirmed.`);
      } else {
        setError('Transaction failed. Please try again.');
      }
    } catch (err: unknown) {
      console.error('Error buying MTX:', err);
      
      const error = err as { code?: number; message?: string };
      if (error.code === 4001) {
        setError('Transaction rejected by user.');
      } else if (error.message?.includes('insufficient funds')) {
        setError('Insufficient ETH balance for this transaction.');
      } else if (err.message?.includes('Exceeds max supply')) {
        setError('Purchase would exceed max MTX supply. Try a smaller amount.');
      } else {
        setError(err.message || 'Failed to purchase MTX. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '1.5rem',
      border: '1px solid #333',
      borderRadius: '8px',
      background: '#181818',
      color: '#fff',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <h3 style={{ 
        marginBottom: '1rem', 
        fontSize: '1.5rem', 
        fontWeight: 'bold',
        color: '#00ff99'
      }}>
        Buy MTX (Direct Mint)
      </h3>

      {/* Rate Display */}
      <div style={{
        marginBottom: '1.5rem',
        padding: '1rem',
        background: '#222',
        borderRadius: '6px',
        border: '1px solid #00ff9950'
      }}>
        <div style={{ fontSize: '0.875rem', color: '#aaa', marginBottom: '0.25rem' }}>
          Current Rate
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#00ff99' }}>
          1 ETH = {rate} MTX
        </div>
      </div>

      {/* Input Section */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          color: '#aaa'
        }}>
          ETH Amount
        </label>
        <input
          type="number"
          value={ethAmount}
          onChange={(e) => setEthAmount(e.target.value)}
          step="0.001"
          min="0"
          disabled={loading || mintingPaused}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            background: '#222',
            border: '1px solid #444',
            borderRadius: '4px',
            color: '#fff',
            outline: 'none'
          }}
        />
      </div>

      {/* MTX Amount Display */}
      <div style={{
        marginBottom: '1.5rem',
        padding: '0.75rem',
        background: '#222',
        borderRadius: '4px',
        border: '1px solid #444'
      }}>
        <div style={{ fontSize: '0.875rem', color: '#aaa', marginBottom: '0.25rem' }}>
          You will receive
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00ff99' }}>
          {mtxAmount} MTX
        </div>
      </div>

      {/* Buy Button */}
      <button
        onClick={handleBuyMTX}
        disabled={loading || mintingPaused}
        style={{
          width: '100%',
          padding: '1rem',
          fontSize: '1.125rem',
          background: mintingPaused ? '#666' : '#00ff99',
          color: '#181818',
          border: 'none',
          borderRadius: '6px',
          cursor: (loading || mintingPaused) ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          opacity: (loading || mintingPaused) ? 0.6 : 1,
          transition: 'opacity 0.2s'
        }}
      >
        {loading ? 'Processing...' : mintingPaused ? 'Minting Paused' : 'Buy MTX with ETH'}
      </button>

      {/* Status Messages */}
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
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: '#00ff9920',
          border: '1px solid #00ff99',
          borderRadius: '4px',
          color: '#00ff99',
          fontSize: '0.875rem'
        }}>
          ✓ {success}
          {txHash && (
            <div style={{ marginTop: '0.5rem' }}>
              <a
                href={`https://etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#00ff99', textDecoration: 'underline' }}
              >
                View on Etherscan
              </a>
            </div>
          )}
        </div>
      )}

      {/* Security & Info Section */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: '#222',
        borderRadius: '6px',
        fontSize: '0.875rem',
        color: '#aaa',
        lineHeight: '1.6'
      }}>
        <div style={{ fontWeight: 'bold', color: '#00ff99', marginBottom: '0.5rem' }}>
          ℹ️ About Direct Mint
        </div>
        <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>Instant MTX minting at a fixed rate</li>
          <li>Lower gas costs than DEX swaps</li>
          <li>Perfect for small purchases and onboarding</li>
          <li>All transactions are on-chain and transparent</li>
          <li>Contract address: {MTX.address.slice(0, 10)}...{MTX.address.slice(-8)}</li>
        </ul>
        
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.75rem', 
          background: '#ff990020',
          border: '1px solid #ff9900',
          borderRadius: '4px',
          color: '#ffaa00'
        }}>
          <strong>⚠️ Important:</strong> Ensure you're on the correct network (Ethereum Mainnet). 
          Always verify the contract address before sending ETH.
        </div>
      </div>
    </div>
  );
};

export default BuyMTX;
