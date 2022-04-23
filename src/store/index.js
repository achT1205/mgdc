/* eslint-disable no-debugger */
import Vue from 'vue'
import Vuex from 'vuex'
import Web3 from 'web3'

import axios from "axios";

// export const config = {
//   headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
// };
// export const apiClient = axios.create(config);

// apiClient.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

// import breed from "../abis/breed.json";
// import MGDC from "../abis/mgdc.json";


const web3 = new Web3(window.ethereum);
// const contract = new web3.eth.Contract(breed.abi, breed.address);
// const contractMGDC = new web3.eth.Contract(MGDC.abi, MGDC.address);


Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    RoadMap: [
      {
        percent: 10,
        color: "#f5819f",
        text: "We serve champagne to our own real-life gold-diggers.",
      },
      {
        percent: 20,
        color: "#f8517d",
        text: "We break lose the Gold-Digger’s Furry Lapdog to all MGDC owners.",
      },
      {
        percent: 40,
        color: "#e52c5d",
        text: "We give M.G.D.C Gold-Diggers access to our lands in the Metaverse and we eventually allow the most famous Apes to join and meet with them. It’s your Gold-Digger’s chance to test her skills and attributes to seduce the wealthiest Apes in the Gold-Diggers’ Mansion.",
      },
      {
        percent: 60,
        color: "#c3093a",
        text: "We are publishing the “Final Enigma”, a complex riddle which can only be solved through meticulous observation of our website contents, both pictures, and short film. The first 10 persons to solve the enigma will receive a unique Golden Gold-Digger and one real-life 24K Gold Gold-Digger Ape statue.",
      },
      {
        percent: 70,
        color: "#aa042f",
        text: "Each Gold-Digger Ape’s owner will receive one Wealthy Ape.",
      },
      {
        percent: 80,
        color: "#860b2c",
        text: "We activate the breeding function to allow our Gold-Diggers to breed with their Wealthy Ape: only those who own 2 Gold-Digger Apes will be able to give birth to one Baby Ape.",
      },
      {
        percent: 90,
        color: "#5d001a",
        text: "Each Gold-Digger Ape in possession of a baby will be paid with our MGDC coin.",
      },
      {
        percent: 100,
        color: "#450011",
        text: "We celebrate the completion of the roadmap in a last expensive night in Saint-Tropez where all the M.G.D.C community will be invited.",
      },
    ],
    TeamBoss: {
      name: "ANONYMOUS WHALE<br/>INVESTOR & ULTIMATE GOLD-DIGGER LOVER",
      pic: require("@/assets/imgs/MGDC_1.jpg"),
      insta: "",
      linkedin: "",
      artstation: "",
      discord: "",
      twitter: "",
    },
    Team: [
      {
        name: "ANTOINE<br/>MARKETING EXPERT",
        pic: require("@/assets/imgs/Antoine.png"),
        insta: "https://www.instagram.com/antoinecrn__",
        linkedin: "https://www.linkedin.com/in/antoine-caron1",
        artstation: "",
        discord: "",
        twitter: "",
      },
      {
        name: "KEVIN<br/>CYBER SECURITY",
        pic: require("@/assets/imgs/MGDC_3.jpg"),
        insta: "",
        linkedin: "https://www.linkedin.com/in/kevin-didelot",
        artstation: "",
        discord: "",
        twitter: "",
      },
      {
        name: "AARON<br/>NFT EXPERT",//
        pic: require("@/assets/imgs/MGDC_7.jpg"),
        insta: "https://www.instagram.com/aaronillouz",
        linkedin: "https://www.linkedin.com/in/aaron-illouz",
        artstation: "",
        discord: "",
        twitter: "",
      },
      {
        name: "TANGUY<br/>WEB DEVELOPPER",
        pic: require("@/assets/imgs/MGDC_4.jpg"),
        insta: "https://www.instagram.com/foxlabs_fr",
        linkedin: "https://www.linkedin.com/in/dtanguy",
        artstation: "",
        discord: "",
        twitter: "",
      },
      {
        name: "LOUIS<br/>STRATEGY",
        pic: require("@/assets/imgs/Louis.png"),
        insta: "",
        linkedin: "",
        artstation: "",
        discord: "",
        twitter: "",
      },

      {
        name: "FANNY<br/>FASHION EXPERT",
        pic: require("@/assets/imgs/Fanny.png"),
        insta: "https://www.instagram.com/fannyhuns",
        linkedin: "",
        artstation: "",
        discord: "",
        twitter: "",
      },
      {
        name: "ANTHONY<br/>3D MODELING",
        pic: require("@/assets/imgs/nicegirl-bleu.png"),
        insta: "",
        linkedin: "",
        artstation: "",
        discord: "",
        twitter: "",
      },
      {
        name: "YVES<br/>3D RENDERING",
        pic: require("@/assets/imgs/MGDC_8.jpg"),
        insta: "",
        linkedin: "",
        artstation: "",
        discord: "",
        twitter: "",
      },
      {
        name: "LAURA<br/>GOLD DIGGER",
        pic: require("@/assets/imgs/Laura.png"),
        insta: "https://www.instagram.com/laucohn",
        linkedin: "",
        artstation: "",
        discord: "",
        twitter: "",
      },
      {
        name: "LUCIE<br/>DISCORD EXPERT",
        pic: require("@/assets/imgs/Lucie.png"),
        insta: "",
        linkedin: "",
        artstation: "",
        discord: "",
        twitter: "",
      },
      {
        name: "THOMAS<br/>GRAPHIC DESIGNER",//
        pic: require("@/assets/imgs/yellow.png"),
        insta: "",
        linkedin: "",
        artstation: "",
        discord: "",
        twitter: "",
      },
      {
        name: "VICTOR<br/>ILLUSTRATOR",//
        pic: require("@/assets/imgs/pink2.jpg"),
        insta: "https://www.instagram.com/traast_agram",
        linkedin: "",
        artstation: "https://victorschiano.com",
        discord: "",
        twitter: "",
      },
      {
        name: "DONAT<br/>CONCEPT ARTIST",
        pic: require("@/assets/imgs/MGDC_9.jpg"),
        insta: "",
        linkedin: "https://www.linkedin.com/in/donat-davy-06965029",
        artstation: "",
        discord: "",
        twitter: "",
      },
    ],
    account: null,
    error: null,
    mgdcs: null,
    isbuisy: false,
    matches: [],
    freeMgdcs: [],
    chatId: localStorage.chatId ? localStorage.chatId : null,
    messages: [],
    conversations: [],
    isChatOpen: false,
    curremgdcid: localStorage.curremgdcid ? parseInt(localStorage.curremgdcid) : null,
    curremgdcname: localStorage.curremgdcname ? localStorage.curremgdcname : null,
    isMatching: false,
    participants: [],
    breeding: false

  },
  getters: {
    account: state => state.account,
    error: state => state.error,
    mgdcs: state => state.balance,
    isbuisy: state => state.isbuisy,
    matches: state => state.matches,
    freeMgdcs: state => state.freeMgdcs,
    chatId: state => state.chatId,
    messages: state => state.messages,
    conversations: state => state.conversations,
    isChatOpen: state => state.isChatOpen,
    curremgdcid: state => state.curremgdcid,
    curremgdcname: state => state.curremgdcname,
    isMatching: state => state.isMatching,
    participants: state => state.participants,
    breeding: state => state.breeding
  },
  mutations: {
    SET_PARTICIPANTS(state, payload) {
      state.participants = payload
    },
    SET_BREEDING(state, payload) {
      state.breeding = payload
    },
    SET_ERROR(state, payload) {
      state.error = payload
    },
    SET_IS_MATCHIING(state, payload) {
      state.isMatching = payload
    },
    SET_IS_CHAT_OPEN(state, payload) {
      state.isChatOpen = payload
    },
    SET_IS_BUISY(state, payload) {
      state.isbuisy = payload
    },
    CLEAN_ERROR(state) {
      state.error = null
    },
    SET_ACCOUNT(state, payload) {
      state.account = payload.toLowerCase()
    },
    SET_MGDCS(state, payload) {
      state.mgdcs = payload
    },
    SET_WHITELIST_CLAIMED(state, payload) {
      state.mgdcs = payload
    },
    SET_MATCHES(state, payload) {
      state.matches = payload
    },
    SET_FILTERED_MATCHES(state, payload) {
      state.matches = state.matches.filter(_ => _.mgdcName.toLowerCase().indexOf(payload.toLowerCase()) > -1)
    },
    SET_MATCH(state, payload) {
      state.matches.push(payload)
    },
    SET_FREE_MGDCS(state, payload) {
      state.freeMgdcs = payload
    },
    SET_CHATCH_ID(state, payload) {
      localStorage.chatId = payload
      state.chatId = payload
    },
    SET_MESSAGES(state, payload) {
      state.messages = []
      payload.forEach((m) => {
        if (m.message) {
          state.messages.push({
            type: "text",
            author: m.author === state.account ? `me` : m.author,
            data: { text: m.message },
          });
        }
      });
    },
    SET_MESSAGE(state, payload) {
      state.messages.push(payload)
    },
    SET_CONVERSAIONS(state, payload) {
      state.conversations = payload
    },
    SET_MATCH_ACTIVE(state, payload) {
      state.curremgdcid = payload
      localStorage.curremgdcid = payload
    },
    SET_CURRENET_NAME(state, payload) {
      state.curremgdcname = payload
      localStorage.curremgdcname = payload
    },
    UPDATE_MATCH(state, payload) {
      const index = state.matches.findIndex(_ => _.mgdcId === payload.mgdcId)
      state.matches[index].hasBreed = true
    },
  },
  actions: {
    async connect({ commit, dispatch }) {
      commit('SET_IS_BUISY', true)
      try {
        const accounts = await web3.eth.requestAccounts()
        if (accounts && accounts.length) {
          commit('SET_ACCOUNT', accounts[0])
          commit('CLEAN_ERROR')
        }
        dispatch("getInitiumBalance")

      } catch (ex) {
        commit('SET_WALLET_CONNECTION_ERROR', ex.message)
        commit('SET_ERROR', ex)
        commit('SET_IS_BUISY', false)
      }
    },
    async isWhiteListClaimed({ commit }) {
      commit('SET_IS_BUISY', true)
      try {
        // const balance = await initiumTokenContract.methods.balanceOf(process.env.VUE_APP_NODEMANAGER_CONTRACT).call({ from: state.account })
        // commit("SET_REWARDPOOL_VALUE", balance);
        commit('SET_IS_BUISY', false)
      }
      catch (ex) {
        console.error(ex);
        commit('SET_ERROR', ex)
        commit('SET_IS_BUISY', false)
      }
    },
    async fetchFreeMgdcs({ commit }) {
      const freeMgdcs = await axios.get(`${process.env.VUE_APP_API_URL}/mgdc/free`);
      commit('SET_FREE_MGDCS', freeMgdcs.data)
    },
    async getMatches({ commit }, payload) {
      const resp = await axios.get(`${process.env.VUE_APP_API_URL}/breed/${payload}`);
      commit('SET_MATCHES', resp.data)
    },
    async addMatch({ commit }, payload) {
      const resp = await axios.post(`${process.env.VUE_APP_API_URL}/breed`, payload);
      const { chatId } = resp.data
      localStorage.chatId = chatId
      commit('SET_CHATCH_ID', chatId)
      commit("SET_MATCH_ACTIVE", payload.mgdcId)
      commit("SET_MATCH", payload)
    },
    async breed({ commit }, payload) {
      await axios.put(`${process.env.VUE_APP_API_URL}/breed/${payload.account}`, {
        "mgdcId": payload.mgdcId
      });
      commit('UPDATE_MATCH', payload)
    },
    async getMeessages({ commit }, payload) {
      const resp = await axios.get(`${process.env.VUE_APP_API_URL}/chats/${payload}`)
      commit("SET_MESSAGES", resp.data)
    },
    async getConversations({ commit }, payload) {
      const resp = await axios.get(`${process.env.VUE_APP_API_URL}/chats/rooms/${payload}`)
      commit("SET_CONVERSAIONS", resp.data)
    },
    async getBreedMgdcs({ commit }, payload) {
      const resp = await axios.get(`${process.env.VUE_APP_API_URL}/breed/mgdc/${payload}`)
      commit("SET_CONVERSAIONS", resp.data)
    }
  }
})
