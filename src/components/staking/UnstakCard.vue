<template>
  <div class="stak">
    <div class="d-flex align-center checking">
      <h3>Unstack</h3>
      <div class="d-flex checkeboxes">
        <button class="btn-check ml-2" :class="{ active: stack === 'mgdc' }">
          <input id="umgdc" type="radio" name="unstack" v-model="stack" value="mgdc" />
          <label for="umgdc">mgdc</label>
        </button>
        <!-- <button class="btn-check ml-2" :class="{active: stack === 'c-02'}">
          <input id="uc-02" type="radio" name="unstack" v-model="stack" value="c-02" />
          <label for="uc-02">c-02</label>
        </button> -->
      </div>
    </div>
    <div class="d-flex texts">
      <p>Selecte the NFTs you want to unstake</p>
    </div>
    <div class="d-flex stak-ids">
      <div class="form-group">
        <label>MGDCs :</label>
        <div
          class="chip"
          v-for="mgdc in localmgdcs"
          :key="mgdc.id"
          @click="select(mgdc.id)"
        >
          <div class="chip-head">
            <img :src="`https://metagolddiggerclub.com/img/thumbnails/${mgdc.id}.png`" />
          </div>
          <div class="chip-content">#{{ mgdc.id }}</div>
          <div class="chip-close">
            <svg
              @click="remove(mgdc.id)"
              v-show="mgdc.selected"
              class="chip-svg"
              focusable="false"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div class="qty d-flex">
        <p>Quantity</p>
        <p>Unstaking {{ quantity }} mgdc<span v-if="quantity > 1">s</span></p>
      </div>
      <div class="reward-per-day d-flex">
        <p>mgdc reward increase</p>
        <div class="increase-per-day">+ 65 c01 / day</div>
      </div>
    </div>
    <div class="d-flex stak-btn">
      <button class="approve-stack-btn">Approve Unstaking</button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: ["balance", "stakecontract", "mgdccontract", "approved"],
  data: () => ({
    stack: "mgdc",
    localmgdcs: null,
    ids: "",
    staks: ["997", "881", "335"],
  }),
  async mounted() {
    await this.$store.dispatch(
      "getStakeds",
      "0x6bc1aE69f3D7eBa3e80c2465c3195fb6d42Cd29d" /*this.account*/
    );
  },
  watch: {
    stakeds(val, old) {
      if (val != old && val) {
        this.localmgdcs = val;
      }
    },
  },
  computed: {
    ...mapGetters(["account", "stakeds"]),
    quantity() {
      if (this.localmgdcs && this.localmgdcs.length)
        return this.localmgdcs.filter((_) => _.selected).length;
      return 0;
    },
  },

  methods: {
    remove(id) {
      const index = this.localmgdcs.findIndex((_) => _.id == id);
      if (index > -1) {
        this.localmgdcs[index].selected = false;
      }
    },
    select(id) {
      const index = this.localmgdcs.findIndex((_) => _.id == id);
      if (index > -1) {
        this.localmgdcs[index].selected = true;
      }
    },
    async appveAndUnstake() {
      const ids = this.localmgdcs.filter((_) => _.selected).map((_) => _.id);
      if (!this.approved)
        this.approved = await this.mgdccontract.methods
          .setApprovalForAll(this.account, this.stakecontract)
          .sen({ from: this.account });

      if (this.approved)
        this.stakecontract.methods.unstakeMGDCByIds(ids).sen({ from: this.account });
    },
  },
};
</script>
<style lang="scss" scoped>
.stak h3 {
  font-size: 22px;
  text-transform: uppercase;
  text-shadow: 0 0 3px #ffffff;
}
.d-flex {
  display: flex;
}
.align-center {
  align-items: center;
}
.ml-2 {
  margin-left: 8px;
}
.checkeboxes input {
  display: none;
}
.btn-check {
  border: 1px solid #eea1c5;
  border-radius: 3px;
  background: rgba(130, 18, 70, 0.8);
  opacity: 0.5;
  padding: 8px 5px;
  cursor: pointer;
  label {
    cursor: pointer;
    display: block;
  }
}
.mt-1 {
  margin-top: 4px;
}
.btn-check.active {
  opacity: 1;
}
.texts {
  margin: 30px 0;
}
.stak-ids {
  padding-top: 30px;
  border-top: 1px solid #fff;
  width: 100%;
  flex-wrap: wrap;
}
.form-group {
  width: 100%;
  text-align: left;
  margin-bottom: 30px;
  label {
    text-align: left;
  }
  .input-field {
    margin-top: 5px;
    width: 100%;
    border: 1px solid #821246;
    background: #821246;
    padding: 7px;
    outline: none;
    color: white;
  }
}

.stak-id {
  border: 1px solid #821246;
  background: #821246;
  display: inline-block;
  margin: 0 2px;
  padding: 3px 12px 3px 5px;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  opacity: 0.9;
  position: relative;
  .fa-times {
    position: absolute;
    font-size: 10px;
    top: 0;
    right: 1px;
  }
  &:hover {
    opacity: 1;
    box-shadow: 0px 0px 7px 0px #ffffff;
  }
}

.qty,
.reward-per-day {
  justify-content: space-between;
  width: 100%;
  margin-bottom: 15px;
  .increase-per-day {
    color: #ff74b4;
  }
}

.stak-btn {
  width: 100%;
  display: flex;
  justify-content: center;
  button {
    border-radius: 3px;
    border: 1px solid #eea1c5;
    padding: 8px 25px;
    background: #6d0234;
    font-size: 16px;
    letter-spacing: 1.5px;
    display: flex;
    align-items: center;
    font-weight: bold;
    min-width: 230px;
    text-align: center;
    display: flex;
    justify-content: center;
  }
}

.chip {
  display: inline-flex;
  flex-direction: row;
  background-color: #e5e5e5;
  border: none;
  cursor: default;
  height: 36px;
  outline: none;
  padding: 0;
  font-size: 14px;
  font-color: #333333;
  font-family: "Open Sans", sans-serif;
  white-space: nowrap;
  align-items: center;
  border-radius: 16px;
  vertical-align: middle;
  text-decoration: none;
  justify-content: center;
}
.chip-head {
  display: flex;
  position: relative;
  overflow: hidden;
  background-color: #32c5d2;
  font-size: 1.25rem;
  flex-shrink: 0;
  align-items: center;
  user-select: none;
  border-radius: 50%;
  justify-content: center;
  width: 36px;
  color: #fff;
  height: 36px;
  font-size: 20px;
  margin-right: -4px;
}
.chip-content {
  cursor: inherit;
  display: flex;
  align-items: center;
  user-select: none;
  white-space: nowrap;
  padding-left: 12px;
  padding-right: 12px;
}
.chip-svg {
  color: #999999;
  cursor: pointer;
  height: auto;
  margin: 4px 4px 0 -8px;
  fill: currentColor;
  width: 1em;
  height: 1em;
  display: inline-block;
  font-size: 24px;
  transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  user-select: none;
  flex-shrink: 0;
}
.chip-svg:hover {
  color: #666666;
}

.chip-close {
  margin-top: 10px;
}

.chip img {
  float: left;
  margin: 0;
  height: 40px;
  width: 46px;
  border-radius: 50%;
}
</style>
