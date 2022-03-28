<template>
  <div class="page">
    <div class="viewContainer mint">
      <div class="mintCard">
        <p class="title1 mintTitle">MGDC mint</p>
        <p class="text howMa">How many Gold-Diggers do you want to mint ?</p>
        <div class="inline22">
          <button :class="`mintButton ${nftsCountToMint === 1 ? ' selected' : ''}`" @click="nftsCountToMint = 1">1</button>
          <button :class="`mintButton ${nftsCountToMint === 2 ? ' selected' : ''}`" @click="nftsCountToMint = 2">2</button>
        </div>

        <p class="text nftPrice">Price : {{ (nftsCountToMint * nftPrice) / 1000000000000000000 }} ETH</p>

        <div v-if="accountID === ''" class="text nbNft">Minted : XXX / 5369</div>
        <div v-if="!notAllowed && accountID !== ''" class="text nbNft">Minted : {{ parseInt(currentSupply) + 393 }} / {{ parseInt(totalTokens) + 400 }}</div>
        <button class="connectButton" @click="connectWallet">{{ accountID === "" ? "Connect wallet" : accountID.substring(1, 9) + "..." + accountID.substring(accountID.length - 6) }}</button>
        <br />
        <button v-if="!notAllowed" :disabled="isMinting" class="validateButton" @click="mint">
          {{ isMinting ? "Waiting..." : "Mint" }}
        </button>
        <button v-if="notAllowed" :disabled="isMinting" class="validateButton" @click="mint">
          {{ notAllowed ? "Please come back later" : "" }}
        </button>
      </div>
    </div>
    <img class="redlip22" :src="require(`@/assets/imgs/redlip-2@1x.png`)" />
    <img class="coin22" :src="require(`@/assets/imgs/coin-5@1x_cut.png`)" />
  </div>
</template>

<script>
var Web3 = require("web3");
var CryptoJS = require("crypto-js");
import mgdc from "../abis/mgdc.json";
import address from "../address/address.json";
var MerkleTree = require("merkletreejs").MerkleTree;
var SHA256 = CryptoJS.SHA256;

const leaves = address.addresses.map((x) => x.replace("0x", "0x000000000000000000000000"));
const tree = new MerkleTree(leaves, SHA256, { sortPairs: true });
const root = tree.getRoot().toString("hex");

