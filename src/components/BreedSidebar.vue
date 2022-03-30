<template>
  <div class="sidebar">
    <button class="btn-sidebar" @click.prevent="showSidebar = true" v-if="!showSidebar">
      <i class="fas fa-bars"></i>
    </button>
    <div class="backdrop" :class="showSidebar ? 'd-flex' : ''">
      <div class="modal" :class="showSidebar ? 'open' : ''">
        <div class="modal-content">
          <div class="modal-header">
            <h1>Mes breed</h1>
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
              <label>Recherche</label>
              <input type="text" v-model="search" placeholder="Recherche par ID" />
            </div>
            <ul class="match-list" :class="show ? 'with-search' : ''">
              <li v-for="(item, index) in myMatchs" :key="index">
                <div class="avatar">
                  <img :src="require('@/assets/imgs/Louis.png')" />
                </div>
                <div class="name">
                  {{ item.name }} / Has breeded : {{ item.hasBreed ? "true" : "false" }}
                </div>
                <span v-if="!item.hasBreed" @click="$emit('breed', item)"
                  >Breed here now</span
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="close-btn">
        <button @click.prevent="showSidebar = false" v-if="showSidebar">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  props: ["breed"],
  data: () => ({
    show: false,
    showSidebar: false,
    search: "",
  }),
  computed: {
    ...mapGetters(["myMatchs"]),
  },
};
</script>
<style scoped lang="scss">
.sidebar {
  .btn-sidebar {
    border: 0;
    font-size: 30px;
  }
  .btn-sidebar:hover {
    box-shadow: none;
  }
  position: fixed;
  z-index: 5000;
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
  z-index: 5000;
  display: none;
  .modal {
    max-width: 250px;
    z-index: 9999;
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
        }
      }
      .search.show {
        display: block;
      }
    }
  }

  .match-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    height: 92vh;
    overflow: auto;
    background: #edf4f6;
    li {
      width: 100%;
      display: flex;
      padding: 6px 12px;
      align-items: center;
      border: 1px solid #ccc;
      margin: 5px;
      background: white;
      border-radius: 10px;
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
</style>
