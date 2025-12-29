// MTX Token Configuration for Ethereum Mainnet
// Network: Ethereum Mainnet (Chain ID: 1)
//
// DEPLOYMENT STATUS: Contract must be deployed to get legitimate address
// Use: npm run deploy:mainnet (production) or npm run deploy:sepolia (testnet)
// 
// ⚠️ AFTER DEPLOYMENT: Update this file with the real contract address
// For production, set MTX_CONTRACT_ADDRESS in environment variables
// Exchange Rate: 1 ETH = 100,000 MTX (configured in contract)
// Initial Owner: 0xb248d5bd04f6fadee6146d0dac1da82b842a437b9c6444c4cbc1e7ee37033e7a

// Get contract address from environment or use placeholder
const contractAddress = typeof process !== 'undefined' && process.env?.MTX_CONTRACT_ADDRESS 
  ? process.env.MTX_CONTRACT_ADDRESS 
  : "0x0000000000000000000000000000000000000000"; // Placeholder - deploy contract to get real address

// Validate address format
const isValidAddress = contractAddress && contractAddress.match(/^0x[a-fA-F0-9]{40}$/);
const isPlaceholder = contractAddress === "0x0000000000000000000000000000000000000000";

if (isPlaceholder) {
  console.warn("⚠️  MTX: Using placeholder address. Deploy contract to get legitimate address.");
  console.warn("    Run: npm run deploy:mainnet or npm run deploy:sepolia");
}

export const MTX = {
  address: contractAddress,
  symbol: "MTX",
  decimals: 18,
  chainId: 1, // Ethereum Mainnet
  chainName: "Ethereum",
  name: "Matrix Hub Coin",
  // Fixed ETH to MTX rate for direct mint: 1 ETH = 100,000 MTX
  ethToMtxRate: 100000,
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18
  },
  rpcUrls: ["https://eth.llamarpc.com"],
  blockExplorerUrls: ["https://etherscan.io/"],
  // Contract owner for verification and management
  owner: "0xb248d5bd04f6fadee6146d0dac1da82b842a437b9c6444c4cbc1e7ee37033e7a",
  isDeployed: isValidAddress && !isPlaceholder,
  get blockExplorerUrl() {
    return `${this.blockExplorerUrls[0]}address/${this.address}`;
  },
  get uniswapUrl() {
    // Uniswap is the primary DEX on Ethereum
    return `https://app.uniswap.org/swap?outputCurrency=${this.address}&chain=ethereum`;
  }
};
