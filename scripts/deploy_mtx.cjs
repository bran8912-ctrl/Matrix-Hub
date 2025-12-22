// scripts/deploy_mtx.cjs
// Deployment script for MatrixHubCoin using CommonJS require syntax


const hre = require("hardhat");
const { ethers } = require("ethers");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const initialSupply = ethers.parseUnits("1000000", 18); // 1,000,000 MTX
  const MatrixHubCoin = await hre.ethers.getContractFactory("MatrixHubCoin");
  const mtx = await MatrixHubCoin.deploy(initialSupply);
  await mtx.waitForDeployment();
  console.log("MatrixHubCoin deployed to:", mtx.target);
  console.log("Deployer address:", deployer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
