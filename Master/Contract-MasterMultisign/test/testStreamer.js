// const { expect } = require("chai");

// const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");

// describe("StreamerContract", function () {
//     async function deployOneContract() {
//         const ExampStreamer = await hre.ethers.getContractFactory("Streamer");
//         const exampleStreamer = await ExampStreamer.deploy();

//         await exampleStreamer.deployed();

//         console.log("YourToken deployed to:", exampleStreamer.address);
//         const [addr1, addr2] = await ethers.getSigners();
//         console.log('------------------------------------------')
//         return { exampleStreamer, addr1, addr2 };
//     }

//     it("should be able fund Channel", async function () {
//         console.log('------------------------------------------')
//         const { exampleStreamer, addr1, addr2 } = await loadFixture(deployOneContract);
//         await expect(exampleStreamer.connect(addr2).fundChannel({ value: ethers.utils.parseEther("8") }))
//             .to.emit(exampleStreamer, "Opened")
//             .withArgs(addr2.address, ethers.utils.parseEther("8"));

//     });

//     it("should be able to withdraw Earnings", async function () {
//         console.log('------------------------------------------')
//         const { exampleStreamer, addr1, addr2 } = await loadFixture(deployOneContract);
//         await exampleStreamer.connect(addr2).fundChannel({ value: ethers.utils.parseEther("8") })

//         let updatedBalance = await exampleStreamer.uintToString(ethers.utils.parseEther("5"))
//         let signature = await addr2.signMessage(updatedBalance)
//         let sig = ethers.utils.splitSignature(signature)
//         let promise = exampleStreamer.verifyString(updatedBalance, sig.v, sig.r, sig.s);
//         promise.then(function (signer) {    // Check the computed signer matches the actual signer
//             console.log("wallet.address : " + addr2.address)
//             console.log("signer : " + signer)
//             console.log(signer === addr2.address);
//         });

//         let updatedBalanceee = ethers.utils.parseEther("5")
//         await expect(exampleStreamer.connect(addr2).withdrawEarnings(updatedBalanceee, sig.v, sig.r, sig.s))
//             .to.emit(exampleStreamer, "Withdrawn")
//             .withArgs(addr2.address, updatedBalanceee);

//     });

//     it("should be able to challenge Channel", async function () {
//         console.log('------------------------------------------')
//         const { exampleStreamer, addr1, addr2 } = await loadFixture(deployOneContract);
//         await exampleStreamer.connect(addr2).fundChannel({ value: ethers.utils.parseEther("8") })
//         await (exampleStreamer.connect(addr2).challengeChannel(50))
//         ethers.provider.send("evm_increaseTime", [50])   // add 50 seconds
//         ethers.provider.send("evm_mine")      // mine the next block
//         expect(await exampleStreamer.timeLeft(addr2.address)).to.equal(0);
//     });

//       it("should be able to defund Channel", async function () {
//         console.log('------------------------------------------')
//         const { exampleStreamer, addr1, addr2 } = await loadFixture(deployOneContract);
//         await exampleStreamer.connect(addr2).fundChannel({ value: ethers.utils.parseEther("8") })
//         await exampleStreamer.connect(addr2).challengeChannel(60)
//         ethers.provider.send("evm_increaseTime", [60])   // add 60 seconds
//         ethers.provider.send("evm_mine")      // mine the next block
//         await exampleStreamer.connect(addr2).defundChannel()
//         expect(await exampleStreamer.connect(addr2).getBalances()).to.equal(0);
//     });


// });























