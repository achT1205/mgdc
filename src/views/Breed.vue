<template>
  <div class="page">
    <div class="viewContainer mint mt-5">
      <div class="switch">
        <switcher />
      </div>
      <div class="profile-avatar" v-if="profile" @click="showprofiles">
        <img :src="profile.url" />
      </div>
      <div class="profile-modal" v-show="show">
        <div>
          <a title="Close" class="modal-close" @click="show = false">
            <i class="fas fa-times-circle close"></i>
          </a>
          <div class="form-group">
            <h4>Select a profile :</h4>
            <br />
            <div>
              <label v-for="item in profiles" :key="item.id">
                <input
                  type="radio"
                  :id="'id_' + item.id"
                  name="profiles"
                  :value="item.id"
                  @click="selectProfile(item)"
                  hidden="true"
                />
                <label
                  class="chip"
                  :for="'id_' + item.id"
                  :class="item.id == profile.id ? 'active-chip' : ''"
                >
                  <div class="chip-head">
                    <img :src="item.url" />
                  </div>
                  <div class="chip-content">#{{ item.id }}</div>
                  <div class="chip-close">
                    <svg
                      v-show="profile.id == item.id"
                      class="chip-svg"
                      focusable="false"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path
                        d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
                      />
                    </svg>
                  </div>
                </label>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="mintCard">
        <p class="title1 mintTitle">MGDC breed</p>
        <p class="text howMa">
          Find your partner

          <button
            class="search-btn"
            :class="showSearch ? 'active' : ''"
            @click="toggleSearch"
          >
            <i class="fas fa-search fa-sm"></i>
          </button>
        </p>
        <div class="modal-body">
          <div class="search" :class="showSearch ? 'show' : ''">
            <label>Search</label>
            <input
              type="text"
              ref="search"
              v-model="search"
              placeholder="Search by ID"
              @keydown.enter="filter"
            />
            <i class="fas fa-times-circle close clean-search" @click="search = null"></i>
          </div>
        </div>
        <button class="connectButton" @click="connectWallet">
          {{
            account === null || !account
              ? "Connect wallet"
              : account.substring(1, 9) + "..." + account.substring(account.length - 6)
          }}
        </button>
      </div>

      <Tinder
        :source="freeMgdcs"
        @addMatch="addMatch"
        v-if="freeMgdcs && freeMgdcs.length > 0"
        :breedContract="breedContract"
        @isTinderLoading="isTinderLoading"
        ref="mgdcTinder"
      />
    </div>

    <img class="redlip22" :src="require(`@/assets/imgs/redlip-2@1x.png`)" />
    <img class="coin22" :src="require(`@/assets/imgs/coin-5@1x_cut.png`)" />
    <breed-sidebar @breed="breed" ref="breedSidebar" />
    <chat @sendMessage="sendMessage" v-if="maleBalance > 0" />

    <div
      id="overlay"
      v-show="isLoading || isMatching || errorMsg"
      class="w-full no-nodes-content flex justify-center items-center"
    >
      <svg
        class="spinner"
        viewBox="0 0 50 50"
        v-if="!errorMsg && (isLoading || isMatching)"
      >
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
      <div class="warnning-notification" v-if="errorMsg && !isLoading">
        <div class="warnning-notification-logo-wrapper">
          <i class="fas fa-triangle-exclamation warnning"></i>
        </div>
        <div class="warnning-notification-content">
          <h4 class="warnning-notification-title">
            {{ errorMsg }}
            <span v-if="maleBalance == 0">
              <a
                href="https://opensea.io/collection/boredapeyachtclub"
                target="_blank"
                class="buy-bn"
                >Buy BAYC</a
              >
              or
              <a href="https://opensea.io/collection/hapeprime" target="_blank" class="buy-bn"
                >Buy an HAPE</a
              >
            </span>
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
import breed from "../abis/breed.json";
import MGDC from "../abis/mgdc.json";
import bayc from "../abis/bayc.json";
import hape from "../abis/hape.json";
import BreedSidebar from "@/components/BreedSidebar.vue";
import Switcher from "../components/Switcher.vue";
import Chat from "@/components/Chat.vue";
import Tinder from "@/components/TinderComponent.vue";
import Web3 from "web3";
//import axios from "axios";
import { mapGetters } from "vuex";

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
      accountBalance: 0,
      maleContract: null,
      maleBalance: null,
      breedContract: null,
      breedAddress: null,
      target: "BAYC",
      selectepHape: null,
      isLoading: false,
      errorMsg: null,
      socket: {},
      contractMGDC: null,
      connectedStatus: "Not connected!",
      maleSymbol: null,
      show: false,
      showSearch: false,
      search: "",
    };
  },
  computed: {
    ...mapGetters([
      "freeMgdcs",
      "chatId",
      "messages",
      "conversations",
      "account",
      "isMatching",
      "profile",
      "profiles",
      "curremgdc",
    ]),
  },
  watch: {
    curremgdc(val) {
      if (val) {
        //this.$store.commit("SET_FREE_MGDCS", [val]);
        this.$refs.mgdcTinder.clearn();
        this.$refs.mgdcTinder.filtered(val);
      }
    },
    search(val) {
      if (!val || val.length === 0) {
        this.$store.dispatch("fetchFreeMgdcs");
        this.$refs.mgdcTinder.clearn();
        this.$refs.mgdcTinder.mock();
      }
    },
  },
  async mounted() {
    this.target = this.$route.query.target ? this.$route.query.target : "BAYC";
    // if(this.target === "HAPE"){
    //   this.target = "BAYC"
    // }
    await this.init();
  },
  methods: {
    toggleSearch() {
      this.showSearch = !this.showSearch;
      if (!this.showSearch) {
        this.search = null;
      }
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
        this.sendMessage({ action: "setOnline", address: this.account });
      };

      this.socket.onmessage = (event) => {
        const messageJson = JSON.parse(event.data);
        const msg = {
          type: "text",
          author: messageJson.from,
          data: { text: messageJson.message },
        };
        this.$store.commit("SET_MESSAGE", msg);
      };

      this.$store.dispatch("fetchFreeMgdcs");
      await this.connectWallet();
    },
    showprofiles() {
      if (this.profiles && this.profiles.length) this.show = true;
    },
    selectProfile(profile) {
      this.$store.commit("SET_PROFILE", profile);
    },
    clearError() {
      this.errorMsg = null;
      this.isTinderLoading(false);
      this.loading = false;
    },
    async loadWeb3() {
      this.isLoading = true;
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);

        window.ethereum.on("accountsChanged", async (accounts) => {
          this.$store.commit("SET_ACCOUNT", accounts[0]);
          await this.fetchData();
        });
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        this.errorMsg =
          "Non-Ethereum browser detected. You should consider trying MetaMask !";
      }
      await this.loadContractData();
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

      this.breedContract = new web3.eth.Contract(breed, this.breedAddress);

      this.maleContract =
        this.target === "HAPE"
          ? new web3.eth.Contract(hape, process.env.VUE_APP_HAPE)
          : new web3.eth.Contract(bayc, process.env.VUE_APP_BAYC);

      this.contractMGDC = new web3.eth.Contract(MGDC, process.env.VUE_APP_MGDC);
    },
    async fetchData() {
      this.notAllowed = false;
      this.$store.dispatch("getMatches", this.account);
      this.$store.dispatch("getConversations", this.account);
      this.$store.dispatch("getMeessages", this.chatId);
      this.$store.dispatch("getProfile", {
        account: this.account,
        maleType: this.target,
      });
      this.$store.dispatch("getProfiles", {
        account: this.account,
        maleType: this.target,
      });
      this.accountBalance = await window.web3.eth.getBalance(this.account);
      this.maleBalance = await this.maleContract.methods.balanceOf(this.account).call();
      this.maleSymbol = await this.maleContract.methods.symbol().call();
      if (this.maleBalance == 0) {
        this.errorMsg = `You do not have neither BAYC nor Hapebeast yet. You can buy one here:`;
      }
      console.log("maleBalance", this.maleBalance);
      this.isTinderLoading(false);
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
        this.$store.commit("SET_ACCOUNT", accounts[0]);
        await this.fetchData();
      } else {
        this.errorMsg = "Unable to connect to Metamask";
      }
    },
    async breed(item) {
      if (this.target === "HAPE") {
        this.errorMsg = `Breeding with Hapebeast is coming soon, stay tuned !`;
        this.$store.commit("SET_IS_MATCHIING", false);
        this.$store.commit("SET_BREEDING", false);
        return;
      }

      const listed = await this.breedContract.methods
        .MGDCisBreeding(parseInt(item.mgdcId))
        .call();
      if (!listed) {
        this.errorMsg = `This MGDC is not listed yet`;
        return;
      }
      try {
        await this.breedContract.methods.breed(item.mgdcId).send({
          from: this.account,
          value: "250000000000000000",
        });
        await this.$store.dispatch("breed", {
          account: this.account,
          mgdcId: item.mgdcId,
          mgdcName: item.mgdcName,
          hasBreed: true,
        });

        const msg = `MGDC HAS BREED: Your MGDC ${item.mgdcName} has been breeded by ${item.owner}`;
        const conversation = {
          action: "sendMessage",
          chatId: item.chatId,
          message: msg,
          from: this.account,
          to: item.to,
        };
        await this.sendMessage(conversation);

        this.$store.commit("SET_BREEDING", false);
      } catch (err) {
        console.log("error:", err.message);
        this.errorMsg = err.message;
        this.$store.commit("SET_BREEDING", false);
      }
    },
    selectHape(hape) {
      this.selectepHape = hape;
    },
    async addMatch(mgdc) {
      const web3 = window.web3;
      const networkId = await web3.eth.net.getId();
      if (networkId != process.env.VUE_APP_CHAIN_ID) {
        this.errorMsg = `Please change to ${process.env.VUE_APP_CHAIN_NAME}`;
        this.$store.commit("SET_IS_MATCHIING", false);
        return;
      }
      if (this.maleBalance == 0) {
        this.errorMsg = `You do not have neither BAYC nor Hapebeast yet. You can buy one here:`;
        this.$store.commit("SET_IS_MATCHIING", false);
        return;
      }
      try {
        let owner = await this.contractMGDC.methods.ownerOf(parseInt(mgdc.id)).call();

        owner = owner.toLowerCase();
        if (owner !== null) {
          this.$store.commit("SET_MESSAGES", []);

          await this.$store.dispatch("addMatch", {
            from: this.account,
            to: owner,
            mgdcId: parseInt(mgdc.id),
            mgdcName: mgdc.name,
            maleType: this.maleSymbol,
            maleUrl: this.profile.url,
            maleId: this.profile.id,
          });

          const message = `MGDC HAS MATCH: You have a new match, you can start a conversation in order to know more about your "ape soeur"`;
          const conversation = {
            action: "sendMessage",
            chatId: this.chatId,
            message: message,
            from: this.account,
            to: owner,
          };

          await this.sendMessage(conversation);
          const conversations = [];
          conversations.push({
            chatId: this.chatId,
            to: owner,
            from: this.account,
            mgdcId: parseInt(mgdc.id),
            mgdcName: mgdc.name,
          });
          this.$store.commit("SET_CONVERSAIONS", conversations);
          this.$store.commit("SET_IS_MATCHIING", false);
          await this.$refs.breedSidebar.onSelect(conversations[0], true);
        }
      } catch (error) {
        console.log("error ==> ", error);
        this.errorMsg = "This token does not have an owner yet, you can choose another.";
        this.$store.commit("SET_IS_MATCHIING", false);
      }
    },
    waitForOpenConnection() {
      return new Promise((resolve, reject) => {
        const maxNumberOfAttempts = 10;
        const intervalTime = 200;

        let currentAttempt = 0;
        const interval = setInterval(() => {
          if (currentAttempt > maxNumberOfAttempts - 1) {
            clearInterval(interval);
            reject(new Error("Maximum number of attempts exceeded."));
          } else if (this.socket.readyState === this.socket.OPEN) {
            clearInterval(interval);
            resolve();
          }
          currentAttempt++;
        }, intervalTime);
      });
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
    isTinderLoading(loading) {
      this.isLoading = loading;
    },
    async filter() {
      console.log("this.search)", this.search);
      await this.$store.dispatch("getMgdc", this.search);
    },
  },
};
</script>

