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
            'background-image': `url(https://ipfs.io/ipfs/QmYpz9sgBezYk4A19FnP9agrvU7RxDzLcES83mbvTp39pp/1572.png)`,
          }"
        >
          <span class="info">
            <span class="title"
              >{{ scope.data.item.name }}
              </span
            >
          </span>
        </div>
      </template>
      <img class="like-pointer" slot="like" src="../assets/tinder/like-txt.png" />
      <img class="nope-pointer" slot="nope" src="../assets/tinder/nope-txt.png" />
      <img class="rewind-pointer" slot="rewind" src="../assets/tinder/rewind-txt.png" />
    </Tinder>
    <div class="btns">
      <img src="../assets/tinder/rewind.png" @click="decide('rewind')" />
      <img src="../assets/tinder/nope.png" @click="decide('nope')" />
      <img src="../assets/tinder/like.png" @click="decide('like')" />
    </div>
  </div>
</template>

<script>
import Tinder from "vue-tinder";

export default {
  name: "MGDC-TINDER",
  props:['source'],
  components: { Tinder },
  data: () => ({
    queue: [],
    offset: 0,
    history: [],
    modalShow: false,
    item: {},
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
    onSubmit({ item }) {
      if (this.queue.length < 3) {
        this.mock();
      }
      this.history.push(item);
    },
    async decide(choice) {
      if (choice === "rewind") {
        if (this.history.length) {
          this.$refs.tinder.rewind([this.history.pop()]);
        }
      }  else {
        this.$refs.tinder.decide(choice);
      }
    },
    openDetail(item) {
      this.item = item;
      this.modalShow = true;
    },
    closeModal() {
      this.modalShow = false;
    },
  },
};
</script>

<style>

#tinder .vue-tinder {
   width: 500px;
   height: 740px;
   display: flex;
   flex-direction: column;
   position: relative;
   transition: opacity 0.1s ease-in-out;
   margin: auto;
   margin-top: 50px;
   font-family: "Jumble";
}

.nope-pointer,
.like-pointer {
  position: absolute;
  z-index: 1;
  top: 20px;
  width: 64px;
  height: 64px;
}

.nope-pointer {
  right: 10px;
}

.like-pointer {
  left: 10px;
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
  width: 112px;
  height: 78px;
}

.pic {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.btns {
  left: 0;
  right: 0;
  bottom: 30px;
  margin: auto;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 300px;
  max-width: 355px;
  margin-top: 30px;
}

.btns img {
  margin-right: 12px;
  box-shadow: 0 4px 9px rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}



.btns img:nth-last-child(1) {
  margin-right: 0;
}

.tinder-card {
  max-height: 530px;
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
</style>