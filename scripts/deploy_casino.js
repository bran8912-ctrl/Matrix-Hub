/**
 * Casino Contracts Deployment Script
 * 
 * This script automates the deployment of the Matrix-Hub casino contracts to Ethereum networks.
 * It deploys CasinoCore, CasinoReserve, LiquidityRouter, and RNGEngine contracts with proper
 * configuration and saves deployment information for frontend integration.
 * 
 * PREREQUISITES:
 * - MTX token must be deployed first (run deploy_mtx.js)
 * - Environment variables configured in .env:
 *   - PRIVATE_KEY: Deployer's private key
 *   - MAINNET_RPC_URL or SEPOLIA_RPC_URL: RPC endpoint
 *   - ETHERSCAN_API_KEY: For contract verification (optional)
 * 
 * USAGE:
 *   npx hardhat run scripts/deploy_casino.js --network sepolia
 *   npx hardhat run scripts/deploy_casino.js --network mainnet
 * 
 * OUTPUT:
 *   - Deployment information saved to: deployments/casino-<network>.json
 *   - JSON file contains all contract addresses for frontend integration
 * 
 * CUSTOMIZATION:
 *   - Modify DEPLOYMENT_CONFIG to change constructor parameters
 *   - Update network-specific settings in hardhat.config.cjs
 *   - Extend deployContract() function for additional contracts
 * 
 * NOTES:
 *   - CasinoReserve initially deployed with temporary casinoCore address (deployer)
 *   - LiquidityRouter initially deployed with temporary dexPool address (deployer)
 *   - These addresses should be updated after deployment via contract functions
 *   - The script creates the deployments/ folder automatically if it doesn't exist
 * 
 * @author Matrix-Hub Team
 * @version 2.0.0
 */

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// ============================================================================
// DEPLOYMENT CONFIGURATION
// ============================================================================
// Customize these values for different deployment scenarios
// All token amounts use 18 decimals (e.g., "1" = 1 * 10^18 wei)
const DEPLOYMENT_CONFIG = {
  // CasinoReserve configuration
  reserveCap: "1000000", // Maximum MTX reserve capacity (1M MTX)
  
  // CasinoCore configuration
  minBet: "1",          // Minimum bet amount (1 MTX)
  maxBet: "1000",       // Maximum bet amount (1000 MTX)
  
  // Optional: Override these addresses if needed, otherwise uses deployer
  devAddress: null,         // Developer fee recipient (null = use deployer)
  governanceAddress: null,  // Governance address (null = use deployer)
  
  // Temporary addresses (will need to be updated after deployment)
  tempDexPool: null,        // Temporary DEX pool address (null = use deployer)
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Ensure the deployments directory exists
 * Creates the directory if it doesn't exist
 */
function ensureDeploymentsDir() {
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    console.log("📁 Creating deployments directory...");
    fs.mkdirSync(deploymentsDir, { recursive: true });
    console.log("✅ Deployments directory created");
  }
  return deploymentsDir;
}

/**
 * Load MTX deployment information from previous deployment
 * @returns {Object} MTX deployment data including contract address
 * @throws {Error} If MTX deployment file not found
 */
function loadMtxDeployment() {
  const mtxDeploymentFile = path.join(__dirname, "..", "deployments", `mtx-${hre.network.name}.json`);
  
  if (!fs.existsSync(mtxDeploymentFile)) {
    console.error("\n❌ Error: MTX token not deployed yet!");
    console.error("   Deploy MTX first using one of these commands:");
    console.error("   - npm run deploy:sepolia:mtx");
    console.error("   - npm run deploy:mainnet:mtx");
    console.error("   - npx hardhat run scripts/deploy_mtx.js --network <network>");
    throw new Error("MTX token not deployed");
  }
  
  const mtxDeployment = JSON.parse(fs.readFileSync(mtxDeploymentFile, 'utf8'));
  return mtxDeployment;
}

/**
 * Deploy a single contract with error handling
 * @param {string} contractName - Name of the contract to deploy
 * @param {Array} constructorArgs - Constructor arguments
 * @returns {Promise<{contract: Object, address: string}>} Deployed contract and address
 */
async function deployContract(contractName, constructorArgs = []) {
  console.log(`\n🔨 Deploying ${contractName}...`);
  
  try {
    const ContractFactory = await hre.ethers.getContractFactory(contractName);
    const contract = await ContractFactory.deploy(...constructorArgs);
    await contract.waitForDeployment();
    const address = await contract.getAddress();
    
    console.log(`✅ ${contractName} deployed successfully`);
    console.log(`   Address: ${address}`);
    
    return { contract, address };
  } catch (error) {
    console.error(`❌ Failed to deploy ${contractName}:`, error.message);
    throw error;
  }
}

