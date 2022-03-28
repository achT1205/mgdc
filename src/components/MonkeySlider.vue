<template>
  <div class="nftContainer">
    <div class="spacer" v-bind:style="{ width: max - x + 'px' }" />
    <img class="nftPic" v-for="(monkey, i) in monkeys" :key="i" :src="monkey" />
    <div class="spacer" v-bind:style="{ width: x + 'px' }" />
    <!-- <img class="nftPic" :src="require(`@/assets/imgs/MGDC_1.jpg`)" />
      <img class="nftPic" :src="require(`@/assets/imgs/MGDC_2.jpg`)" />
      <img class="nftPic" :src="require(`@/assets/imgs/MGDC_3.jpg`)" />
      <img class="nftPic" :src="require(`@/assets/imgs/MGDC_4.jpg`)" />
      <img class="nftPic" :src="require(`@/assets/imgs/MGDC_5.jpg`)" />
      <img class="nftPic" :src="require(`@/assets/imgs/MGDC_6.jpg`)" />
      <img class="nftPic" :src="require(`@/assets/imgs/MGDC_7.jpg`)" />
      <img class="nftPic" :src="require(`@/assets/imgs/yellow.png`)" />
      <img class="nftPic" :src="require(`@/assets/imgs/nicegirl-bleu.png`)" />
      <img class="nftPic" :src="require(`@/assets/imgs/pink.webp`)" />
      <img class="nftPic" :src="require(`@/assets/imgs/nft-1@1x.png`)" /> -->
  </div>
</template>

<script>
export default {
  name: "MainPageSlider",
  data() {
    return {
      x: 0,
      max: 320,
      monkeys: [
        require(`@/assets/imgs/MGDC_1.jpg`),
        require(`@/assets/imgs/MGDC_2.jpg`),
        require(`@/assets/imgs/MGDC_3.jpg`),
        require(`@/assets/imgs/MGDC_4.jpg`),
        require(`@/assets/imgs/MGDC_5.jpg`),
        require(`@/assets/imgs/MGDC_6.jpg`),
        require(`@/assets/imgs/MGDC_7.jpg`),
        require(`@/assets/imgs/yellow.png`),
        require(`@/assets/imgs/nicegirl-bleu.png`),
        require(`@/assets/imgs/pink2.jpg`),
      ],
    };
  },
  mounted() {
    this.slider();
  },
  methods: {
    slider() {
      if (window.innerWidth > 768) {
        this.max = 320;
      } else {
        this.max = 220;
      }

      if (this.x > this.max) {
        this.x = 0;
        let tmp = this.monkeys[0];
        this.monkeys.shift();
        this.monkeys.push(tmp);
      } else {
        this.x += 1;
      }
      setTimeout(() => {
        this.slider();
      }, 10);
    },
    goTo(name) {
      if (this.$route.name !== name) {
        this.$router.push({ name });
      }
    },
    changeSlide(id) {
      this.currentSlide = id;
    },
  },
};
</script>

<style lang="scss" scoped>
.nftContainer {
  display: inline-block;
  width: calc(100% + 10000px);
  margin-left: -5000px;
  padding-top: 50px;
  padding-bottom: 50px;
  overflow: hidden;
  z-index: 100;
  //border: 1px solid red;
  transition: all 100ms ease-in-out;
}

.spacer {
  display: inline-block;
  margin-left: 10px;
  margin-right: 10px;
}

.nftPic {
  display: inline-block;
  width: 300px;
  height: 300px;
  margin-left: 10px;
  margin-right: 10px;
  object-fit: cover;
  border-radius: 40px;
  transition: all 100ms ease-in-out;
  cursor: pointer;
  box-shadow: 0px 0px 5px $white;
  &:hover {
    width: 310px;
    height: 310px;
    margin-top: -5px;
    margin-bottom: -5px;
    margin-left: 5px;
    margin-right: 5px;
    box-shadow: 0px 0px 20px $white;
    opacity: 1;
  }
}

@media screen and (max-width: $layout-breakpoint-medium) {
  .nftContainer {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .nftPic {
    width: 200px;
    height: 200px;
    &:hover {
      width: 210px;
      height: 210px;
      margin-top: -5px;
      margin-bottom: -5px;
      margin-left: 5px;
      margin-right: 5px;
      box-shadow: 0px 0px 10px $white;
      opacity: 1;
    }
  }
}
</style>