<style scoped lang="scss">
.active-chip {
  border: 1px solid #eea1c5 !important;
}

.chip {
  display: inline-flex;
  flex-direction: row;
  background: rgba(130, 18, 70, 0.8);
  border: none;
  cursor: default;
  height: 36px;
  outline: none;
  padding: 0;
  font-size: 14px;
  font-color: #333333;
  font-family: "Open Sans", sans-serif;
  white-space: nowrap;
  align-items: center;
  border-radius: 16px;
  vertical-align: middle;
  text-decoration: none;
  justify-content: center;
}
.chip-head {
  display: flex;
  position: relative;
  overflow: hidden;
  background-color: #32c5d2;
  font-size: 1.25rem;
  flex-shrink: 0;
  align-items: center;
  user-select: none;
  border-radius: 50%;
  justify-content: center;
  width: 36px;
  color: #fff;
  height: 36px;
  font-size: 20px;
  margin-right: -4px;
}
.chip-content {
  cursor: inherit;
  display: flex;
  align-items: center;
  user-select: none;
  white-space: nowrap;
  padding-left: 12px;
  padding-right: 12px;
}
.chip-svg {
  color: pink;
  cursor: pointer;
  height: auto;
  margin: 4px 4px 0 -8px;
  fill: currentColor;
  width: 1em;
  height: 1em;
  display: inline-block;
  font-size: 24px;
  transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  user-select: none;
  flex-shrink: 0;
}
.chip-svg:hover {
  color: #666666;
}

