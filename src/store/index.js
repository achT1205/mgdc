/* eslint-disable no-debugger */
import Vue from 'vue'
import Vuex from 'vuex'
import Web3 from 'web3'
import axios from "axios";
import Moralis from "moralis";
import bayc from "../abis/bayc.json";

const serverUrl = process.env.VUE_APP_MORALIS_SERVER
const appId = process.env.VUE_APP_MORALIS_APP_ID
Moralis.start({ serverUrl, appId });


const web3 = new Web3(window.ethereum);

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    RoadMap: [
      {
        percent: 5,
        color: "#f5819f",
        text: "We update the website (in less than 7 days).",
        diams: 1,
        empty: 9
      },
      {
        percent: 10,
        color: "#f8517d",
        text: "We create a new MGDC crypto-currency (in less than 14 days) coin.",
        diams: 2,
        empty: 8
      },
      {
        percent: 20,
        color: "#e52c5d",
        text: "We developpe a staking concept, which allows you to stake your gold digger and receive Meta Gold Digger Coin  (in less than 16 days).",
        diams: 4,
        empty: 6
      },
      {
        percent: 40,
        color: "#c3093a",
        diams: 6,
        empty: 4,
        text: "We activate the breeding function with the Hape Beast collection, payment available in Meta Gold Digger Coin (TBD).",
      },
      {
        percent: 60,
        color: "#aa042f",
        diams: 7,
        empty: 3,
        text: "We launch Merch by creating the most famous gold-digger brand with also the possibility to buy it with Meta Gold Digger Coin (TBD).",
      },
      {
        percent: 80,
        color: "#860b2c",
        diams: 8,
        empty: 2,
        text: "We launch a new surprise project (TDB).",
      },
      {
        percent: 90,
        color: "#5d001a",
        diams: 9,
        empty: 1,
        text: "We give a second life to our gold diggers by implementing them into the metaverse (TBD).",
      },
      {
        percent: 100,
        color: "#450011",
        diams: 10,
        empty: 0,
        text: "We celebrate the completion of the roadmap on a last expensive night in Saint Tropez where all the M.G.D.C. holders will be invited.",
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
    teams: [
      {
        title: "Management",
        members: [
          {
            name: "LOUIS<br/>CO FOUNDER",
            pic: require("@/assets/imgs/Louis.png"),
            insta: "",
            linkedin: "",
            artstation: "",
            discord: "",
            twitter: "",
          },
          {
            name: "CHLOE <br/>COMMUNITY MANAGER",
            pic: require("@/assets/imgs/teams/chloe.png"),
            insta: "",
            linkedin: "",
            artstation: "",
            discord: "",
            twitter: "",
          },
          {
            name: "LAURA<br/>GOLD DIGGER",
            pic: require("@/assets/imgs/Laura.png"),
            insta: "",
            linkedin: "",
            artstation: "",
            discord: "",
            twitter: "",
          },
          {
            name: "ANONYMOUS WHALE<br/>INVESTOR & ULTIMATE GOLD-DIGGER LOVER",
            pic: require("@/assets/imgs/MGDC_1.jpg"),
            insta: "",
            linkedin: "",
            artstation: "",
            discord: "",
            twitter: "",
          },
        ]

      },
      {
        title: "Board team members ",
        members: [
          {
            name: "BEMBIS",
            pic: require("@/assets/imgs/teams/bembis.jpeg"),
            insta: "",
            linkedin: "",
            artstation: "",
            discord: "",
            twitter: "",
          },
          {
            name: "CONTEKK",
            pic: require("@/assets/imgs/teams/contekk.jpeg"),
            insta: "",
            linkedin: "",
            artstation: "",
            discord: "",
            twitter: "",
          },
          {
            name: "OOK",
            pic: require("@/assets/imgs/teams/ook.jpeg"),
            insta: "",
            linkedin: "",
            artstation: "",
            discord: "",
            twitter: "",
          },
          {
            name: "SJOEMH",
            pic: require("@/assets/imgs/teams/sjoemh.jpeg"),
            insta: "",
            linkedin: "",
            artstation: "",
            discord: "",
            twitter: "",
          },
          {
            name: "SSG-DaPeif",
            pic: require("@/assets/imgs/teams/ssg-dapeif.jpeg"),
            insta: "",
            linkedin: "",
            artstation: "",
            discord: "",
            twitter: "",
          },
        ]
      }

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
    breeding: false,
    curremgdc: null,
    stakeds: null,
    profileIsLoading: false,
    profile: null,
    profiles: null
  },
  getters: {
    account: state => state.account,
    error: state => state.error,
    mgdcs: state => state.mgdcs,
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
    breeding: state => state.breeding,
    curremgdc: state => state.curremgdc,
    profileIsLoading: state => state.profileIsLoading,
    profile: state => state.profile,
    profiles: state => state.profiles
  },
  mutations: {
    SET_PROFILE(state, payload) {
      state.profile = payload
    },
    SET_PROFILES(state, payload) {
      state.profiles = payload
    },
    SET_PROFILE_IS_LOADING(state, payload) {
      state.profileIsLoading = payload
    },
    SET_PARTICIPANTS(state, payload) {
      state.participants = payload
    },
    SET_CURRENT_MGDC(state, payload) {
      state.curremgdc = payload
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
    async connect({ commit }) {
      commit('SET_IS_BUISY', true)
      try {
        const accounts = await web3.eth.requestAccounts()
        if (accounts && accounts.length) {
          commit('SET_ACCOUNT', accounts[0])
          commit('CLEAN_ERROR')
        }
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
      commit("SET_PROFILE_IS_LOADING", true)
      const resp = await axios.get(`${process.env.VUE_APP_API_URL}/breed/mgdc/${payload}`)
      const conversations = resp.data
      commit("SET_CONVERSAIONS", conversations)
      commit("SET_PROFILE_IS_LOADING", false)
    },
    async getmgdcs({ commit }, payload) {
      const resp = await Moralis.Web3API.account.getNFTsForContract({
        chain: "Eth",
        address: payload,
        token_address: process.env.VUE_APP_MGDC,
      });
      commit("SET_MGDCS", resp.result)
    },
    // eslint-disable-next-line no-empty-pattern
    async upadeteMgdc({ }, payload) {
      await axios.put(`${process.env.VUE_APP_API_URL}/mgdc/${payload.id}`, {
        "biography": payload.biography
      });
    },
    async getMgdc({ commit }, payload) {
      const resp = await axios.get(`${process.env.VUE_APP_API_URL}/mgdc/${payload}`);
      commit("SET_CURRENT_MGDC", resp.data)
    },
    async getProfile({ commit }, payload) {
      let profile = {}
      if (payload.maleType === "BAYC") {
        const maleContract = new web3.eth.Contract(bayc, process.env.VUE_APP_BAYC);
        profile.maleId = await maleContract.methods
          .tokenOfOwnerByIndex(payload.account, 0).call();
        if (profile.maleId) {
          const metadada = await axios.get(`https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/${profile.maleId}`)
          profile.url = metadada.data.image.replace("ipfs://", "https://ipfs.io/ipfs/")
          profile.id = parseInt(profile.maleId)
          commit("SET_PROFILE", profile)
        }
      } else {
        const resp = await Moralis.Web3API.account.getNFTsForContract({
          chain: "Eth",
          address: payload.account,
          token_address: process.env.VUE_APP_HAPE
        });
        if (resp.result && resp.result.length > 0) {
          profile = {
            id: resp.result[0].token_id,
            url: `https://meta.hapeprime.com/${resp.result[0].token_id}.png`,
            selected: false,
            maleId: resp.result[0].token_id
          }
          commit("SET_PROFILE", profile)
        }
      }
    },
    async getProfiles({ commit }, payload) {
      const profiles = []
      if (payload.maleType === "BAYC") {
        const maleContract = new web3.eth.Contract(bayc, process.env.VUE_APP_BAYC);
        const maleBalance = await maleContract.methods.balanceOf(payload.account).call();
        if (maleBalance > 0)
          for (let index = 0; index < maleBalance; index++) {
            const profile = {}
            profile.maleId = await maleContract.methods
              .tokenOfOwnerByIndex(payload.account, index).call();
            const metadada = await axios.get(`https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/${profile.maleId}`)
            profile.url = metadada.data.image.replace("ipfs://", "https://ipfs.io/ipfs/")
            profile.id = parseInt(profile.maleId)
            profile.selected = false
            profiles.push(profile)
          }
      }
      else {
        const resp = await Moralis.Web3API.account.getNFTsForContract({
          chain: "Eth",
          address: payload.account,
          token_address: process.env.VUE_APP_HAPE
        });
        if (resp.result && resp.result.length > 0) {
          console.log("resp.result : => ", resp.result)
          resp.result.forEach(async element => {
            // const metadada = await axios.get(element.token_uri)
            const profile = {
              id: element.token_id,
              url: `https://meta.hapeprime.com/${element.token_id}.png`, //metadada.image,
              selected: false,
              maleId: element.token_id
            }
            profiles.push(profile)
          });
        }
      }
      commit("SET_PROFILES", profiles)
    }
  }
})
