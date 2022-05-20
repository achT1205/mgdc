<template>
  <div class="sidebar">
    <button class="btn-sidebar" @click.prevent="showSidebar = true" v-if="!showSidebar">
      <i class="fas fa-bars"></i>
    </button>
    <div class="backdrop" :class="showSidebar ? 'd-flex' : ''">
      <div class="modal" :class="showSidebar ? 'open' : ''">
        <div class="modal-content">
          <div class="modal-header">
            <h1>Mes Matchs</h1>
            <button
              class="search-btn"
              :class="show ? 'active' : ''"
              @click="show = !show"
            >
              <i class="fas fa-search fa-sm"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="search" :class="show ? 'show' : ''">
              <label>Search</label>
              <input
                type="text"
                ref="search"
                v-model="search"
                placeholder="Search by ID"
                @keydown.enter="filter"
              />
            </div>
            <ul
              class="match-list"
              :class="show ? 'with-search' : ''"
              v-if="matches && matches.length > 0"
            >
              <li
                v-for="(item, index) in matches"
                :key="index"
                :class="curremgdcid === item.mgdcId ? 'active' : ''"
                @click.prevent="onSelect(item, false)"
              >
                <div class="avatar">
                  <img
                    :src="`https://metagolddiggerclub.com/img/thumbnails/${item.mgdcId}.png`"
                  />
                </div>
                <div class="breed-content">
                  <div class="has-breed">
                    <i class="fas fa-heart" :class="item.hasBreed ? 'down' : 'up'"></i>
                  </div>
                  <div class="name">
                    {{ item.mgdcName }}
                  </div>
                  <div
                    class="join-us-on-discord2"
                    v-if="!profile && !item.hasBreed"
                    @click="onBreed(item)"
                  >
                    Breed now
                  </div>
                </div>
                <svg
                  class="spinner"
                  viewBox="0 0 50 50"
                  v-if="breeding && item.mgdcId == selected"
                >
                  <circle
                    class="path"
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke-width="5"
                  ></circle>
                </svg>
              </li>
            </ul>
            <div v-else class="no-matches-yet">Pas encore de matchs !</div>
          </div>
        </div>
      </div>
      <div class="backdrop-mask" @click="showSidebar = false">
        <div class="close-btn">
          <button @click.prevent="showSidebar = false" v-if="showSidebar">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  props: ["breed", "profile"],
  data: () => ({
    show: false,
    showSidebar: false,
    search: "",
    selected: null,
  }),
  mounted() {},
  watch: {
    show(val) {
      if (val === true) {
        this.$refs.search.focus();
      }
    },
  },
  computed: {
    ...mapGetters([
      "matches",
      "curremgdcid",
      "account",
      "conversations",
      "chatId",
      "breeding",
    ]),
  },
  methods: {
    filter() {
      this.$store.commit("SET_FILTERED_MATCHES", this.search);
    },
    onSelect(item, origine) {
      this.$store.commit("SET_CHATCH_ID", item.chatId);
      if (!origine) this.$store.dispatch("getMeessages", item.chatId);
      this.$store.commit("SET_MATCH_ACTIVE", item.mgdcId);
      this.$store.commit("SET_CURRENET_NAME", item.mgdcName);
      this.$store.commit("SET_IS_CHAT_OPEN", true);
      let participants = [];
      const me = {
        id: this.account,
        name: item.mgdcName,
        imageUrl: "",
      };
      let other = null;

      const conv = this.conversations.find((_) => _.chatId == this.chatId);
      if (conv)
        other = {
          id: conv.to === this.account ? conv.owner : conv.to,
          name: conv.to === this.account ? conv.owner : conv.to,
          imageUrl: `https://metagolddiggerclub.com/img/thumbnails/${item.mgdcId}.png`,
        };
      participants.push(me);
      if (other) participants.push(other);
      this.$store.commit("SET_PARTICIPANTS", participants);
    },
    onBreed(item) {
      this.selected = item.mgdcId;
      this.$store.commit("SET_BREEDING", true);
      this.$emit("breed", item);
    },
  },
};
</script>
<style scoped lang="scss">
.spinner {
  animation: rotate 2s linear infinite;
  z-index: 2;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -25px 0 0 -25px;
  width: 50px;
  height: 50px;

  & .path {
    stroke: pink;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }
}

