<template>
  <div class="teamMember" v-if="localmgdc && localmgdc.id">
    <p class="text name">ID: {{ localmgdc.id }}</p>
    <p class="text name">Has breeded: {{ localmgdc.hasBreed ? "Yes" : "No" }}</p>
    <p class="text name" style="margin-bottom: 10px">
      Is Listed to breed: {{ localmgdc.isListed ? "Yes" : "No" }}
    </p>
    <div class="picContainer">
      <div class="img-blc">
        <img
          class="pic"
          :src="`https://metagolddiggerclub.com/img/thumbnails/${localmgdc.id}.png`"
        />
        <div class="tooltip">
          <a @click="toggle">
            <i class="fas fa-pencil"></i>
          </a>
          <span class="tooltiptext">Edit biography</span>
        </div>
      </div>
    </div>
    <button class="connectButton" @click="list(localmgdc)">
      {{ localmgdc.isListed ? "Already Listed" : "List on Tinder-Ape" }}
    </button>
    <div class="modal-window" v-show="show">
      <div>
        <a title="Close" class="modal-close" @click="show = false">
          <i class="fas fa-times-circle close"></i>
        </a>
        <div class="form-group">
          <label>Biography :</label>
          <textarea
            v-model="biography"
            placeholder="type your biography here "
          ></textarea>
        </div>
        <button class="btn-save" @click="save">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "BreedCard",
  props: ["mgdc", "contract", "toggleLoading", "listMgdc"],
  computed: {
    ...mapGetters(["curremgdc"]),
  },
  watch: {
    curremgdc(val, old) {
      if (val != old && val) {
        this.biography = val.biography;
      }
    },
  },
  data() {
    return {
      style: "",
      localmgdc: null,
      show: false,
      biography: null,
    };
  },
  async mounted() {
    this.localmgdc = { ...this.mgdc };
  },
  methods: {
    async toggle() {
      this.$store.commit("SET_PROFILE_IS_LOADING", true);
      await this.$store.dispatch("getMgdc", this.localmgdc.id);
      this.show = true;
      this.$store.commit("SET_PROFILE_IS_LOADING", false);
    },
    async save() {
      this.$store.commit("SET_PROFILE_IS_LOADING", true);
      await this.$store.dispatch("upadeteMgdc", {
        biography: this.biography,
        id: this.localmgdc.id,
      });
      this.$store.commit("SET_PROFILE_IS_LOADING", false);
      this.show = false;
    },
    goToExternal(url) {
      window.open(url);
    },
    list(mgdc) {
      if (mgdc.isListed) return;
      this.$emit("listMgdc", mgdc.id);
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

.btn-save {
  border: 1px solid #821246;
  background: #821246;
  padding: 5px 30px;
}

.form-group {
  text-align: left;
  label {
    text-align: left;
  }
}

textarea {
  margin-top: 15px;
  width: 100%;
  border: 1px solid #821246;
  background: #821246;
  padding: 7px;
  outline: none;
  color: white;
  resize: none;
  height: 150px;
  margin-bottom: 15px;
}

::placeholder {
  color: white;
  font-family: var(--font-family-acme);
}
.img-blc {
  max-width: 200px;
  height: 200px;
  margin: auto;
  position: relative;
  .tooltip {
    position: absolute;
    top: -5px;
    right: -5px;
  }
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
  .img-blc {
    max-width: 150px;
    height: 150px;
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

.modal-window {
  position: fixed;
  background-color: rgba(255, 255, 255, 0.25);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s;
  visibility: visible;
  opacity: 1;
  pointer-events: auto;
  & > div {
    width: 600px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 2em;
    background: linear-gradient(180deg, #e56932 0%, #ba3474 83.74%, #9b3782 100%);
    box-shadow: 0 0 20px #e56932;
  }
  header {
    font-weight: bold;
  }
  h1 {
    font-size: 150%;
    margin: 0 0 15px;
  }
}

.modal-close {
  color: #aaa;
  font-size: 80%;
  position: absolute;
  right: -24px;
  text-align: center;
  top: -10px;
  width: 70px;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    color: black;
  }
  .close {
    color: white;
  }
}

.modal-window {
  z-index: 1000;
  & > div {
    border-radius: 1rem;
  }
}

.modal-window div:not(:last-of-type) {
  margin-bottom: 15px;
}

.tooltip {
  position: relative;
  display: inline-block;
  z-index: 999;
  a {
    cursor: pointer;
  }
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: #aa3c75;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;

  position: absolute;
  z-index: 1;
  bottom: 100%;
  left: 50%;
  margin-left: -60px;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
