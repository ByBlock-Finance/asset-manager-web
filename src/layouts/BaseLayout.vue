<template>
  <div class="base-app">
    <slot />
  </div>
</template>
<script>
export default {
  name: "BaseLayout",
}
</script>
<style lang="scss">
.base-app {
  margin-left: 150pt;
  padding: 0px 60px;
}
</style>

