<template>
  <div class="textarea-container">
    <label>
      <span v-if="title" class="title">{{ title }}</span>
      <textarea :disabled="disabled" :readonly="readOnly" :placeholder="placeholder" :value="modelValue" rows="1" @input="emitChange"></textarea>
    </label>
  </div>
</template>

<script>
export default {
  name: 'TextareaField',
  props: {
    title: String,
    placeholder: String,
    modelValue: [String, Number],
    disabled: {
      type: Boolean,
      default: false,
    },
    readOnly: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['update:modelValue'],
  methods: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    emitChange(event) {
      this.$emit('update:modelValue', event.target.value);
    },
  },
}
</script>

<style scoped>
.textarea-container {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}

.textarea-container .title {
  display: flex;
  font-family: DM Sans Bold;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: #4C5055;
  margin-bottom: 6px;
  user-select: none;
}

.textarea-container textarea {
  display: flex;
  width: 100%;
  background: #FFFFFF;
  box-shadow: 0 0 0 1px #D5D6D5;
  box-sizing: border-box;
  border-radius: 6px;
  padding: 0 12px;
  appearance: none;
  outline: none;
  height: 40px;
  line-height: 40px;
}

.textarea-container textarea:focus {
  box-shadow: 0 0 0 2px #737372, 0px 2px 8px rgba(0, 0, 0, 0.1);
}

.textarea-container textarea:disabled {
  background-color: #E8E8E8;
  box-shadow: none;
}

.textarea-container textarea.error {
  box-shadow: 0 0 0 1px #FD545A;
}

.textarea-container textarea::placeholder {
  font-family: DM Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 40px;
  color: #737372;
}
</style>
