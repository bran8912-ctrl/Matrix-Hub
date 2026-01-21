import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract, formatUnits } from 'ethers';
import { MTX } from '../config/mtx';
import mtxAbi from '../abi/mtx.json';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  blockNumber: number;
  type: 'send' | 'receive' | 'mint' | 'burn';
}

interface MTXTransactionHistoryProps {
  address?: string;
  maxItems?: number;
}

/**
 * MTXTransactionHistory Component
 * Displays recent MTX token transactions for the connected wallet
 * 
 * Features:
 * - Fetch recent transactions from blockchain
 * - Display transaction type (send, receive, mint, burn)
 * - Show transaction amounts and timestamps
 * - Link to block explorer for details
 * - Automatic refresh capability
 */
const MTXTransactionHistory: React.FC<MTXTransactionHistoryProps> = ({ 
  address,
  maxItems = 10 
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Fetch transaction history from blockchain
   */
  const fetchTransactions = async () => {
    if (!address || !window.ethereum) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const provider = new BrowserProvider(window.ethereum);
      const mtxContract = new Contract(MTX.address, mtxAbi, provider);
      const decimals = await mtxContract.decimals();

      // Get Transfer events
      // Note: This is a simplified version. In production, you'd use etherscan API
      // or a backend service to get comprehensive transaction history
      const currentBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 10000); // Last ~10k blocks

      // Fetch Transfer events where user is sender or receiver
      const sentFilter = mtxContract.filters.Transfer(address, null);
      const receivedFilter = mtxContract.filters.Transfer(null, address);

      const [sentEvents, receivedEvents] = await Promise.all([
        mtxContract.queryFilter(sentFilter, fromBlock, currentBlock),
        mtxContract.queryFilter(receivedFilter, fromBlock, currentBlock),
      ]);

      // Combine and process events
      const allEvents = [...sentEvents, ...receivedEvents];
      
      // Remove duplicates and sort by block number
      const uniqueEvents = Array.from(
        new Map(allEvents.map(event => [event.transactionHash, event])).values()
      );
      
      uniqueEvents.sort((a, b) => b.blockNumber - a.blockNumber);

      // Process transactions
      const txs: Transaction[] = await Promise.all(
        uniqueEvents.slice(0, maxItems).map(async (event) => {
          const args = event.args as { from: string; to: string; value: bigint };
          const block = await provider.getBlock(event.blockNumber);
          const value = formatUnits(args.value, decimals);
          
          // Determine transaction type
          let type: Transaction['type'] = 'send';
          if (args.from === address) {
            type = args.to === '0x000000000000000000000000000000000000dEaD' ? 'burn' : 'send';
          } else if (args.to === address) {
            type = args.from === '0x0000000000000000000000000000000000000000' ? 'mint' : 'receive';
          }

          return {
            hash: event.transactionHash,
            from: args.from,
            to: args.to,
            value,
            timestamp: block?.timestamp || 0,
            blockNumber: event.blockNumber,
            type,
          };
        })
      );

      setTransactions(txs);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transaction history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions when address changes
  useEffect(() => {
    if (address) {
      fetchTransactions();
    }
  }, [address]);

  if (!address) {
    return (
      <div style={{
        padding: '1.5rem',
        border: '1px solid #333',
        borderRadius: '8px',
        background: '#181818',
        color: '#aaa',
        textAlign: 'center'
      }}>
        Connect your wallet to view transaction history
      </div>
    );
  }

  return (
    <div style={{
      padding: '1.5rem',
      border: '1px solid #333',
      borderRadius: '8px',
      background: '#181818',
      color: '#fff'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>
          Recent Transactions
        </h3>
        <button
          onClick={fetchTransactions}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            background: '#00ff99',
            color: '#181818',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'wait' : 'pointer',
            fontWeight: '500'
          }}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div style={{
          padding: '0.75rem',
          background: '#ff000020',
          border: '1px solid #ff0000',
          borderRadius: '4px',
          color: '#ff6666',
          fontSize: '0.875rem',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {loading && transactions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#aaa' }}>
          Loading transactions...
        </div>
      ) : transactions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#aaa' }}>
          No transactions found
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.875rem'
          }}>
            <thead>
              <tr style={{
                borderBottom: '1px solid #333',
                textAlign: 'left'
              }}>
                <th style={{ padding: '0.75rem', color: '#aaa' }}>Type</th>
                <th style={{ padding: '0.75rem', color: '#aaa' }}>Amount</th>
                <th style={{ padding: '0.75rem', color: '#aaa' }}>From/To</th>
                <th style={{ padding: '0.75rem', color: '#aaa' }}>Time</th>
                <th style={{ padding: '0.75rem', color: '#aaa' }}>Tx</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx.hash}
                  style={{
                    borderBottom: '1px solid #222'
                  }}
                >
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      background: 
                        tx.type === 'receive' ? '#00ff9920' :
                        tx.type === 'mint' ? '#0099ff20' :
                        tx.type === 'burn' ? '#ff990020' :
                        '#ff006620',
                      color:
                        tx.type === 'receive' ? '#00ff99' :
                        tx.type === 'mint' ? '#0099ff' :
                        tx.type === 'burn' ? '#ff9900' :
                        '#ff0066'
                    }}>
                      {tx.type.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>
                    {Number(tx.value).toFixed(4)} MTX
                  </td>
                  <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {tx.type === 'send' || tx.type === 'burn' 
                      ? `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`
                      : `${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`
                    }
                  </td>
                  <td style={{ padding: '0.75rem', color: '#aaa' }}>
                    {tx.timestamp > 0 
                      ? new Date(tx.timestamp * 1000).toLocaleDateString()
                      : 'Pending'
                    }
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <a
                      href={`${MTX.blockExplorerUrls[0]}tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#00ff99',
                        textDecoration: 'none',
                        fontSize: '0.75rem'
                      }}
                    >
                      View ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        background: '#222',
        borderRadius: '4px',
        fontSize: '0.75rem',
        color: '#aaa',
        textAlign: 'center'
      }}>
        Showing last {maxItems} transactions. View full history on{' '}
        <a
          href={`${MTX.blockExplorerUrls[0]}token/${MTX.address}?a=${address}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#00ff99', textDecoration: 'none' }}
        >
          PolygonScan ↗
        </a>
      </div>
    </div>
  );
};

export default MTXTransactionHistory;