export default {
  name: "Mint",
  data() {
    return {
      address: "",
      accountID: "",
      accountBalance: 0,
      abi: [],
      contract: [],
      wlClaimed: 0,
      // Contract
      isActive: false,
      isPresaleActive: false,
      currentSupply: 0,
      totalTokens: 5369,
      maxSupply: 5369,
      buyLimit: 2,
      nftPrice: 250000000000000000,
      whiteListMaxMint: 2,
      notAllowed: false,
      // Form data
      nftsCountToMint: 2,
      minted: false,
      isMinting: false,
    };
  },
  async created() {
    await this.loadWeb3();
    this.GetRoot();
  },
  methods: {
    GetMerkleProof(walletAddress) {
      const leaf = walletAddress;
      return tree.getHexProof(leaf.replace("0x", "0x000000000000000000000000"));
    },
    GetRoot() {
      console.log("root");
      console.log(root);
      console.log(address.addresses.length);
      console.log("contract : " + this.address);
      return `0x${root}`;
    },
    async loadWeb3() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);

        window.ethereum.on("accountsChanged", async (accounts) => {
          await this.setWallet(accounts[0]);
          this.wlClaimed = await this.contract.methods.whiteListClaimed(this.accountID).call();
        });
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert("Non-Ethereum browser detected. You should consider trying MetaMask !");
      }

      await this.loadContractData();
      setInterval(
        function () {
          this.loadContractData();
        }.bind(this),
        1000
      );
    },
    async pick(nftsCountToMint) {
      this.nftsCountToMint = nftsCountToMint;
      console.log(this.nftsCountToMint);
    },
    async loadContractData() {
      const web3 = window.web3;
      const networkId = await web3.eth.net.getId();

      if (networkId !== mgdc.network) {
        window.alert("Please change to ethereum mainnet.");
        return;
      }

      this.abi = mgdc.abi;
      this.address = mgdc.address;
      this.contract = new web3.eth.Contract(this.abi, this.address);
      this.nftPrice = await this.contract.methods.NFTPrice().call();
      this.totalTokens = await this.contract.methods.MAX_NFT_PUBLIC().call();
      this.buyLimit = await this.contract.methods.BUY_LIMIT_PER_TX().call();
      this.isActive = await this.contract.methods.isActive().call();
      this.currentSupply = await this.contract.methods.totalSupply().call();
      this.isPresaleActive = await this.contract.methods.isPresaleActive().call();
    },
    async setWallet(address) {
      this.accountID = address;
      this.notAllowed = false;
      this.accountBalance = await window.web3.eth.getBalance(this.accountID);
    },
    async connectWallet() {
      console.log("Connect to wallet");
      const web3js = window.web3;
      if (typeof web3js !== "undefined") {
        this.web3 = new Web3(web3js.currentProvider);
        const accounts = await window.ethereum
          .request({
            method: "eth_requestAccounts",
          })
          .catch((err) => {
            alert(err.message);
          });
        await this.setWallet(accounts[0]);
        console.log("wlClaimed " + this.wlClaimed);
      } else {
        // web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')) GANACHE FALLBACK
        alert("Unable to connect to Metamask");
      }
    },
    //Minting Functionality
    async mint(e) {
      this.isMinting = true;
      e.preventDefault();

      if (this.accountID === "") {
        window.alert("Please connect wallet first!");
        this.isMinting = false;
        return;
      } else if (this.accountBalance <= this.nftPrice * this.nftsCountToMint) {
        //this.isMinting = false;
       // alert(`Insufficient funds`);
       // return;
      }

      this.isActive = await this.contract.methods.isActive().call();
      this.isPresaleActive = await this.contract.methods.isPresaleActive().call();
      console.log("isActive : ", this.isActive);
      console.log("isPresaleActive : ", this.isPresaleActive);

      if (!this.isActive) {
        this.isMinting = false;
        alert("Sale is not active yet!");
        return;
      }

      const noOfTokens = this.nftsCountToMint;
      console.log("nftPrice : ", this.nftPrice);
      if (this.isPresaleActive == true) {
        this.whiteListMaxMint = await this.contract.methods.WHITELIST_MAX_MINT().call();
        this.wlClaimed = parseInt(await this.contract.methods.whiteListClaimed(this.accountID).call());

       /* if (this.wlClaimed + this.nftsCountToMint > this.whiteListMaxMint) {
          alert(`Already minted ${this.wlClaimed} but max is ${this.whiteListMaxMint}`);
          this.notAllowed = true;
          this.isMinting = false;
          return;
        }*/

        console.log("whiteListMaxMint : ", this.whiteListMaxMint);
        if (noOfTokens < 1 || noOfTokens == undefined) {
          alert("Select at least 1 NFT!");
        } else if (noOfTokens > this.whiteListMaxMint) {
          alert("Buy limit for presale is : " + this.whiteListMaxMint);
          this.notAllowed = true;
          this.isMinting = false;
        } else if (this.totalSupply >= this.totalTokens) {
          alert("Sold out!");
        } else {
          const proof = await this.GetMerkleProof(this.accountID);
          if (proof.length == 0) {
            alert("This wallet is not whitelisted");
            this.notAllowed = true;
            this.isMinting = false;
          } else {
            const result = await this.contract.methods
              .mintNFTDuringPresale(noOfTokens, proof)
              .send({
                from: this.accountID,
                value: 0,//parseInt(this.nftPrice) * noOfTokens,
              })
              .on("receipt", function (res) {
                this.minted = true;
                this.isMinting = false;
                console.log("Receipt :", res);
              })
              .on("error", function (err) {
                console.log("error:" + err);
                alert("Transaction Error");
                this.isMinting = false;
              });
            this.minted = true;
            console.log("Test :", result);
          }
        }
      } else {
        if (noOfTokens < 1 || noOfTokens == undefined) {
          alert("Select at least 1 NFT!");
        } else if (this.totalSupply >= this.currentSupply) {
          alert("Sold out!");
        } else {
          const result = await this.contract.methods
            .mintNFT(noOfTokens)
            .send({
              from: this.accountID,
              value: parseInt(this.nftPrice) * noOfTokens,
            })
            .on("receipt", function (res) {
              this.minted = true;
              this.isMinting = false;
              console.log("Receipt :", res);
            })
            .on("error", function (err) {
              console.log(err);
              alert("Transaction Error");
              this.isMinting = false;
            });
          this.minted = true;
          console.log("Test :", result);
        }
      }
      this.isMinting = false;
    },
  },
};
</script>

