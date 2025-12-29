// MTX Token Configuration for Polygon Network
// Polygonscan account: MatrixHubOrg
//
// DEPLOYMENT STATUS: Contract must be deployed to get legitimate address
// Use: npm run deploy or ./scripts/deploy.sh
// 
// For production, set MTX_CONTRACT_ADDRESS in environment variables

// Get contract address from environment or use placeholder
const contractAddress = typeof process !== 'undefined' && process.env?.MTX_CONTRACT_ADDRESS 
  ? process.env.MTX_CONTRACT_ADDRESS 
  : "0x0000000000000000000000000000000000000000"; // Placeholder - deploy contract to get real address

// Validate address format
const isValidAddress = contractAddress && contractAddress.match(/^0x[a-fA-F0-9]{40}$/);
const isPlaceholder = contractAddress === "0x0000000000000000000000000000000000000000";

if (isPlaceholder) {
  console.warn("⚠️  MTX: Using placeholder address. Deploy contract to get legitimate address.");
  console.warn("    Run: npm run deploy or ./scripts/deploy.sh");
}

export const MTX = {
  address: contractAddress,
  symbol: "MTX",
  decimals: 18,
  chainId: 137, // Polygon Mainnet
  chainName: "Polygon",
  name: "Matrix Hub Coin",
  // Fixed MATIC to MTX rate for direct mint: 1 MATIC = 1000 MTX
  ethToMtxRate: 1000,
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18
  },
  rpcUrls: ["https://polygon-rpc.com/"],
  blockExplorerUrls: ["https://polygonscan.com/"],
  // Polygonscan account for contract verification: MatrixHubOrg
  polygonscanAccount: "MatrixHubOrg",
  isDeployed: isValidAddress && !isPlaceholder,
  get blockExplorerUrl() {
    return `${this.blockExplorerUrls[0]}address/${this.address}`;
  },
  get uniswapUrl() {
    // QuickSwap is the primary DEX on Polygon (Uniswap equivalent)
    return `https://quickswap.exchange/#/swap?outputCurrency=${this.address}`;
  }
};
