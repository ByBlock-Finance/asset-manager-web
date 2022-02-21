<template>
  <div v-if="text !== null" class="tooltip-box" @mouseleave="closeTooltip">
    <span @mouseenter="openTooltip">
      <slot />
    </span>
    <div ref="tooltip" class="tooltip" :class="positionClass">
      <div class="tooltip-content">
        <p>{{ text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Tooltip",
  props: {
    position: {
      type: String,
      default: "right",
    },
    text: {
      type: String,
    },
  },
  data() {
    return {
      show: false,
      overflow: false,
    };
  },
  computed: {
    positionClass() {
      return {
        top: this.position == "top",
        bottom: this.position == "bottom" || this.overflow,
        left: this.position == "left",
        right: this.position == "right" && !this.overflow,
        hidden: this.show == false,
      };
    },
  },
  methods: {
    openTooltip() {
      this.tooltipOverflow();
      this.show = true;
    },
    closeTooltip() {
      this.tooltipOverflow();
      this.show = false;
    },
    tooltipOverflow() {
      if (
        this.$refs.tooltip.getBoundingClientRect().right > window.innerWidth
      ) {
        this.overflow = true;
      } else {
        this.overflow = false;
      }
    },
  },
};
</script>

<style lang="scss">
@use '../../assets/css/variables';

.tooltip-box {
  position: relative;
  display: inline-block;
  margin-left: 4px;
}

.tooltip {
  position: absolute;
  cursor: default;
  display: flex;
  flex-direction: column;
  z-index: 1;
  align-items: center;
  min-height: 20px;
  width: max-content;
  max-width: 250px;
  background-color: #ffffff;
  border-radius: 2px;
  font-size: 14px;
  font-family: DM Sans;
  color: variables.$neutral-color-white-light;
  background-color: variables.$neutral-color-black-dark;
  opacity: 1;
  transition: opacity 0.3s;
  -webkit-transition: opacity 0.3s;
}

.tooltip.hidden {
  visibility: hidden;
  opacity: 0;
}

.tooltip-content {
  padding: 2px 8px;
  position: relative;
  border-radius: 4px;
  width: 100%;
}

.tooltip.top {
  bottom: 100%;
  left: 50%;
  margin-left: -30px;
  margin-bottom: 5px;
}

.tooltip.bottom {
  top: 100%;
  right: 0%;
  margin-right: -150px;
  margin-top: 3px;
}

.tooltip.right {
  top: -10%;
  left: 100%;
  margin-left: 7px;
}

.tooltip.left {
  bottom: 0%;
  right: 100%;
  margin-right: 5px;
}

.information-tooltip {
  .information-icon {
    // visibility: hidden;
    display: flex;
    cursor: pointer;
    width:24px;
    height: 24px;
    background-image: url("../../assets/icons/singular/info.svg");
    background-repeat: no-repeat;
    background-position: center center;
  }
}
</style>
