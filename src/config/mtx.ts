// MTX Token Configuration for Polygon Mainnet
// Network: Polygon Mainnet (Chain ID: 137)
//
// DEPLOYMENT STATUS: Contract must be deployed to get legitimate address
// Use: npm run deploy:polygon (production) or npm run deploy:amoy (testnet)
// 
// ⚠️ AFTER DEPLOYMENT: Update this file with the real contract address
// For production, set MTX_CONTRACT_ADDRESS in environment variables
// Exchange Rate: 1 MATIC = 1,000 MTX (configured in contract)
// Initial Owner: 0x9fb4bb44d8d962d695fc93b3dc15f1b287391077

// Get contract address from environment or use placeholder
const contractAddress = typeof process !== 'undefined' && process.env?.MTX_CONTRACT_ADDRESS 
  ? process.env.MTX_CONTRACT_ADDRESS 
  : "0x0000000000000000000000000000000000000000"; // Placeholder - deploy contract to get real address

// Validate address format
const isValidAddress = contractAddress && contractAddress.match(/^0x[a-fA-F0-9]{40}$/);
const isPlaceholder = contractAddress === "0x0000000000000000000000000000000000000000";

if (isPlaceholder) {
  console.warn("⚠️  MTX: Using placeholder address. Deploy contract to get legitimate address.");
  console.warn("    Run: npm run deploy:polygon or npm run deploy:amoy");
}

export const MTX = {
  address: contractAddress,
  symbol: "MTX",
  decimals: 18,
  chainId: 137, // Polygon Mainnet
  chainName: "Polygon",
  name: "Matrix Hub Coin",
  maxSupply: 100_000_000, // 100M MTX hard cap
  // Fixed MATIC to MTX rate for direct mint: 1 MATIC = 1,000 MTX
  maticToMtxRate: 1000,
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18
  },
  rpcUrls: ["https://polygon-rpc.com/"],
  blockExplorerUrls: ["https://polygonscan.com/"],
  // Contract owner for verification and management
  owner: "0x9fb4bb44d8d962d695fc93b3dc15f1b287391077",
  isDeployed: isValidAddress && !isPlaceholder,
  get blockExplorerUrl() {
    return `${this.blockExplorerUrls[0]}address/${this.address}`;
  },
  get quickswapUrl() {
    // QuickSwap is the primary DEX on Polygon
    return `https://quickswap.exchange/#/swap?outputCurrency=${this.address}`;
  },
  get uniswapUrl() {
    // Alias for quickswapUrl — Polygon uses QuickSwap, but call sites reference uniswapUrl
    return this.quickswapUrl;
  }
};
