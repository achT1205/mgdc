<template>
  <div class="page">
    <div class="viewContainer mint">
      <div class="switch">
        <switcher />
      </div>
      <div class="mintCard">
        <p class="title1 mintTitle">MGDC profile</p>
        <p class="text howMa">List your MDGC</p>
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

      <div class="breedCard" style="">
        <div class="text nbNft">Owned MGDC : {{ mgdcBalance }}</div>
        <div class="contentTeam ct2">
          <BreedCard
            v-for="mgdc in mgdcs"
            :key="mgdc.id"
            :mgdc="mgdc"
            :contract="contract"
            :target="target"
            @listMgdc="listMgdc"
          />
        </div>
      </div>
    </div>
    <img class="redlip22" :src="require(`@/assets/imgs/redlip-2@1x.png`)" />
    <img class="coin22" :src="require(`@/assets/imgs/coin-5@1x_cut.png`)" />
    <breed-sidebar ref="breedSidebar" />
    <chat @sendMessage="sendMessage" v-if="target === 'BAYC' && mgdcBalance > 0" />
    <div
      id="overlay"
      v-show="errorMsg || profileIsLoading"
      class="w-full no-nodes-content flex justify-center items-center"
    >
      <svg class="spinner" viewBox="0 0 50 50" v-if="!errorMsg && profileIsLoading">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
      <div class="warnning-notification" v-if="errorMsg">
        <div class="warnning-notification-logo-wrapper">
          <i class="fas fa-triangle-exclamation warnning"></i>
        </div>
        <div class="warnning-notification-content">
          <h4 class="warnning-notification-title">
            {{ errorMsg }}
            <span v-if="mgdcBalance == 0">
              <a href="https://opensea.io/collection/mgdc" target="_blank" class="buy-bn"
                >Buy an MGDC</a
              ></span
            >
          </h4>
        </div>
        <div class="warnning-notification-logo-wrapper" @click="clearError">
          <i class="fas fa-times-circle close"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BreedCard from "@/components/BreedCard";

var Web3 = require("web3");
var CryptoJS = require("crypto-js");
import breed from "../abis/breed.json";
import breedhape from "../abis/breedhape.json";
import MGDC from "../abis/mgdc.json";
import bayc from "../abis/bayc.json";
import hape from "../abis/hape.json";
import mgdcstake from "../abis/mgdcstake.json";
import address from "../address/address.json";
import Switcher from "../components/Switcher.vue";
import Chat from "@/components/Chat.vue";
import BreedSidebar from "@/components/ProfileSidebar.vue";
import { mapGetters } from "vuex";

var MerkleTree = require("merkletreejs").MerkleTree;
var SHA256 = CryptoJS.SHA256;

const leaves = address.addresses.map((x) =>
  x.replace("0x", "0x000000000000000000000000")
);
const tree = new MerkleTree(leaves, SHA256, { sortPairs: true });
const root = tree.getRoot().toString("hex");

