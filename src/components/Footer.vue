<template>
  <div class="footer">
    <div>
      <img class="footer-montre" :src="require(`@/assets/imgs/montreor@1x.png`)" />
      <img class="footer-logo" :src="require(`@/assets/imgs/mdgc-logo.png`)" />
      <img class="footer-redlip" :src="require(`@/assets/imgs/redlip-1@1x.png`)" />
    </div>
    <div class="footer-terms">Terms & Conditions</div>
    <div class="footer-rights">MGDC - All Rights Reserved 2022</div>
  </div>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style lang="scss" scoped>
.footer {
  position: relative;
  text-align: center;
  width: 100%;
  z-index: 3;
  background: linear-gradient(180deg, #e56932 0%, #c5316e 45.81%, #993783 100%);
  background-size: 100%;
  padding-bottom: 1px;
}

.footer-logo {
  margin-top: 50px;
  width: 300px;
}

.footer-terms {
  color: white;
  font-size: 20px;
  font-weight: bold;
  font-family: "Acme", Helvetica;
  margin-top: 60px;
  margin-bottom: 40px;
}

.footer-rights {
  font-weight: bold;
  font-family: "Acme", Helvetica;
  color: white;
  font-size: 16px;
  margin-bottom: 80px;
}

.footer-montre {
  position: absolute;
  top: -30%;
  width: 19%;
  left: 5%;
  z-index: -1;
  transition: all 100ms ease-in-out;
  animation: moveItem 2800ms infinite alternate;
}

.footer-redlip {
  position: absolute;
  top: -30%;
  width: 15%;
  right: 5%;
  z-index: -1;
  transition: all 100ms ease-in-out;
  animation: moveItem 3200ms infinite alternate;
}

@keyframes moveItem {
  0% {
    -webkit-filter: drop-shadow(0px 0px 0px rgba(255, 255, 255, 255));
    filter: drop-shadow(0px 0px 0px rgba(255, 255, 255, 255));
    transform: rotate(3deg);
  }
  50% {
    -webkit-filter: drop-shadow(0px 0px 5px rgba(255, 255, 255, 255));
    filter: drop-shadow(0px 0px 5px rgba(255, 255, 255, 255));
    transform: rotate(-3deg);
  }
  100% {
    -webkit-filter: drop-shadow(0px 0px 0px rgba(255, 255, 255, 255));
    filter: drop-shadow(0px 0px 0px rgba(255, 255, 255, 255));
    transform: rotate(3deg);
  }
}

@media screen and (max-width: $layout-breakpoint-medium) {
  .footer-logo {
    margin-top: 100px;
    width: 200px;
  }
  .footer-montre {
    position: absolute;
    top: -30px; //-15%;
    width: 150px;
    left: 5%;
  }

  .footer-redlip {
    position: absolute;
    top: -30px; //-13%;
    width: 120px;
    right: 5%;
  }
}
</style>
