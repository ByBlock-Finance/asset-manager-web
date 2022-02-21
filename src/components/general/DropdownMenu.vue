<template>
    <div class="menu-card" v-if="modelValue">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'DropdownMenu',
    props: {
        modelValue: Boolean,
    },
    emits: ['update:modelValue'],
    methods: {
        closeModal() {
            this.$emit('update:modelValue', false);
        },
    },
}
</script>

<style scoped>
.menu-card {
    display: flex;
    flex-direction: column;
    background: #FFFFFF;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 12px;
}
</style>