.sidebar {
  .btn-sidebar {
    border: 0;
    font-size: 30px;
  }
  .btn-sidebar:hover {
    box-shadow: none;
  }
  position: fixed;
  z-index: 1002;
  top: 20px;
  left: 20px;
}
.backdrop {
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1000;
  display: none;
  .modal {
    max-width: 250px;
    z-index: 1005;
    width: 100%;
    background: white;
    overflow: auto;
    transform: translateX(-250px);
    transition: all 500ms ease-out;
  }
  .modal.open {
    transform: translateX(0);
  }
  .modal-content {
    width: 100%;
    .modal-header {
      font-family: var(--font-family-acme);
      display: flex;
      background: linear-gradient(180deg, #e56932 0%, #ba3474 83.74%, #9b3782 100%);
      color: white;
      padding: 10px 12px;
      justify-content: space-between;
      align-items: center;
      .search-btn {
        background: none;
        border: 2px solid #fff;
        border-radius: 100%;
        width: 29px;
        text-align: center;
        height: 29px;
      }
      .search-btn.active {
        opacity: 1;
        transform: translateY(-1px);
        box-shadow: 0px 0px 7px 0px #ffffff;
      }
    }
    .modal-body {
      width: 100%;
      color: #000000;
      .search {
        width: 100%;
        padding: 20px 12px 20px;
        position: relative;
        background: #edf4f6;
        display: none;
        label {
          background: #edf4f6;
          position: absolute;
          top: 12px;
          left: 21px;
          padding: 0 5px;
        }
        input {
          border: 1px solid #a0367f;
          height: 35px;
          border-radius: 3px;
          width: 100%;
          background: transparent;
          outline: none;
        }
      }
      .search.show {
        display: block;
      }
    }
  }

  .no-matches-yet {
    margin-top: 50px;
  }

  .match-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px 12px 10px 12px;
    margin: 0;
    height: 92vh;
    overflow: auto;
    background: #edf4f6;
    li {
      cursor: pointer;
      width: 100%;
      display: flex;
      padding: 6px;
      align-items: center;
      border: 1px solid #ccc;
      margin: 5px 0;
      background: white;
      border-radius: 10px;
      position: relative;
      .avatar {
        max-width: 50px;
        width: 100%;
        border-radius: 100%;
        border: 2px solid #edf4f6;
        img {
          max-width: 50px;
          display: block;
          width: 100%;
          overflow: hidden;
          border-radius: 100%;
        }
      }
      .name {
        padding: 0 10px;
      }
    }
    li.active {
      box-shadow: 0 0 6px 0 rgba(110, 110, 110, 0.42);
      border-style: solid;
      border-color: pink;
    }
  }
}

.backdrop-mask {
  width: 100%;
}
.breed-content {
  flex: 1;
}
.has-breed {
  position: absolute;
  top: -10px;
  right: -5px;
  .fa-heart.down {
    background: #d31616;
    color: #fff;
    padding: 5px;
    border-radius: 100%;
    animation: animateHeart 1.2s infinite;
  }
  .fa-heart.up {
    background: #458d45;
    color: #fff;
    padding: 5px;
    border-radius: 100%;
  }
}
.join-us-on-discord2 {
  font-family: Jumble;
  font-weight: 800;
  background-color: #e53261;
  border-radius: 20px;
  padding: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 20px;
  text-transform: uppercase;
  opacity: 0.9;
  font-size: 14px;
  text-align: center;
  transition: all 100ms ease-in-out;
  display: flex;
  justify-content: center;
  max-width: 120px;
  margin: 5px auto 0;
  &:hover {
    filter: drop-shadow(0px 0px 5px $cerise-red);
    //  filter: drop-shadow(0px 0px 1px #ffffff);
    opacity: 1;
    transform: translateY(-1px);
  }
}
.match-list.with-search {
  height: 80vh;
}

.show {
  display: block;
}
.d-flex {
  display: flex;
}
.close-btn {
  height: 50px;
  max-width: 50px;
  width: 100%;
  padding: 6px;
  button {
    border: 0;
    font-size: 30px;
    color: #fff;
  }
  button:hover {
    box-shadow: none;
  }
}

@keyframes animateHeart {
  // scale down and scale up faster in irregular intervals to get the throbbing effect
  0% {
    transform: scale(0.8);
  }
  5% {
    transform: scale(0.9);
  }
  10% {
    transform: scale(0.8);
  }
  15% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(0.8);
  }
}

@media (min-width: 1500px) {
  .backdrop .modal {
    max-width: 300px;
  }
}
</style>
