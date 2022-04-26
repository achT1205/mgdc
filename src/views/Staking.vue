<template>
  <div class="page">
    <div class="mint">
    <stack-header />
      <div class="staking-content">
        <div class="col-12">
          <h1>STAKING</h1>
        </div>
        <div class="col-6">
          <stak-card class="stak-card" />
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
import StackHeader from '@/components/staking/StackHeader.vue';
import stakCard from '@/components/staking/StakCard.vue';
import UnstakCard from '@/components/staking/UnstakCard.vue';
import ClaimingCard from '@/components/staking/ClaimingCard.vue';
export default {
  components:{
    StackHeader,
    stakCard,
    UnstakCard,
    ClaimingCard,
  }
}
</script>
<style lang="scss" scoped>
.staking-content{
    width: 100%;
    display: flex;
    margin: auto;
    max-width: 1100px;
    justify-content: center;
    flex-wrap: wrap;
}
.col-6{
  padding-left: 12px;
  padding-right: 12px;
  box-sizing: border-box;
  width: 50%;
}
.mint{
  padding-top: 0;
}
.col-12{
  padding-left: 12px;
  padding-right: 12px;
  box-sizing: border-box;
  width: 100%;
}
h1{
  font-size: 40px;
  // filter: drop-shadow(0px 0px 1px #ffffff);
  text-shadow: 0 0 3px #ffffff;
  margin-bottom: 20px;
}
.stak-card{
  width: calc(1050px / 2);
  padding: 20px;
  border-radius: 3px;
  border: 2px solid #eea1c5;
  background: rgba(195, 25, 103, 0.4);
  text-align: left;
}

.mt-3{
  margin-top: 16px;
}
</style>