<template>
    <div class="input-container">
        <label>
            <span v-if="title" class="title">{{ title }}</span>
            <input :type="type" :disabled="disabled" :readonly="readOnly" :placeholder="placeholder" :value="modelValue" @input="emitChange">
        </label>
    </div>
</template>

<script>
export default {
    name: 'InputField',
    props: {
        title: String,
        placeholder: String,
        type: {
            type: String,
            default: "text",
        },
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
        emitChange(event) {
            this.$emit('update:modelValue', event.target.value);
        },
    },
}
</script>

<style scoped lang="scss">
@use "../../assets/css/variables";

.input-container {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
}

.input-container .title {
    display: flex;
    font-family: DM Sans Bold;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 17px;
    color: variables.$neutral-color-black-dark;
    margin-bottom: 6px;
    user-select: none;
}

.input-container input {
    display: flex;
    width: 100%;
    height: 40px;
    background: #FFFFFF;
    box-shadow: 0 0 0 1px #D5D6D5;
    box-sizing: border-box;
    border-radius: 6px;
    padding: 12px;
    appearance: none;
    outline: none;
}

.input-container input:focus {
    box-shadow: 0 0 0 1px variables.$primary-color-dark, 0px 2px 8px rgba(#162430, 0.08);
}

.input-container input:disabled {
    background-color: #E8E8E8;
    box-shadow: none;
}

.input-container input.error {
    box-shadow: 0 0 0 1px #FD545A;
}

.input-container input::placeholder {
    font-family: DM Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
    color: variables.$neutral-color-black-medium;
}
</style>
