<template>
  <div v-if="participants && participants.length">
    <beautiful-chat
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
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
    />
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
      participants: [
        // {
        //   id: 'user1',
        //   name: 'Matteo',
        //   imageUrl: 'https://avatars3.githubusercontent.com/u/1915989?s=230&v=4'
        // },
        // {
        //   id: 'user2',
        //   name: 'Support',
        //   imageUrl: 'https://avatars3.githubusercontent.com/u/37018832?s=200&v=4'
        // }
      ], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
      titleImageUrl: "https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png",
      messageList: [
        // { type: 'text', author: `me`, data: { text: `Say yes!` } },
        // { type: 'text', author: `user1`, data: { text: `No.` } }
      ], // the list of the messages to show, can be paginated and adjusted dynamically
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
    ...mapGetters(["chatId", "messages", "conversations", "isChatOpen", "account"]),
  },
  mounted() {
    this.formatParticipants();
    this.formatMessages();
    setTimeout(this.finishInit, 5000);
  },
  watch: {
    async conversations(val) {
      if (val) {
        if (this.chatId && this.account) {
          await this.formatParticipants();
          this.$store.commit("SET_IS_CHAT_OPEN", true);
        }
      }
    },
    async messages(val) {
      if (val) {
        await this.formatMessages();
        this.$store.commit("SET_IS_CHAT_OPEN", true);
      }
    },
  },
  methods: {
    // sendMessage(text) {
    //   if (text.length > 0) {
    //     this.newMessagesCount = this.isChatOpen
    //       ? this.newMessagesCount
    //       : this.newMessagesCount + 1;
    //     this.onMessageWasSent({ author: "support", type: "text", data: { text } });
    //   }
    // },
    onMessageWasSent(message) {
      const conversation = {
        action: "sendMessage",
        chatId: this.chatId,
        message: message.data.text,
        from: this.account,
        to: this.participants[1].id,
      };
      console.log(conversation);
      this.$emit("sendMessage", conversation);
      //this.messageList = [ ...this.messageList, message ]
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
      console.log("Emit typing event");
    },
    editMessage(message) {
      const m = this.messageList.find((m) => m.id === message.id);
      m.isEdited = true;
      m.data.text = message.data.text;
    },
    formateId(id) {
      return id.substring(1, 4) + "..." + id.substring(id.length - 4);
    },
    async formatParticipants() {
      if (this.conversations && this.conversations.length) {
        const participants = [];
        participants.push({
          id: this.account,
          name: this.formateId(this.account),
          imageUrl: "https://avatars3.githubusercontent.com/u/1915989?s=230&v=4",
        });

        const index = this.conversations.findIndex((_) => _.chatId == this.chatId);
        const conv = this.conversations[index];
        if (conv && conv.to)
          participants.push({
            id: conv.to,
            name: this.formateId(conv.to),
            imageUrl: "https://avatars3.githubusercontent.com/u/1915989?s=230&v=4",
          });

        this.participants = participants;
      }
    },
    async formatMessages() {
      const messages = [];
      this.messages.forEach((m) => {
        messages.push({
          type: "text",
          author: m.author === this.account ? `me` : m.author,
          data: { text: m.message },
        });
      });
      this.messageList = messages;
    },
  },
};
</script>
<style lang="scss" scoped>
.sc-chat-window {
  z-index: 2;
}
</style>
