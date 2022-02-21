<template>
    <div class="placehoder">
        <slot name="placeholder-content" />
    </div>
</template>
<script>
export default {
    name: "Placeholder",
}
</script>
<style lang="scss">
.placehoder {
    margin-top: 16px;
    box-sizing: border-box;
    border-radius: 8px;
    box-shadow: 0 2px 8px 0 rgba(#162430, 0.08);
    background-color: #ffffff;
    padding: 12px 16px;
}
</style>
