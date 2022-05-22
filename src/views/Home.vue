<template>
  <div class="page">
    <!-- TOPVIEW -->
    <div class="viewContainer topView">
      <img class="topViewImg" :src="require(`@/assets/imgs/MGDC-WEB.jpg`)" />
    </div>

    <!-- TOPDESCR -->
    <div class="viewContainer topDescr" style="min-height: 0">
      <div class="text topDescrTitle">
        {{ "«" }} MGDC is a collection of 3,818 unique digital and collectible NFTs
        relying on the Ethereum blockchain. We call them Gold-Diggers {{ "»" }}
      </div>
    </div>

    <!-- EXPECT -->
    <div class="longBg">
      <div id="project" class="viewContainer expect">
        <div class="center">
          <div class="inline expectInline">
            <img class="diamond" :src="require(`@/assets/imgs/diamond-10@1x.png`)" />
            <p class="title1 expectTitle">What to expect from your Gold-Digger ?</p>
            <img class="diamond" :src="require(`@/assets/imgs/diamond-11@1x.png`)" />
          </div>
          <div class="howCanCol">
            <div class="inline howCanColItem expect1">
              <p class="heart-logo">♥</p>
              <p class="textB">
                By owning one of these 3,818 NFTs, you will receive a Wealthy Ape and a
                Furry Lapdog as well. You will also be offered multiple opportunities:
                You’ll be able to live in a metaverse through the eyes of your
                Gold-Digger, rubbing shoulders with some of the most famous Apes, bating
                and digging-on them thanks to your Gold-Digger’s charming and unique
                attributes.
              </p>
            </div>
            <div class="inline howCanColItem expect2">
              <p class="pic-logo">♠</p>
              <p class="textB">
                Then, by activating the breeding function with your Wealthy Ape, you will
                be able to give birth to a Baby Ape and earn MGDC coin, enjoy your family
                life and be set for good.
              </p>
            </div>
          </div>
        </div>
        <img class="coin" :src="require(`@/assets/imgs/coin-5@1x.png`)" />
        <img class="goldduck" :src="require(`@/assets/imgs/goldduck-1@1x.png`)" />
        <img class="redlip" :src="require(`@/assets/imgs/redlip-2@2x.png`)" />
      </div>

      <!-- NFT -->
      <div class="bg3">
        <div class="viewContainer nft">
          <MonkeySlider class="slider" />
        </div>

        <!-- TRAILER -->
        <div class="viewContainer trailer">
          <p class="title1 trailerTitle">Trailer Video</p>

          <video controls class="trailerVideo" id="vid">
            <source
              :src="require(`@/assets/FASHION_SHOW_MGDC_V5.mp4`)"
              type="video/mp4"
            />
            Sorry, your browser doesn't support embedded videos.
          </video>
          <!-- <img class="trailerVideo" :src="require(`@/assets/imgs/coming-soon.png`)" /> -->

          <div class="butt2" @click="goToExternal('https://opensea.io/collection/mgdc')">
            Buy on OpenSea
          </div>
        </div>
      </div>

      <!-- REWARD -->
      <div id="exc-reward" class="viewContainer reward">
        <div class="center">
          <p class="title1 rewardTitle">
            What is the exclusive reward program for B.A.Y.C NFT owners ?
          </p>

          <div class="howCanCol" style="max-width: 1200px">
            <div class="inline howCanColItem excl1">
              <p class="trefle-logo">♣</p>
              <p class="text">
                The exclusive reward program is dedicated to B.A.Y.C NFT owners. To apply
                to the program send a message to any of our official accounts to verify
                yourself.
              </p>
            </div>
            <div class="inline howCanColItem excl2">
              <p class="lozange-logo">♦</p>
              <p class="text">
                The first 369 B.A.Y.C owners to join the program will be granted a free
                M.G.D.C Gold-Digger to tag along with your own Ape and dig on him as you
                will.
              </p>
            </div>
          </div>
        </div>
        <img class="redlip2" :src="require(`@/assets/imgs/redlip-2@1x.png`)" />
        <img class="coin2" :src="require(`@/assets/imgs/coin-5@1x_cut.png`)" />
        <img class="duck2" :src="require(`@/assets/imgs/goldduck-1@1x.png`)" />
      </div>

      <!-- WHO CAN -->
      <div id="whocan" class="viewContainer whoCan">
        <div class="center centerWhoCan">
          <p class="title1 whoCanTitle">Who can buy a Gold-Digger NFT ?</p>
          <div class="howCanCol" style="max-width: 1200px">
            <div class="inline howCanColItem who1">
              <p class="heart-logo">♥</p>
              <p class="textB">
                If you want your own meta gold digger nft, you better go on our page
                Opensea before you miss what could be your lifetime opportunity.
              </p>
            </div>
            <div class="inline howCanColItem who2">
              <p class="pic-logo">♠</p>
              <p class="textB">
                You are a B.A.Y.C owner and you are in the 369 first members of your
                community to join our discord server, identify yourself to any of our
                social media official account and get one complimentary MGDC NFT. You will
                still get automatically whitelisted if you were not among the first “369”
                BAYC members to join the club.
              </p>
            </div>
          </div>
        </div>

        <img class="shoe" :src="require(`@/assets/imgs/heelshoe@1x.png`)" />
        <img class="ring" :src="require(`@/assets/imgs/bague-1@1x.png`)" />
      </div>

      <!-- HOW CAN -->
      <div id="howcan" class="viewContainer howCan">
        <div class="center leftCrane">
          <p class="title1 howCanTitle">How can you use your Gold-Digger NFT ?</p>
          <div class="howCanCol" style="max-width: 1200px">
            <div class="inline howCanColItem how1">
              <img
                class="smalldiams"
                :src="require(`@/assets/imgs/diamant_small2.png`)"
              />
              <p class="text">
                Your Gold-Digger represents a unique gateway to the metaverse, and your
                exclusive access to the MGDC Mansion in which you will be able to meet the
                most notorious members of the NFT community.
              </p>
            </div>
            <div class="inline howCanColItem how2">
              <img
                class="smalldiams"
                :src="require(`@/assets/imgs/diamant_small3.png`)"
              />
              <p class="text">
                Your Gold-Digger will also come with her own Furry Lapdog in a future
                airdrop.
              </p>
            </div>
            <div class="inline howCanColItem how3">
              <img
                class="smalldiams"
                :src="require(`@/assets/imgs/diamant_small2.png`)"
              />
              <p class="text">
                Your Gold-Digger also needs a Wealthy Ape to dig on, therefore you will
                also receive a MGDC Wealthy Ape.
              </p>
            </div>
            <div class="inline howCanColItem how4">
              <img
                class="smalldiams"
                :src="require(`@/assets/imgs/diamant_small3.png`)"
              />
              <p class="text">
                If you want to go further, in a second phase your Gold Digger will be able
                to breed with your Wealthy Ape and give birth to a new Baby Ape.
              </p>
            </div>
            <div class="inline howCanColItem how5">
              <img
                class="smalldiams"
                :src="require(`@/assets/imgs/diamant_small2.png`)"
              />
              <p class="text">
                In a third phase Each Baby Ape will allow you to collect MGDC coins.
              </p>
            </div>
            <div class="inline howCanColItem how6">
              <img
                class="smalldiams"
                :src="require(`@/assets/imgs/diamant_small3.png`)"
              />
              <p class="text">
                Once you have created your family you and your Gold-Digger can get back to
                your lavish and glittery metaverse fast life.
              </p>
            </div>
          </div>
        </div>
        <div class="center rightCrane">
          <img class="crane" :src="require(`@/assets/imgs/Group 189.png`)" />
        </div>
      </div>
    </div>

    <!-- APPLICATION -->
    <div class="application">
      <div class="viewContainer appli">
        <div id="what-app" class="center appContLeft">
          <img class="champ" :src="require(`@/assets/imgs/champagne-singe@1x.png`)" />
        </div>
        <div id="what-app" class="center appContRight">
          <p class="title1 appTitle">
            What to do inside the MGDC Mansion in the Metaverse ?
          </p>
          <p class="textB apptxtp1">
            The MGDC Gold-Diggers are going to have a dedicated and exclusive hangout in
            Decentraland. The MGDC Mansion will be accessible by every MGDC Gold-Digger
            NFT owner and to the owners of the most notorious Ape NFTs. It will allow you
            to talk and maybe dig on the most notorious Apes.
          </p>
        </div>
      </div>

      <!-- ROADMAP -->
      <div class="viewContainer roadmap" id="roadmap">
        <div class="center roadmapCenter">
          <p class="title1 roadTitle">Roadmap</p>
          <div class="boxes">
            <RoadMapItem
              v-for="(item, i) in $store.state.RoadMap"
              :key="'rm' + i"
              :percent="item.percent"
              :color="item.color"
              :text="item.text"
              :id="'road' + i"
              :diams="item.diams"
              :empty="item.empty"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- HOW CAN -->
    <div id="team" class="viewContainer team">
      <div v-for="(team, i) in $store.state.teams" :key="'team_' + i">
        <div>
          <p class="title1 teamTitle">{{ team.title }}</p>
        </div>
        <div class="contentTeam ct2">
          <TeamCard
            v-for="(member, i) in team.members"
            :key="'member_' + i"
            :name="member.name"
            :pic="member.pic"
            :twitter="member.twitter"
            :insta="member.insta"
            :linkedin="member.linkedin"
            :discord="member.discord"
            :artstation="member.artstation"
            :id="'pcard' + i"
          />
        </div>
      </div>
    </div>

    <!-- Join US -->
    <div class="joinTheClub">
      <div class="title1 joinTheClubTitle">Join the club</div>
      <div class="howCanCol" style="max-width: 1200px">
        <div class="inline howCanColItem joinCol">
          <div
            class="discord-button"
            @click="goToExternal('https://discord.gg/jXB2Sxgxzz')"
          >
            <i class="fab fa-discord"></i> DISCORD
          </div>
        </div>
      </div>
      <div class="howCanCol" style="max-width: 1200px">
        <div class="inline howCanColItem joinCol">
          <div
            class="join-instagram-button"
            @click="goToExternal('https://www.instagram.com/mgdcofficial')"
          >
            <i class="fab fa-instagram" href="https://www.instagram.com/mgdcofficial/"></i
            >INSTAGRAM
          </div>
          <div
            class="join-twitter-button"
            @click="goToExternal('https://twitter.com/mgdcofficial')"
          >
            <i class="fab fa-twitter" href="https://twitter.com/mgdcofficial" />TWITTER
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MonkeySlider from "@/components/MonkeySlider";
import RoadMapItem from "@/components/RoadMapItem";
import TeamCard from "@/components/TeamCard";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default {
  name: "Home",
  components: { MonkeySlider, RoadMapItem, TeamCard },
  data() {
    return {};
  },
  mounted() {
    this.scrollAnimation();
  },
  methods: {
    goTo(name) {
      if (this.$route.name !== name) {
        this.$router.push({ name });
      }
    },
    goToExternal(url) {
      window.open(url);
    },
    scrollAnimation() {
      // EXPECT
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".expectTitle",
            start: "bottom bottom",
            end: "bottom bottom",
            markers: this.scrollMarker,
            scrub: false,
            pin: false,
          },
        })
        .from(".expectInline", { opacity: 0 })
        .from(".expect1", { x: -innerWidth, opacity: 0 })
        .from(".expect2", { x: innerWidth, opacity: 0 });

      // NFT
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".nft",
            start: "bottom bottom",
            end: "bottom bottom",
            markers: this.scrollMarker,
            scrub: false,
            pin: false,
          },
        })
        .from(".slider", { opacity: 0 });

      // TRAILLER
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".trailerTitle",
            start: "bottom bottom",
            end: "bottom bottom",
            markers: this.scrollMarker,
            scrub: false,
            pin: false,
          },
        })
        .from(".trailerTitle", { opacity: 0 })
        .from(".trailerVideo", { opacity: 0 })
        .from(".butt2", { opacity: 0 })
        .call(() => {
          let vid = document.getElementById("vid");
          vid.play();
        });

      // EXCLUSIVE
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".rewardTitle",
            start: "bottom bottom",
            end: "bottom bottom",
            markers: this.scrollMarker,
            scrub: false,
            pin: false,
          },
        })
        .from(".rewardTitle", { opacity: 0 })
        .from(".excl1", { x: -innerWidth, opacity: 0 })
        .from(".excl2", { x: innerWidth, opacity: 0 });

      // WHO CAN
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".whoCanTitle",
            start: "bottom bottom",
            end: "bottom bottom",
            markers: this.scrollMarker,
            scrub: false,
            pin: false,
          },
        })
        .from(".whoCanTitle", { opacity: 0 })
        .from(".who1", { x: -innerWidth, opacity: 0 })
        .from(".who2", { x: innerWidth, opacity: 0 });

      // HOW CAN
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".howCanTitle",
            start: "bottom bottom",
            end: "bottom bottom",
            markers: this.scrollMarker,
            scrub: false,
            pin: false,
          },
        })
        .from(".howCanTitle", { opacity: 0 })
        .from(".crane", { x: innerWidth, opacity: 0 })
        .from(".how1", { x: -innerWidth, opacity: 0 })
        .from(".how2", { x: -innerWidth, opacity: 0 })
        .from(".how3", { x: -innerWidth, opacity: 0 })
        .from(".how4", { x: -innerWidth, opacity: 0 })
        .from(".how5", { x: -innerWidth, opacity: 0 })
        .from(".how6", { x: -innerWidth, opacity: 0 });

      // APPLICATION
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".appTitle",
            start: "bottom bottom",
            end: "bottom bottom",
            markers: this.scrollMarker,
            scrub: false,
            pin: false,
          },
        })
        .from(".appTitle", { opacity: 0 })
        .from(".apptxtp1", { x: innerWidth, opacity: 0 })
        .from(".champ", { x: -innerWidth, opacity: 0 });

      // ROADMAP
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".roadTitle",
            start: "bottom bottom",
            end: "bottom bottom",
            markers: this.scrollMarker,
            scrub: false,
            pin: false,
          },
        })
        .from(".roadTitle", { opacity: 0 })
        .from("#road0", { x: -innerWidth, opacity: 0 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#road0",
            start: "bottom bottom",
            end: "bottom bottom",
            markers: this.scrollMarker,
            scrub: false,
            pin: false,
          },
        })
        .from("#road1", { x: innerWidth, opacity: 0 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#road1",
            start: "bottom bottom",
            end: "bottom bottom",
            markers: this.scrollMarker,
            scrub: false,
            pin: false,
          },
        })
        .from("#road2", { x: -innerWidth, opacity: 0 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#road2",
            start: "bottom bottom",
            end: "bottom bottom",
            markers: this.scrollMarker,
            scrub: false,
            pin: false,
          },
        })
        .from("#road3", { x: innerWidth, opacity: 0 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#road3",
            start: "bottom bottom",
            end: "bottom bottom",
            markers: this.scrollMarker,
            scrub: false,
            pin: false,
          },
        })
        .from("#road4", { x: -innerWidth, opacity: 0 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#road4",
            start: "bottom bottom",
            end: "bottom bottom",
            markers: this.scrollMarker,
            scrub: false,
            pin: false,
          },
        })
        .from("#road5", { x: innerWidth, opacity: 0 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#road5",
            start: "bottom bottom",
            end: "bottom bottom",
            markers: this.scrollMarker,
            scrub: false,
            pin: false,
          },
        })
        .from("#road6", { x: -innerWidth, opacity: 0 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#road6",
            start: "bottom bottom",
            end: "bottom bottom",
            markers: this.scrollMarker,
            scrub: false,
            pin: false,
          },
        })
        .from("#road7", { x: innerWidth, opacity: 0 });

      // TEAM
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".teamTitle",
            start: "bottom bottom",
            end: "bottom bottom",
            markers: this.scrollMarker,
            scrub: false,
            pin: false,
          },
        })
        .from(".teamTitle", { opacity: 0 })
        .from("#maincard", { y: -innerHeight, opacity: 0 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#maincard",
            start: "bottom bottom",
            end: "bottom bottom",
            markers: this.scrollMarker,
            scrub: false,
            pin: false,
          },
        })
        .from("#pcard0", { y: innerHeight, opacity: 0 })
        .from("#pcard1", { y: innerHeight, opacity: 0 })
        .from("#pcard2", { y: innerHeight, opacity: 0 })
        .from("#pcard3", { y: innerHeight, opacity: 0 })
        .from("#pcard4", { y: innerHeight, opacity: 0 })
        .from("#pcard5", { y: innerHeight, opacity: 0 })
        .from("#pcard6", { y: innerHeight, opacity: 0 })
        .from("#pcard7", { y: innerHeight, opacity: 0 })
        .from("#pcard8", { y: innerHeight, opacity: 0 })
        .from("#pcard9", { y: innerHeight, opacity: 0 })
        .from("#pcard10", { y: innerHeight, opacity: 0 })
        .from("#pcard11", { y: innerHeight, opacity: 0 })
        .from("#pcard12", { y: innerHeight, opacity: 0 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".joinTheClubTitle",
            start: "bottom bottom",
            end: "bottom bottom",
            markers: this.scrollMarker,
            scrub: false,
            pin: false,
          },
        })
        .from(".joinTheClubTitle", { opacity: 0 })
        .from(".discord-button", { y: -innerHeight, opacity: 0 })
        .from(".join-instagram-button", { x: -innerWidth, opacity: 0 })
        .from(".join-twitter-button", { x: innerWidth, opacity: 0 });
    },
  },
};
</script>

