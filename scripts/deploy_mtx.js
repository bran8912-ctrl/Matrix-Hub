const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting MTX Token Deployment to Ethereum Mainnet...");
  console.log("Network:", hre.network.name);
  
  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Check deployer balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
  
  // Deploy parameters
  const initialSupply = "100000000"; // 100M MTX
  const initialOwner = "0xb248d5bd04f6fadee6146d0dac1da82b842a437b9c6444c4cbc1e7ee37033e7a";
  
  console.log("\nDeployment parameters:");
  console.log("- Initial Supply:", initialSupply, "MTX");
  console.log("- Initial Owner:", initialOwner);
  console.log("- Token Name: Matrix-HubCoin");
  console.log("- Token Symbol: MTX");
  console.log("- Decimals: 18");
  console.log("- Network: Ethereum Mainnet (Chain ID: 1)");
  
  // Deploy contract
  console.log("\nDeploying MatrixHubCoin contract...");
  const MTX = await hre.ethers.getContractFactory("MatrixHubCoin");
  const mtx = await MTX.deploy(initialSupply, initialOwner);
  
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
    initialSupply: initialSupply,
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
  console.log("1. Verify contract on Etherscan:");
  console.log(`   npx hardhat verify --network ${hre.network.name} ${contractAddress} "${initialSupply}" "${initialOwner}"`);
  console.log("\n2. Update src/config/mtx.ts with the contract address:");
  console.log(`   address: "${contractAddress}"`);
  console.log("\n3. Add liquidity to Uniswap (ETH/MTX pair)");
  console.log("\n4. Test the contract thoroughly before announcing");
  
  // Get network explorer URL
  let explorerUrl = "";
  if (hre.network.name === "mainnet") {
    explorerUrl = `https://etherscan.io/address/${contractAddress}`;
  } else if (hre.network.name === "sepolia") {
    explorerUrl = `https://sepolia.etherscan.io/address/${contractAddress}`;
  }
  
  if (explorerUrl) {
    console.log("\n🔍 View on Etherscan:", explorerUrl);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });
