<template>
  <div class="page">
    <div class="mint" v-if="mgdcBalance">
      <stack-header @connect="web3Check" />
      <div class="staking-content">
        <div class="col-12">
          <h1>STAKING</h1>
        </div>
        <div class="col-6">
          <stak-card
            :balance="mgdcBalance"
            :stakecontract="contractMGDCStake"
            :mgdccontract="contractMGDC"
            :approved="approvedForall"
            @fetchStakeds="fetchStakeds"
            class="stak-card"
            ref="stake"
          />
        </div>
        <div class="col-6">
          <unstak-card
            :stakecontract="contractMGDCStake"
            :mgdccontract="contractMGDC"
            :approved="approvedForall"
            @fetchStakeds="fetchStakeds"
            class="stak-card"
            ref="unstake"
          />
        </div>
      </div>
      <div class="staking-content mt-3">
        <claiming-card
          :stakecontract="contractMGDCStake"
          :approved="approvedForall"
          class="stak-card"
        />
      </div>
    </div>

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
import StackHeader from "@/components/staking/StackHeader.vue";
import stakCard from "@/components/staking/StakCard.vue";
import UnstakCard from "@/components/staking/UnstakCard.vue";
import ClaimingCard from "@/components/staking/ClaimingCard.vue";
import MGDC from "../abis/mgdc.json";
import mgdcstake from "../abis/mgdcstake.json";
import Web3 from "web3";
import { mapGetters } from "vuex";

export default {
  components: {
    StackHeader,
    stakCard,
    UnstakCard,
    ClaimingCard,
  },
  data() {
    return {
      mgdcBalance: 0,
      contractMGDC: null,
      contractMGDCStake: null,
      approvedForall: false,
      errorMsg: null,
    };
  },
  computed: {
    ...mapGetters(["account", "profileIsLoading"]),
  },
  async mounted() {
    await this.web3Check();
    window.ethereum.on("accountsChanged", function () {
      location.reload();
    });
    window.ethereum.on("networkChanged", function () {
      location.reload();
    });
  },
  methods: {
    fetchStakeds(target) {
      if (target === "unstake") this.$refs.unstake.init();
      else this.$refs.stake.focus();
    },
    async web3Check() {
      if (this.account) return;
      const ethereum = window.ethereum;
      if (!ethereum || !ethereum.on) {
        this.errorMsg = "This App requires MetaMask, Please Install MetaMask";
      } else {
        const web3 = new Web3(window.ethereum);
        this.contractMGDC = new web3.eth.Contract(MGDC, process.env.VUE_APP_MGDC);
        this.contractMGDCStake = new web3.eth.Contract(
          mgdcstake,
          process.env.VUE_APP_MGDC_STAKE
        );

        const networkId = await web3.eth.net.getId();
        if (networkId != process.env.VUE_APP_CHAIN_ID) {
          this.errorMsg = `Please change to ${process.env.VUE_APP_CHAIN_NAME}`;
        } else {
          await this.$store.dispatch("connect");
          this.mgdcBalance = await this.contractMGDC.methods
            .balanceOf(this.account)
            .call();
          if (this.mgdcBalance > 0) {
            this.approvedForall = await this.contractMGDC.methods
              .isApprovedForAll(this.account, process.env.VUE_APP_MGDC_STAKE)
              .call();
          } else {
            this.errorMsg = `You don't have MGDC ink. You can buy it here:`;
          }
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.staking-content {
  width: 100%;
  display: flex;
  margin: auto;
  max-width: 1100px;
  justify-content: center;
  flex-wrap: wrap;
}
.col-6 {
  padding-left: 12px;
  padding-right: 12px;
  box-sizing: border-box;
  width: 50%;
}
.mint {
  padding-top: 0;
}
.col-12 {
  padding-left: 12px;
  padding-right: 12px;
  box-sizing: border-box;
  width: 100%;
}
h1 {
  font-size: 40px;
  // filter: drop-shadow(0px 0px 1px #ffffff);
  text-shadow: 0 0 3px #ffffff;
  margin-bottom: 20px;
}
.stak-card {
  width: calc(1050px / 2);
  padding: 20px;
  border-radius: 3px;
  border: 2px solid #eea1c5;
  background: rgba(195, 25, 103, 0.4);
  text-align: left;
}

.mt-3 {
  margin-top: 16px;
}
</style>
