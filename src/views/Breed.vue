<template>
  <div class="page">
    <div class="viewContainer mint mt-5">
      <div class="switch">
        <switcher @changeSmartcontract="changeSmartcontract" />
      </div>
      <div class="mintCard">
        <p class="title1 mintTitle">MGDC breed</p>
        <p class="text howMa">Find your partner</p>
        <button class="connectButton" @click="connectWallet">
          {{
            account === ""
              ? "Connect wallet"
              : account.substring(1, 9) + "..." + account.substring(account.length - 6)
          }}
        </button>
        <div v-if="hapes && hapes.length > 0">
          <div
            class="chip"
            :class="selectepHape && selectepHape.id === hape.id ? 'selected-chip' : ''"
            v-for="hape in hapes"
            :key="hape.id"
            @click="selectHape(hape)"
          >
            <img :src="hape.image" alt="Person" width="96" height="96" />
            {{ hape.name }}
            <i
              v-if="selectepHape && selectepHape.id === hape.id"
              class="fas fa-circle-check checked"
            ></i>
          </div>
        </div>
      </div>

      <Tinder
        :source="freeMgdcs"
        @addMatch="addMatch"
        v-if="hapeBalance > 0 && freeMgdcs && freeMgdcs.length > 0"
      />
    </div>

    <img class="redlip22" :src="require(`@/assets/imgs/redlip-2@1x.png`)" />
    <img class="coin22" :src="require(`@/assets/imgs/coin-5@1x_cut.png`)" />
    <breed-sidebar @breed="breed" />
    <chat v-if="hapeBalance > 0" />

    <div
      id="overlay"
      v-show="isLoading || errorMsg"
      class="w-full no-nodes-content flex justify-center items-center"
    >
      <svg class="spinner" viewBox="0 0 50 50" v-if="!errorMsg && isLoading">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
      <div class="warnning-notification" v-if="errorMsg && !isLoading">
        <div class="warnning-notification-logo-wrapper">
          <i class="fas fa-triangle-exclamation warnning"></i>
        </div>
        <div class="warnning-notification-content">
          <h4 class="warnning-notification-title">{{ errorMsg }}</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import breed from "../abis/breed.json";
import breedhape from "../abis/breedhape.json";
import MGDC from "../abis/mgdc.json";
import bayc from "../abis/bayc.json";
import hape from "../abis/hape.json";
import BreedSidebar from "@/components/BreedSidebar.vue";
import Switcher from "../components/Switcher.vue";
import Chat from "@/components/Chat.vue";
import Tinder from "@/components/TinderComponent.vue";
import Web3 from "web3";
import axios from "axios";
import { mapGetters } from "vuex";

// import axios from "axios";

