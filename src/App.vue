<template>
  <div id="app">
    <Topbar v-if="this.$route.name === 'Home'" />
    <router-view />
    <Footer v-if="this.$route.name === 'Home'" />
  </div>
</template>

<script>
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";

export default {
  name: "App",
  components: { Topbar, Footer },
  mounted() {
    // console.clear();
    // console.log("Loading ...");
  },
};
</script>

<style lang="scss">
@import url("https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css");
@import url("https://fonts.googleapis.com/css?family=Acme:400");
@font-face {
  font-family: "Jaapokki-Regular";
  font-style: normal;
  font-weight: 400;
  src: url("~@/assets/fonts/Jaapokki-Regular.otf") format("opentype");
}
@import url("https://fonts.googleapis.com/css?family=Acme:400");
@font-face {
  font-family: "HelveticaNeue-Regular";
  font-style: normal;
  font-weight: 400;
  src: url("https://anima-uploads.s3.amazonaws.com/projects/61a00f16b025b40396416025/fonts/helvetica-neueltw0693blkextobl.ttf") format("truetype");
}
@font-face {
  font-family: "Jumble";
  font-style: normal;
  font-weight: 400;
  src: url("~@/assets/fonts/Jumble/Laura Worthington - Jumble.otf");
}

html,
body,
#app {
  margin: 0;
  padding: 0;
  scroll-behavior: smooth;
  background-color: $white;
  zoom: normal;
}
#app {
  font-family: Jumble;
  text-align: center;
  color: $white;
  margin: auto;
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}

a {
  color: $white;
}

.viewContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  //min-height: 100vh;
  max-width: 100vw;
  overflow: hidden;
  //border: 1px solid blue;
}

.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  width: 100%;
  max-width: 900px;
  padding-top: 150px;
  padding-bottom: 50px;
  z-index: 10;
  //border: 1px solid green;
}

.title1 {
  font-family: Jumble;
  font-size: 60px;
  font-weight: 400;
  margin: auto;
  margin-bottom: 100px;
  //border: 1px solid red;
}

.text,
.textB {
  text-align: left;
  color: #fff;
  font-family: var(--font-family-acme);
  font-size: 30px;
  line-height: 43px;
}
.textB {
  color: black;
}

.heart-logo,
.pic-logo,
.lozange-logo,
.trefle-logo {
  color: var(--thunderbird);
  // font-family: var(--font-family-helveticaneue-regular);
  font-size: var(--font-size-m);
  font-style: normal;
  font-weight: 400;
  padding-left: 10px;
  padding-right: 20px;
  padding-top: 3px;
}
.pic-logo,
.trefle-logo {
  color: black;
}

.inline {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.howCanCol {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: nowrap;
  width: 100%;
  margin: auto;
  //border: 1px solid red;
}

.howCanColItem {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: nowrap;
  margin: 10px;
  margin-bottom: 20px;
  align-items: left;
}

@media screen and (max-width: $layout-breakpoint-xlarge) {
  .center {
    width: calc(100% - 50px);
    margin-left: 25px;
    margin-right: 25px;
  }
}

@media screen and (max-width: $layout-breakpoint-large) {
  .title1 {
    font-size: 60px;
    font-weight: 400;
    margin-bottom: 50px;
  }
}

@media screen and (max-width: $layout-breakpoint-medium) {
  .title1 {
    font-size: 50px;
    font-weight: 400;
    margin-bottom: 50px;
  }
  .text,
  .textB {
    font-size: 25px;
    font-weight: 300;
    line-height: 35px;
  }
  .center {
    padding-top: 50px;
    padding-bottom: 50px;
  }

  .heart-logo,
  .pic-logo,
  .lozange-logo,
  .trefle-logo {
    display: none;
  }
}

@media screen and (max-width: $layout-breakpoint-small) {
  .title1 {
    font-size: 40px;
    font-weight: 400;
    margin-bottom: 50px;
  }
  .text,
  .textB {
    font-size: 20px;
    font-weight: 300;
    line-height: 28px;
  }
  .center {
    padding-top: 50px;
    padding-bottom: 0px;
  }
}
</style>
