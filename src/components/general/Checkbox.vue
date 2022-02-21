<template>
    <label class="custom-checkbox-label">
        <input type="checkbox" class="custom-checkbox" @change="toggle" :checked="modelValue">
        <span>{{ label }}</span>
    </label>
</template>

<script>
export default {
    name: 'Checkbox',
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        label: String,
    },
    emits: ['update:modelValue'],
    methods: {
        toggle() {
            this.$emit('update:modelValue', !this.modelValue);
        }
    },
}
</script>

<style lang="scss">
@use '../../assets/css/variables';

.custom-checkbox-label {
    display: flex;
    align-items: center;
}

.custom-checkbox-label span {
    display: inline-flex;
    user-select: none;
    cursor: pointer;
    font-family: DM Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
    color: #4C5055;
}

.custom-checkbox + span::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    flex-grow: 0;
    background-repeat: no-repeat;
    background-position: center center;
    background-color: #ffffff;
    border: 1px solid #c5c5c5;
    border-radius: 2px;
    margin-right: 8px;
}

.custom-checkbox {
    position: absolute;
    z-index: -1;
    opacity: 0;
}

.custom-checkbox:checked + span::before {
    background: variables.$neutral-color-black-dark;
    background-image: url('~@/assets/icons/singular/check.svg');
    background-repeat: no-repeat;
    background-position: center center;
}

.custom-checkbox:not(:disabled):not(:checked) + span:hover::before,
.custom-checkbox:not(:disabled):active + span::before,
.custom-checkbox:focus + span::before {
    border-color: #BEC5DA;
    box-shadow: 0px 2px 8px rgba(#B1C3E3, 0.4);
}

.custom-checkbox:not(:disabled):active + span::before {
    background: variables.$neutral-color-black-dark;
}
</style>
