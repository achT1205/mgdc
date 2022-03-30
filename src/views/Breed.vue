<template>
  <div class="page">
    <div class="viewContainer mint">
      <div class="switch">
      <switcher  @changeSmartcontract="changeSmartcontract" />
      </div>
      <div class="mintCard">
        <p class="title1 mintTitle">MGDC breed</p>
        <p class="text howMa">Find your partner</p>
        <button class="connectButton" @click="connectWallet">
          {{
            accountID === ""
              ? "Connect wallet"
              : accountID.substring(1, 9) +
                "..." +
                accountID.substring(accountID.length - 6)
          }}
        </button>
      </div>

      <div
        class="tinder"
        :style="{ display: accountID !== '' && !match ? 'flex' : 'none' }"
      >
        <div class="tinder--cards">
          <div class="tinder--card" v-for="item in queue" :key="item.name">
            <img :src="item.image" />
            <h3 style="color: black">ID : {{ item.id }}</h3>
            <p style="color: black">
              Has breeded : {{ item.hasBreed ? "true" : "false" }}
            </p>
          </div>
        </div>
        <div class="tinder--buttons">
          <button id="nope" @click="decide(item, 'nope')">
            <i class="fa fa-remove"></i>
          </button>
          <button id="nope" @click="decide(item, 'nice')">
            <i class="fa fa-star"></i>
          </button>
          <button id="love" @click="decide(item, 'match')">
            <i class="fa fa-heart"></i>
          </button>
        </div>
      </div>

      <!-- <div class="tinderCards" v-if="accountID !== '' && npmCnt >= 5 && !match">
        <div class="tinderCard" v-for="(item, i) in MGDC" :key="'b' + i">
          ID : {{ item.id }}
          <br />
          <br />
          Has breeded : {{ item.hasBreed ? "true" : "false" }}
          <br />
          <br />
          <br />
          <div class="teamMember">
            <div class="picContainer">
              <img class="pic" data-v-16dd8cbd :src="item.image ? item.image : ''" />
            </div>
            <button
              class="connectButton"
              v-bind:style="{ color: '#000000' }"
              @click="breed(item.id)"
            >
              breed
            </button>
          </div>
          <br />
          <br />
        </div>
      </div> -->

      <div class="tinderCards" v-if="match && accountID !== ''">
        <p class="title1 matchTitle">It's a match !</p>
        <img :src="require('@/assets/imgs/monkey-miss.gif')" style="width: 500px" />
      </div>
    </div>

    <img class="redlip22" :src="require(`@/assets/imgs/redlip-2@1x.png`)" />
    <img class="coin22" :src="require(`@/assets/imgs/coin-5@1x_cut.png`)" />
    <breed-sidebar  @breed="breed"/>
    <chat />
  </div>
</template>

<script>
var Web3 = require("web3");
var CryptoJS = require("crypto-js");
import breed from "../abis/breed.json";
import MGDC from "../abis/mgdc.json";
import address from "../address/address.json";
import BreedSidebar from "@/components/BreedSidebar.vue";
import Switcher from "../components/Switcher.vue";
import Chat from "@/components/Chat.vue";
import { mapGetters } from "vuex";

// import axios from "axios";
var MerkleTree = require("merkletreejs").MerkleTree;
var SHA256 = CryptoJS.SHA256;

const leaves = address.addresses.map((x) =>
  x.replace("0x", "0x000000000000000000000000")
);
const tree = new MerkleTree(leaves, SHA256, { sortPairs: true });
const root = tree.getRoot().toString("hex");

