const { expect } = require("chai");

const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");

describe("MultiSigWalletContract", function () {
  async function deployOneContract() {
    const ExampleMasterMultiSigWallet = await hre.ethers.getContractFactory("MasterMultiSigWallet");
    const exampleMasterMultiSigWallet = await ExampleMasterMultiSigWallet.deploy();

    await exampleMasterMultiSigWallet.deployed();

    console.log("MetaMultiSigWallete deployed to:", exampleMasterMultiSigWallet.address);

    const [addr1, addr2, addr3, addr4] = await ethers.getSigners();
    const data = `0x${Buffer.from("salam", 'utf8').toString('hex')}`;
    console.log('------------------------------------------')
    return { exampleMasterMultiSigWallet, addr1, addr2, addr3, addr4, data };
  }

  it("should be able Add Transaction", async function () {
    console.log('------------------------------------------')
    const { exampleMasterMultiSigWallet, addr1, addr2, addr3, addr4, data } = await loadFixture(deployOneContract);
    await expect(exampleMasterMultiSigWallet.AddTransaction(addr4.address, data, { value: ethers.utils.parseEther("8") }))
      .to.emit(exampleMasterMultiSigWallet, "Submission")
      .withArgs(0);
  });

  it("should be able add Signer", async function () {
    console.log('------------------------------------------')
    const { exampleMasterMultiSigWallet, addr1, addr2, addr3, addr4, data } = await loadFixture(deployOneContract);
    await exampleMasterMultiSigWallet.AddTransaction(addr4.address, data, { value: ethers.utils.parseEther("8") })
    await expect(exampleMasterMultiSigWallet.addSigner(0, addr2.address))
      .to.emit(exampleMasterMultiSigWallet, "Owner")
      .withArgs(0, addr2.address);
  });

  it("should be able remove Signer", async function () {
    console.log('------------------------------------------')
    const { exampleMasterMultiSigWallet, addr1, addr2, addr3, addr4, data } = await loadFixture(deployOneContract);
    await exampleMasterMultiSigWallet.AddTransaction(addr4.address, data, { value: ethers.utils.parseEther("8") })
    await exampleMasterMultiSigWallet.addSigner(0, addr2.address)
    await expect(exampleMasterMultiSigWallet.removeSigner(0, addr2.address))
      .to.emit(exampleMasterMultiSigWallet, "DeleteOwner")
      .withArgs(addr2.address, false);
  });

  it("should be able confirm and execute transaction ", async function () {
    console.log('------------------------------------------')
    const { exampleMasterMultiSigWallet, addr1, addr2, addr3, addr4, data } = await loadFixture(deployOneContract);
    await exampleMasterMultiSigWallet.AddTransaction(addr4.address, data, { value: ethers.utils.parseEther("8") })
    await exampleMasterMultiSigWallet.addSigner(0, addr2.address)
    const _hash = await exampleMasterMultiSigWallet.connect(addr2).getTransactionHash(0)
    const hash = ethers.utils.arrayify(_hash)
    let signature = await addr2.signMessage(hash)
    await expect(exampleMasterMultiSigWallet.connect(addr2).confirmTransaction(0, signature))
      .to.emit(exampleMasterMultiSigWallet, "Execution")
      .withArgs(0, true);
  });

  it("Must be able to confirm and execute the transaction with two signers", async function () {
    console.log('------------------------------------------')
    const { exampleMasterMultiSigWallet, addr1, addr2, addr3, addr4, data } = await loadFixture(deployOneContract);
    await exampleMasterMultiSigWallet.AddTransaction(addr4.address, data, { value: ethers.utils.parseEther("8") })
    await exampleMasterMultiSigWallet.addSigner(0, addr2.address)
    await exampleMasterMultiSigWallet.addSigner(0, addr3.address)
    let _hash = await exampleMasterMultiSigWallet.connect(addr2).getTransactionHash(0)
    let hash = ethers.utils.arrayify(_hash)
    let signature = await addr2.signMessage(hash)
    await expect(exampleMasterMultiSigWallet.connect(addr2).confirmTransaction(0, signature))
      .to.emit(exampleMasterMultiSigWallet, "Execution")
      .withArgs(0, false);

    _hash = await exampleMasterMultiSigWallet.connect(addr3).getTransactionHash(0)
    hash = ethers.utils.arrayify(_hash)
    signature = await addr3.signMessage(hash)
    await expect(exampleMasterMultiSigWallet.connect(addr3).confirmTransaction(0, signature))
      .to.emit(exampleMasterMultiSigWallet, "Execution")
      .withArgs(0, true);

  });

});























