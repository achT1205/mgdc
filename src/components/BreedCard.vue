<template>
  <div class="teamMember">
    <p class="text name">ID: {{ id }}</p>
    <p class="text name">Has breeded: {{ breed ? "Yes" : "No" }}</p>
    <p class="text name" style="margin-bottom: 10px">Is Listed to breed: {{ listed ? "Yes" : "No" }}</p>
    <div class="picContainer">
      <img class="pic" :src="pic" />
    </div>
    <button v-if="profOrBreed === 'prof'" class="connectButton" @click="list(token)">{{ listed ? "Already Listed" : "List on Tinder-Ape" }}</button>
    <button v-if="profOrBreed === 'breed'" class="connectButton" @click="breedClick(id)">breed</button>
  </div>
</template>

<script>
export default {
  name: "BreedCard",
  props: {
    profOrBreed: String,
    id: String,
    breed: Boolean,
    listed: Boolean,
    pic: String,
    token: String,
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
    list(token) {
      this.$parent.list(token);
    },
    breedClick(id1) {
      console.log(id1)
      this.$parent.breed(id1);
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
  width: 250px;
  > * {
    transition: all 100ms ease-in-out;
  }
  //border: 1px solid blue;
}

.name {
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
  width: 200px;
  height: 200px;
  border-radius: 500px;
  object-fit: cover;
  transition: all 100ms ease-in-out;
  //box-shadow: 0px 0px 5px 0px #ffffff;
  filter: drop-shadow(0px 0px 5px #ffffff);
}
.connectButton {
  margin-top: 25px;
  padding: 15px 15px;
  font-size: 15px;
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
