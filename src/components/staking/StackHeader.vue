<template>
  <div class="topbar-container">
    <div class="topbar staking">
      <img class="logo-png-transparent" :src="require(`@/assets/imgs/mdgc-logo.png`)" @click="goToExternal('https://discord.com/invite/9mxyH2eDr3')" />
      <button class="btn-wallet" @click="$emit('connect')">
          <span>
          {{
            account === null || !account
              ? "Connect Your wallet"
              : account.substring(1, 9) + "..." + account.substring(account.length - 6)
          }}
          </span>
          <i class="fas fa-wallet"></i>
        </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TopBar",
  props:["connect"],
  data() {
    return {

    };
  },
    computed: {
    ...mapGetters(["account"]),
  },
  mounted() {
    window.addEventListener("resize", this.onresize);
  },
  methods: {
    onresize() {
      this.hide = false;
    },
    goToExternal(url) {
      window.open(url);
    },
    goTo(name) {
      console.log(name);
      if (this.$route.name !== name) {
        this.$router.push({ name });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
.topbar-container {
  position: relative;
  top: auto;
  left: auto;
  width: 100%;
  z-index: 4000;
  color: $white;
  font-family: Jumble;
  font-size: var(--font-size-s);
  font-style: normal;
  font-weight: 400;
}

.topbar.staking {
  background: none;
}

.nav-item {
  height: 40px;
  letter-spacing: 0;
  line-height: 40px;
  font-family: Jumble;
  margin-right: 25px;
  cursor: pointer;
  text-transform: uppercase;
  opacity: 0.9;
  transition: all 100ms ease-in-out;
  &:hover {
    filter: drop-shadow(0px 0px 1px #ffffff);
    opacity: 1;
    transform: translateY(-1px);
  }
}

.logo-png-transparent {
  height: 80%;
  z-index: 100;
  margin-right: 30px;
  margin-top: 0;
  cursor: pointer;
  &:hover {
    filter: drop-shadow(0px 0px 1px #ffffff);
    opacity: 1;
    transform: translateY(-1px);
  }
}

.btn-wallet{
  border-radius: 3px;
  border: 1px solid #c31967;
  padding: 10px;
  background: rgba(195, 25, 103, 0.702);
  font-size: 12px;
  letter-spacing: 1.5px;
  display: flex;
  align-items: center;
  span{
    padding-right: 3px;
  }
  i{
    border-left: 1px solid #fff;
    padding-left: 5px;
  }
}

@media screen and (max-width: 1400px) {
  .right {
    display: none;
  }
  .topbar {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    height: 80px;
    padding: 0px 30px;
    width: 100%;
    background: linear-gradient(90deg, #e56932 0%, #c23471 52.71%, #993783 100%);
    align-items: center;
    z-index: 5000;
  }
}

@media screen and (max-width: $layout-breakpoint-xlarge) {
  .nav-item {
    font-size: 23px;
  }
}
@media screen and (max-width: $layout-breakpoint-large) {
  .burger {
    display: flex;
  }
  .logo-png-transparent {
    margin-left: 0;
    margin-top: -5px;
  }
  .mainNav {
    display: none;
  }
}
</style>