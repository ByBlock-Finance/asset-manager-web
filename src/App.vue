<template>
  <SideMenu />

  <router-view>
  </router-view>

  <Message
      class="top-message"
      v-for="msg of messages"
      :severity="msg.severity"
      :key="msg.content"
      :life="msg.life"
      :sticky="msg.sticky"
      >{{ msg.content }}</Message
    >
</template>

<script>
import SideMenu from "./components/general/SideMenu.vue";
import * as uService from "@/services/util";

export default {
  name: "App",
  components: {
    // Header,
    SideMenu,
  },
  computed: {
    messages() {
      return this.$store.state.messages;
    },
  },
  created() {
    this.checkServerHealth();
  },
  methods: {
    async checkServerHealth() {
      console.log("App / checkServerHealth()");
      try {
        let result = await uService.checkAPIHealth();
        if (!result) this.notifyGlobalError("Problems contacting server");
      } catch (error) {
        this.notifyGlobalError("Problems contacting server");
      }
    },
    notifyGlobalError(message) {
      this.$store.dispatch("addMessage", {
        severity: "error",
        content: message,
        sticky: true,
      });
    },
  },
};
</script>


<style lang="scss">
@use "./assets/css/variables";

#app {
  font-family: "Inter", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: variables.$primary-color-dark;
}

h1 {
  font-size: 42px;
  font-style: normal;
  font-weight: 700;
  line-height: 52px;
  letter-spacing: 0.0025em;
}

h2 {
  font-size: 38px;
  font-style: normal;
  font-weight: 600;
  line-height: 35px;
  letter-spacing: 0em;
}

h3 {
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 35px;
  letter-spacing: 0em;
}

h4 {
  /* Heading/H4-19px */
  font-style: normal;
  font-weight: 700;
  font-size: 19px;
  line-height: 150%;
  letter-spacing: 0.06em;
  /* Neutrals/Black */
  color: variables.$neutral-color-black-dark;
}

h3.sub-heading {
  font-weight: bold;
  letter-spacing: 0.011em;
  font-size: 16px;
}
</style>
