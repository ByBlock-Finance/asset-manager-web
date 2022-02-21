<template>
    <div class="menu-item">
        <slot name="item-prefix"></slot>
        <slot name="item-content"></slot>
        <slot name="item-postfix"></slot>
    </div>
</template>

<script>
export default {
    name: 'DropdownMenuItem',
}
</script>

<style scoped>
.menu-item {
    display: flex;
    margin-bottom: 12px;
    box-sizing: border-box;
    align-items: center;
    cursor: pointer;
    user-select: none;
}

.menu-item:last-of-type {
    margin-bottom: 0;
}

.menu-item:hover {
    background-color: rgba(0, 0, 0, 0.025);
}
</style>
