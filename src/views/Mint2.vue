<template>
  <div class="page">
    <div class="viewContainer mint">
      <div class="mintCard">
        <p class="title1 mintTitle">Chihuahua mint</p>
        <p class="text howMa">How many Chihuahua do you want to mint (max 2) ?</p>
        <div class="inline22">
          <button :class="`mintButton ${nftsCountToMint === 1 ? ' selected' : ''}`" @click="nftsCountToMint = 1">1</button>
          <button :class="`mintButton ${nftsCountToMint === 2 ? ' selected' : ''}`" @click="nftsCountToMint = 2">2</button>
        </div>

        <p class="text nftPrice">Price : {{ (nftsCountToMint * nftPrice) / 1000000000000000000 }} MGDC Tokens</p>
        <div v-if="accountID === ''" class="text nbNft">Minted : XXX / 4000</div>
        <div v-if="!notAllowed && accountID !== ''" class="text nbNft">Minted : {{ parseInt(currentSupply) + 393 }} / {{ parseInt(totalTokens) + 400 }}</div>
        <button class="connectButton" @click="connectWallet">{{ accountID === "" ? "Connect wallet" : accountID.substring(1, 9) + "..." + accountID.substring(accountID.length - 6) }}</button>
        <br />
        <button v-if="!approved" :disabled="isMinting" class="validateButton" @click="approve">
          {{ isMinting ? "Waiting..." : "Approve" }}
        </button>
        <button v-if="!notAllowed" :disabled="isMinting&&!approved" class="validateButton" @click="mint">
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
import mgdc from "../abis/chihuahua.json";
import mgdcstake from "../abis/mgdcstake1.json";


export default {
  name: "Mint",
  data() {
    return {
      address: "",
      accountID: "",
      accountBalance: 0,
      abi: [],
      abi1:[],
      contract1: [],
      contract: [],
      wlClaimed: 0,
      // Contract
      isActive: false,
      isPresaleActive: false,
      currentSupply: 0,
      totalTokens: 4000,
      approved:false,
      maxSupply: 4000,
      buyLimit: 2,
      nftPrice: 1000000000000000000,
      whiteListMaxMint: 2,
      notAllowed: false,
      // Form data
      nftsCountToMint: 1,
      minted: false,
      isMinting: false,
    };
  },
  async created() {
    await this.loadWeb3();
  },
  methods: {
    async loadWeb3(){
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);

        window.ethereum.on("accountsChanged", async (accounts) => {
          await this.setWallet(accounts[0]);
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
      this.abi1=mgdcstake.abi;
      this.address = mgdc.address;
      this.contract1=new web3.eth.Contract(this.abi1, mgdcstake.address);
      this.contract = new web3.eth.Contract(this.abi, this.address);
      this.nftPrice = await this.contract.methods.NFTPriceMgdc().call();
      this.isActive = await this.contract.methods.isActive().call();
      this.currentSupply = await this.contract.methods.totalSupply().call();
      
      
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
    },async approve(e){
  e.preventDefault();
  if (this.accountID === "") {
        window.alert("Please connect wallet first!");
        this.isMinting = false;
        return;
      }
    console.log(await this.contract1.methods.allowance(this.accountID,mgdc.address).call())
  if(await this.contract1.methods.allowance(this.accountID,mgdc.address).call()>0){
    window.alert("already approved");
    this.approved=await this.contract1.methods.allowance(this.accountID,mgdc.address).call()>0?true:false
  
  }
      
  await this.contract1.methods.approve(mgdc.address,"10000000000000000000000000").send({
              from: this.accountID,
              value: 0,
            })
    },
    //Minting Functionality
    async mint(e) {
      this.isMinting = true;
      e.preventDefault();

      if (this.accountID === "") {
        window.alert("Please connect wallet first!");
        this.isMinting = false;
        return;
      }
       if(await this.contract1.methods.allowance(this.accountID,mgdc.address).call()==0){
        window.alert("Not approved");
     this.isMinting = false;
        return;
     }
      this.isActive = await this.contract.methods.isActive().call();
      console.log("isActive : ", this.isActive);
      if (!this.isActive) {
        this.isMinting = false;
        alert("Sale is not active yet!");
        return;
      }

      const noOfTokens = this.nftsCountToMint;
      console.log("nftPrice : ", this.nftPrice);
    
            
          const result = await this.contract.methods
            .mintNFTWithToken(noOfTokens)
            .send({
              from: this.accountID,
              value: 0,
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
        
      this.isMinting = false;
    },//Minting Functionality
    async mintNormal(e) {
      this.isMinting = true;
      e.preventDefault();

      if (this.accountID === "") {
        window.alert("Please connect wallet first!");
        this.isMinting = false;
        return;
      }

      this.isActive = await this.contract.methods.isActive().call();
      console.log("isActive : ", this.isActive);
      if (!this.isActive) {
        this.isMinting = false;
        alert("Sale is not active yet!");
        return;
      }

      const noOfTokens = this.nftsCountToMint;
      console.log("nftPrice : ", this.nftPrice);
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
        
      this.isMinting = false;
    }
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
