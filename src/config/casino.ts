// Casino Contract Configuration
// Network: Ethereum Mainnet (Chain ID: 1)
//
// DEPLOYMENT STATUS: Contracts must be deployed to get legitimate addresses
// Use: npm run deploy:mainnet:casino (after MTX token is deployed)
// 
// ⚠️ AFTER DEPLOYMENT: Update environment variables with real contract addresses

// Get contract addresses from environment or use placeholders
const getContractAddress = (envVar: string | undefined, fallback = "0x0000000000000000000000000000000000000000"): string => {
  return (typeof process !== 'undefined' && envVar) ? envVar : fallback;
};

const casinoCoreAddress = getContractAddress(process.env?.CASINO_CORE_ADDRESS);
const casinoReserveAddress = getContractAddress(process.env?.CASINO_RESERVE_ADDRESS);
const liquidityRouterAddress = getContractAddress(process.env?.LIQUIDITY_ROUTER_ADDRESS);
const rngEngineAddress = getContractAddress(process.env?.RNG_ENGINE_ADDRESS);

// Validate address format
const isValidAddress = (address: string | null | undefined): boolean => {
  if (!address || typeof address !== 'string') return false;
  return address.match(/^0x[a-fA-F0-9]{40}$/) !== null;
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
