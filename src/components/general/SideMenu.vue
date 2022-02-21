<template>
  <div class="sidemenu">
    <div class="logo-container mb-10">
      <a href="/#/projects">
        <img
          class="header-logo"
          src="../../assets/logos/byb_black.png"
          alt="Logo Small"
        />
      </a>
    </div>

    <div class="menu-body-container">
      <div class="menu-items">
        <router-link to="/portfolio">
          <div
            class="menu-item"
            :class="{ 'selected-menu-item': currentRoute == 'Portfolio' }"
          >
            <div class="menu-item-logo"><i class="pi pi-dollar"></i></div>
            <div class="menu-item-text">Portfolio</div>
          </div>
        </router-link>
        <router-link to="/">
          <div
            class="menu-item"
            :class="{ 'selected-menu-item': currentRoute == 'Home' }"
          >
            <div class="menu-item-logo"><i class="pi pi-wallet"></i></div>
            <!-- <div class="menu-item-text">Assets</div> -->
            <div class="menu-item-text">Transactions</div>
          </div>
        </router-link>
        <router-link to="/api">
          <div
            class="menu-item"
            :class="{ 'selected-menu-item': currentRoute == 'Api' }"
          >
            <div class="menu-item-logo"><i class="pi pi-cloud"></i></div>
            <div class="menu-item-text">API Access</div>
          </div>
        </router-link>
        <router-link to="/services">
          <div
            class="menu-item"
            :class="{ 'selected-menu-item': currentRoute == 'Services' }"
          >
            <div class="menu-item-logo"><i class="pi pi-file-excel"></i></div>
            <div class="menu-item-text">GSheets</div>
          </div>
        </router-link>
                <router-link to="/wallets">
          <div
            class="menu-item"
            :class="{ 'selected-menu-item': currentRoute == 'Wallets' }"
          >
            <div class="menu-item-logo"><i class="pi pi-wallet"></i></div>
            <div class="menu-item-text">Wallets</div>
          </div>
        </router-link>
      </div>

      <div class="menu-footer">
        <div class="no-token-warn mb-5">
          <div class="no-token-cause">
            Site speed and availability is limited.
          </div>
          <div class="no-token-solution">
            <span
              >For unlimited use, hold BYB token.<router-link
                to="/services"
                style="color: #24659B; font-weight: bold"
                >See how</router-link
              ></span
            >
          </div>
        </div>
        <i>Alpha v.0.1</i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideMenu",
  data() {
    return {};
  },
  computed: {
    currentRoute() {
      return this.$route.name;
    },
  },
};
</script>

<style scoped lang="scss">
@use "../../assets/css/variables";
.menu-body-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

.menu-footer {
  text-align: center;
  font-style: italic;
}
.menu-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 50pt;
  width: 100%;
  padding: 10px 10px 10px 20pt;
  cursor: pointer;
  border-radius: 6px;
  margin-top: 10px;
}
.selected-menu-item {
  background-color: variables.$semantic-color-blue-dark;
  color: variables.$neutral-color-white-medium;
  font-weight: bold;
  cursor: default;
}

.selected-menu-item:hover {
  background-color: variables.$semantic-color-blue-dark !important;
}

.menu-item:hover {
  background-color: variables.$neutral-color-black-light;
}

.menu-item-text {
  font-size: 1.2em;
}
.menu-item-logo {
  margin-right: 10px;
  display: flex;
}
.menu-item-logo i {
  font-size: 20pt;
}
.header-logo {
  width: 90%;
}
.flex-10 {
  flex: 0 0 10%;
}

.sidemenu {
  position: fixed;
  display: flex;
  width: 180pt;
  height: 100%;
  left: 0;
  background: variables.$neutral-color-black-very-light;
  border-bottom: 1px solid variables.$neutral-color-white-dark;
  padding: 50pt 16px 16px 16px;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.no-token-cause {
  font-size: 16px;
  line-height: 150%;
  /* or 18px */

  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.004em;

  /* Razzmatazz */

  color: #e40066;
}

.no-token-solution {
  font-size: 14px;
  line-height: 150%;
  /* or 16px */

  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.015em;

  /* Neutrals/Gray-4 */

  color: #7f94a9;
}
</style>
