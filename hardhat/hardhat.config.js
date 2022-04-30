require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
const fs = require('fs')
const projectId = '9c4c48140895481fb26831f5a6dc3d19'
const privateKey = fs.readFileSync(".secret").toString()
module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: [privateKey]
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${projectId}`,
      accounts: [privateKey]
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${projectId}`,
      accounts: [privateKey]
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4"
      },
      {
        version: "0.8.0"
      }
    ]
  },
};
