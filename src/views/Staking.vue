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
           class="stak-card" />
        </div>
        <div class="col-6">
          <unstak-card class="stak-card" />
        </div>
      </div>
      <div class="staking-content mt-3">
        <claiming-card class="stak-card" />
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
      mgdcBalance: null,
      contractMGDC: null,
      contractMGDCStake:null,
      approvedForall:false
    };
  },
  computed: {
    ...mapGetters(["account"]),
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
    async web3Check() {
      const ethereum = window.ethereum;
      if (!ethereum || !ethereum.on) {
        this.errorMsg = "This App requires MetaMask, Please Install MetaMask";
      } else {
        const web3 = new Web3(window.ethereum);
        this.contractMGDC = new web3.eth.Contract(MGDC, process.env.VUE_APP_MGDC);
         this.contractMGDCStake = new web3.eth.Contract(mgdcstake, process.env.VUE_APP_MGDC_STAKE);
        
        const networkId = await web3.eth.net.getId();
        if (networkId != process.env.VUE_APP_CHAIN_ID) {
          this.errorMsg = `Please change to ${process.env.VUE_APP_CHAIN_NAME}`;
        } else {
          await this.$store.dispatch("connect");
          this.mgdcBalance = await this.contractMGDC.methods
            .balanceOf(this.account)
            .call();
          if(this.mgdcBalance>0){
            this.approvedForall = await this.contractMGDC.methods.isApprovedForAll(this.account, process.env.VUE_APP_MGDC_STAKE)
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