<style lang="scss">
.page {
  background: linear-gradient(180deg, #edbcad 1.31%, #f0d0df 27.36%, #edb8ed 56.4%);
}

.mint {
  background-image: url("~@/assets/imgs/gold-digger-house-4@1x.png");
  background-size: 120% 180%;
  background-repeat: no-repeat;
  background-position-x: 20%;
  padding-top: 5vh;
  padding-bottom: 5vh;
  min-height: 100vh;
}

@media screen and (max-width: $layout-breakpoint-medium) {
  .mint {
    padding-top: 0;
    padding-bottom: 0;
  }
}

.mintTitle {
  width: 100%;
  text-transform: uppercase;
  font-size: 80px;
  margin-top: 50px;
  margin-bottom: 25px;
  filter: drop-shadow(10px -20px 1px rgb(229, 50, 97));
  transition: all 500ms ease-in-out;
  animation: moveTrailer 2000ms infinite linear;
}
@media screen and (max-width: $layout-breakpoint-xxlarge) {
  .mintTitle {
    margin-bottom: 25px;
    font-size: 50px;
  }
}
@media screen and (max-width: $layout-breakpoint-large) {
  .mintTitle {
    font-size: 40px;
  }
}
@media screen and (max-width: $layout-breakpoint-medium) {
  .mintTitle {
    font-size: 30px;
  }
}
@media screen and (max-width: $layout-breakpoint-small) {
  .mintTitle {
    font-size: 30px;
  }
}

.mintCard {
  border-radius: 50px;
  width: 50%;
  max-width: 1200px;
  margin: auto;
  background: linear-gradient(180deg, #e56932 0%, #ba3474 83.74%, #9b3782 100%);
  box-shadow: 0 0 20px #e56932;
  //border: 5px solid #e56932;
  z-index: 1000;
}
@media screen and (max-width: $layout-breakpoint-medium) {
  .mintCard {
    padding: 25px;
    border-radius: 0px;
    min-height: 100vh;
    width: 100%;
  }
}

.howMa {
  margin: auto;
  margin-bottom: 50px;
  text-align: center;
  transition: all 100ms ease-in-out;
  animation: shineT7 3000ms infinite alternate;
}
@keyframes shineT7 {
  0% {
    filter: drop-shadow(0px 0px 0px $white);
  }
  50% {
    filter: drop-shadow(0px 0px 2px $white);
  }
  100% {
    filter: drop-shadow(0px 0px 0px $white);
  }
}
@media screen and (max-width: $layout-breakpoint-xxlarge) {
  .howMa {
    margin-bottom: 25px;
  }
}

.inline22 {
  width: 60%;
  margin: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

button {
  font-family: var(--font-family-acme);
  border-radius: 15px;
  border: 8px solid pink;
  background-color: transparent;
  color: $white;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 3px;
  opacity: 0.85;
  transition: all 100ms ease-in-out;
  cursor: pointer;
  &:hover {
    opacity: 1;
    transform: translateY(-1px);
    box-shadow: 0px 0px 7px 0px #ffffff;
  }
}

.selected {
  opacity: 1;
  transform: translateY(-1px);
  box-shadow: 0px 0px 7px 0px #ffffff;
  font-weight: 700;
  background-color: $white;
  color: #e56932;
}

.mintButton {
  width: 120px;
  height: 120px;
  // margin: auto;
  padding: 30px;
  padding-top: 10px;
  padding-left: 35px;
  font-size: 65px;
}
@media screen and (max-width: $layout-breakpoint-xxlarge) {
  .mintButton {
    width: 80px;
    height: 80px;
    margin: auto;
    margin-left: 10px;
    margin-right: 10px;
    padding: 15px;
    padding-top: 14px;
    padding-left: 15px;
    border-radius: 15px;
    border: 4px solid pink;
    font-size: 35px;
  }
}

.connectButton {
  margin-top: 25px;
  padding: 15px 40px;
  font-size: 30px;
}
@media screen and (max-width: $layout-breakpoint-xxlarge) {
  .connectButton {
    margin-top: 25px;
    padding: 10px 20px;
    font-size: 20px;
    border-radius: 15px;
    border: 4px solid pink;
  }
}

.validateButton {
  margin-top: 20px;
  padding: 15px 40px;
  font-size: 30px;
  margin-bottom: 50px;
}
@media screen and (max-width: $layout-breakpoint-xxlarge) {
  .validateButton {
    margin-top: 25px;
    padding: 10px 20px;
    font-size: 20px;
    border-radius: 15px;
    border: 4px solid pink;
  }
}

.nftPrice {
  margin-top: 25px;
  text-align: center;
}

.nbNft {
  text-align: center;
}

.coin22 {
  position: absolute;
  right: 0;
  bottom: 10%;
  width: 200px;
}

.redlip22 {
  position: absolute;
  bottom: 10%;
  width: 300px;
  left: 50px;
}
</style>
