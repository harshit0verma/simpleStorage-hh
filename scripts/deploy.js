const { ethers, run, network } = require("hardhat");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying .....");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();

  console.log(simpleStorage.address);

  // goerli network check - ch 6
  // if(network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY){
  //   await simpleStorage.deployTransaction.wait(6);
  //   await verify(simpleStorage.address, [])
  // }

  const txpre = await simpleStorage.retrieve();
  console.log(`initial value : ${txpre}`);
  const txstore = await simpleStorage.store("7");
  await txstore.wait(1);
  const uptx = await simpleStorage.retrieve();
  console.log(`updated value : ${uptx}`);

  const verify = async (contractAddress, args) => {
    console.log("Verifying contract...");
    try {
      await run("verify:verify", {
        address: contractAddress,
        constructorArguments: args,
      });
    } catch (e) {
      if (e.message.toLowerCase().includes("already verified")) {
        console.log("Already Verified!");
      } else {
        console.log(e);
      }
    }
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
