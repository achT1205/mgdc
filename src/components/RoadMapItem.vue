<template>
  <div class="roadMapItem">
    <div class="progressBar" :style="{ 'background-color': color }">
      <div class="left">
        <img class="red" :src="require(`@/assets/imgs/redlip-4@1x.png`)" />
        <p class="text pers">{{ percent }}%</p>
      </div>
      <div class="right">
        <img
          class="diams"
          v-for="(empt, i) in diams"
          :key="'diams_' + i"
          :src="require(`@/assets/imgs/diamant_small.png`)"
        />
        <img
          class="empty"
          v-for="(empt, i) in empty"
          :key="'empty_' + i"
          :src="require(`@/assets/imgs/empty-diamond.png`)"
        />
      </div>
    </div>

    <div class="box11">
      <img class="icon1" :src="require(`@/assets/imgs/Group 19.png`)" alt="" />
      <p
        class="text boxTxt1"
        :class="[5, 10, 20].includes(percent) ? 'line-through' : ''"
      >
        {{ text }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "RoadMapItem",
  props: {
    percent: Number,
    color: String,
    text: String,
    diams: Number,
    empty: Number,
  },
  data() {
    return {
      hide: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.line-through {
  text-decoration: line-through;
}

.roadMapItem {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  //border: 1px solid green;
  width: 100%;
  transition: all 100ms ease-in-out;
}

.progressBar {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  width: 100%;
  border-radius: 30px;
  height: 120px;
  line-height: 120px;
  padding: 15px 25px;
  margin-bottom: 20px;
  transition: all 100ms ease-in-out;
}

.red,
.diams,
.empty {
  height: 80%;
  width: auto;
  margin: auto;
  transition: all 100ms ease-in-out;
}

.diams {
  transition: all 100ms ease-in-out;
  opacity: 1;
  animation: shineDiams 3000ms infinite alternate;
}

@keyframes shineDiams {
  0% {
    filter: drop-shadow(0px 0px 0px rgba(255, 255, 255, 255));
    opacity: 0.9;
    transform: rotate(5deg);
  }
  50% {
    filter: drop-shadow(0px 0px 5px rgba(255, 255, 255, 255));
    opacity: 1;
    transform: rotate(-5deg);
  }
  100% {
    filter: drop-shadow(0px 0px 0px rgba(255, 255, 255, 255));
    opacity: 0.9;
    transform: rotate(5deg);
  }
}

.left {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  height: 100%;
}

.pers {
  font-size: 55px;
  margin: auto;
  margin-left: 20px;
  margin-right: 50px;
  font-family: "Jumble";
  font-weight: 100;
  margin-top: 26px;
}

.right {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  background-color: $big-dip-o-ruby;
  border-radius: 40px;
  height: 100%;
  width: 100%;
  padding: 10px;
}

.box11 {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-radius: 30px;
  width: 100%;
  margin-bottom: 20px;
}

.box11 {
  background-color: var(--plum);
  padding: 20px;
}

.icon1 {
  width: 30px;
}
.boxTxt1 {
  text-align: left;
  padding-left: 25px;
  width: 90%;
  line-height: 30px;
  font-size: 28px;
}

@media screen and (max-width: $layout-breakpoint-large) {
  .red {
    display: none;
  }
  .pers {
    font-size: 25px;
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 15px;
  }
  .progressBar {
    border-radius: 35px;
    height: 80px;
    padding: 5px 5px;
  }
  .boxTxt1 {
    font-size: 24px;
    line-height: 30px;
  }
}
@media screen and (max-width: $layout-breakpoint-medium) {
  .boxTxt1 {
    font-size: 20px;
    line-height: 28px;
  }
  .pers {
    font-size: 20px;
    margin-top: 12px;
  }
  .progressBar {
    border-radius: 35px;
    height: 60px;
    padding: 5px 5px;
  }
}
</style>
