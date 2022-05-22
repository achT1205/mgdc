<template>
  <div class="stak">
    <h3>Claim Reward</h3> 
    <div><p>You will be able to claim your tokens after the marketplace's launch.</p></div>
    <div class="pending-balance">
      <div class="pending">
        {{ rewards ? rewards.substring(0, 6) : "" }} $mgdc
        <div class="labels">Pending rewards</div>
      </div>
      <div class="chevron-to">
        <div class="chevron">
          <i class="fas fa-arrow-right"></i>
        </div>
      </div>
      <div class="balance">
        {{ balance ? balance.substring(0, 6) : "" }} $mgdc
        <div class="labels">Balance</div>
      </div>
    </div>
    <div class="d-flex stak-btn" @click="claim">
      <button class="approve-stake-btn">Claim</button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Web3 from "web3";

export default {
  props: ["stakecontract"],
  computed: {
    ...mapGetters(["account"]),
  },
  data() {
    return {
      rewards: 0,
      balance: 0,
    };
  },
  async mounted() {
    if (this.stakecontract.methods) {
      await this.fetch();
      setInterval(await this.fetch(), 500);
    }
  },
  methods: {
    async fetch() {
      const rewards = await this.stakecontract.methods.getAllRewards(this.account).call();
      const eth = Web3.utils.fromWei(rewards, "ether");
      this.rewards = eth.toString(18);

      const balance = await this.stakecontract.methods.balanceOf(this.account).call();
      const balanceeth = Web3.utils.fromWei(balance, "ether");
      this.balance = balanceeth.toString(18);
    },
    async claim() {
      if (!this.rewards || this.rewards == 0) {
        return;
      }
      this.$store.commit("SET_PROFILE_IS_LOADING", true);
      await this.stakecontract.methods.claimAll().send({ from: this.account });
      location.reload();
    },
  },
};
</script>
<style lang="scss" scoped>
.stak h3 {
  font-size: 22px;
  text-transform: uppercase;
  text-shadow: 0 0 3px #ffffff;
  margin-bottom: 10px;
}
.d-flex {
  display: flex;
}
.align-center {
  align-items: center;
}
.pending-balance,
.pending-balance-labels {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  .pending,
  .balance {
    font-size: 26px;
  }
  .pending-label {
    color: #eea1c5;
    margin: 0 10px;
  }
}
.stak-btn {
  width: 100%;
  display: flex;
  justify-content: center;
  button {
    border-radius: 3px;
    border: 1px solid #eea1c5;
    padding: 8px 25px;
    background: #6d0234;
    font-size: 16px;
    letter-spacing: 1.5px;
    display: flex;
    align-items: center;
    font-weight: bold;
    min-width: 230px;
    justify-content: center;
    display: flex;
  }
}

.chevron {
  background: #6d0234;
  border-radius: 100%;
  font-size: 22px;
  width: 40px;
  height: 40px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffffff;
  margin: 10px 40px;
}

.labels {
  position: relative;
  font-size: 12px;
  color: #e9c7d7;
  top: 10px;
}
</style>
