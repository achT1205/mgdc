import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Breed from "./views/Breed.vue";
import Mint2 from "./views/Mint2.vue";
import Profile from "./views/Profile.vue";
import Staking from "./views/Staking.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/mint",
      name: "Mint2",
      component: Mint2,
    },
    {
      path: "/profile",
      name: "Profile",
      component: Profile,
    }, {
      path: "/breed",
      name: "Breed",
      component: Breed,
    },
    {
      path: "/stake",
      name: "Stake",
      component: Staking,
    }

  ],
});