export default {
  name: "Breed",
  components: {
    BreedSidebar,
    Switcher,
    Chat,
  },
  data() {
    return {
      sidebar: false,
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
      match: false,
      npmCnt: 0,
      contractMGDC: [],
      queue: [],
      offset: 0,
    };
  },
  computed: {
    ...mapGetters(["tokens"]),
  },
  async created() {
    await this.loadWeb3();
    this.tinder();
  },
  async mounted() {
    await this.connectWallet();
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
        });
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert(
          "Non-Ethereum browser detected. You should consider trying MetaMask !"
        );
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

      if (networkId !== breed.network) {
        window.alert("Please change to ethereum mainnet.");
        return;
      }

      this.abi = breed.abi;
      this.address = breed.address;
      this.contract = new web3.eth.Contract(this.abi, this.address);
      this.contractMGDC = new web3.eth.Contract(MGDC.abi, MGDC.address);
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
        this.mock();

        // let count = await this.contract.methods.MGDCisBreedingCount().call();

        // let table = [];
        // let ids = [];
        // this.MGDC = [];
        // for (var t = 0; t < count; t++) {
        //   let a = await this.contract.methods.MGDCbreeding(t).call();
        //   ids.push(a);
        //   table.push(await this.contractMGDC.methods.tokenURI(a).call());
        //   let toto = {};
        //   toto.id = ids[t];
        //   toto.hasBreed = await this.contract.methods.hasBreed(ids[t]).call();
        //   toto.isListed = await this.contract.methods.MGDCisBreeding(ids[t]).call();
        //   let token = table[t];
        //   //console.log(token);
        //   token = await axios.get(token.replace("ipfs://", "https://ipfs.io/ipfs/"));
        //   console.log("token", token.data.image);

        //   toto.image = token.data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
        //   console.log(toto.image);
        //   if (toto.hasBreed == false) this.MGDC.push(toto);
        // }
        // this.MGDC = this.MGDC.filter((e) => e.hasBreed == false);

        // console.log(this.MGDC);
        // console.log("wlClaimed " + this.wlClaimed);
      } else {
        // web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')) GANACHE FALLBACK
        alert("Unable to connect to Metamask");
      }
    },
    async breed(token_id) {
      console.log(token_id);
      this.match = true;
      await this.contract.methods
        .breed(token_id)
        .send({
          from: this.accountID,
          value: "250000000000000000",
        })
        .on("receipt", function (res) {
          console.log("Receipt :", res);
        })
        .on("error", function (err) {
          console.log("error:" + err);
          alert("Transaction Error");
        });
      this.match = true;
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
        this.isMinting = false;
        alert(`Insufficient funds`);
        return;
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
        this.wlClaimed = parseInt(
          await this.contract.methods.whiteListClaimed(this.accountID).call()
        );

        if (this.wlClaimed + this.nftsCountToMint > this.whiteListMaxMint) {
          alert(`Already minted ${this.wlClaimed} but max is ${this.whiteListMaxMint}`);
          this.notAllowed = true;
          this.isMinting = false;
          return;
        }

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
                value: parseInt(this.nftPrice) * noOfTokens,
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

    tinder() {
      var tinderContainer = document.querySelector(".tinder");
      var allCards = document.querySelectorAll(".tinder--card");
      var nope = document.getElementById("nope");
      var love = document.getElementById("love");
      function initCards() {
        var newCards = document.querySelectorAll(".tinder--card:not(.removed)");
        newCards.forEach(function (card, index) {
          card.style.zIndex = allCards.length - index;
          card.style.transform =
            "scale(" + (20 - index) / 20 + ") translateY(-" + 30 * index + "px)";
          card.style.opacity = (10 - index) / 10;
        });
        tinderContainer.classList.add("loaded");
      }

      initCards();
      function createButtonListener(love) {
        return function (event) {
          var cards = document.querySelectorAll(".tinder--card:not(.removed)");
          var moveOutWidth = document.body.clientWidth * 1.5;
          if (!cards.length) return false;
          var card = cards[0];
          card.classList.add("removed");
          if (love) {
            card.style.transform =
              "translate(" + moveOutWidth + "px, -100px) rotate(-30deg)";
          } else {
            card.style.transform =
              "translate(-" + moveOutWidth + "px, -100px) rotate(30deg)";
          }
          initCards();
          event.preventDefault();
        };
      }

      var nopeListener = createButtonListener(false);
      var loveListener = createButtonListener(true);
      nope.addEventListener("click", nopeListener);
      love.addEventListener("click", loveListener);
    },
    async changeSmartcontract(target) {
      if (target === "BAYC") {
        await this.loadContractData("0x563cB938f8945d01c1795BB7e457123E65983C06");
        await this.connectWallet();
      } else {
        await this.loadContractData("newcontract");
        await this.connectWallet();
      }
    },
    async mock() {
      let count = 0;
      while (count < 5) {
        const token = this.tokens[this.offset];
        if (!token.hasBreed) {
          this.queue.push(token);
          count++;
        }
        this.offset++;
      }
    },
  },
};
</script>

