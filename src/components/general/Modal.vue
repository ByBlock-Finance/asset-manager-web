<template>
    <div class="background-overlap" v-if="modelValue"></div>
    <div class="modal-background" v-if="modelValue">
        <div class="modal-card" :class="modalSizeClasses">
            <div class="modal-header">
                <slot name="modal-header"></slot>
                <i class="close-modal" @click="closeModal"></i>
            </div>
            <div class="modal-content">
                <slot name="modal-content"></slot>
            </div>
            <div class="modal-actions">
                <slot name="modal-actions"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Modal',
    props: {
        modelValue: Boolean,
        size: {
            type: String,
            default: 'auto',
        }
    },
    emits: ['update:modelValue'],
    computed: {
        modalSizeClasses() {
            return {
                'modal-small': this.size === 'small',
                'modal-medium': this.size === 'medium',
                'modal-auto': this.size === 'auto',
            };
        },
    },
    methods: {
        closeModal() {
            this.$emit('update:modelValue', false);
        },
    },
}
</script>

<style scoped>
.background-overlap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #000000;
    opacity: 0.4;
    z-index: 1000;
}

.modal-background {
    position: fixed;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    z-index: 1000;
}

.modal-card {
    display: flex;
    flex-direction: column;
    background: #FFFFFF;
    border-radius: 8px;
    max-width: 90vw;
    max-height: 100vh;
}

.modal-card.modal-small {
    max-width: 420px;
    width: 420px;
}

.modal-card.modal-medium {
    max-width: 720px;
    width: 720px;
}

.modal-card.modal-auto {
    max-width: 90vw;
    width: auto;
}


.modal-card .modal-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    min-height: 62px;
    padding: 20px 24px;
    box-sizing: border-box;
}

.modal-card .modal-header, .modal-card .modal-header div {
    font-family: DM Sans Bold;
    font-style: normal;
    font-size: 18px;
}

.modal-card .modal-header i.close-modal {
    display: flex;
    cursor: pointer;
    width: 14px;
    height: 14px;
    background-image: url('../../assets/icons/singular/cross.svg');
    background-repeat: no-repeat;
    background-position: center center;
    margin-right: 3px;
}

.modal-background hr {
    border: 1px solid #F5F5F5;
    width: 100%;
    box-sizing: border-box;
}

.modal-card .modal-content {
    display: flex;
    flex-direction: column;
    padding: 10px 24px;
    box-sizing: border-box;
    overflow: auto;
}

.modal-card .modal-content .title {
    font-size: 14px;
    line-height: 17px;
}

.modal-card .modal-content .row {
    display: flex;
    flex-direction: row;
}

.mr-16 {
    margin-right: 16px;
}

.mt-20 {
    margin-top: 20px;
}

.mt-12 {
    margin-top: 12px;
}

.small-input {
    width: 70px;
}

.modal-card .modal-actions {
    /* display: flex; */
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    padding: 16px 24px;
    box-sizing: border-box;
    /* box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2); */
}
</style>
