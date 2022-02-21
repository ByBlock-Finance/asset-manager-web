<template>
  <div v-if="text !== null" class="popover-box" @mouseleave="closepopover">
    <span @mouseenter="openpopover">
      <slot />
    </span>
    <div ref="popover" class="popover" :class="positionClass">
      <div class="popover-content">
        <p class="popover-heading"><slot name="popover-heading" /></p>
        <p>{{ text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Popover",
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
    openpopover() {
      this.popoverOverflow();
      this.show = true;
    },
    closepopover() {
      this.popoverOverflow();
      this.show = false;
    },
    popoverOverflow() {
      if (
        this.$refs.popover.getBoundingClientRect().right > window.innerWidth
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

.popover-box {
  position: relative;
  display: inline-block;
  margin-left: 4px;
}

.popover {
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
  border-radius: 4px;
//   border: 
  font-size: 12px;
  font-family: DM Sans;
  color: variables.$neutral-color-black-dark;;
  box-shadow: 0px 2px 8px rgba(76, 80, 85, 0.16);
  opacity: 1;
  transition: opacity 0.3s;
  -webkit-transition: opacity 0.3s;
}

.popover.hidden {
  visibility: hidden;
  opacity: 0;
}

.popover-heading {
  font-weight: bold;
  font-family: DM Sans Bold;
  margin-bottom: 6px;
}

.popover-heading i.close-popover {
  display: flex;
  cursor: pointer;
  width: 14px;
  height: 14px;
  /* background-image: url('../../assets/icons/singular/cross_light.svg'); */
  background-repeat: no-repeat;
  background-position: center center;
  margin-right: 3px;
}

.popover-content {
  padding: 12px 12px;
  position: relative;
  border-radius: 2px;
  width: 100%;
  text-align: left;
}

.popover.top {
  bottom: 100%;
  left: 50%;
  margin-left: -30px;
  margin-bottom: 5px;
}

.popover.bottom {
  top: 100%;
  right: 0%;
  margin-right: -150px;
  margin-top: 3px;
}

.popover.right {
  top: -60%;
left: 100%;
margin-left: 7px;
}

.popover.left {
  bottom: 0%;
  right: 100%;
  margin-right: 5px;
}

.popover.right .popover-content::before {
  content: " ";
  display: block;
  position: absolute;
  left: 0px;
  margin-left: -12px;
  top: 10px;
  width: 0;
  height: 0;
  border: 6px solid transparent;
  border-right-color: rgba(#4c5055, 0.1);
}

.popover.right .popover-content::after {
  content: " ";
  display: block;
  position: absolute;
  margin-left: -21px;
  top: 11px;
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-right-color: #ffffff;
}

.information-popover {
  .information-icon {
    // visibility: hidden;
    display: flex;
    cursor: pointer;
    width: 15px;
    height: 15px;
    background-image: url("../../assets/icons/singular/info.svg");
    background-repeat: no-repeat;
    background-position: center center;
  }
}
</style>
