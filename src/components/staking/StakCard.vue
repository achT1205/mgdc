<template>
  <div class="stak">
    <div class="d-flex align-center checking">
      <h3>Stack</h3>
      <div class="d-flex checkeboxes">
        <button class="btn-check ml-2" :class="{ active: stack === 'mgdc' }">
          <input id="mgdc" type="radio" name="stack" v-model="stack" value="mgdc" />
          <label for="mgdc"> mgdc</label>
        </button>
        <div class="tooltip">
          <button class="btn-check ml-2">
            <input id="brred-bayc" type="radio" name="stack" />
            <label for="brred-bayc">Breed BAYC</label>
          </button>
          <span class="tooltiptext">Coming soon</span>
        </div>

        <div class="tooltip">
          <button class="btn-check ml-2">
            <input id="brred-hape" type="radio" name="stack" />
            <label for="brred-hape">Breed Hape</label>
          </button>
          <span class="tooltiptext">Coming soon</span>
        </div>
      </div>
    </div>
    <div class="d-flex texts">
      <p>Selecte the NFTs you want to stake</p>
    </div>
    <div class="d-flex stak-ids">
      <div class="form-group">
        <label>MGDC :</label>
        <!-- <div class="mt-1">
          <div class="stak-id" v-for="id in ids" :key="id" @click="select(id)">
            ID: {{ id }} <i class="fas fa-times" @click="remove(id)"></i>
          </div>
        </div> -->
        <!-- <input type="number" :max="balance" class="input-field" v-model="ids" /> -->

        <label v-for="mgdc in localmgdcs" :key="mgdc.id">
          <input
            type="checkbox"
            :id="mgdc.id"
            :name="mgdc.id"
            v-model="mgdc.selected"
            class="btn"
            hidden="true"
          />
          <label class="chip" :class="mgdc.selected ? 'active-chip' : ''" :for="mgdc.id">
            <div class="chip-head">
              <img
                :src="`https://metagolddiggerclub.com/img/thumbnails/${mgdc.id}.png`"
              />
            </div>
            <div class="chip-content">#{{ mgdc.id }}</div>
            <div class="chip-close">
              <svg
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
          </label>
        </label>
      </div>
      <div class="qty d-flex">
        <p>Quantity</p>
        <p>Staking {{ quantity }} mgdc<span v-if="quantity > 1">s</span></p>
      </div>
      <div class="reward-per-day d-flex">
        <p>mgdc reward increase</p>
        <div class="increase-per-day">+ 65 mgdc / day</div>
      </div>
    </div>
    <div class="d-flex stak-btn">
      <button class="approve-stack-btn" @click="appveAndStake">Approve && staking</button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: ["balance", "stakecontract", "mgdccontract", "approved", "fetchStakeds"],
  data: () => ({
    stack: "mgdc",
    localmgdcs: [],
    mgdcBalance: null,
  }),
  async mounted() {
    await this.init();
  },
  computed: {
    ...mapGetters(["account"]),
    quantity() {
      if (this.localmgdcs && this.localmgdcs.length)
        return this.localmgdcs.filter((_) => _.selected).length;
      return 0;
    },
  },
  methods: {
    async init() {
      this.$store.commit("SET_PROFILE_IS_LOADING", true);
      this.mgdcBalance = await this.mgdccontract.methods.balanceOf(this.account).call();
      if (this.mgdcBalance > 0) {
        for (let index = 0; index < this.mgdcBalance; index++) {
          const mgdc = {
            selected: false,
          };
          mgdc.id = await this.mgdccontract.methods
            .tokenOfOwnerByIndex(this.account, index)
            .call();

          this.localmgdcs.push(mgdc);
        }
      }
      this.$store.commit("SET_PROFILE_IS_LOADING", false);
    },
    async appveAndStake() {
      this.$store.commit("SET_PROFILE_IS_LOADING", true);
      const ids = this.localmgdcs.filter((_) => _.selected).map((_) => parseInt(_.id));
      if (!this.approved) {
        await this.mgdccontract.methods
          .setApprovalForAll(process.env.VUE_APP_MGDC_STAKE, true)
          .send({ from: this.account });
      }

      const approved = await this.mgdccontract.methods
        .isApprovedForAll(this.account, process.env.VUE_APP_MGDC_STAKE)
        .call();

      if (approved) {
        await this.stakecontract.methods.stakeMGDCByIds(ids).send({ from: this.account });
        await this.init();
        this.$store.commit("SET_PROFILE_IS_LOADING", false);
        this.$emit("fetchStakeds","unstake")
      }
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

.active-chip {
  border: 1px solid #eea1c5 !important;
}

.chip {
  display: inline-flex;
  flex-direction: row;
  background: rgba(130, 18, 70, 0.8);
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
  color: pink;
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
    margin-top: 20px;
}
</style>
