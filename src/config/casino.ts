// Casino Contract Configuration
// Network: Polygon Mainnet (Chain ID: 137)
//
// DEPLOYMENT STATUS: Contracts must be deployed to get legitimate addresses
// Use: npm run deploy:polygon:casino (after MTX token is deployed)
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
  const match = address.match(/^0x[a-fA-F0-9]{40}$/);
  return match !== null;
};

const isPlaceholder = (address: string): boolean => {
  return address === "0x0000000000000000000000000000000000000000";
};

// Helper function to create contract info object
const createContractInfo = (address: string) => ({
  address,
  isDeployed: isValidAddress(address) && !isPlaceholder(address),
  displayAddress: (isValidAddress(address) && !isPlaceholder(address)) ? address : "Coming Soon"
});

// Check deployment status
const casinoCoreDeployed = isValidAddress(casinoCoreAddress) && !isPlaceholder(casinoCoreAddress);
const casinoReserveDeployed = isValidAddress(casinoReserveAddress) && !isPlaceholder(casinoReserveAddress);
const allContractsDeployed = casinoCoreDeployed && casinoReserveDeployed;

if (!allContractsDeployed) {
  console.warn("⚠️  Casino: Using placeholder addresses. Deploy contracts to get legitimate addresses.");
  console.warn("    Run: npm run deploy:polygon:casino");
}

export const Casino = {
  contracts: {
    casinoCore: {
      address: casinoCoreAddress,
      isDeployed: casinoCoreDeployed,
      displayAddress: casinoCoreDeployed ? casinoCoreAddress : "Coming Soon"
    },
    casinoReserve: {
      address: casinoReserveAddress,
      isDeployed: casinoReserveDeployed,
      displayAddress: casinoReserveDeployed ? casinoReserveAddress : "Coming Soon"
    },
    liquidityRouter: createContractInfo(liquidityRouterAddress),
    rngEngine: createContractInfo(rngEngineAddress)
  },
  isFullyDeployed: allContractsDeployed,
  chainId: 137, // Polygon Mainnet
  chainName: "Polygon"
};
