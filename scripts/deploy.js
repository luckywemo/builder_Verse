const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // FIL token address on Filecoin Calibration network
  const filTokenAddress = "0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153"; // tFIL token on Calibration
  console.log("Using tFIL token at:", filTokenAddress);

  const FilecoinStorageManager = await ethers.getContractFactory("FilecoinStorageManager");
  console.log("Deploying FilecoinStorageManager...");

  const storageManager = await upgrades.deployProxy(FilecoinStorageManager, [filTokenAddress], {
    initializer: "initialize",
    kind: "uups"
  });

  await storageManager.waitForDeployment();
  const address = await storageManager.getAddress();
  console.log("FilecoinStorageManager deployed to:", address);
  console.log("Transaction hash:", storageManager.deploymentTransaction().hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 