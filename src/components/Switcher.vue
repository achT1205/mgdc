<template>
  <div class="switcher" @click="switcher">
    <div class="switches">
      <label>BAYC</label>
      <div class="switches-byx">
        <div class="switches-round" :class="switching ? 'primary' : ''"></div>
      </div>
      <label>Hape Beast</label>
    </div>
    <input type="hidden" v-model="cryptoType" />
  </div>
</template>
<script>
export default {
  data: () => ({
    cryptoType: "BAYC",
    switching: false,
  }),
  mounted() {
    if (!this.$route.query.target || this.$route.query.target === "BAYC")
      this.switching = false;
    if (this.$route.query.target && this.$route.query.target === "HAPE")
      this.switching = true;
  },
  methods: {
    switcher() {
      this.switching = !this.switching;
      if (this.switching) {
        this.$router.replace({ query: { target: "HAPE" } });
        location.reload()
      } else {
        this.$router.replace({ query: { target: "BAYC" } });
        location.reload()
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.switcher {
  .switches {
    display: flex;
    align-items: center;
  }
  .switches-byx {
    width: 40px;
    border-radius: 10px;
    height: 20px;
    border: 1px solid #fff;
    margin: 0 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
    .switches-round {
      transition: all 200ms linear;
      background: #fff;
      height: 16px;
      width: 16px;
      border-radius: 100%;
      margin: 0 2px;
      transform: translateX(0);
    }
    .switches-round.primary {
      transform: translateX(18px);
    }
  }
}
</style>
