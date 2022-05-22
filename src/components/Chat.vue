<template>
  <div v-if="participants && participants.length">
    <beautiful-chat
      :participants="participants"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messages"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :open="openChat"
      :showEmoji="true"
      :showFile="false"
      :showEdition="true"
      :showDeletion="true"
      :showTypingIndicator="showTypingIndicator"
      :showLauncher="true"
      :showCloseButton="true"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :messageStyling="messageStyling"
      @onType="handleOnType"
      @edit="editMessage"
    >
      <template v-slot:header>
        <img
          :src="`https://metagolddiggerclub.com/img/thumbnails/${curremgdcid}.png`"
          alt=""
          class="sc-header--img"
        />
        <div data-v-61edfd75="" class="sc-header--title enabled">
          {{ curremgdcname }}
        </div>
      </template>
      
    </beautiful-chat>
  </div>
</template>
<script>
import Vue from "vue";
import Chat from "vue-beautiful-chat";
import { mapGetters } from "vuex";

Vue.use(Chat);

export default {
  name: "app",
  props: ["sendMessage"],
  data() {
    return {
      icons: {
        open: {},
        init: true,
      },
      newMessagesCount: 0,
      showTypingIndicator: "", // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: "#993783",
          text: "#ffffff",
        },
        launcher: {
          bg: "#993783",
        },
        messageList: {
          bg: "#ffffff",
        },
        sentMessage: {
          bg: "#993783",
          text: "#ffffff",
        },
        receivedMessage: {
          bg: "#eaeaea",
          text: "#222222",
        },
        userInput: {
          bg: "#f4f7f9",
          text: "#565867",
        },
      }, // specifies the color scheme for the component
      alwaysScrollToBottom: false, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true, // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
    };
  },
  computed: {
    ...mapGetters([
      "chatId",
      "messages",
      "conversations",
      "isChatOpen",
      "account",
      "curremgdcid",
      "curremgdcname",
      "matches",
      "participants",
    ]),
  },
  mounted() {
    if (this.messages && this.messages.length) {
      this.$store.commit("SET_IS_CHAT_OPEN", true);
    }
  },
  methods: {
    onMessageWasSent(message) {
      const conversation = {
        action: "sendMessage",
        chatId: this.chatId,
        message: message.data.text,
        from: this.account,
        to: this.participants[1].id,
      };
      this.$emit("sendMessage", conversation);
    },
    finishInit() {
      this.init = false;
    },
    openChat() {
      // called when the user clicks on the fab button to open the chat
      this.$store.commit("SET_IS_CHAT_OPEN", true);
      this.newMessagesCount = 0;
    },
    closeChat() {
      // called when the user clicks on the botton to close the chat
      this.$store.commit("SET_IS_CHAT_OPEN", false);
    },
    handleScrollToTop() {
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
    },
    handleOnType() {

},
    editMessage(message) {
      const m = this.messageList.find((m) => m.id === message.id);
      m.isEdited = true;
      m.data.text = message.data.text;
    },
  },
};
</script>
<style lang="scss" scoped>
.sc-chat-window {
  z-index: 2;
}
.sc-header--img {
  width: 70px !important;
}
</style>
