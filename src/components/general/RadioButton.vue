<template>
    <label class="custom-radio-button-label">
        <input type="radio" class="custom-radio-button" :value="value" :modelValue="modelValue" :checked="value === modelValue" @change="toggle">
        <span>{{ label }}</span>
    </label>
</template>

<script>
export default {
    name: 'RadioButton',
    props: {
        modelValue: {
            required: true,
        },
        value: {
            required: true,
        },
        label: String,
    },
    emits: ['change', 'update:modelValue'],
    methods: {
        toggle() {
            this.$emit('update:modelValue', this.value);
            this.$emit('change', this.value);
        }
    },
}
</script>

<style lang="scss">
@use '../../assets/css/variables';

.custom-radio-button-label {
    display: flex;
    align-items: center;
}

.custom-radio-button-label span {
    display: inline-flex;
    user-select: none;
    cursor: pointer;
    font-family: DM Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
    color: variables.$primary-color-dark;
}

.custom-radio-button + span::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    flex-grow: 0;
    background-repeat: no-repeat;
    background-position: center center;
    background-color: #ffffff;
    border: 1px solid variables.$neutral-color-black-light;
    border-radius: 50%;
    margin-right: 8px;
}

.custom-radio-button {
    position: absolute;
    z-index: -1;
    opacity: 0;
}

.custom-radio-button:checked + span::before {
    background: #FFFFFF;
    border: 4px solid variables.$primary-color-dark;
    box-sizing: border-box;
    box-shadow: 0px 2px 8px rgba(#0741AD, 0.2);
    background-repeat: no-repeat;
    background-position: center center;
}

.custom-radio-button:not(:disabled):not(:checked) + span:hover::before,
.custom-radio-button:not(:disabled):active + span::before,
.custom-radio-button:focus + span::before {
    border-color: variables.$primary-color-light;
    box-shadow: 0px 2px 8px rgba(#0741AD, 0.2);
}

.custom-radio-button:not(:disabled):active + span::before {
    background: variables.$primary-color-dark;
}
</style>
