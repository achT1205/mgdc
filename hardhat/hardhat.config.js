require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const { INFURA_RINKEBY_URL, ACCOUNT_PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.7.0",
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    },
  },
  networks: {
    rinkeby: {
      url: INFURA_RINKEBY_URL || "",
      accounts:
        ACCOUNT_PRIVATE_KEY !== undefined
          ? [process.env.ACCOUNT_PRIVATE_KEY]
          : [],
    },
    hardhat: {
      chainId: 1337,
    },
  },
  paths: {
    artifacts: "../src/assets/artifacts",
  },
};
