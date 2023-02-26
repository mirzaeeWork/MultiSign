const hre = require("hardhat");

async function main() {
  const ExampleMasterMultiSigWallet = await hre.ethers.getContractFactory("MasterMultiSigWallet");
  const exampleMasterMultiSigWallet = await ExampleMasterMultiSigWallet.deploy();

  await exampleMasterMultiSigWallet.deployed();

  console.log("MetaMultiSigWallete deployed to:", exampleMasterMultiSigWallet.address);


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
