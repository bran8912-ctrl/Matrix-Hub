// Casino Contract Configuration
// Network: Ethereum Mainnet (Chain ID: 1)
//
// DEPLOYMENT STATUS: Contracts must be deployed to get legitimate addresses
// Use: npm run deploy:mainnet:casino (after MTX token is deployed)
// 
// ⚠️ AFTER DEPLOYMENT: Update environment variables with real contract addresses

// Get contract addresses from environment or use placeholders
const casinoCoreAddress = typeof process !== 'undefined' && process.env?.CASINO_CORE_ADDRESS 
  ? process.env.CASINO_CORE_ADDRESS 
  : "0x0000000000000000000000000000000000000000";

const casinoReserveAddress = typeof process !== 'undefined' && process.env?.CASINO_RESERVE_ADDRESS 
  ? process.env.CASINO_RESERVE_ADDRESS 
  : "0x0000000000000000000000000000000000000000";

const liquidityRouterAddress = typeof process !== 'undefined' && process.env?.LIQUIDITY_ROUTER_ADDRESS 
  ? process.env.LIQUIDITY_ROUTER_ADDRESS 
  : "0x0000000000000000000000000000000000000000";

const rngEngineAddress = typeof process !== 'undefined' && process.env?.RNG_ENGINE_ADDRESS 
  ? process.env.RNG_ENGINE_ADDRESS 
  : "0x0000000000000000000000000000000000000000";

// Validate address format
const isValidAddress = (address: string): boolean => {
  return address !== null && address.match(/^0x[a-fA-F0-9]{40}$/) !== null;
};

const isPlaceholder = (address: string): boolean => {
  return address === "0x0000000000000000000000000000000000000000";
};

// Check deployment status
const casinoCoreDeployed = isValidAddress(casinoCoreAddress) && !isPlaceholder(casinoCoreAddress);
const casinoReserveDeployed = isValidAddress(casinoReserveAddress) && !isPlaceholder(casinoReserveAddress);
const allContractsDeployed = casinoCoreDeployed && casinoReserveDeployed;

if (!allContractsDeployed) {
  console.warn("⚠️  Casino: Using placeholder addresses. Deploy contracts to get legitimate addresses.");
  console.warn("    Run: npm run deploy:mainnet:casino");
}

export const Casino = {
  contracts: {
    casinoCore: {
      address: casinoCoreAddress,
      isDeployed: casinoCoreDeployed,
      displayAddress: casinoCoreDeployed ? casinoCoreAddress : "Pending Deployment"
    },
    casinoReserve: {
      address: casinoReserveAddress,
      isDeployed: casinoReserveDeployed,
      displayAddress: casinoReserveDeployed ? casinoReserveAddress : "Pending Deployment"
    },
    liquidityRouter: {
      address: liquidityRouterAddress,
      isDeployed: isValidAddress(liquidityRouterAddress) && !isPlaceholder(liquidityRouterAddress),
      displayAddress: (isValidAddress(liquidityRouterAddress) && !isPlaceholder(liquidityRouterAddress)) 
        ? liquidityRouterAddress 
        : "Pending Deployment"
    },
    rngEngine: {
      address: rngEngineAddress,
      isDeployed: isValidAddress(rngEngineAddress) && !isPlaceholder(rngEngineAddress),
      displayAddress: (isValidAddress(rngEngineAddress) && !isPlaceholder(rngEngineAddress)) 
        ? rngEngineAddress 
        : "Pending Deployment"
    }
  },
  isFullyDeployed: allContractsDeployed,
  chainId: 1, // Ethereum Mainnet
  chainName: "Ethereum"
};
