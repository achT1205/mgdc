<template>
  <div class="teamMember">
    <div class="picContainer">
      <img class="pic" :src="pic" />
    </div>
    <p class="text name" v-html="name"></p>
    <!-- <div class="socialsContainer2">
      <div class="logoContainer2" v-if="insta != ''" @click="goToExternal(insta)">
        <i class="fab fa-instagram"></i>
      </div>
      <div class="logoContainer2" v-if="twitter != ''" @click="goToExternal(twitter)">
        <i class="fab fa-twitter" />
      </div>
      <div class="logoContainer2" v-if="discord != ''" @click="goToExternal(discord)">
        <i class="fab fa-discord"></i>
      </div>
      <div class="logoContainer2" v-if="linkedin != ''" @click="goToExternal(linkedin)">
        <i class="fab fa-linkedin"></i>
      </div>
      <div class="logoContainer2" v-if="artstation != ''" @click="goToExternal(artstation)">
        <i class="fab fa-artstation"></i>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "TeamCard",
  props: {
    name: String,
    pic: String,
    insta: String,
    linkedin: String,
    discord: String,
    artstation: String,
    twitter: String,
  },
  data() {
    return {
      style: "",
    };
  },
  mounted() {},
  methods: {
    goToExternal(url) {
      window.open(url);
    },
  },
};
</script>

<style lang="scss" scoped>
.teamMember {
  transition: all 500ms ease-in-out;
  opacity: 0.85;
  margin-left: 50px;
  margin-right: 50px;
  margin-bottom: 50px;
  > * {
    transition: all 100ms ease-in-out;
  }
}

.name {
  text-transform: uppercase;
  font-size: 28px;
  line-height: 36px;
  margin: auto;
  margin-top: 10px;
  width: 500px;
  text-align: center;
  color: $white;
  font-family: Jumble;
}

.pic {
  width: 300px;
  height: 300px;
  border-radius: 500px;
  object-fit: cover;
  transition: all 100ms ease-in-out;
  //box-shadow: 0px 0px 5px 0px #ffffff;
  filter: drop-shadow(0px 0px 5px #ffffff);
}

.socialsContainer2 {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.logoContainer2 {
  width: 60px;
  min-width: 60px;
  height: 60px;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0.85;
}

.fab {
  color: $white;
  font-size: 35px;
  opacity: 0.85;
  cursor: pointer;
  &:hover {
    filter: drop-shadow(0px 0px 1px $white);
    opacity: 1;
    transform: translateY(-1px);
  }
}

@media screen and (max-width: $layout-breakpoint-medium) {
  .teamMember {
    margin-bottom: 50px;
  }
  .pic {
    width: 200px;
    height: 200px;
  }
  .name {
    width: 300px;
    font-size: 20px;
  }
  .fab {
    font-size: 25px;
  }
  .logoContainer2 {
    width: 40px;
    min-width: 40px;
    height: 40px;
    min-height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0.85;
  }
  .socialsContainer2 {
    margin-left: 10px;
    margin-top: 0px;
  }
}
</style>
