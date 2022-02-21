<template>
    <div class="switch" :class="{ disabled, active: modelValue }" @click="toggle">
        <div class="text-overlay">{{ modelValue ? 'ON' : 'OFF' }}</div>
        <div class="knob"></div>
    </div>
</template>

<script>
export default {
    name: 'Switch',
    props: {
        modelValue: Boolean,
        disabled: {
            type: Boolean,
            default: false,
        }
    },
    emits: ['update:modelValue'],
    methods: {
        toggle() {
            this.$emit('update:modelValue', !this.modelValue);
        },
    },
}
</script>


<style lang="scss">
@use '../../assets/css/variables';

.switch {
    display: flex;
    position: relative;
    align-items: center;
    width: 80px;
    height: 32px;
    background-color: #737372;
    color: #FFFFFF;
    user-select: none;
    border-radius: 50px;
    padding: 8px 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.switch .text-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    flex: 1 1 100%;
    top: 0;
    left: 0;
    font-family: DM Sans Bold;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 19px;
    padding: 8px;
    text-align: right;
}

.switch .knob {
    position: relative;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #FFFFFF;
    left: 0;
    transition: left 0.3s;
}

.active .knob {
    left: calc(100% - 24px);
}

.active .text-overlay {
    text-align: left;
}

.active {
    background-color: variables.$primary-color-medium;
}

.disabled {
    background-color: variables.$neutral-color-black-light;
    pointer-events: none;
    cursor: not-allowed;
}
</style>
