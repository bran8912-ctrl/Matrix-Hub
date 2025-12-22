const hre = require("hardhat");

async function main() {
  const MTX = await hre.ethers.getContractFactory("MatrixHubCoin");
  const supply = "100000000"; // 100M MTX

  const mtx = await MTX.deploy(supply);
  await mtx.waitForDeployment();

  console.log("MTX deployed to:", await mtx.getAddress());
}

main().catch(console.error);