<style lang="scss">
.page {
  background: linear-gradient(180deg, #edbcad 1.31%, #f0d0df 27.36%, #edb8ed 56.4%);
}

.switch{
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 0 15px;
  margin-bottom: 15px;
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
.tinder {
  width: 100%;
  height: 800px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  //opacity: 0;
  transition: opacity 0.1s ease-in-out;
  //border: 1px solid red;
  margin: auto;
  margin-top: 50px;
}

.loaded.tinder {
  opacity: 1;
}

.tinder--status {
  position: absolute;
  top: 50%;
  margin-top: -30px;
  z-index: 2;
  width: 100%;
  text-align: center;
  pointer-events: none;
}

.tinder--status i {
  font-size: 100px;
  opacity: 0;
  transform: scale(0.3);
  transition: all 0.2s ease-in-out;
  position: absolute;
  width: 100px;
  margin-left: -50px;
}

.tinder_love .fa-heart {
  opacity: 0.7;
  transform: scale(1);
}

.tinder_nope .fa-remove {
  opacity: 0.7;
  transform: scale(1);
}

.tinder--cards {
  flex-grow: 1;
  padding-top: 40px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1;
}

.tinder--card {
  display: inline-block;
  width: 90vw;
  max-width: 400px;
  height: 70vh;
  background: #ffffff;
  padding-bottom: 40px;
  border-radius: 8px;
  overflow: hidden;
  position: absolute;
  will-change: transform;
  transition: all 0.3s ease-in-out;
  cursor: -webkit-grab;
  cursor: -moz-grab;
  cursor: grab;
}

.moving.tinder--card {
  transition: none;
  cursor: -webkit-grabbing;
  cursor: -moz-grabbing;
  cursor: grabbing;
}

.tinder--card img {
  max-width: 100%;
  pointer-events: none;
}

.tinder--card h3 {
  margin-top: 32px;
  font-size: 32px;
  padding: 0 16px;
  pointer-events: none;
}

.tinder--card p {
  margin-top: 24px;
  font-size: 20px;
  padding: 0 16px;
  pointer-events: none;
}

.tinder--buttons {
  flex: 0 0 100px;
  text-align: center;
  padding-top: 20px;
}

.tinder--buttons button {
  border-radius: 50%;
  line-height: 60px;
  width: 60px;
  border: 0;
  background: #ffffff;
  display: inline-block;
  margin: 0 8px;
  .fa-heart {
    color: #fface4;
    margin-left: 5px;
    margin-top: -3px;
  }
  .fa-remove {
    color: #cdd6dd;
    margin-left: 5px;
    margin-top: -5px;
  }
}

.tinder--buttons button:focus {
  outline: 0;
}

.tinder--buttons i {
  font-size: 32px;
  vertical-align: middle;
}

.matchTitle {
  width: 100%;
  text-transform: uppercase;
  font-size: 80px;
  margin-top: 50px;
  margin-bottom: 25px;
  filter: drop-shadow(10px -20px 1px rgb(229, 50, 97));
  transition: all 500ms ease-in-out;
  z-index: 20000;
}

.tinderCards {
  padding-top: 100px;
  // position: relative;
  // height: 600px;
  width: 80%;
  // margin: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 50px;
  //border: 1px solid red;
  z-index: 1000;
  margin: auto;
}

.tinderCard {
  position: relative;
  // top: 0;
  // left: 0;
  margin: 20px;
  height: 500px;
  width: 350px;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  color: black;
  filter: drop-shadow(10px -20px 1px rgb(229, 50, 97));
  transition: all 500ms ease-in-out;
  img {
    height: 50%;
    width: 100%;
    object-fit: cover;
  }
  .fa {
    width: 80px;
    height: 80px;
    padding-top: 21px;
    padding-left: 0px;
    border-radius: 100%;
    background: white;

    font-size: 35px;
    cursor: pointer;
    &:hover {
    }
  }
}

.tinderButtons {
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: auto;
  margin-bottom: 25px;

  .fa-heart {
    border: 2px solid green;
    color: green;
    transition: all 100ms ease-in-out;
    &:hover {
      background: green;
      color: white;
    }
  }
  .fa-remove {
    border: 2px solid red;
    color: red;
    transition: all 100ms ease-in-out;
    &:hover {
      background: red;
      color: white;
    }
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

.connectButton {
  margin-top: 25px;
  margin-bottom: 50px;
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
