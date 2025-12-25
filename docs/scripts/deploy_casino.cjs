// scripts/deploy_casino.cjs
// Deploy CasinoReserve and CasinoCore contracts with the deployed MatrixHubCoin address

const hre = require("hardhat");

async function main() {
  const MTX_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const [deployer] = await hre.ethers.getSigners();

  // Deploy CasinoReserve
  const reserveCap = hre.ethers.parseUnits("1000000", 18); // 1,000,000 MTX
  const CasinoReserve = await hre.ethers.getContractFactory("CasinoReserve");
  const reserve = await CasinoReserve.deploy(MTX_ADDRESS, reserveCap, deployer.address);
  await reserve.waitForDeployment();
  console.log("CasinoReserve deployed to:", reserve.target);

  // Deploy CasinoCore (dummy addresses for liquidity, rng, dev, governance for now)
  const CasinoCore = await hre.ethers.getContractFactory("CasinoCore");
  const dummy = deployer.address;
  const minBet = hre.ethers.parseUnits("1", 18);
  const maxBet = hre.ethers.parseUnits("1000", 18);
  const core = await CasinoCore.deploy(
    MTX_ADDRESS,
    dummy, // liquidity
    reserve.target,
    dummy, // rng
    minBet,
    maxBet,
    dummy, // dev
    dummy  // governance
  );
  await core.waitForDeployment();
  console.log("CasinoCore deployed to:", core.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