export default {
  name: "Profile",
  components: { BreedCard, Switcher, Chat, BreedSidebar },
  data() {
    return {
      errorMsg: null,
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
      target: "BAYC",
      contractMGDCStake: null,
      contractMGDC: [],
      breedAddress: null,
      malContract: null,
      mgdcBalance: null,
      socket: {},
      connectedStatus: "Not connected!",
    };
  },
  async mounted() {
    this.target = this.$route.query.target ? this.$route.query.target : "BAYC";
    await this.init();
    await this.connectWallet();
  },
  computed: {
    ...mapGetters([
      "chatId",
      "messages",
      "conversations",
      "account",
      "mgdcs",
      "profileIsLoading",
    ]),
  },
  methods: {
    clearError() {
      this.errorMsg = null;
    },

    async init() {
      await this.loadWeb3();
      window.ethereum.on("accountsChanged", function () {
        location.reload();
      });
      window.ethereum.on("networkChanged", function () {
        location.reload();
      });

      if (this.account) {
        this.socket = await new WebSocket(process.env.VUE_APP_SW_URL);

        this.socket.onopen = () => {
          console.log("Websocket connected.");
          this.connectedStatus = "Connected";
          this.sendMessage({ action: "setOnline", address: this.account });
        };

        this.socket.onmessage = async (event) => {
          const messageJson = JSON.parse(event.data);

          if (
            messageJson &&
            messageJson.message &&
            (messageJson.message.indexOf("MGDC HAS MATCH:") > -1 ||
              messageJson.message.indexOf("MGDC HAS BREED: ")) > -1
          ) {
            this.$store.commit("SET_MESSAGES", []);
            await this.$store.dispatch("getBreedMgdcs", this.accountID);
            await this.$store.dispatch("getMeessages", this.chatId);
            await this.$refs.breedSidebar.onSelect(this.conversations[0], true);
          }
          const msg = {
            type: "text",
            author: messageJson.from,
            data: { text: messageJson.message },
          };
          this.$store.commit("SET_MESSAGE", msg);
        };
      }
    },

    async sendMessage(message) {
      let msg = JSON.stringify(message);
      if (this.socket.readyState !== this.socket.OPEN) {
        try {
          await this.waitForOpenConnection(this.socket);
          this.socket.send(msg);
          this.localUpdate(message);
        } catch (err) {
          console.error(err);
        }
      } else {
        this.socket.send(msg);
        this.localUpdate(message);
      }
    },
    localUpdate(message) {
      const msg = {
        type: "text",
        author: `me`,
        data: { text: message.message },
      };
      this.$store.commit("SET_MESSAGE", msg);
    },

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
      this.$store.commit("SET_PROFILE_IS_LOADING", true);
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);

        if (this.accountID)
          this.wlClaimed = await this.contractMGDC.methods
            .whiteListClaimed(this.accountID)
            .call();

        window.ethereum.on("accountsChanged", function () {
          location.reload();
        });
        window.ethereum.on("networkChanged", function () {
          location.reload();
        });
        this.$store.commit("SET_PROFILE_IS_LOADING", false);
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        this.$store.commit("SET_PROFILE_IS_LOADING", false);
        this.errorMsg =
          "Non-Ethereum browser detected. You should consider trying MetaMask !";
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
      if (networkId != process.env.VUE_APP_CHAIN_ID) {
        this.errorMsg = `Please change to ${process.env.VUE_APP_CHAIN_NAME}`;
        this.isTinderLoading(false);
        return;
      }

      this.contract =
        this.target === "HAPE"
          ? new web3.eth.Contract(breedhape, process.env.VUE_APP_BREED_HAPE)
          : new web3.eth.Contract(breed, process.env.VUE_APP_BREED_BAYC);

      this.malContract =
        this.target === "HAPE"
          ? new web3.eth.Contract(hape, process.env.VUE_APP_HAPE)
          : new web3.eth.Contract(bayc, process.env.VUE_APP_BAYC);

      this.contractMGDCStake = new web3.eth.Contract(
        mgdcstake,
        process.env.VUE_APP_MGDC_STAKE
      );

      this.contractMGDC = new web3.eth.Contract(MGDC, process.env.VUE_APP_MGDC);
    },
    async setWallet(address) {
      this.accountID = address.toLowerCase();
      this.$store.commit("SET_ACCOUNT", address);
      this.notAllowed = false;
      this.accountBalance = await window.web3.eth.getBalance(this.accountID);
      await this.init();
    },
    async connectWallet() {
      this.$store.commit("SET_PROFILE_IS_LOADING", true);
      console.log("Connect to wallet");
      const web3js = window.web3;
      if (typeof web3js !== "undefined") {
        this.web3 = new Web3(web3js.currentProvider);
        const accounts = await window.ethereum
          .request({
            method: "eth_requestAccounts",
          })
          .catch((err) => {
            this.errorMsg = err.message;
          });
        await this.setWallet(accounts[0]);

        this.mgdcBalance = await this.contractMGDC.methods
          .balanceOf(this.accountID)
          .call();
        if (this.mgdcBalance == 0) {
          this.errorMsg = `You do not have MGDC yet. You can buy it here:`;
          this.$store.commit("SET_PROFILE_IS_LOADING", false);
        } else {
          const mgdcs = [];
          for (let index = 0; index < this.mgdcBalance; index++) {
            const id = await this.contractMGDC.methods
              .tokenOfOwnerByIndex(this.accountID, index)
              .call();

            if (id) {
              const mgdc = {};
              mgdc.id = id;
              if (this.target === "BAYC") {
                mgdc.hasBreed = await this.contract.methods.hasBreed(id).call();
                mgdc.isListed = await this.contract.methods.MGDCisBreeding(id).call();
              }
              mgdcs.push(mgdc);
              this.$store.commit("SET_MGDCS", mgdcs);
            }
          }
          await this.$store.dispatch("getBreedMgdcs", this.accountID);
          await this.$store.dispatch("getMeessages", this.chatId);
        }

        console.log("wlClaimed " + this.wlClaimed);
      } else {
        // web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')) GANACHE FALLBACK
        this.errorMsg = "Unable to connect to Metamask";
      }
    },
    async listMgdc(payload) {
      const { id, token } = payload;
      const web3 = window.web3;
      const networkId = await web3.eth.net.getId();
      if (networkId != process.env.VUE_APP_CHAIN_ID) {
        this.errorMsg = `Please change to ${process.env.VUE_APP_CHAIN_NAME}`;
        return;
      }
      try {
        if (token === "eth") {
          await this.contract.methods.listBreeding(id).send({
            from: this.accountID,
            value: "250000000000000000",
          });
        } else {
          if (this.target === "HAPE") {
            const breedPrice = await this.contract.methods.breedPrice().call();
            await this.contractMGDCStake.methods
              .approve(
                process.env.VUE_APP_BREED_HAPE,
                web3.utils.toWei(breedPrice.toString(), "ether")
              )
              .send({
                from: this.accountID,
              });
            await this.contract.methods.listBreedingWithMGDCToken(id).send({
              from: this.accountID,
            });
          }
        }

        this.minted = true;
        this.isMinting = false;
      } catch (err) {
        console.log("error:", err.message);
        this.errorMsg = err.message;
        this.isMinting = false;
      }
    },
    async mint(e) {
      this.isMinting = true;
      e.preventDefault();

      if (this.accountID === "") {
        this.errorMsg = "Please connect wallet first!";
        this.isMinting = false;
        return;
      } else if (this.accountBalance <= this.nftPrice * this.nftsCountToMint) {
        this.isMinting = false;
        this.errorMsg = `Insufficient funds`;
        return;
      }

      this.isActive = await this.contract.methods.isActive().call();
      this.isPresaleActive = await this.contract.methods.isPresaleActive().call();
      console.log("isActive : ", this.isActive);
      console.log("isPresaleActive : ", this.isPresaleActive);

      if (!this.isActive) {
        this.isMinting = false;
        this.errorMsg = "Sale is not active yet!";
        return;
      }

      const noOfTokens = this.nftsCountToMint;
      console.log("nftPrice : ", this.nftPrice);
      if (this.isPresaleActive == true) {
        this.whiteListMaxMint = await this.contract.methods.WHITELIST_MAX_MINT().call();
        this.wlClaimed = parseInt(
          await this.contractMGDC.methods.whiteListClaimed(this.accountID).call()
        );

        if (this.wlClaimed + this.nftsCountToMint > this.whiteListMaxMint) {
          this.errorMsg = `Already minted ${this.wlClaimed} but max is ${this.whiteListMaxMint}`;
          this.notAllowed = true;
          this.isMinting = false;
          return;
        }

        console.log("whiteListMaxMint : ", this.whiteListMaxMint);
        if (noOfTokens < 1 || noOfTokens == undefined) {
          this.errorMsg = "Select at least 1 NFT!";
        } else if (noOfTokens > this.whiteListMaxMint) {
          this.errorMsg = "Buy limit for presale is : " + this.whiteListMaxMint;
          this.notAllowed = true;
          this.isMinting = false;
        } else if (this.totalSupply >= this.totalTokens) {
          this.errorMsg = "Sold out!";
        } else {
          const proof = await this.GetMerkleProof(this.accountID);
          if (proof.length == 0) {
            this.errorMsg = "This wallet is not whitelisted";
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
                this.errorMsg = "Transaction Error";
                this.isMinting = false;
              });
            this.minted = true;
            console.log("Test :", result);
          }
        }
      } else {
        if (noOfTokens < 1 || noOfTokens == undefined) {
          this.errorMsg = "Select at least 1 NFT!";
        } else if (this.totalSupply >= this.currentSupply) {
          this.errorMsg = "Sold out!";
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
              this.errorMsg = "Transaction Error";
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
  min-height: 0;
}
@media screen and (max-width: $layout-breakpoint-medium) {
  .mintCard {
    padding: 25px;
    border-radius: 0px;
    // min-height: 100vh;
    width: 100%;
  }
}

.breedCard {
  border-radius: 50px;
  width: 50%;
  max-width: 1200px;
  max-height: 960px;
  overflow: auto;
  margin: auto;
  margin-top: 100px;
  padding: 25px 0;
  background: linear-gradient(180deg, #e56932 0%, #ba3474 83.74%, #9b3782 100%);
  box-shadow: 0 0 20px #e56932;
  //border: 5px solid #e56932;
  z-index: 1000;
}
@media screen and (max-width: $layout-breakpoint-medium) {
  .breedCard {
    padding: 25px;
    border-radius: 0px;
    width: 100%;
    margin-top: 0px;
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
    font-size: 16px;
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
.switch {
  position: fixed;
  top: 25px;
  right: 20px;
  z-index: 1;
}

.spinner {
  animation: rotate 2s linear infinite;
  z-index: 2;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -25px 0 0 -25px;
  width: 50px;
  height: 50px;

  & .path {
    stroke: pink;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }
}
</style>
