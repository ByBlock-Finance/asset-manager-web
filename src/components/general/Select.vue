<template>
  <div class="select-container">
    <div class="select-label" v-if="label">{{ label }}</div>
    <div class="custom-select" :tabindex="tabIndex" @blur="open = false">
      <div class="selected" :class="{ open: open, placeholder: !selectedOption }" @click="open = !open">
        <div class="text-container">
          <div class="text">{{ selectedText }}</div>
        </div>
      </div>
      <div class="items" v-show="open">
        <div
          v-for="(option, i) of options"
          :key="i"
          :class="{ 'selected-option': option.value === selectedOptionValue }"
          @click="selectOption(option)"
        >
          {{ option.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Select",
  props: {
    options: {
      type: Array,
      required: true,
    },
    modelValue: String || Number,
    label: String,
    placeholder: String,
    autoSelection: {
      type: Boolean,
      default: false,
    },
    tabIndex: {
      type: Number,
      default: 0,
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      selectedOption: null,
      open: false,
    };
  },
  mounted() {
    if (this.modelValue) {
        this.selectedOption = this.options.find((option) => option.value === this.modelValue) || null;
    }
    else if (this.autoSelection) {
        this.selectedOption = this.options.length > 0 ? this.options[0] : null;
        this.$emit('update:modelValue', this.selectedOption ? this.selectedOption.value : null);
    }
  },
  computed: {
    selectedText() {
      if (this.selectedOption) {
        return this.selectedOption.title;
      }

      return this.placeholder || '';
    },
    selectedOptionValue() {
      return this.selectedOption ? this.selectedOption.value : null;
    }
  },
  methods: {
    selectOption(option) {
        this.selectedOption = option;
        this.open = false;
        this.$emit('update:modelValue', this.selectedOption.value);
    }
  },
};
</script>

<style scoped>
.select-container {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
}

.select-label {
  font-family: DM Sans Bold;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: #4C5055;
  margin-bottom: 6px;
  user-select: none;
}

.custom-select {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  position: relative;
  font-family: DM Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  color: #737372;
  flex: 1 1 auto;
  outline: none;
}

.custom-select .selected {
  display: flex;
  align-items: center;
  position: relative;
  height: 40px;
  line-height: 40px;
  background: #FFFFFF;
  box-shadow: 0 0 0 1px #D5D6D5;
  box-sizing: border-box;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  border-radius: 6px;
}

.text-container {
  display: flex;
  align-items: center;
  position: relative;
  height: 100%;
  width: 100%;
  margin-right: 15px;
  overflow: hidden;
}

.text-container .text {
  position: absolute;
  cursor: pointer;
  user-select: none;
  width: auto;
  height: 40px;
  line-height: 40px;
  white-space: nowrap;
}

.custom-select .selected.open {
  box-sizing: border-box;
  box-shadow: 0 0 0 2px #737372, 0px 2px 8px rgba(0, 0, 0, 0.1);
}

.custom-select .selected:after {
  position: absolute;
  content: "";
  top: 18px;
  right: 1em;
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-color: #737372 transparent transparent transparent;
}

.custom-select .items {
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  left: 0;
  right: 0;
  top: 48px;
  background: #FFFFFF;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.custom-select .items div {
  height: 32px;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  padding: 8px 12px;
}

.custom-select .items div:first-of-type {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.custom-select .items div:last-of-type {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.custom-select .items div:hover {
  background-color: #D5D6D5;
}

.custom-select .items div.selected-option {
  color: #FFFFFF;
  background-color: #CC0000;
}
</style>
