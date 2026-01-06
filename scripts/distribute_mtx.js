const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * MTX Ecosystem Distribution Script
 * 
 * This script distributes MTX tokens to ecosystem contracts after deployment:
 * - CasinoCore: For game operations and player rewards
 * - CasinoReserve: For holding reserves and paying winners
 * - LiquidityRouter: For DEX liquidity provision
 * 
 * IMPORTANT: Run this AFTER deploying MTX and all ecosystem contracts
 */

async function main() {
  console.log("=".repeat(60));
  console.log("MTX Ecosystem Distribution");
  console.log("=".repeat(60));
  console.log("");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Distributing with account:", deployer.address);
  
  // Check deployer balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("");

  // Load MTX contract address from deployment
  const mtxDeploymentFile = path.join(__dirname, "..", "deployments", `mtx-${hre.network.name}.json`);
  
  if (!fs.existsSync(mtxDeploymentFile)) {
    console.error("❌ Error: MTX deployment file not found");
    console.error(`   Expected: ${mtxDeploymentFile}`);
    console.error("   Deploy MTX first with: npm run deploy:mainnet");
    process.exit(1);
  }

  const mtxDeployment = JSON.parse(fs.readFileSync(mtxDeploymentFile, 'utf8'));
  const MTX_ADDRESS = mtxDeployment.contractAddress;
  
  console.log("📋 MTX Contract Address:", MTX_ADDRESS);
  console.log("");

  // Load Casino deployment addresses (if they exist)
  const casinoDeploymentFile = path.join(__dirname, "..", "deployments", `casino-${hre.network.name}.json`);
  
  if (!fs.existsSync(casinoDeploymentFile)) {
    console.error("❌ Error: Casino deployment file not found");
    console.error(`   Expected: ${casinoDeploymentFile}`);
    console.error("   Deploy casino contracts first with: node scripts/deploy_casino.js --network " + hre.network.name);
    process.exit(1);
  }

  const casinoDeployment = JSON.parse(fs.readFileSync(casinoDeploymentFile, 'utf8'));
  
  console.log("📋 Casino Ecosystem Contracts:");
  console.log("   CasinoCore:", casinoDeployment.casinoCore || "Not deployed");
  console.log("   CasinoReserve:", casinoDeployment.casinoReserve || "Not deployed");
  console.log("   LiquidityRouter:", casinoDeployment.liquidityRouter || "Not deployed");
  console.log("");

  // Distribution amounts (adjust as needed)
  // Strategy: Prioritize public access via buyMTX (direct mint)
  // Smaller ecosystem allocations to match "earn through usage" philosophy
  const DISTRIBUTIONS = {
    casinoReserve: hre.ethers.parseEther("20000000"),   // 20M MTX for casino reserves
    liquidityRouter: hre.ethers.parseEther("10000000"), // 10M MTX for initial DEX liquidity
    // Total: 30M MTX (30% for ecosystem)
    // Remaining: 70M MTX (70% for public via direct mint at 1 ETH = 100k MTX)
  };

  console.log("📊 Distribution Plan:");
  console.log("   CasinoReserve:   ", hre.ethers.formatEther(DISTRIBUTIONS.casinoReserve), "MTX (Casino operations)");
  console.log("   LiquidityRouter: ", hre.ethers.formatEther(DISTRIBUTIONS.liquidityRouter), "MTX (DEX liquidity)");
  console.log("   --------------------------------------------------");
  const total = DISTRIBUTIONS.casinoReserve + DISTRIBUTIONS.liquidityRouter;
  console.log("   Total Ecosystem: ", hre.ethers.formatEther(total), "MTX (30%)");
  console.log("   Public (buyMTX): 70,000,000 MTX (70% - via direct mint)");
  console.log("");
  console.log("   📝 Philosophy: Prioritize public access via direct mint");
  console.log("      Casino funds from house edge, not pre-allocation");
  console.log("      Users earn MTX through engagement, not token distribution");
  console.log("");

  // Confirm distribution
  if (hre.network.name === "mainnet") {
    console.log("⚠️  WARNING: This will mint MTX on MAINNET");
    console.log("⚠️  This action is IRREVERSIBLE");
    console.log("");
    // In production, you might want to add an interactive confirmation here
  }

  // Connect to MTX contract
  console.log("🔗 Connecting to MTX contract...");
  const MTX = await hre.ethers.getContractAt("MatrixHubCoin", MTX_ADDRESS);
  
  // Check current supply
  const currentSupply = await MTX.totalSupply();
  console.log("   Current Total Supply:", hre.ethers.formatEther(currentSupply), "MTX");
  
  const maxSupply = await MTX.MAX_SUPPLY();
  console.log("   Maximum Supply:      ", hre.ethers.formatEther(maxSupply), "MTX");
  console.log("");

  // Verify we won't exceed max supply
  if (currentSupply + total > maxSupply) {
    console.error("❌ Error: Distribution would exceed MAX_SUPPLY");
    console.error(`   Current: ${hre.ethers.formatEther(currentSupply)} MTX`);
    console.error(`   Distribution: ${hre.ethers.formatEther(total)} MTX`);
    console.error(`   Total: ${hre.ethers.formatEther(currentSupply + total)} MTX`);
    console.error(`   Max: ${hre.ethers.formatEther(maxSupply)} MTX`);
    process.exit(1);
  }

  // Execute distributions
  console.log("🚀 Starting MTX distribution...");
  console.log("");

  const distributions = [];

  // Distribute to CasinoReserve
  if (casinoDeployment.casinoReserve) {
    console.log("💰 Distributing to CasinoReserve...");
    const tx1 = await MTX.mintToEcosystem(casinoDeployment.casinoReserve, DISTRIBUTIONS.casinoReserve);
    console.log("   Transaction:", tx1.hash);
    await tx1.wait();
    console.log("   ✅ Confirmed");
    distributions.push({
      contract: "CasinoReserve",
      address: casinoDeployment.casinoReserve,
      amount: hre.ethers.formatEther(DISTRIBUTIONS.casinoReserve),
      txHash: tx1.hash
    });
    console.log("");
  }

  // Distribute to LiquidityRouter
  if (casinoDeployment.liquidityRouter) {
    console.log("💰 Distributing to LiquidityRouter...");
    const tx2 = await MTX.mintToEcosystem(casinoDeployment.liquidityRouter, DISTRIBUTIONS.liquidityRouter);
    console.log("   Transaction:", tx2.hash);
    await tx2.wait();
    console.log("   ✅ Confirmed");
    distributions.push({
      contract: "LiquidityRouter",
      address: casinoDeployment.liquidityRouter,
      amount: hre.ethers.formatEther(DISTRIBUTIONS.liquidityRouter),
      txHash: tx2.hash
    });
    console.log("");
  }

  // Check final supply
  const finalSupply = await MTX.totalSupply();
  console.log("📊 Distribution Complete!");
  console.log("   Final Total Supply:", hre.ethers.formatEther(finalSupply), "MTX");
  console.log("   Remaining Capacity:", hre.ethers.formatEther(maxSupply - finalSupply), "MTX");
  console.log("");

  // Save distribution info
  const distributionInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    mtxContract: MTX_ADDRESS,
    distributor: deployer.address,
    distributionTime: new Date().toISOString(),
    distributions: distributions,
    totalDistributed: hre.ethers.formatEther(total),
    finalSupply: hre.ethers.formatEther(finalSupply),
    remainingCapacity: hre.ethers.formatEther(maxSupply - finalSupply)
  };

  const distributionsDir = path.join(__dirname, "..", "deployments");
  const distributionFile = path.join(distributionsDir, `mtx-distribution-${hre.network.name}.json`);
  
  fs.writeFileSync(distributionFile, JSON.stringify(distributionInfo, null, 2));
  console.log("📄 Distribution info saved to:", distributionFile);
  console.log("");

  // Print summary
  console.log("=".repeat(60));
  console.log("Distribution Summary");
  console.log("=".repeat(60));
  console.log("");
  console.log("✅ MTX successfully distributed to ecosystem contracts");
  console.log("");
  console.log("Distributions:");
  distributions.forEach(d => {
    console.log(`   ${d.contract}:`);
    console.log(`      Address: ${d.address}`);
    console.log(`      Amount:  ${d.amount} MTX`);
    console.log(`      TX:      ${d.txHash}`);
    console.log("");
  });

  // Next steps
  console.log("📋 Next Steps:");
  console.log("1. Verify distributions on block explorer");
  console.log("2. Add DEX liquidity from LiquidityRouter allocation (10M MTX)");
  console.log("3. Casino operates from reserve (20M MTX)");
  console.log("4. Casino replenishes reserve from house edge profits");
  console.log("5. Public accesses remaining 70M MTX via buyMTX() at 1 ETH = 100k MTX");
  console.log("6. Users earn MTX through platform engagement (usage milestones, contributions)");
  console.log("");
  console.log("💡 Philosophy: Earn-focused, not distribution-focused");
  console.log("   - 70% supply available via direct mint (low friction onboarding)");
  console.log("   - Casino funded minimally, grows from house edge");
  console.log("   - Users earn through engagement, not airdrops");
  console.log("");

  // Explorer URLs
  if (hre.network.name === "mainnet") {
    console.log("🔍 View on Etherscan:");
    distributions.forEach(d => {
      console.log(`   ${d.contract}: https://etherscan.io/tx/${d.txHash}`);
    });
  } else if (hre.network.name === "sepolia") {
    console.log("🔍 View on Sepolia Etherscan:");
    distributions.forEach(d => {
      console.log(`   ${d.contract}: https://sepolia.etherscan.io/tx/${d.txHash}`);
    });
  }
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Distribution failed:", error);
    process.exit(1);
  });
