const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting Casino Contracts Deployment...");
  console.log("Network:", hre.network.name);
  
  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Check deployer balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "MATIC");
  
  // Load MTX deployment info
  const mtxDeploymentFile = path.join(__dirname, "..", "deployments", `mtx-${hre.network.name}.json`);
  if (!fs.existsSync(mtxDeploymentFile)) {
    console.error("\n❌ Error: MTX token not deployed yet!");
    console.error("   Deploy MTX first: npm run deploy:amoy");
    process.exit(1);
  }
  
  const mtxDeployment = JSON.parse(fs.readFileSync(mtxDeploymentFile, 'utf8'));
  const MTX_ADDRESS = mtxDeployment.contractAddress;
  console.log("\n📋 Using MTX Token:", MTX_ADDRESS);
  
  // Deploy parameters
  const RESERVE_CAP = hre.ethers.parseUnits("1000000", 18); // 1M MTX reserve cap
  const MIN_BET = hre.ethers.parseUnits("1", 18); // 1 MTX minimum bet
  const MAX_BET = hre.ethers.parseUnits("1000", 18); // 1000 MTX maximum bet
  const DEV_ADDRESS = deployer.address; // Use deployer as dev address
  const GOVERNANCE_ADDRESS = deployer.address; // Use deployer as governance
  
  console.log("\n🎰 Deploying Casino Contracts...");
  console.log("Parameters:");
  console.log("- Reserve Cap:", hre.ethers.formatUnits(RESERVE_CAP, 18), "MTX");
  console.log("- Min Bet:", hre.ethers.formatUnits(MIN_BET, 18), "MTX");
  console.log("- Max Bet:", hre.ethers.formatUnits(MAX_BET, 18), "MTX");
  console.log("");
  
  // Deploy RNGEngine
  console.log("1️⃣ Deploying RNGEngine...");
  const RNGEngine = await hre.ethers.getContractFactory("RNGEngine");
  const rngEngine = await RNGEngine.deploy();
  await rngEngine.waitForDeployment();
  const rngAddress = await rngEngine.getAddress();
  console.log("✅ RNGEngine deployed:", rngAddress);
  
  // Deploy CasinoReserve (needs MTX address)
  console.log("\n2️⃣ Deploying CasinoReserve...");
  const CasinoReserve = await hre.ethers.getContractFactory("CasinoReserve");
  // We'll update the casinoCore address after deploying CasinoCore
  const tempCasinoCore = deployer.address; // Temporary, will be updated
  const casinoReserve = await CasinoReserve.deploy(MTX_ADDRESS, RESERVE_CAP, tempCasinoCore);
  await casinoReserve.waitForDeployment();
  const reserveAddress = await casinoReserve.getAddress();
  console.log("✅ CasinoReserve deployed:", reserveAddress);
  
  // Deploy LiquidityRouter (needs MTX address and DEX pool)
  console.log("\n3️⃣ Deploying LiquidityRouter...");
  const LiquidityRouter = await hre.ethers.getContractFactory("LiquidityRouter");
  // For now, use deployer address as DEX pool (to be updated with actual QuickSwap pool)
  const tempDexPool = deployer.address;
  const liquidityRouter = await LiquidityRouter.deploy(MTX_ADDRESS, tempDexPool);
  await liquidityRouter.waitForDeployment();
  const liquidityAddress = await liquidityRouter.getAddress();
  console.log("✅ LiquidityRouter deployed:", liquidityAddress);
  console.log("   ⚠️  Note: Update DEX pool address after creating QuickSwap pool");
  
  // Deploy CasinoCore
  console.log("\n4️⃣ Deploying CasinoCore...");
  const CasinoCore = await hre.ethers.getContractFactory("CasinoCore");
  const casinoCore = await CasinoCore.deploy(
    MTX_ADDRESS,
    liquidityAddress,
    reserveAddress,
    rngAddress,
    MIN_BET,
    MAX_BET,
    DEV_ADDRESS,
    GOVERNANCE_ADDRESS
  );
  await casinoCore.waitForDeployment();
  const casinoCoreAddress = await casinoCore.getAddress();
  console.log("✅ CasinoCore deployed:", casinoCoreAddress);
  
  console.log("\n🎉 All Casino Contracts Deployed Successfully!");
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    contracts: {
      mtxToken: MTX_ADDRESS,
      casinoCore: casinoCoreAddress,
      casinoReserve: reserveAddress,
      liquidityRouter: liquidityAddress,
      rngEngine: rngAddress
    },
    parameters: {
      reserveCap: RESERVE_CAP.toString(),
      minBet: MIN_BET.toString(),
      maxBet: MAX_BET.toString(),
      devAddress: DEV_ADDRESS,
      governanceAddress: GOVERNANCE_ADDRESS,
      tempDexPool: tempDexPool
    }
  };
  
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  const deploymentFile = path.join(deploymentsDir, `casino-${hre.network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n📄 Deployment info saved to:", deploymentFile);
  
  // Print next steps
  console.log("\n" + "=".repeat(60));
  console.log("📋 Next Steps:");
  console.log("=".repeat(60));
  console.log("\n1. Update CasinoReserve with correct CasinoCore address:");
  console.log(`   (This needs to be done on-chain or redeploy with correct address)`);
  
  console.log("\n2. Create QuickSwap liquidity pool for MTX/MATIC");
  console.log("   - Visit: https://quickswap.exchange/");
  console.log("   - Create MTX/MATIC pool");
  console.log("   - Update LiquidityRouter with pool address");
  
  console.log("\n3. Fund CasinoReserve with initial MTX:");
  console.log(`   - Transfer MTX to: ${reserveAddress}`);
  console.log("   - Recommended: 100,000+ MTX for initial liquidity");
  
  console.log("\n4. Verify contracts on Polygonscan:");
  console.log(`   npx hardhat verify --network ${hre.network.name} ${rngAddress}`);
  console.log(`   npx hardhat verify --network ${hre.network.name} ${reserveAddress} "${MTX_ADDRESS}" "${RESERVE_CAP}" "${tempCasinoCore}"`);
  console.log(`   npx hardhat verify --network ${hre.network.name} ${liquidityAddress} "${MTX_ADDRESS}" "${tempDexPool}"`);
  console.log(`   npx hardhat verify --network ${hre.network.name} ${casinoCoreAddress} ...`);
  
  console.log("\n5. Update environment variables:");
  console.log(`   CASINO_CORE_ADDRESS=${casinoCoreAddress}`);
  
  console.log("\n6. Update src/pages/api/place-bet.js with CasinoCore address");
  
  console.log("\n7. Test casino functionality thoroughly");
  
  // Get network explorer URL
  let explorerUrl = "";
  if (hre.network.name === "polygon") {
    explorerUrl = `https://polygonscan.com/address/${casinoCoreAddress}`;
  } else if (hre.network.name === "amoy") {
    explorerUrl = `https://amoy.polygonscan.com/address/${casinoCoreAddress}`;
  }
  
  if (explorerUrl) {
    console.log("\n🔍 View CasinoCore on Explorer:", explorerUrl);
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("Done!");
  console.log("=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Casino deployment failed:", error);
    process.exit(1);
  });
