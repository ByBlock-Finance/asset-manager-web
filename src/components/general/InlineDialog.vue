<template>
    <div class="inline-dialog" :class="classes">
        <div class="icon icon-large" :class="iconClass"></div>
        <div class="text">
            <slot></slot>
        </div>
    </div>
</template>

<script>
const ALLOWED_TYPES = [
    'info',
    'warning',
    'error',
    'success',
    'default',
];

export default {
    name: 'InlineDialog',
    props: {
        type: {
            type: String,
            default: 'default',
        }
    },
    computed: {
        classes() {
            if (!ALLOWED_TYPES.includes(this.type)) {
                return { default: true };
            }

            return { [this.type]: true };
        },
        iconClass() {
            switch (this.type) {
                case 'info':
                    return { 'icon-info': true };
                case 'warning':
                    return { 'icon-warning': true };
                case 'error':
                    return { 'icon-error': true };
                case 'success':
                    return { 'icon-success': true };
                default:
                    return { 'icon-info': true };
            }
        }
    },
}
</script>

<style scoped>
.inline-dialog {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 18px;
    min-height: 40px;
}

.inline-dialog.info {
    background-color: #DFEBF7;
}

.inline-dialog.warning {
    background-color: #FFEC70;
}

.inline-dialog.error {
    background-color: #FFEBEB;
}

.inline-dialog.success {
    background-color:#CAF6EC;
}

.inline-dialog.default {
    background-color:#FFFFFF;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
}

.inline-dialog .text {
    font-family: DM Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 11px;
    line-height: 13px;
    color: #4C5055;
}

.inline-dialog .icon {
    margin-right: 8px;
}
</style>
