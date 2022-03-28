<template>
  <div class="teamMember">
    <div class="picContainer">
      <img class="pic" :src="pic" />
    </div>
    <p class="text name" v-html="name"></p>
    <div class="socialsContainer2">
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
        <i class="fa fa-link"></i>
      </div>
    </div>
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
  margin-bottom: 50px;
  margin-left: 30px;
  margin-right: 30px;
  width: 200px;
  > * {
    transition: all 100ms ease-in-out;
  }
  //border: 1px solid blue;
}

.name {
  text-transform: uppercase;
  font-size: 18px;
  line-height: 28px;
  margin: auto;
  margin-bottom: -5px;
  margin-top: 10px;
  width: 100%;
  text-align: center;
  color: $white;
  font-family: Jumble;
}

.pic {
  width: 150px;
  height: 150px;
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

.fa,
.fab {
  color: $white;
  font-size: 25px;
  opacity: 0.85;
  cursor: pointer;
  &:hover {
    filter: drop-shadow(0px 0px 1px $white);
    opacity: 1;
    transform: translateY(-1px);
  }
}

.fa {
  font-size: 22px;
}

@media screen and (max-width: $layout-breakpoint-medium) {
  .teamMember {
    margin-bottom: 50px;
    margin-left: -10px;
    margin-right: -10px;
  }
  .pic {
    width: 150px;
    height: 150px;
  }
  .name {
    width: 200px;
    font-size: 18px;
  }
  .fa {
    font-size: 22px;
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
