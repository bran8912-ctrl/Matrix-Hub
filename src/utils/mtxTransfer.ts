import { BrowserProvider, Contract, parseUnits } from 'ethers';
import { MTX } from '../config/mtx';
import mtxAbi from '../abi/mtx.json';

/**
 * Utility function to spend/transfer MTX tokens from the connected wallet
 * to a specified address (e.g., casino vault for placing bets).
 * 
 * @param to - Recipient address (e.g., casino vault address)
 * @param amount - Amount of MTX to transfer (in human-readable format, e.g., "10" for 10 MTX)
 * @returns Promise<string> - Transaction hash on success
 * @throws Error if wallet not connected, insufficient balance, or transaction fails
 */
export async function spendMTX(to: string, amount: string): Promise<string> {
  // Normalize the amount by trimming whitespace
  const normalizedAmount = amount.trim();

  // Validate amount parameter
  if (!normalizedAmount) {
    throw new Error('Amount is required and cannot be empty.');
  }

  // Check that amount parses to a finite number and is strictly greater than zero
  const numericAmount = parseFloat(normalizedAmount);
  if (!Number.isFinite(numericAmount)) {
    throw new Error('Amount must be a valid number.');
  }
  if (numericAmount <= 0) {
    throw new Error('Amount must be greater than zero.');
  }
  
  // Check if window.ethereum is available
  if (!window.ethereum) {
    throw new Error('Ethereum wallet not found. Please install MetaMask or compatible wallet.');
  }

  try {
    // Create provider and get signer
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // Create contract instance with signer for write operations
    const mtxContract = new Contract(MTX.address, mtxAbi, signer);
    
    // Get decimals from contract (should be 18 for MTX)
    const decimals = await mtxContract.decimals();
    
    // Convert amount to wei using contract decimals
    let amountInWei;
    try {
      amountInWei = parseUnits(normalizedAmount, decimals);
    } catch (err: any) {
      // Handle invalid amount format (e.g., scientific notation, multiple decimals)
      throw new Error(
        'Amount format is invalid. Please enter a plain decimal number (e.g., "10.5").'
      );
    }
    
    // Get user address for balance check
    const userAddress = await signer.getAddress();
    
    // Check balance before attempting transfer
    const balance = await mtxContract.balanceOf(userAddress);
    if (balance < amountInWei) {
      throw new Error(`Insufficient MTX balance. Required: ${amount} MTX`);
    }
    
    // Execute transfer transaction
    const tx = await mtxContract.transfer(to, amountInWei);
    
    // Wait for transaction confirmation (1 block confirmation)
    const receipt = await tx.wait(1);
    
    // Return transaction hash
    return receipt.hash;
  } catch (error: any) {
    // Handle specific error cases
    if (error.code === 'ACTION_REJECTED') {
      throw new Error('Transaction rejected by user.');
    }
    
    // Re-throw with descriptive message
    throw new Error(`MTX transfer failed: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Helper function to ensure the correct Ethereum network is selected.
 * Automatically switches to the configured network if needed.
 * 
 * @returns Promise<void>
 * @throws Error if network switch fails or is rejected
 */
export async function ensureEthereum(): Promise<void> {
  if (!window.ethereum) {
    throw new Error('Ethereum wallet not found. Please install MetaMask or compatible wallet.');
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    
    // Check if we're on the correct network (chainId is bigint in ethers v6)
    if (network.chainId !== BigInt(MTX.chainId)) {
      // Attempt to switch network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${MTX.chainId.toString(16)}` }],
        });
      } catch (switchError: any) {
        // This error code indicates the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          throw new Error(
            `Please add Ethereum network (Chain ID: ${MTX.chainId}) to your wallet.`
          );
        }
        throw switchError;
      }
    }
  } catch (error: any) {
    throw new Error(`Network check failed: ${error.message || 'Unknown error'}`);
  }
}
