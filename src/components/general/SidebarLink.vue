<template>
  <div class="sidebar-link">
    <div class="icon-wrap"></div>
    <span class="link" :class="active && 'link--active'">{{ name }}</span>
  </div>
</template>
<script>
export default {
  name: "SidebarLink",
  props: {
    name: String,
    active: Boolean,
  }
};
</script>
<style lang="scss">
@use "../../assets/css/variables";

.sidebar-link {
  display: flex;
  padding: .6rem;
  justify-items: center;
  border-radius: 6px;
  > .link {
    color: variables.$primary-color-light;
    margin-bottom: 0 !important;
  }
  &:hover > .link, .link--active {
    color: variables.$semantic-color-green-dark;
  }
}
.icon-wrap {
  display: block;
  width: 24px;
  height: 24px;
  background-color: variables.$primary-color-light;
  border-radius: 4px;
  margin-right: 16px;
}
</style>
