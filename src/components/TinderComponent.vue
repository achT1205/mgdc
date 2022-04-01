<template>
  <div id="tinder">
    <Tinder
      ref="tinder"
      key-name="title"
      :queue.sync="queue"
      :offset-y="10"
      :super-threshold="0.3"
      @submit="onSubmit"
    >
      <template slot-scope="scope">
        <div
          class="pic"
          :style="{
            'background-image': `url(https://metagolddiggerclub.com/img/thumbnails/${scope.data.item.id}.png)`,
          }"
        >
          <div class="info">
            <h3 class="title">{{ scope.data.item.name }}</h3>
          </div>
        </div>
      </template>
      <img class="like-pointer" slot="like" src="../assets/imgs/tinder/like-t.png" />
      <img class="nope-pointer" slot="nope" src="../assets/imgs/tinder/nope-t.png" />
      <img
        class="rewind-pointer"
        slot="rewind"
        src="../assets/imgs/tinder/rewind-t.png"
      />
    </Tinder>
    <div class="btns">
      <img src="../assets/imgs/tinder/rewind.png" @click="decide('rewind')" />
      <img src="../assets/imgs/tinder/nope.png" @click="decide('nope')" />
      <img src="../assets/imgs/tinder/like.png" @click="decide('like')" />
    </div>
  </div>
</template>

<script>
import Tinder from "vue-tinder";

export default {
  name: "MGDC-TINDER",
  props: ["source", "addMatch"],
  components: { Tinder },
  data: () => ({
    queue: [],
    offset: 0,
    history: [],
    modalShow: false,
    item: {},
    choice: null,
  }),
  created() {
    this.mock();
  },
  methods: {
    mock(count = 5, append = true) {
      const list = [];
      for (let i = 0; i < count; i++) {
        list.push({
          title: this.source[this.offset].name,
          item: this.source[this.offset],
        });
        this.offset++;
      }
      if (append) {
        this.queue = this.queue.concat(list);
      } else {
        this.queue.unshift(...list);
      }
    },
    onSubmit({ type, key, item }) {
      if (type === "like") {
        this.$emit("addMatch", { id: item.item.id, name: key })
      }
      if (this.queue.length < 3) {
        this.mock();
      }
      this.history.push(item);
    },
    async decide(choice) {
      this.choice = choice;
      if (choice === "rewind") {
        if (this.history.length) {
          this.$refs.tinder.rewind([this.history.pop()]);
        }
      } else {
        this.$refs.tinder.decide(choice);
      }
    },
  },
};
</script>

<style>
#tinder .vue-tinder {
  width: 400px;
  height: 500px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: opacity 0.1s ease-in-out;
  margin: auto;
  margin-top: 50px;
  font-family: "Jumble";
}

.tinder-card {
  max-height: 500px;
}

.nope-pointer,
.like-pointer {
  position: absolute;
  z-index: 1;
  top: 20px;
  max-width: 64px;
}

.nope-pointer {
  right: 10px;
  max-width: 64px;
}

.like-pointer {
  left: 10px;
  max-width: 64px;
}

.super-pointer {
  position: absolute;
  z-index: 1;
  bottom: 80px;
  left: 0;
  right: 0;
  margin: auto;
  width: 112px;
  height: 78px;
}

.btns img {
  width: 53px;
}

.rewind-pointer {
  position: absolute;
  z-index: 1;
  top: 20px;
  right: 10px;
  max-width: 64px;
}

.pic {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.btns {
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 500px;
  width: 100%;
  margin-top: 30px;
}

.btns img {
  margin: 6px;
  box-shadow: 0 4px 9px rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

/* Item Informations */
.info {
  cursor: pointer;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 10px;
  width: 100%;
  font-family: sans-serif;
  font-size: 18px;
  color: #fff;
  text-shadow: 0 0 1px #000;
  /* -webkit-text-stroke: 1px black;*/
  background: rgb(0, 0, 0);
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.7) 50%,
    rgba(255, 255, 255, 0) 100%
  );
}
.title {
  text-transform: uppercase;
  font-size: 24px;
  width: 100%;
  display: block;
  font-family: var(--font-family-acme);
}
.year {
  font-size: 15px;
}
.rating {
  margin-right: 5px;
  display: inline-block;
}
.time {
  display: inline-block;
}
.categories {
  font-size: 16px;
  margin-top: 10px;
  display: block;
  width: 100%;
}
.categories span {
  margin: 0;
  padding: 0;
}
/* Modal Info */
.modal-info {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9;
}
.modal-info .modal-content {
  position: fixed;
  top: 5%;
  left: 5%;
  width: 90%;
  height: 90%;
  background: #fff;
  border-radius: 5px;
  padding: 15px;
}
.modal-info .modal-content .item {
  color: #000;
}
.modal-info .modal-content .close {
  color: #000;
  position: absolute;
  right: 10px;
  top: 5px;
  cursor: pointer;
  font-size: 20px;
}

@media (min-width: 1500px) {
  #tinder .vue-tinder {
    width: 400px;
    height: 620px;
  }
  .tinder-card {
    max-height: 620px;
  }
  .backdrop .match-list li {
    margin: 5 12px;
  }
  .backdrop .modal {
    max-width: 300px;
  }
}
</style>