.chip-close {
  margin-top: 10px;
}

.chip img {
  float: left;
  margin: 0;
  height: 40px;
  width: 46px;
  border-radius: 50%;
}

.switch {
  position: fixed;
  top: 20px;
  right: 85px;
  z-index: 1;
}

.profile-modal {
  position: fixed;
  background-color: rgba(255, 255, 255, 0.25);
  top: 140px;
  right: 162px;
  z-index: 999;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s;
  visibility: visible;
  opacity: 1;
  pointer-events: auto;
  & > div {
    width: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    background: linear-gradient(180deg, #e56932 0%, #ba3474 83.74%, #9b3782 100%);
    box-shadow: 0 0 20px #e56932;
  }
  header {
    font-weight: bold;
  }
  h1 {
    font-size: 150%;
    margin: 0 0 15px;
  }
}

.form-group {
  & > div {
    height: 100px;
    overflow: scroll;
  }
}

.modal-close {
  color: #aaa;
  font-size: 80%;
  position: absolute;
  right: -24px;
  text-align: center;
  top: -10px;
  width: 70px;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    color: black;
  }
  .close {
    color: white;
  }
}

.profile-modal {
  z-index: 1000;
  & > div {
    border-radius: 1rem;
  }
}
</style>

<style lang="scss">
.profile-avatar {
  max-width: 50px;
  width: 100%;
  border-radius: 100%;
  border: 2px solid #edf4f6;
  img {
    max-width: 50px;
    display: block;
    width: 100%;
    overflow: hidden;
    border-radius: 100%;
  }
}
.page {
  background: linear-gradient(180deg, #edbcad 1.31%, #f0d0df 27.36%, #edb8ed 56.4%);
}

.profile-avatar {
  position: fixed;
  top: 5px;
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

.buy-bn {
  font-family: var(--font-family-acme);
  border-radius: 15px;
  border: 2px solid pink;
  background-color: transparent;
  color: pink;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 3px;
  opacity: 0.85;
  transition: all 100ms ease-in-out;
  cursor: pointer;
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

.close {
  color: #000;
  font-size: 20px;
  margin-left: 10px;
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

.search-btn {
  background: none;
  border: 2px solid #fff;
  border-radius: 100%;
  width: 29px;
  text-align: center;
  height: 29px;
}
.search-btn.active {
  opacity: 1;
  transform: translateY(-1px);
  box-shadow: 0px 0px 7px 0px #ffffff;
}

.modal-body {
  width: 100%;
  color: #000000;
  .search {
    border-radius: 18px;
    margin-left: 25%;
    width: 50%;
    padding: 20px 12px 20px;
    position: relative;
    background: #edf4f6;
    display: none;
    label {
      background: #edf4f6;
      position: absolute;
      top: 12px;
      left: 21px;
      padding: 0 5px;
    }
    input {
      border: 1px solid #a0367f;
      height: 35px;
      border-radius: 3px;
      width: 100%;
      background: transparent;
    }
  }
  .search.show {
    display: block;
  }
  .clean-search {
    position: absolute;
    margin-left: -22px;
    margin-top: 8px;
  }
}
</style>
