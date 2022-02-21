<template>
  <div class="dashboard-container">
    <Sidebar />
    <div class="dashboard-content">
      <p class="text-small view-description">{{ $route.meta.description }}</p>
      <slot name="content" />
    </div>
  </div>
</template>
<script>
import Sidebar from "../components/dashboard/Sidebar";

export default {
  name: "DashboardLayout",
  components: {
    Sidebar,
  },
};
</script>
<style lang="scss">
@use "../assets/css/variables";

.dashboard-container {
  height: 100vh;
  display: grid;
  grid-template-columns: 200px auto;
  grid-template-areas: "dashboard-sidebar dashboard-content";
}

.dashboard-content {
  grid-area: dashboard-content;
  margin-top: 56px;
  padding: 16px 24px;
  background-color: variables.$neutral-color-white-medium;
  .view-description {
    max-width: 50%;
  }
}
</style>
