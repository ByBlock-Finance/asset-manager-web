<template>
  <base-layout>
    <div class="home" style="height:100vh">
      <pre style="height:100%" id="gs_example_code" ><iframe src="./examples/bb_gheet_plugin.js" frameborder="0" width="100%" height="100%"></iframe></pre></div
  ></base-layout>
</template>

<script>
import { Options, Vue } from "vue-class-component";
import BaseLayout from "@/layouts/BaseLayout.vue";

@Options({
  components: {
    BaseLayout,
  },
  data() {
    return {
      showSignUpModal: false,
    };
  },
  methods: {
  },
})
export default class Home extends Vue {}
</script>
