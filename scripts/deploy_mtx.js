const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting MTX Token Deployment to Polygon...");
  console.log("Network:", hre.network.name);
  
  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Check deployer balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "MATIC");
  
  // Deploy parameters
  const maxSupply = "100000000"; // 100M MTX maximum supply cap
  // Owner address (user's MetaMask address from requirements)
  // This address will own the contract (NO initial minting - gradual distribution via buyMTX)
  // Verified address format: 0x9fb4bb44d8d962d695fc93b3dc15f1b287391077
  const initialOwner = "0x9fb4bb44d8d962d695fc93b3dc15f1b287391077";
  
  // Validate owner address
  if (!initialOwner || !initialOwner.match(/^0x[a-fA-F0-9]{40}$/)) {
    console.error("❌ Error: Invalid owner address format");
    console.error("   Expected: 40-character hex string (Polygon address)");
    process.exit(1);
  }
  
  console.log("\nDeployment parameters:");
  console.log("- Maximum Supply Cap:", maxSupply, "MTX");
  console.log("- Initial Minting: NONE (gradual distribution via buyMTX)");
  console.log("- Contract Owner:", initialOwner);
  console.log("- Token Name: Matrix-HubCoin");
  console.log("- Token Symbol: MTX");
  console.log("- Decimals: 18");
  console.log("- Network: Polygon Mainnet (Chain ID: 137)");
  console.log("- Distribution Method: MATIC purchases at 1 MATIC = 1,000 MTX");
  
  // Deploy contract
  console.log("\nDeploying MatrixHubCoin contract...");
  const MTX = await hre.ethers.getContractFactory("MatrixHubCoin");
  const mtx = await MTX.deploy(maxSupply, initialOwner);
  
  await mtx.waitForDeployment();
  const contractAddress = await mtx.getAddress();
  
  console.log("\n✅ MTX Token deployed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Contract Owner:", initialOwner);
  
  // Get deployment transaction
  const deployTx = mtx.deploymentTransaction();
  if (deployTx) {
    console.log("Transaction Hash:", deployTx.hash);
    console.log("Block Number:", deployTx.blockNumber);
  }
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    contractAddress: contractAddress,
    deployer: deployer.address,
    owner: initialOwner,
    deploymentTime: new Date().toISOString(),
    maxSupply: maxSupply,
    initialMinting: "NONE - gradual distribution via buyMTX",
    transactionHash: deployTx ? deployTx.hash : null,
    blockNumber: deployTx ? deployTx.blockNumber : null
  };
  
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  
  const deploymentFile = path.join(deploymentsDir, `mtx-${hre.network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n📄 Deployment info saved to:", deploymentFile);
  
  // Print next steps
  console.log("\n📋 Next Steps:");
  
  // Check if Polygonscan API key is set for verification
  if (!process.env.POLYGONSCAN_API_KEY && hre.network.name !== "localhost") {
    console.log("\n⚠️  WARNING: POLYGONSCAN_API_KEY not set in environment");
    console.log("   Contract verification will fail without it.");
    console.log("   Get your API key from: https://polygonscan.com/myapikey");
    console.log("");
  }
  
  console.log("1. Verify contract on Polygonscan:");
  console.log(`   npx hardhat verify --network ${hre.network.name} ${contractAddress} "${maxSupply}" "${initialOwner}"`);
  console.log("\n2. Update src/config/mtx.ts with the contract address:");
  console.log(`   address: "${contractAddress}"`);
  console.log("\n3. Add liquidity to QuickSwap (MATIC/MTX pair)");
  console.log("\n4. Test the contract thoroughly before announcing");
  
  // Get network explorer URL
  let explorerUrl = "";
  if (hre.network.name === "polygon") {
    explorerUrl = `https://polygonscan.com/address/${contractAddress}`;
  } else if (hre.network.name === "amoy") {
    explorerUrl = `https://amoy.polygonscan.com/address/${contractAddress}`;
  }
  
  if (explorerUrl) {
    console.log("\n🔍 View on Polygonscan:", explorerUrl);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });
