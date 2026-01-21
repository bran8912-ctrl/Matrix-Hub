import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract, formatUnits, formatEther } from 'ethers';
import { MTX } from '../config/mtx';
import mtxAbi from '../abi/mtx.json';

interface DashboardStats {
  mtxBalance: string;
  maticBalance: string;
  totalSupply: string;
  userPercentage: string;
  tier: string;
  lockedMTX: string;
  availableMTX: string;
}

const TIERS = [
  { name: 'Bronze', threshold: 0, color: '#CD7F32' },
  { name: 'Silver', threshold: 100, color: '#C0C0C0' },
  { name: 'Gold', threshold: 1000, color: '#FFD700' },
  { name: 'Platinum', threshold: 10000, color: '#E5E4E2' },
  { name: 'Diamond', threshold: 100000, color: '#B9F2FF' },
];

interface MTXDashboardProps {
  address?: string;
}

/**
 * MTXDashboard Component
 * Comprehensive dashboard for MTX token holdings and statistics
 * 
 * Features:
 * - Display MTX and MATIC balances
 * - Show user tier based on MTX holdings
 * - Display total supply and user's percentage
 * - Track locked vs available MTX
 * - Quick actions for common operations
 * - Visual tier progress indicator
 */
const MTXDashboard: React.FC<MTXDashboardProps> = ({ address }) => {
  const [stats, setStats] = useState<DashboardStats>({
    mtxBalance: '0',
    ethBalance: '0',
    totalSupply: '0',
    userPercentage: '0',
    tier: 'Bronze',
    lockedMTX: '0',
    availableMTX: '0',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Determine user tier based on MTX balance
   */
  const getTier = (balance: number): typeof TIERS[number] => {
    for (let i = TIERS.length - 1; i >= 0; i--) {
      if (balance >= TIERS[i].threshold) {
        return TIERS[i];
      }
    }
    return TIERS[0];
  };

  /**
   * Get next tier and progress
   */
  const getNextTierProgress = (balance: number): { nextTier: typeof TIERS[number] | null; progress: number } => {
    const currentTier = getTier(balance);
    const currentIndex = TIERS.findIndex(t => t.name === currentTier.name);
    
    if (currentIndex === TIERS.length - 1) {
      return { nextTier: null, progress: 100 };
    }

    const nextTier = TIERS[currentIndex + 1];
    const currentThreshold = currentTier.threshold;
    const nextThreshold = nextTier.threshold;
    const progress = ((balance - currentThreshold) / (nextThreshold - currentThreshold)) * 100;

    return { nextTier, progress: Math.min(progress, 100) };
  };

  /**
   * Fetch dashboard statistics
   */
  const fetchStats = async () => {
    if (!address || !window.ethereum) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const provider = new BrowserProvider(window.ethereum);
      const mtxContract = new Contract(MTX.address, mtxAbi, provider);

      // Fetch all data in parallel
      const [rawBalance, decimals, totalSupply, maticBalance] = await Promise.all([
        mtxContract.balanceOf(address),
        mtxContract.decimals(),
        mtxContract.totalSupply(),
        provider.getBalance(address),
      ]);

      const mtxBalance = formatUnits(rawBalance, decimals);
      const mtxBalanceNum = parseFloat(mtxBalance);
      const totalSupplyFormatted = formatUnits(totalSupply, decimals);
      const totalSupplyNum = parseFloat(totalSupplyFormatted);
      
      const userPercentage = totalSupplyNum > 0 
        ? ((mtxBalanceNum / totalSupplyNum) * 100).toFixed(4)
        : '0';

      const tier = getTier(mtxBalanceNum);

      setStats({
        mtxBalance,
        maticBalance: formatEther(maticBalance),
        totalSupply: totalSupplyFormatted,
        userPercentage,
        tier: tier.name,
        lockedMTX: '0', // TODO: Implement locking mechanism
        availableMTX: mtxBalance,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to fetch dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats when address changes
  useEffect(() => {
    if (address) {
      fetchStats();
    }
  }, [address]);

  if (!address) {
    return (
      <div style={{
        padding: '2rem',
        border: '1px solid #333',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #181818 0%, #222 100%)',
        color: '#aaa',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#00ff99', marginBottom: '1rem' }}>MTX Dashboard</h2>
        <p>Connect your wallet to view your MTX dashboard</p>
      </div>
    );
  }

  const mtxBalanceNum = parseFloat(stats.mtxBalance);
  const currentTier = getTier(mtxBalanceNum);
  const { nextTier, progress } = getNextTierProgress(mtxBalanceNum);

  return (
    <div style={{
      padding: '2rem',
      border: '1px solid #333',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #181818 0%, #222 100%)',
      color: '#fff'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '1.75rem',
          fontWeight: 'bold',
          color: '#00ff99',
          fontFamily: 'Courier New, monospace'
        }}>
          MTX Dashboard
        </h2>
        <button
          onClick={fetchStats}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            background: '#00ff99',
            color: '#181818',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'wait' : 'pointer',
            fontWeight: '600'
          }}
        >
          {loading ? 'Loading...' : '↻ Refresh'}
        </button>
      </div>

      {error && (
        <div style={{
          padding: '1rem',
          background: '#ff000020',
          border: '1px solid #ff0000',
          borderRadius: '6px',
          color: '#ff6666',
          fontSize: '0.875rem',
          marginBottom: '1.5rem'
        }}>
          {error}
        </div>
      )}

      {/* Main Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {/* MTX Balance Card */}
        <div style={{
          padding: '1.5rem',
          background: 'rgba(0, 255, 153, 0.05)',
          border: '1px solid rgba(0, 255, 153, 0.2)',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#aaa', marginBottom: '0.5rem' }}>
            MTX Balance
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#00ff99',
            fontFamily: 'monospace'
          }}>
            {loading ? '...' : Number(stats.mtxBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.25rem' }}>
            {stats.userPercentage}% of total supply
          </div>
        </div>

        {/* MATIC Balance Card */}
        <div style={{
          padding: '1.5rem',
          background: 'rgba(99, 153, 255, 0.05)',
          border: '1px solid rgba(99, 153, 255, 0.2)',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#aaa', marginBottom: '0.5rem' }}>
            MATIC Balance
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#6399ff',
            fontFamily: 'monospace'
          }}>
            {loading ? '...' : Number(stats.maticBalance).toFixed(4)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.25rem' }}>
            Polygon Mainnet
          </div>
        </div>

        {/* Tier Card */}
        <div style={{
          padding: '1.5rem',
          background: `rgba(${parseInt(currentTier.color.slice(1, 3), 16)}, ${parseInt(currentTier.color.slice(3, 5), 16)}, ${parseInt(currentTier.color.slice(5, 7), 16)}, 0.05)`,
          border: `1px solid ${currentTier.color}40`,
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#aaa', marginBottom: '0.5rem' }}>
            Current Tier
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: currentTier.color,
            fontFamily: 'monospace'
          }}>
            {stats.tier}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.25rem' }}>
            {currentTier.threshold.toLocaleString()} MTX minimum
          </div>
        </div>
      </div>

      {/* Tier Progress */}
      {nextTier && (
        <div style={{
          padding: '1.5rem',
          background: '#222',
          border: '1px solid #333',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#aaa' }}>
              Progress to {nextTier.name} Tier
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: nextTier.color }}>
              {progress.toFixed(1)}%
            </div>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: '#333',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${currentTier.color}, ${nextTier.color})`,
              transition: 'width 0.5s ease'
            }} />
          </div>
          <div style={{
            marginTop: '0.5rem',
            fontSize: '0.75rem',
            color: '#aaa'
          }}>
            {(nextTier.threshold - mtxBalanceNum).toLocaleString(undefined, { maximumFractionDigits: 2 })} MTX needed for next tier
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        <a
          href="/buy-mtx"
          style={{
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            background: '#00ff99',
            color: '#181818',
            textDecoration: 'none',
            border: 'none',
            borderRadius: '6px',
            textAlign: 'center',
            fontWeight: '600',
            display: 'block'
          }}
        >
          Buy MTX
        </a>
        <a
          href={MTX.uniswapUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            background: '#FF007A',
            color: '#fff',
            textDecoration: 'none',
            border: 'none',
            borderRadius: '6px',
            textAlign: 'center',
            fontWeight: '600',
            display: 'block'
          }}
        >
          Trade on QuickSwap
        </a>
        <a
          href="/casino"
          style={{
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            background: '#6399ff',
            color: '#fff',
            textDecoration: 'none',
            border: 'none',
            borderRadius: '6px',
            textAlign: 'center',
            fontWeight: '600',
            display: 'block'
          }}
        >
          Play Casino
        </a>
        <a
          href="/staking"
          style={{
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            background: '#ff9900',
            color: '#181818',
            textDecoration: 'none',
            border: 'none',
            borderRadius: '6px',
            textAlign: 'center',
            fontWeight: '600',
            display: 'block'
          }}
        >
          Stake MTX
        </a>
      </div>

      {/* Additional Info */}
      <div style={{
        padding: '1rem',
        background: '#222',
        border: '1px solid #333',
        borderRadius: '8px',
        fontSize: '0.75rem',
        color: '#aaa'
      }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong style={{ color: '#00ff99' }}>Total Supply:</strong>{' '}
          {Number(stats.totalSupply).toLocaleString(undefined, { maximumFractionDigits: 0 })} MTX
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong style={{ color: '#00ff99' }}>Contract:</strong>{' '}
          <a
            href={MTX.blockExplorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#00ff99', textDecoration: 'none' }}
          >
            {MTX.address.slice(0, 10)}...{MTX.address.slice(-8)} ↗
          </a>
        </div>
        <div>
          <strong style={{ color: '#00ff99' }}>Network:</strong> {MTX.chainName} (Chain ID: {MTX.chainId})
        </div>
      </div>
    </div>
  );
};

export default MTXDashboard;