<style lang="scss">
/*************************************** TOPVIEW *****************************************/
.topView {
  margin-top: 100px;
  min-height: 100px;
}

@media screen and (max-width: 1400px) {
  .topView {
    margin-top: 80px;
  }
}

.topViewImg {
  object-fit: cover;
  width: 100%;
  height: auto;
}
/*************************************** TOPDESCR *****************************************/
.topDescr {
}

.topDescrTitle {
  font-family: Jumble;
  color: var(--white);
  font-weight: 400;
  letter-spacing: 0;
  background: linear-gradient(180deg, #e56932 0%, #ba3474 83.74%, #9b3782 100%);
  width: 100%;
  text-align: center;
  font-size: 30px;
  padding: 40px 20%;
  line-height: 45px;
}

@media screen and (max-width: $layout-breakpoint-xlarge) {
  .topDescrTitle {
    font-size: 25px;
    line-height: 35px;
    padding: 30px 20px;
  }
}

@media screen and (max-width: $layout-breakpoint-medium) {
  .topDescrTitle {
    font-size: 20px;
    line-height: 30px;
    padding: 20px 10px;
  }
}

.longBg {
  background: linear-gradient(180deg, #edbcad 1.31%, #f0d0df 27.36%, #edb8ed 56.4%);
}

/*************************************** EXPECT *****************************************/
.expect {
}

.expectTitle {
  color: $rusty-red;
  max-width: 900px;
  transition: all 100ms ease-in-out;
  animation: shineTitle4 3000ms infinite alternate;
}
@keyframes shineTitle4 {
  0% {
    filter: drop-shadow(0px 0px 0px $rusty-red);
  }
  50% {
    filter: drop-shadow(0px 0px 2px $rusty-red);
  }
  100% {
    filter: drop-shadow(0px 0px 0px $rusty-red);
  }
}

.diamond {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-top: 40px;
  animation: moveItem 2000ms infinite alternate;
}

.coin,
.goldduck,
.redlip {
  position: absolute;
  object-fit: cover;
  z-index: 1;
}
.coin {
  width: 30%;
  left: -200px;
  margin-top: -150px;
}
.goldduck {
  width: 200px;
  left: 100px;
  margin-top: 350px;
}
.redlip {
  width: 18%;
  right: 0px;
  margin-top: -100px;
}

@media screen and (max-width: $layout-breakpoint-large) {
  .goldduck {
    display: none;
  }
}

@media screen and (max-width: $layout-breakpoint-medium) {
  .diamond,
  .coin,
  .goldduck,
  .redlip {
    display: none;
  }
}

/*************************************** NFT *****************************************/
.bg3 {
  background-image: url("~@/assets/imgs/gold-digger-house-4@1x.png");
  background-size: 120% 100%;
  background-repeat: no-repeat;
  background-position-x: 20%;
}

.nft {
  width: 100vw;
  min-height: 0;
  margin-bottom: 150px;
  // margin-bottom: -400px;
  // margin-top: 100px;
  //border: 1px solid red;
}

@media screen and (max-width: $layout-breakpoint-medium) {
  .bg3 {
    background-image: url("~@/assets/imgs/gold-digger-house-4@1x.png");
    background-size: 250% 100%;
    background-repeat: no-repeat;
    background-position-x: 20%;
  }
}

/*************************************** TRAILER *****************************************/
.trailer {
  // background-image: url("~@/assets/imgs/gold-digger-house-4@1x.png");
  // background-size: 120% 100%;
  // background-repeat: no-repeat;
  // background-position-x: -100px;
  min-height: 0;
  overflow: visible;
}

.trailerTitle {
  text-transform: uppercase;
  max-width: 900px;
  font-size: 100px;
  // margin-top: 500px;
  filter: drop-shadow(10px -20px 1px rgb(229, 50, 97));
  transition: all 500ms ease-in-out;
  animation: moveTrailer 2000ms infinite linear;
}
@media screen and (max-width: $layout-breakpoint-large) {
  .trailerTitle {
    font-size: 100px;
  }
}
@media screen and (max-width: $layout-breakpoint-medium) {
  .trailerTitle {
    font-size: 80px;
  }
}
@media screen and (max-width: $layout-breakpoint-small) {
  .trailerTitle {
    font-size: 60px;
  }
}

.trailerVideo {
  width: 100%;
  max-width: 1200px;
  filter: drop-shadow(0px 0px 5px #ffffff);
}

@keyframes moveTrailer {
  0% {
    filter: drop-shadow(10px -22px 1px rgb(229, 50, 97));
    //opacity: 0.85;
    transform: translate(-3px, 0);
  }
  50% {
    filter: drop-shadow(-10px -18px 1px rgb(229, 50, 97));
    //opacity: 1;
    transform: translate(3px, 0);
  }
  100% {
    filter: drop-shadow(10px -22px 1px rgb(229, 50, 97));
    //opacity: 0.85;
    transform: translate(-3px, 0);
  }
}

.trailerVideo {
  width: 80%;
  margin: auto;
  z-index: 200;
}

.butt2 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  cursor: pointer;
  border-radius: 35px;
  font-family: var(--font-family-jaapokki-regular);
  font-size: 30px;
  line-height: 100px;
  background-color: $cerise-red;
  padding: 10px 30px;
  margin: auto;
  margin-top: 50px;

  .fab {
    font-size: 75px;
    padding: 10px;
    margin-right: 30px;
  }
  opacity: 0.9;
  transition: all 100ms ease-in-out;
  &:hover {
    filter: drop-shadow(0px 0px 5px $cerise-red);
    opacity: 1;
    transform: translateY(-1px);
  }
  margin-bottom: 50px;
}

@media screen and (max-width: $layout-breakpoint-medium) {
  .butt2 {
    font-size: 18px;
    line-height: 70px;
    background-color: $cerise-red;
    padding: 0px 20px;
    border-radius: 25px;
    .fab {
      font-size: 40px;
      padding: 10px;
      margin-right: 10px;
      margin-top: 3px;
    }
  }
}

/*************************************** REWARD *****************************************/
.reward {
  background-image: url("~@/assets/imgs/trac-251x.png");
  background-size: 200% 100%;
  background-position-x: 30%;
  // padding-top: 100px;
  // padding-bottom: 100px;
}

.rewardTitle {
  color: #f49f88;
  max-width: 1200px;
  transition: all 100ms ease-in-out;
  animation: shineTitle3 3000ms infinite alternate;
}
@keyframes shineTitle3 {
  0% {
    filter: drop-shadow(0px 0px 0px #f49f88);
  }
  50% {
    filter: drop-shadow(0px 0px 2px #f49f88);
  }
  100% {
    filter: drop-shadow(0px 0px 0px #f49f88);
  }
}

.duck2 {
  position: absolute;
  width: 20%;
  left: 0;
  margin-top: 300px;
  transition: all 100ms ease-in-out;
  animation: moveItem 3200ms infinite alternate;
}

.coin2 {
  position: absolute;
  right: 0;
  margin-top: -400px;
  width: 15%;
}

.redlip2 {
  position: absolute;
  left: 100px;
  margin-top: -700px;
  width: 20%;
  transition: all 100ms ease-in-out;
  animation: moveItem 2300ms infinite alternate;
}

@keyframes moveItem {
  0% {
    filter: drop-shadow(0px 0px 0px rgba(255, 255, 255, 255));
    transform: rotate(3deg);
  }
  50% {
    filter: drop-shadow(0px 0px 5px rgba(255, 255, 255, 255));
    transform: rotate(-3deg);
  }
  100% {
    filter: drop-shadow(0px 0px 0px rgba(255, 255, 255, 255));
    transform: rotate(3deg);
  }
}

@media screen and (max-width: $layout-breakpoint-medium) {
  .duck2,
  .coin2,
  .redlip2 {
    display: none;
  }
}

/*************************************** WHO CAN *****************************************/
.whoCan {
  min-height: 60vh;
}

.whoCanTitle {
  color: $thunderbird;
  max-width: 800px;
  transition: all 100ms ease-in-out;
  animation: shineTitle2 3000ms infinite alternate;
}
@keyframes shineTitle2 {
  0% {
    filter: drop-shadow(0px 0px 0px $thunderbird);
  }
  50% {
    filter: drop-shadow(0px 0px 2px $thunderbird);
  }
  100% {
    filter: drop-shadow(0px 0px 0px $thunderbird);
  }
}

.shoe {
  position: absolute;
  width: 20%;
  right: 0;
  margin-top: 0;
}
.ring {
  position: absolute;
  width: 15%;
  left: 0;
  margin-top: 100px;
  transition: all 100ms ease-in-out;
  animation: moveItem 2000ms infinite alternate;
}

@media screen and (max-width: $layout-breakpoint-medium) {
  .shoe,
  .ring {
    display: none;
  }
}

/*************************************** HOW CAN *****************************************/
.howCan {
  background-image: url("~@/assets/imgs/trac-251x.png");
  background-size: 228% 110%;
  background-position-x: 50%;
  background-position-y: 50%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: nowrap;
}

.howCanTitle {
  // max-width: 900px;
  transition: all 100ms ease-in-out;
  animation: shineTitle 3000ms infinite alternate;
}

.leftCrane {
  justify-content: flex-end;
  margin-left: 50px;
  max-width: 1000px;
}

.rightCrane {
  display: flex;
  flex-direction: column;
  justify-content: center;
  //border: 1px solid blue;
}

.smalldiams {
  width: 70px;
  height: 70px;
  padding: 5px;
  margin-right: 10px;
  //border: 1px solid red;
}

.crane {
  object-fit: cover;
  z-index: 1;
  width: 100%;
  transition: all 100ms ease-in-out;
  animation: craneMove 3000ms infinite alternate;
}

@keyframes craneMove {
  0% {
    filter: drop-shadow(0px 0px 0px rgba(255, 255, 255, 255));
    transform: rotate(2deg);
  }
  50% {
    filter: drop-shadow(0px 0px 3px rgba(255, 255, 255, 255));
    transform: rotate(-2deg);
  }
  100% {
    filter: drop-shadow(0px 0px 0px rgba(255, 255, 255, 255));
    transform: rotate(2deg);
  }
}

@keyframes shineTitle {
  0% {
    filter: drop-shadow(0px 0px 0px rgba(255, 255, 255, 255));
  }
  50% {
    filter: drop-shadow(0px 0px 3px rgba(255, 255, 255, 255));
  }
  100% {
    filter: drop-shadow(0px 0px 0px rgba(255, 255, 255, 255));
  }
}

@media screen and (max-width: $layout-breakpoint-xxlarge) {
  .leftCrane {
    margin-left: 25px;
    max-width: 900px;
  }
}

@media screen and (max-width: $layout-breakpoint-medium) {
  .smalldiams {
    display: none;
  }
  .howCan {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    flex-wrap: nowrap;
  }
}

/*************************************** APPLICATION *****************************************/
.application {
  background-color: white;
  background-image: url("~@/assets/imgs/GOLD-DIGGER HOUSE-b2.png");
  background-size: 200%;
  box-shadow: 0px 1px 10px $white;
}

.appli {
  min-height: 50vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: nowrap;
}

.appTitle {
  color: rgb(229, 50, 97);
  transition: all 100ms ease-in-out;
  animation: shineTitle5 3000ms infinite alternate;
}
@keyframes shineTitle5 {
  0% {
    filter: drop-shadow(0px 0px 0px rgb(229, 50, 97));
  }
  50% {
    filter: drop-shadow(0px 0px 3px rgb(229, 50, 97));
  }
  100% {
    filter: drop-shadow(0px 0px 0px rgb(229, 50, 97));
  }
}

.appContLeft {
  display: flex;
  flex-direction: column;
  justify-content: center;
  //border: 1px solid blue;
}

.appContRight {
  max-width: 1000px;
  margin-right: 50px;
  //border: 1px solid red;
}

.champ {
  object-fit: cover;
  z-index: 1;
  max-width: 100%;
  margin-left: -50px;
  transition: all 100ms ease-in-out;
  animation: craneMove 3000ms infinite alternate;
}

@media screen and (max-width: $layout-breakpoint-xxlarge) {
  .appContRight {
    max-width: 900px;
    margin-right: 25px;
  }
  .appContLeft {
    max-width: 900px;
    margin-left: 0;
  }
}
@media screen and (max-width: $layout-breakpoint-medium) {
  .appli {
    display: flex;
    flex-direction: column-reverse;
    justify-content: space-evenly;
    flex-wrap: nowrap;
  }
}

/*************************************** ROADMAP *****************************************/
.roadmap {
  justify-content: center;
  margin: auto;
}

.roadmapCenter {
  justify-content: center;
  margin: auto;
}

.roadTitle {
  color: rgb(229, 50, 97);
  transition: all 100ms ease-in-out;
  animation: shineTitle6 3000ms infinite alternate;
}
@keyframes shineTitle6 {
  0% {
    filter: drop-shadow(0px 0px 0px rgb(229, 50, 97));
  }
  50% {
    filter: drop-shadow(0px 0px 3px rgb(229, 50, 97));
  }
  100% {
    filter: drop-shadow(0px 0px 0px rgb(229, 50, 97));
  }
}

.boxes {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/*************************************** Team *****************************************/
.team {
  background: linear-gradient(180deg, #e56932 0%, #ba3474 83.74%, #9b3782 100%);
  box-shadow: 0px -5px 10px #e56932;
}

.teamTitle {
  color: $white;
  max-width: 1200px;
  text-align: center;
  transition: all 100ms ease-in-out;
  animation: shineTitle6 3000ms infinite alternate;
  margin-bottom: 100px;
  margin-top: 100px;
}
@keyframes shineTitle6 {
  0% {
    filter: drop-shadow(0px 0px 0px $white);
  }
  50% {
    filter: drop-shadow(0px 0px 3px $white);
  }
  100% {
    filter: drop-shadow(0px 0px 0px $white);
  }
}

.contentTeam {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  margin: auto;
  width: 100%;
  max-width: 1600px;
  //border: 1px solid red;
}

/*************************************** Join the club *****************************************/
.joinTheClub {
  width: 100%;
  background-color: white;
  background-image: url("~@/assets/imgs/gold-digger-house1x.png");
  background-size: 100%;
  text-align: center;
  margin: 0 auto 0 auto;
  padding-top: 10px;
  padding-bottom: 50px;
  box-shadow: 0px -5px 10px $white;
}

.joinTheClubTitle {
  //font-size: 60px;
  max-width: 900px;
  margin: auto;
  margin-bottom: 50px;
  margin-top: 50px;
  transition: all 100ms ease-in-out;
  animation: shineTitle7 3000ms infinite alternate;
}
@keyframes shineTitle7 {
  0% {
    filter: drop-shadow(0px 0px 0px $white);
  }
  50% {
    filter: drop-shadow(0px 0px 3px $white);
  }
  100% {
    filter: drop-shadow(0px 0px 0px $white);
  }
}

.joinCol {
  width: 100%;
  max-width: 700px;
  margin: auto;
  justify-content: center;
}

.discord-button,
.join-instagram-button,
.join-twitter-button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  cursor: pointer;
  height: 60px;
  line-height: 60px;
  border-radius: 20px;
  margin: 15px;
  font-family: var(--font-family-jaapokki-regular);
  font-size: 20px;
  font-weight: 600;
  .fab {
    font-size: 40px;
    padding: 10px;
  }
  opacity: 0.9;
  transition: all 100ms ease-in-out;
  &:hover {
    opacity: 1;
    transform: translateY(-1px);
  }
}

.discord-button {
  background-color: $cerise-red;
  width: 100%;
  font-weight: 100;
  padding-top: 1px;
  .fab {
    margin-top: -2px;
  }
  &:hover {
    filter: drop-shadow(0px 0px 5px $cerise-red);
  }
}

.join-instagram-button {
  background-color: #df5f3d;
  width: 50%;
  font-weight: 100;
  padding-top: 2px;
  z-index: 10;
  .fab {
    margin-top: -2px;
  }
  &:hover {
    filter: drop-shadow(0px 0px 5px #df5f3d);
  }
}
.join-twitter-button {
  background-color: #a6357d;
  width: 50%;
  font-weight: 100;
  padding-top: 2px;
  z-index: 10;
  .fab {
    margin-top: -2px;
  }
  &:hover {
    filter: drop-shadow(0px 0px 5px #a6357d);
  }
}

@media screen and (max-width: $layout-breakpoint-medium) {
  .discord-button,
  .join-instagram-button,
  .join-twitter-button {
    font-size: 15px;
    .fab {
      font-size: 30px;
      padding: 10px;
      margin-top: 2px;
      padding-left: 0px;
    }
  }
}
</style>
