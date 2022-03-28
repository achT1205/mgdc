<template>
  <div class="page">
    <div class="viewContainer mint">
      <div class="mintCard">
        <p class="title1 mintTitle">MGDC mint page</p>
        <p class="text howMa">How many Gold-Diggers do you want to mint ?</p>
        <div class="inline22">
          <button :class="`mintButton ${nftsCountToMint === 1 ? ' selected' : ''}`" @click="nftsCountToMint = 1">1</button>
          <button :class="`mintButton ${nftsCountToMint === 2 ? ' selected' : ''}`" @click="nftsCountToMint = 2">2</button>
          <button :class="`mintButton ${nftsCountToMint === 3 ? ' selected' : ''}`" @click="nftsCountToMint = 3">3</button>
        </div>

        <p class="text nftPrice">Price : {{ (nftsCountToMint * nftPrice) / 1000000000000000000 }} ETH</p>
        <p class="text nbNft">Minted : XXX/5,000</p>
        <button class="connectButton">Connect wallet</button>
        <br />
        <button class="validateButton">Mint</button>
      </div>
    </div>
    <img class="redlip22" :src="require(`@/assets/imgs/redlip-2@1x.png`)" />
    <img class="coin22" :src="require(`@/assets/imgs/coin-5@1x_cut.png`)" />
  </div>
</template>

<script>
export default {
  name: "Mint2",
  data() {
    return {
      nftPrice: 250000000000000000,
      nftsCountToMint: 3,
    };
  },
  methods: {
    goToExternal(url) {
      window.open(url);
    },
  },
};
</script>

<style lang="scss">
.page {
  background: linear-gradient(180deg, #edbcad 1.31%, #f0d0df 27.36%, #edb8ed 56.4%);
}

.mint {
  background-image: url("~@/assets/imgs/gold-digger-house-4@1x.png");
  background-size: 120% 180%;
  background-repeat: no-repeat;
  background-position-x: 20%;
  padding-top: 5vh;
  padding-bottom: 5vh;
  min-height: 100vh;
}

@media screen and (max-width: $layout-breakpoint-medium) {
  .mint {
    padding-top: 0;
    padding-bottom: 0;
  }
}

.mintTitle {
  width: 100%;
  text-transform: uppercase;
  font-size: 80px;
  margin-top: 50px;
  margin-bottom: 25px;
  filter: drop-shadow(10px -20px 1px rgb(229, 50, 97));
  transition: all 500ms ease-in-out;
  animation: moveTrailer 2000ms infinite linear;
}
@media screen and (max-width: $layout-breakpoint-xxlarge) {
  .mintTitle {
    margin-bottom: 25px;
    font-size: 50px;
  }
}
@media screen and (max-width: $layout-breakpoint-large) {
  .mintTitle {
    font-size: 40px;
  }
}
@media screen and (max-width: $layout-breakpoint-medium) {
  .mintTitle {
    font-size: 30px;
  }
}
@media screen and (max-width: $layout-breakpoint-small) {
  .mintTitle {
    font-size: 30px;
  }
}

.mintCard {
  border-radius: 50px;
  width: 50%;
  max-width: 1200px;
  margin: auto;
  background: linear-gradient(180deg, #e56932 0%, #ba3474 83.74%, #9b3782 100%);
  box-shadow: 0 0 20px #e56932;
  //border: 5px solid #e56932;
  z-index: 1000;
}
@media screen and (max-width: $layout-breakpoint-medium) {
  .mintCard {
    padding: 25px;
    border-radius: 0px;
    min-height: 100vh;
    width: 100%;
  }
}

.howMa {
  margin: auto;
  margin-bottom: 50px;
  text-align: center;
  transition: all 100ms ease-in-out;
  animation: shineT7 3000ms infinite alternate;
}
@keyframes shineT7 {
  0% {
    filter: drop-shadow(0px 0px 0px $white);
  }
  50% {
    filter: drop-shadow(0px 0px 2px $white);
  }
  100% {
    filter: drop-shadow(0px 0px 0px $white);
  }
}
@media screen and (max-width: $layout-breakpoint-xxlarge) {
  .howMa {
    margin-bottom: 25px;
  }
}

.inline22 {
  width: 60%;
  margin: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

button {
  font-family: var(--font-family-acme);
  border-radius: 15px;
  border: 8px solid pink;
  background-color: transparent;
  color: $white;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 3px;
  opacity: 0.85;
  transition: all 100ms ease-in-out;
  cursor: pointer;
  &:hover {
    opacity: 1;
    transform: translateY(-1px);
    box-shadow: 0px 0px 7px 0px #ffffff;
  }
}

.selected {
  opacity: 1;
  transform: translateY(-1px);
  box-shadow: 0px 0px 7px 0px #ffffff;
  font-weight: 700;
  background-color: $white;
  color: #e56932;
}

.mintButton {
  width: 120px;
  height: 120px;
  margin: auto;
  padding: 30px;
  padding-top: 10px;
  padding-left: 35px;
  font-size: 65px;
}
@media screen and (max-width: $layout-breakpoint-xxlarge) {
  .mintButton {
    width: 80px;
    height: 80px;
    margin: auto;
    margin-left: 10px;
    margin-right: 10px;
    padding: 15px;
    padding-top: 14px;
    padding-left: 15px;
    border-radius: 15px;
    border: 4px solid pink;
    font-size: 35px;
  }
}

.connectButton {
  margin-top: 25px;
  padding: 15px 40px;
  font-size: 30px;
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

.validateButton {
  margin-top: 20px;
  padding: 15px 40px;
  font-size: 30px;
  margin-bottom: 50px;
}
@media screen and (max-width: $layout-breakpoint-xxlarge) {
  .validateButton {
    margin-top: 25px;
    padding: 10px 20px;
    font-size: 20px;
    border-radius: 15px;
    border: 4px solid pink;
  }
}

.nftPrice {
  margin-top: 25px;
  text-align: center;
}

.nbNft {
  text-align: center;
}

.coin22 {
  position: absolute;
  right: 0;
  bottom: 10%;
  width: 200px;
}

.redlip22 {
  position: absolute;
  bottom: 10%;
  width: 300px;
  left: 50px;
}
</style>