export default {
  name: "Breed",
  components: {
    BreedSidebar,
    Switcher,
    Chat,
    Tinder,
  },
  data() {
    return {
      address: "",
      account: "",
      accountBalance: 0,
      abi: [],
      baycAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      hapeAddress: "0x4Db1f25D3d98600140dfc18dEb7515Be5Bd293Af",
      hapeContract: "",
      hapeBalance: null,
      target: "BAYC",
      hapes: [],
      selectepHape: null,
      isLoading: false,
      errorMsg: null,
      wsConnection: null,
    };
  },
  computed: {
    ...mapGetters(["freeMgdcs"]),
  },
  async created() {
    await this.loadWeb3();
    window.ethereum.on("accountsChanged", function () {
      location.reload();
    });
    window.ethereum.on("networkChanged", function () {
      location.reload();
    });
    this.startConnetion();
  },
  async mounted() {
    this.$store.dispatch("fetchFreeMgdcs");
    await this.connectWallet();
  },
  methods: {
    async loadWeb3() {
      this.isLoading = true;
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);

        window.ethereum.on("accountsChanged", async (accounts) => {
          await this.fetchData(accounts[0]);
        });
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        this.isLoading = false;
      } else {
        this.isLoading = false;
        this.errorMsg =
          "Non-Ethereum browser detected. You should consider trying MetaMask !";
      }

      await this.loadContractData(this.target);
      // setInterval(
      //   function () {
      //     this.loadContractData(this.target);
      //   }.bind(this),
      //   1000
      // );
    },
    async loadContractData(target) {
      const web3 = window.web3;
      const networkId = await web3.eth.net.getId();

      if (networkId !== breed.network) {
        this.errorMsg = "Please change to ethereum mainnet.";
        return;
      }

      this.contract = new web3.eth.Contract(
        breed.abi,
        target === "HAPE" ? breedhape.address : breed.address
      );
      this.hapeContract =
        target === "HAPE"
          ? new web3.eth.Contract(hape, this.hapeAddress)
          : new web3.eth.Contract(bayc, this.baycAddress);

      this.contractMGDC = new web3.eth.Contract(MGDC.abi, MGDC.address);

      this.contract.events
        .TransferSingle({ filter: { operator: this.account } })
        .on("data", function (event) {
          const data = event.returnValues;
          console.log(data);
          this.$store.dispatch("updateMatch", {
            account: this.account,
            id: this.currentItem.id,
            hasBreed: true,
          });
        })
        .on("error", console.error);
    },
    async fetchData(address) {
      this.hapes = [];
      if (address) this.account = "0xf6F6bE2Ceb02DB9953BA9394DC5ee7dcE1fCbbeD"; //address;
      this.notAllowed = false;
      this.accountBalance = await window.web3.eth.getBalance(this.account);
      this.hapeBalance = await this.hapeContract.methods.balanceOf(this.account).call();
      if (this.hapeBalance) {
        let count = this.hapeBalance;
        for (let index = 0; index < count; index++) {
          const hapeId = await this.hapeContract.methods
            .tokenOfOwnerByIndex(this.account, index)
            .call();

          const uri = await this.hapeContract.methods.tokenURI(hapeId).call();
          const resp = await axios.get(uri.replace("ipfs://", "https://ipfs.io/ipfs/"));
          const image = resp.data.image.replace("ipfs://", "https://ipfs.io/ipfs/");

          this.hapes.push({
            id: hapeId,
            image: image,
            name: `${this.target} #${hapeId}`,
          });
          if (this.hapes && this.hapes.length) {
            this.selectepHape = this.hapes[0];
          }
        }
        this.isLoading = false;
      }
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
        await this.fetchData(accounts[0]);
      } else {
        this.errorMsg = "Unable to connect to Metamask";
      }
    },
    async breed(item) {
      this.currentItem = item;
      await this.contract.methods
        .breed(item.id)
        .send({
          from: this.account,
          value: "250000000000000000",
        })
        .on("receipt", function (res) {
          console.log("Receipt :", res);
        })
        .on("error", function (err) {
          console.log("error:" + err);
          alert("Transaction Error");
        });
    },

    async changeSmartcontract(target) {
      this.target = target;
      await this.loadContractData(target);
      await this.fetchData();
    },
    selectHape(hape) {
      this.selectepHape = hape;
    },
    async addMatch(mgdc) {
      const hapeprofile =
        this.selectepHape && this.selectepHape.id
          ? this.selectepHape
          : this.hapes.length > 0
          ? this.hapes[0]
          : null;
      if (hapeprofile) {
        const owner = await this.hapeContract.methods.ownerOf(mgdc.id).call();

        this.$store.dispatch("addMatch", { id: mgdc.id, name: mgdc.name });
        this.sendMessage({
          from: {
            account: this.account,
            tokenId: this.selectepHape.id,
            name: this.selectepHape.name,
          },
          to: { account: owner, tokenId: mgdc.id, name: mgdc.name },
        });
      }
    },
    sendMessage(message) {
      this.wsConnection.send(message);
    },
    startConnetion() {
      this.wsConnection = new WebSocket(
        "wss://da42imq2q2.execute-api.eu-west-3.amazonaws.com/dev"
      );
      this.wsConnection.onmessage = (event) => {
        console.log("onmessage", event);
      };
      this.wsConnection.onopen = (event) => {
        console.log(event);
        this.sendMessage({ action: "setOnline", address: this.account });
      };
    },
  },
};
</script>

<style lang="scss">
.page {
  background: linear-gradient(180deg, #edbcad 1.31%, #f0d0df 27.36%, #edb8ed 56.4%);
}

.switch {
  position: fixed;
  top: 25px;
  right: 20px;
  z-index: 1;
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

.mint.mt-5 {
  padding-top: 10vh;
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
  z-index: 2;
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

.chip {
  display: inline-block;
  padding: 0 25px;
  height: 50px;
  font-size: 16px;
  line-height: 50px;
  border-radius: 25px;
  background-color: pink;
  margin: 5px;
  cursor: pointer;
}

.selected-chip {
  color: pink;
  background-color: #f1f1f1;
}

.checked {
  color: pink;
  margin-left: 3px;
}

.chip img {
  float: left;
  margin: 0 10px 0 -25px;
  height: 50px;
  width: 50px;
  border-radius: 50%;
}

.warnning-notification {
  display: flex;
  min-width: 24rem;
  margin: 0 auto;
  padding: 1rem;
  position: absolute;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 10%), 0 10px 10px -5px rgb(0 0 0 / 4%);
  align-items: center;
    /* justify-content: center; */
  bottom: 15px;
  left: 15px;
}
.warnning-notification-logo-wrapper {
  flex-shrink: 0;
}
.warnning-notification-logo {
  height: 3rem;
  width: 3rem;
}
.warnning-notification-content {
  margin-left: 1.5rem;
  padding-top: 0.25rem;
}
.warnning-notification-title {
  color: #1a202c;
  font-size: 1.25rem;
  line-height: 1.25;
}
.warnning-notification-message {
  color: #718096;
  font-size: 1rem;
  line-height: 1.5;
}
#overlay {
  position: fixed; /* Sit on top of the page content */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Black background with opacity */
  z-index: 2000; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
}

.warnning {
  color: #e56932;
  font-size: 32px;
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

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
