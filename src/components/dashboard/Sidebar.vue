<template>
  <aside class="sidebar">
    <div class="sidebar-menu">
      <router-link to="about" v-slot="{ isActive }"
        ><SidebarLink name="About" :active="isActive"
      /></router-link>
      <router-link to="home" v-slot="{ isActive }"
        ><SidebarLink name="Home" :active="isActive"
      /></router-link>
    </div>
  </aside>
</template>
<script>
import SidebarLink from "../general/SidebarLink";

export default {
  name: "Sidebar",
  components: {
    SidebarLink,
  },
};
</script>
<style lang="scss">
@use "../../assets/css/variables";

.sidebar {
  height: 100vh;
  grid-area: dashboard-sidebar;
  padding: 24px 16px;
  display: grid;
  margin-top: 56px;
  grid-template-columns: 100%;
  grid-template-rows: auto 10%;
  grid-template-areas:
    "sidebar-menu"
    "sidebar-user";
  box-shadow: 0 2px 8px 0 rgba(#162430, 0.08);
}

.logo-wrap {
  background-color: variables.$primary-color-medium;
  height: 50px;
  width: 100%;
  grid-area: sidebar-logo;
}

.sidebar-menu {
  grid-area: sidebar-menu;
  display: flex;
  flex-direction: column;
  
  .router-link-active {
    background-color: variables.$semantic-color-green-light;
    border-radius: 8px;
    font-weight: bold;
  }
}

.sidebar-user-block {
  grid-area: sidebar-user;
  display: flex;
  flex-direction: row;
}

.user-img-wrapper {
  display: block;
  width: 56px;
  height: 56px;
  margin-right: 12px;
  border-radius: 8px;
  background-color: variables.$neutral-color-black-light;
}
</style>
