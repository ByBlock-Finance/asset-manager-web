<template>
    <div class="btn" :class="classes">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'Button',
    props: {
        type: {
            type: String,
            default: 'primary',
        },
        size: {
            type: String,
            default: 'large',
        },
        outlined: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: [],
    computed: {
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        classes() {
            return {
                'btn-primary': this.type === 'primary',
                'btn-secondary': this.type === 'secondary',
                'btn-large': this.size === 'large',
                'btn-medium': this.size === 'medium',
                'btn-small': this.size === 'small',
                'btn-outline': !!this.outlined,
                'btn-disabled': !!this.disabled,
            };
        }
    },
}
</script>

<style lang="scss">
@use '../../assets/css/variables';

.btn {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: DM Sans Bold;
    font-style: normal;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
    box-sizing: border-box;
}

.btn-primary {
    background-color: variables.$primary-color-dark;
    color: variables.$neutral-color-white-light;
    transition: background-color 0.2s;
}

.btn-primary:hover {
    background-color: variables.$primary-color-light;
}

.btn-primary:active {
    background: variables.$primary-color-medium;
    // box-shadow: 0 0 0 3px #F29D9B;
}

.btn-secondary {
    background-color: variables.$neutral-color-white-light;
    color: variables.$primary-color-dark;
}

.btn-secondary:hover {
    background-color: variables.$primary-color-light;
    transition: background-color 0.2s;
    color: variables.$neutral-color-white-light;
}

.btn-secondary:active {
    background: variables.$primary-color-medium;
    color: variables.$neutral-color-white-light;
}

.btn-large {
    height: 48px;
    padding: 16px 32px;
    font-size: 16px;
    line-height: 150%;
    border-radius: 6px;
}

.btn-medium {
    height: 40px;
    padding: 10px 24px;
    font-size: 14px;
    line-height: 150%;
    border-radius: 6px;
}

.btn-small {
    height: 32px;
    padding: 8px 16px;
    font-size: 12px;
    line-height: 150%;
    border-radius: 6px;
}

.btn-primary.btn-outline {
    background-color: #FFFFFF;
    border: 1px solid #CC0000;
    box-sizing: border-box;
    color: #CC0000;
}

.btn-secondary.btn-outline {
    background-color: #FFFFFF;
    border: 1px solid #737372;
    box-sizing: border-box;
    color:#737372;
}

.btn-disabled {
    background-color: variables.$neutral-color-white-dark;
    border: none;
    color: variables.$neutral-color-black-light;
    pointer-events: none;
    cursor: not-allowed;
}
</style>