/**
 * Save deployment information to JSON file
 * @param {Object} deploymentInfo - Deployment data to save
 * @param {string} deploymentsDir - Path to deployments directory
 */
function saveDeploymentInfo(deploymentInfo, deploymentsDir) {
  const deploymentFile = path.join(deploymentsDir, `casino-${hre.network.name}.json`);
  
  try {
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    console.log("\n📄 Deployment info saved successfully");
    console.log(`   File: ${deploymentFile}`);
  } catch (error) {
    console.error("❌ Failed to save deployment info:", error.message);
    throw error;
  }
}

// ============================================================================
// MAIN DEPLOYMENT FUNCTION
// ============================================================================

async function main() {
  console.log("╔════════════════════════════════════════════════════════════════╗");
  console.log("║       Casino Contracts Deployment - Matrix-Hub Platform       ║");
  console.log("╚════════════════════════════════════════════════════════════════╝");
  
  // Step 1: Network Information
  console.log("\n📡 Network Information:");
  console.log("   Network:", hre.network.name);
  console.log("   Chain ID:", hre.network.config.chainId);
  
  // Step 2: Deployer Account Setup
  const [deployer] = await hre.ethers.getSigners();
  console.log("\n👤 Deployer Account:");
  console.log("   Address:", deployer.address);
  
  // Step 3: Check Balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("   Balance:", hre.ethers.formatEther(balance), "ETH");
  
  if (balance === 0n) {
    console.warn("\n⚠️  Warning: Deployer balance is 0 ETH!");
    console.warn("   Deployment will fail. Please fund the deployer account.");
  }
  
  // Step 4: Ensure Deployments Directory Exists
  const deploymentsDir = ensureDeploymentsDir();
  
  // Step 5: Load MTX Deployment
  console.log("\n📋 Loading MTX Token Information...");
  const mtxDeployment = loadMtxDeployment();
  const MTX_ADDRESS = mtxDeployment.contractAddress;
  console.log("   MTX Token Address:", MTX_ADDRESS);
  
  // Step 6: Prepare Constructor Arguments
  console.log("\n⚙️  Preparing Constructor Arguments...");
  
  // Parse configuration values
  const RESERVE_CAP = hre.ethers.parseUnits(DEPLOYMENT_CONFIG.reserveCap, 18);
  const MIN_BET = hre.ethers.parseUnits(DEPLOYMENT_CONFIG.minBet, 18);
  const MAX_BET = hre.ethers.parseUnits(DEPLOYMENT_CONFIG.maxBet, 18);
  const DEV_ADDRESS = DEPLOYMENT_CONFIG.devAddress || deployer.address;
  const GOVERNANCE_ADDRESS = DEPLOYMENT_CONFIG.governanceAddress || deployer.address;
  const TEMP_DEX_POOL = DEPLOYMENT_CONFIG.tempDexPool || deployer.address;
  
  console.log("   Reserve Cap:", hre.ethers.formatUnits(RESERVE_CAP, 18), "MTX");
  console.log("   Min Bet:", hre.ethers.formatUnits(MIN_BET, 18), "MTX");
  console.log("   Max Bet:", hre.ethers.formatUnits(MAX_BET, 18), "MTX");
  console.log("   Dev Address:", DEV_ADDRESS);
  console.log("   Governance Address:", GOVERNANCE_ADDRESS);
  
  // Step 7: Deploy Contracts
  console.log("\n🎰 Starting Casino Contracts Deployment...");
  
  // Deploy 1: RNGEngine (no dependencies)
  console.log("\n1️⃣  RNGEngine");
  const { address: rngAddress } = await deployContract("RNGEngine", []);
  
  // Deploy 2: CasinoReserve (depends on MTX)
  // Note: CasinoCore address is set to deployer temporarily and must be updated after CasinoCore deployment
  console.log("\n2️⃣  CasinoReserve");
  const tempCasinoCore = deployer.address; // Temporary - see post-deployment steps
  const { address: reserveAddress } = await deployContract(
    "CasinoReserve",
    [MTX_ADDRESS, RESERVE_CAP, tempCasinoCore]
  );
  console.log("   ⚠️  CasinoCore address is temporary (deployer)");
  console.log("   ⚠️  Update after deployment using CasinoReserve contract");
  
  // Deploy 3: LiquidityRouter (depends on MTX and DEX pool)
  // Note: DEX pool address is set to deployer temporarily until Uniswap pool is created
  console.log("\n3️⃣  LiquidityRouter");
  const { address: liquidityAddress } = await deployContract(
    "LiquidityRouter",
    [MTX_ADDRESS, TEMP_DEX_POOL]
  );
  if (TEMP_DEX_POOL === deployer.address) {
    console.log("   ⚠️  DEX pool address is temporary (deployer)");
    console.log("   ⚠️  Update after creating Uniswap MTX/ETH pool");
  }
  
  // Deploy 4: CasinoCore (depends on all previous contracts)
  console.log("\n4️⃣  CasinoCore");
  const { address: casinoCoreAddress } = await deployContract(
    "CasinoCore",
    [
      MTX_ADDRESS,
      liquidityAddress,
      reserveAddress,
      rngAddress,
      MIN_BET,
      MAX_BET,
      DEV_ADDRESS,
      GOVERNANCE_ADDRESS
    ]
  );
  
  console.log("\n╔════════════════════════════════════════════════════════════════╗");
  console.log("║                    ✅ DEPLOYMENT SUCCESSFUL                     ║");
  console.log("╚════════════════════════════════════════════════════════════════╝");
  
  // Step 8: Prepare Deployment Information
  console.log("\n💾 Preparing Deployment Information...");
  
  const deploymentInfo = {
    // Metadata
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    
    // Deployed Contract Addresses
    contracts: {
      mtxToken: MTX_ADDRESS,
      casinoCore: casinoCoreAddress,
      casinoReserve: reserveAddress,
      liquidityRouter: liquidityAddress,
      rngEngine: rngAddress
    },
    
    // Constructor Parameters Used
    parameters: {
      reserveCap: RESERVE_CAP.toString(),
      reserveCapFormatted: hre.ethers.formatUnits(RESERVE_CAP, 18) + " MTX",
      minBet: MIN_BET.toString(),
      minBetFormatted: hre.ethers.formatUnits(MIN_BET, 18) + " MTX",
      maxBet: MAX_BET.toString(),
      maxBetFormatted: hre.ethers.formatUnits(MAX_BET, 18) + " MTX",
      devAddress: DEV_ADDRESS,
      governanceAddress: GOVERNANCE_ADDRESS,
      tempDexPool: TEMP_DEX_POOL
    },
    
    // Additional Info
    notes: {
      casinoReserveSetup: "CasinoReserve deployed with temporary casinoCore address (deployer). Update required.",
      liquidityRouterSetup: `LiquidityRouter deployed with DEX pool address: ${TEMP_DEX_POOL}. Verify this is the correct production pool address and update after creating the final Uniswap pool if necessary.`,
      reserveFunding: "CasinoReserve must be funded with MTX tokens before casino operations can begin."
    }
  };
  
  // Step 9: Save Deployment Information
  saveDeploymentInfo(deploymentInfo, deploymentsDir);
  
  // Step 10: Display Post-Deployment Instructions
  console.log("\n╔════════════════════════════════════════════════════════════════╗");
  console.log("║                   📋 POST-DEPLOYMENT STEPS                      ║");
  console.log("╚════════════════════════════════════════════════════════════════╝");
  
  console.log("\n🔧 Required Configuration Updates:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  console.log("\n1. Update CasinoReserve with correct CasinoCore address:");
  console.log("   This requires calling a setter function on-chain or redeploying.");
  console.log(`   CasinoCore Address: ${casinoCoreAddress}`);
  
  if (TEMP_DEX_POOL === deployer.address) {
    console.log("\n2. Create Uniswap liquidity pool for MTX/ETH:");
    console.log("   a. Visit https://app.uniswap.org/");
    console.log("   b. Create a new MTX/ETH pool");
    console.log("   c. Note the pool address");
    console.log("   d. Update LiquidityRouter with the pool address");
  }
  
  console.log("\n3. Fund CasinoReserve with initial MTX:");
  console.log(`   Reserve Address: ${reserveAddress}`);
  console.log("   Recommended: 100,000+ MTX for initial liquidity");
  console.log("   Use MTX.transfer() to send tokens to the reserve");
  
  console.log("\n🔍 Contract Verification (Optional but Recommended):");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\nVerify contracts on Etherscan for transparency:");
  console.log(`\n  npx hardhat verify --network ${hre.network.name} ${rngAddress}`);
  console.log(`\n  npx hardhat verify --network ${hre.network.name} ${reserveAddress} \\`);
  console.log(`    "${MTX_ADDRESS}" "${RESERVE_CAP}" "${tempCasinoCore}"`);
  console.log(`\n  npx hardhat verify --network ${hre.network.name} ${liquidityAddress} \\`);
  console.log(`    "${MTX_ADDRESS}" "${TEMP_DEX_POOL}"`);
  console.log(`\n  npx hardhat verify --network ${hre.network.name} ${casinoCoreAddress} \\`);
  console.log(`    "${MTX_ADDRESS}" "${liquidityAddress}" "${reserveAddress}" "${rngAddress}" \\`);
  console.log(`    "${MIN_BET}" "${MAX_BET}" "${DEV_ADDRESS}" "${GOVERNANCE_ADDRESS}"`);
  
  console.log("\n🌐 Frontend Integration:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n1. Update environment variables in .env:");
  console.log(`   CASINO_CORE_ADDRESS=${casinoCoreAddress}`);
  console.log(`   CASINO_RESERVE_ADDRESS=${reserveAddress}`);
  console.log(`   LIQUIDITY_ROUTER_ADDRESS=${liquidityAddress}`);
  console.log(`   RNG_ENGINE_ADDRESS=${rngAddress}`);
  
  console.log("\n2. Import deployment JSON in Astro components:");
  console.log(`   import deploymentInfo from '../../deployments/casino-${hre.network.name}.json';`);
  console.log("   const casinoCoreAddress = deploymentInfo.contracts.casinoCore;");
  
  console.log("\n3. Update relevant API routes and frontend files:");
  console.log("   - src/pages/api/place-bet.js");
  console.log("   - src/components/casino/*.tsx");
  console.log("   - Any files that interact with casino contracts");
  
  console.log("\n🧪 Testing:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n1. Test all casino functionality on testnet first");
  console.log("2. Verify bet placement and payout mechanisms");
  console.log("3. Test liquidity routing and reserve management");
  console.log("4. Ensure proper permission controls (governance, dev)");
  
  // Get network explorer URL
  let explorerUrl = "";
  let explorerName = "Block Explorer";
  
  if (hre.network.name === "mainnet") {
    explorerUrl = `https://etherscan.io/address/${casinoCoreAddress}`;
    explorerName = "Etherscan";
  } else if (hre.network.name === "sepolia") {
    explorerUrl = `https://sepolia.etherscan.io/address/${casinoCoreAddress}`;
    explorerName = "Sepolia Etherscan";
  } else if (hre.network.name === "localhost" || hre.network.name === "hardhat") {
    explorerUrl = "http://localhost:8545";
    explorerName = "Local Network";
  }
  
  if (explorerUrl && hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("\n🔗 View CasinoCore on " + explorerName + ":");
    console.log("   " + explorerUrl);
  }
  
  console.log("\n╔════════════════════════════════════════════════════════════════╗");
  console.log("║                    🎉 DEPLOYMENT COMPLETE                       ║");
  console.log("╚════════════════════════════════════════════════════════════════╝");
  console.log("\n✅ All contracts deployed successfully");
  console.log(`✅ Deployment info saved to: deployments/casino-${hre.network.name}.json`);
  console.log("✅ Ready for frontend integration\n");
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

main()
  .then(() => {
    console.log("\n🏁 Script execution completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n╔════════════════════════════════════════════════════════════════╗");
    console.error("║                    ❌ DEPLOYMENT FAILED                         ║");
    console.error("╚════════════════════════════════════════════════════════════════╝");
    console.error("\n💥 Error Details:");
    console.error(error);
    
    console.error("\n🔍 Troubleshooting Tips:");
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("\n1. Check that your .env file is configured correctly:");
    console.error("   - PRIVATE_KEY is set");
    console.error("   - RPC URL is valid and accessible");
    console.error("\n2. Verify deployer account has sufficient ETH:");
    console.error("   - Gas fees are required for contract deployment");
    console.error("   - Check balance on block explorer");
    console.error("\n3. Ensure MTX token is deployed:");
    console.error("   - Run: npm run deploy:sepolia:mtx (for testnet)");
    console.error("   - Or: npm run deploy:mainnet:mtx (for mainnet)");
    console.error("\n4. Verify network configuration in hardhat.config.cjs");
    console.error("\n5. Check RPC endpoint is responding:");
    console.error("   - Try: curl <RPC_URL>");
    console.error("\n6. Review Hardhat documentation: https://hardhat.org/docs");
    
    process.exit(1);
  });
