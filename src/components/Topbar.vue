<template>
  <div class="topbar-container">
    <div class="topbar">
      <img class="logo-png-transparent" :src="require(`@/assets/imgs/mdgc-logo.png`)" @click="goToExternal('https://discord.gg/jXB2Sxgxzz')" />
      <a href="#project" class="nav-item mainNav">Project</a>
      <a href="#exc-reward" class="nav-item mainNav">Reward program</a>
      <a href="#howcan" class="nav-item mainNav">Metaverse</a>
      <a @click="goTo('Profile')" class="nav-item mainNav">Profile</a>
      <a @click="goTo('Breed')" class="nav-item mainNav">Breed</a>
      <a @click="goTo('Stake')" class="nav-item mainNav discord-button2">Staking</a>

      <div class="right">
        <i class="fab fa-instagram" @click="goToExternal('https://www.instagram.com/mgdcofficial')"></i>
        <i class="fab fa-twitter" @click="goToExternal('https://twitter.com/mgdcofficial')"></i>
        <a href="#project"><img class="heelshoe" :src="require(`@/assets/imgs/heelshoe-3@1x.png`)" /></a>
        <!-- @click="goTo('#project')" -->
      </div>

      <div class="burger">
        <i class="fa fa-bars" @click="hide = !hide"></i>
      </div>
    </div>

    <div class="mobile" v-if="hide">
      <a href="#project" class="mob-nav-item" style="background-color: #db6138" @click="hide = false">Project</a>
      <a href="#exc-reward" class="mob-nav-item" style="background-color: #e56932" @click="hide = false">Reward program</a>
      <a href="#howcan" class="mob-nav-item" style="background-color: #cf4859" @click="hide = false">Metaverse</a>
      <a
        class="mob-nav-item"
        style="background-color: #c63a6a"
        @click="
          goTo('Profile');
          hide = false;
        "
        >Profile</a
      >
      <a
        class="mob-nav-item"
        style="background-color: #b03578"
        @click="
          goTo('Breed');
          hide = false;
        "
        >Breed</a
      >
      <div class="mob-nav-item mobLogo" style="background-color: #88296c">
        <i class="fab fa-instagram" @click="goToExternal('https://www.instagram.com/mgdcofficial')"></i>
        <i class="fab fa-twitter" @click="goToExternal('https://twitter.com/mgdcofficial')"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopBar",
  data() {
    return {
      hide: false,
    };
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

<style lang="scss">
a {
  text-decoration: none;
}
.topbar-container {
  position: fixed;
  top: 0px;
  left: 0;
  width: 100%;
  z-index: 4000;
  color: $white;
  font-family: Jumble;
  font-size: var(--font-size-s);
  font-style: normal;
  font-weight: 400;
}

.topbar {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  height: 105px;
  padding: 12px 30px;
  width: 100%;
  background: linear-gradient(90deg, #e56932 0%, #c23471 52.71%, #993783 100%);
  align-items: center;
  z-index: 5000;
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
  margin-top: -15px;
  cursor: pointer;
  &:hover {
    filter: drop-shadow(0px 0px 1px #ffffff);
    opacity: 1;
    transform: translateY(-1px);
  }
}

.discord-button2 {
  font-family: Jumble;
  font-weight: 800;
  background-color: $cerise-red;
  border-radius: 20px;
  padding: 10px 22px;
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 50px;
  line-height: 50px;
  text-transform: uppercase;
  .fab {
    font-size: 35px;
  }
  opacity: 0.9;
  transition: all 100ms ease-in-out;
  &:hover {
    filter: drop-shadow(0px 0px 5px $cerise-red);
    //  filter: drop-shadow(0px 0px 1px #ffffff);
    opacity: 1;
    transform: translateY(-1px);
  }
}

.join-us-on-discord2 {
  color: $white;
  font-family: var(--font-family-jaapokki-regular);
  font-size: 21px;
  font-weight: 600;
  letter-spacing: 0;
  margin-left: 10px;
  margin-top: 5px;
  text-align: center;
}

.discord-logo {
  width: 40px;
}

.right {
  width: 180px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;

  .fab {
    font-size: 45px;
    cursor: pointer;
    opacity: 0.9;
    transition: all 100ms ease-in-out;
    &:hover {
      filter: drop-shadow(0px 0px 1px #ffffff);
      opacity: 1;
      transform: translateY(-1px);
    }
  }

  .heelshoe {
    cursor: pointer;
    height: 45px;
    opacity: 0.9;
    &:hover {
      filter: drop-shadow(0px 0px 1px #ffffff);
      opacity: 1;
      transform: translateY(-1px);
    }
  }
}

.burger {
  display: none;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  margin-right: -20px;
  .fa {
    font-size: 50px;
    padding: 10px;
    padding-left: 15px;
    padding-right: 15px;
    cursor: pointer;
    opacity: 0.9;
    transition: all 100ms ease-in-out;
    &:hover {
      filter: drop-shadow(0px 0px 1px #ffffff);
      opacity: 1;
      transform: translateY(-1px);
    }
  }
}

.mobile {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  position: absolute;
  top: 80px;
  left: 0px;
  width: 100%;
}

.mob-nav-item {
  align-items: center;
  white-space: nowrap;
  user-select: none;
  padding: 20px 20px;
  color: $white;
  text-decoration: none;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 20px;
  transition: all 100ms ease-in-out;
  &:hover {
    filter: drop-shadow(0px 0px 1px #ffffff);
    opacity: 1;
  }
}

.mobLogo {
  display: flex;
  flex-direction: row;
  justify-content: center;
  .fab {
    font-size: 35px;
    cursor: pointer;
    opacity: 0.9;
    transition: all 100ms ease-in-out;
    margin-right: 10px;
    margin-left: 10px;
  }
}
@media screen and (max-width: $layout-breakpoint-medium) {
  .discord-button2 {
    display: none;
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
  // .logo-png-transparent {
  //   margin-top: -15px;
  // }
}
@media screen and (max-width: $layout-breakpoint-large) {
  .burger {
    display: flex;
  }
  .logo-png-transparent {
    margin-left: -15px;
    margin-top: -5px;
  }
  .mainNav {
    display: none;
  }
  // .topbar {
  //   display: flex;
  //   flex-flow: row wrap;
  //   justify-content: space-between;
  //   height: 80px;
  //   padding: 0px 30px;
  //   width: 100%;
  //   background: linear-gradient(90deg, #e56932 0%, #c23471 52.71%, #993783 100%);
  //   align-items: center;
  //   z-index: 5000;
  // }
}

@media screen and (max-width: $layout-breakpoint-small) {
}
</style>
