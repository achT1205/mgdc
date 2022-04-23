<template>
  <div class="page">
    <div class="viewContainer mint">
      <div class="switch">
        <switcher @changeSmartcontract="changeSmartcontract" />
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
        <div class="text nbNft" style="margin-bottom: 25px">
          Owned MGDC : {{ mgdcBalance }}
        </div>
        <div class="contentTeam ct2">
          <BreedCard
            v-for="(item, i) in MGDC"
            :key="'b' + i"
            :profOrBreed="'prof'"
            :id="item.token_id"
            :breed="item.hasBreed"
            :listed="item.isListed"
            :pic="item.metadata ? item.metadata : ''"
            :token="item.token_id"
          />
        </div>
      </div>

      <!-- <div class="mintCard">
        <div class="viewContainer team" v-for="item in MGDC" :key="item.token_id">
          ID : {{ item.token_id }}
          <br />
          <br />
          Has breeded : {{ item.hasBreed ? "true" : "false" }}
          <br />
          <br />
          Is Listed to breed : {{ item.isListed ? "true" : "false" }}
          <br />
          <br />
          <div class="teamMember">
            <div class="picContainer"><img class="pic" data-v-16dd8cbd :src="item.metadata ? item.metadata : ''" /></div>
            <button class="connectButton" @click="list(item.token_id)">{{ item.isListed ? "Already Listed" : "List on Tinder-Ape" }}</button>
          </div>
          <br />
          <br />
        </div>
      </div> -->
    </div>
    <img class="redlip22" :src="require(`@/assets/imgs/redlip-2@1x.png`)" />
    <img class="coin22" :src="require(`@/assets/imgs/coin-5@1x_cut.png`)" />
    <breed-sidebar :profile="true" />
    <chat @sendMessage="sendMessage" v-if="mgdcBalance > 0" />
    <div
      id="overlay"
      v-show="errorMsg"
      class="w-full no-nodes-content flex justify-center items-center"
    >
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
import MGDC from "../abis/mgdc.json";
import bayc from "../abis/bayc.json";
import hape from "../abis/hape.json";
import address from "../address/address.json";
import Moralis from "moralis";
import axios from "axios";
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
      target: null,
      MGDC: [
        // {
        //   token_address: "0x0191c41dbceb20a612b25137133ca719e84f7933",
        //   token_id: "4969",
        //   block_number_minted: "14074267",
        //   owner_of: "0x71523b03385e24fca2671413b409e394fc5364ae",
        //   block_number: "14074267",
        //   amount: "1",
        //   contract_type: "ERC721",
        //   name: "Meta Gold Digger Club",
        //   symbol: "MGDC",
        //   token_uri: null,
        //   metadata: "https://ipfs.io/ipfs/QmTfwEP88ENMUvMjgBqJq1wHUXPcvjKRNsu7fpryrVAWtA",
        //   synced_at: null,
        //   is_valid: 0,
        //   syncing: 1,
        //   frozen: 0,
        //   hasBreed: false,
        //   isListed: false,
        // },
        // {
        //   token_address: "0x0191c41dbceb20a612b25137133ca719e84f7933",
        //   token_id: "2",
        //   block_number_minted: "14075098",
        //   owner_of: "0x71523b03385e24fca2671413b409e394fc5364ae",
        //   block_number: "14075098",
        //   amount: "1",
        //   contract_type: "ERC721",
        //   name: "Meta Gold Digger Club",
        //   symbol: "MGDC",
        //   token_uri: "https://ipfs.moralis.io:2053/ipfs/QmcftsHG5MnNNoAYrHtg93YdgmChCjh35o9yXyoJaBurBR",
        //   metadata: "https://ipfs.io/ipfs/QmTfwEP88ENMUvMjgBqJq1wHUXPcvjKRNsu7fpryrVAWtA",
        //   synced_at: "2022-01-25T13:47:40.635Z",
        //   is_valid: 1,
        //   syncing: 2,
        //   frozen: 0,
        //   hasBreed: false,
        //   isListed: false,
        // },
        // {
        //   token_address: "0x0191c41dbceb20a612b25137133ca719e84f7933",
        //   token_id: "1",
        //   block_number_minted: "14075078",
        //   owner_of: "0x71523b03385e24fca2671413b409e394fc5364ae",
        //   block_number: "14075078",
        //   amount: "1",
        //   contract_type: "ERC721",
        //   name: "Meta Gold Digger Club",
        //   symbol: "MGDC",
        //   token_uri: "https://ipfs.moralis.io:2053/ipfs/QmcftsHG5MnNNoAYrHtg93YdgmChCjh35o9yXyoJaBurBR",
        //   metadata: "https://ipfs.io/ipfs/QmTfwEP88ENMUvMjgBqJq1wHUXPcvjKRNsu7fpryrVAWtA",
        //   synced_at: "2022-01-25T13:43:02.374Z",
        //   is_valid: 1,
        //   syncing: 2,
        //   frozen: 0,
        //   hasBreed: false,
        //   isListed: false,
        // },
        // {
        //   token_address: "0x0191c41dbceb20a612b25137133ca719e84f7933",
        //   token_id: "4969",
        //   block_number_minted: "14074267",
        //   owner_of: "0x71523b03385e24fca2671413b409e394fc5364ae",
        //   block_number: "14074267",
        //   amount: "1",
        //   contract_type: "ERC721",
        //   name: "Meta Gold Digger Club",
        //   symbol: "MGDC",
        //   token_uri: null,
        //   metadata: "https://ipfs.io/ipfs/QmTfwEP88ENMUvMjgBqJq1wHUXPcvjKRNsu7fpryrVAWtA",
        //   synced_at: null,
        //   is_valid: 0,
        //   syncing: 1,
        //   frozen: 0,
        //   hasBreed: false,
        //   isListed: false,
        // },
        // {
        //   token_address: "0x0191c41dbceb20a612b25137133ca719e84f7933",
        //   token_id: "2",
        //   block_number_minted: "14075098",
        //   owner_of: "0x71523b03385e24fca2671413b409e394fc5364ae",
        //   block_number: "14075098",
        //   amount: "1",
        //   contract_type: "ERC721",
        //   name: "Meta Gold Digger Club",
        //   symbol: "MGDC",
        //   token_uri: "https://ipfs.moralis.io:2053/ipfs/QmcftsHG5MnNNoAYrHtg93YdgmChCjh35o9yXyoJaBurBR",
        //   metadata: "https://ipfs.io/ipfs/QmTfwEP88ENMUvMjgBqJq1wHUXPcvjKRNsu7fpryrVAWtA",
        //   synced_at: "2022-01-25T13:47:40.635Z",
        //   is_valid: 1,
        //   syncing: 2,
        //   frozen: 0,
        //   hasBreed: false,
        //   isListed: false,
        // },
        // {
        //   token_address: "0x0191c41dbceb20a612b25137133ca719e84f7933",
        //   token_id: "1",
        //   block_number_minted: "14075078",
        //   owner_of: "0x71523b03385e24fca2671413b409e394fc5364ae",
        //   block_number: "14075078",
        //   amount: "1",
        //   contract_type: "ERC721",
        //   name: "Meta Gold Digger Club",
        //   symbol: "MGDC",
        //   token_uri: "https://ipfs.moralis.io:2053/ipfs/QmcftsHG5MnNNoAYrHtg93YdgmChCjh35o9yXyoJaBurBR",
        //   metadata: "https://ipfs.io/ipfs/QmTfwEP88ENMUvMjgBqJq1wHUXPcvjKRNsu7fpryrVAWtA",
        //   synced_at: "2022-01-25T13:43:02.374Z",
        //   is_valid: 1,
        //   syncing: 2,
        //   frozen: 0,
        //   hasBreed: false,
        //   isListed: false,
        // },
      ],
      contractMGDC: [],
      breedAddress: null,
      malContract: null,
      mgdcBalance: null,
      socket: {},
      connectedStatus: "Not connected!",
    };
  },
  async created() {
    await this.init();
  },
  computed: {
    ...mapGetters(["chatId", "messages", "conversations", "account"]),
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

      this.socket = await new WebSocket(process.env.VUE_APP_SW_URL);

      this.socket.onopen = () => {
        console.log("Websocket connected.");
        this.connectedStatus = "Connected";
        if (this.accountID)
          this.sendMessage({ action: "setOnline", address: this.accountID });
      };

      this.socket.onmessage = (event) => {
        let parsedMessage = JSON.parse(event.data);
        console.log(parsedMessage);
      };
    },

    async sendMessage(message, match) {
      let msg = JSON.stringify(message);
      if (this.socket.readyState !== this.socket.OPEN) {
        try {
          await this.waitForOpenConnection(this.socket);
          this.socket.send(msg);
          this.localUpdate(match, message);
        } catch (err) {
          console.error(err);
        }
      } else {
        this.socket.send(msg);
        this.localUpdate(match, message);
      }
    },
    localUpdate(match, message) {
      if (match) {
        const conversations = [];
        conversations.push({
          chatId: this.chatId,
          to: message.to,
        });
        this.$store.commit("SET_MESSAGES", []);
        this.$store.commit("SET_CONVERSAIONS", conversations);
      }
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
      const serverUrl = "https://jscrvqk2kalm.usemoralis.com:2053/server"; //'https://ttbvxxqntz1v.usemoralis.com:2053/server';
      const appId = "000zXI8oQpWQybSDy0eXKh7OVMYOl6I91SxMetpQ"; //'D8jmxu2Y96KWnah4acDrAKNrxfky8MJ08QKFK9f9';
      Moralis.start({ serverUrl, appId });

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
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        this.errorMsg =
          "Non-Ethereum browser detected. You should consider trying MetaMask !";
      }

      await this.loadContractData(this.target);
      setInterval(
        function () {
          this.loadContractData(this.target);
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

      this.breedAddress =
        this.target === "HAPE"
          ? process.env.VUE_APP_BREED_HAPE
          : process.env.VUE_APP_BREED_BAYC;

      this.contract = new web3.eth.Contract(breed, this.breedAddress);

      this.malContract =
        this.target === "HAPE"
          ? new web3.eth.Contract(hape, process.env.VUE_APP_HAPE)
          : new web3.eth.Contract(bayc, process.env.VUE_APP_BAYC);

      this.contractMGDC = new web3.eth.Contract(MGDC, process.env.VUE_APP_MGDC);
    },
    async setWallet(address) {
      this.accountID = address.toLowerCase();
      this.notAllowed = false;
      this.accountBalance = await window.web3.eth.getBalance(this.accountID);
      await this.init();
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
            this.errorMsg = err.message;
          });
        await this.setWallet(accounts[0]);

        this.mgdcBalance = await this.contractMGDC.methods
          .balanceOf(this.accountID)
          .call();
        if (this.mgdcBalance == 0) {
          this.errorMsg = `Vous n'avez pas encre de MGDC. Vous pouvez en acheter ici :`;
        } else {
          this.$store.dispatch("getMatches", this.accountID);
          this.$store.dispatch("getConversations", this.accountID);
          this.$store.dispatch("getMeessages", this.chatId);
        }

        let result = await Moralis.Web3API.account.getNFTsForContract({
          chain: "Eth",
          address: this.accountID,
          token_address: "0x0191c41DBceB20a612b25137133ca719E84f7933", //change for contract address
        });

        this.MGDC = result.result;

        this.MGDC = this.MGDC.map((e) => {
          if (e.metadata == null) return e;
          e.metadata = JSON.parse(e.metadata).image;

          return e;
        });

        for (var i = 0; i < this.MGDC.length; i++) {
          this.MGDC[i].hasBreed = await this.contract.methods
            .hasBreed(this.MGDC[i].token_id)
            .call();
          this.MGDC[i].isListed = await this.contract.methods
            .MGDCisBreeding(this.MGDC[i].token_id)
            .call();
          let token = await this.contractMGDC.methods
            .tokenURI(this.MGDC[i].token_id)
            .call();
          console.log(token);

          token = await axios.get(token.replace("ipfs://", "https://ipfs.io/ipfs/"));
          console.log("token", token.data.image);
          this.MGDC[i].metadata = token.data.image.replace(
            "ipfs://",
            "https://ipfs.io/ipfs/"
          );
        }
        console.log(this.MGDC);
        console.log("wlClaimed " + this.wlClaimed);
      } else {
        // web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')) GANACHE FALLBACK
        this.errorMsg = "Unable to connect to Metamask";
      }
    },
    async list(token_id) {
      console.log(token_id);

      await this.contract.methods
        .listBreeding(token_id)
        .send({
          from: this.accountID,
          value: "250000000000000000",
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
    },
    //Minting Functionality
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
    async changeSmartcontract(target) {
      this.target = target;
      await this.init();
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
  margin: auto;
  margin-top: 100px;
  padding-top: 50px;
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
.switch {
  position: fixed;
  top: 25px;
  right: 20px;
  z-index: 1;
}
</style>
