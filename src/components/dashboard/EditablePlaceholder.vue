<template>
    <placeholder>
        <template v-slot:placeholder-content>
            <div class="placeholder-heading">
                <slot name="placeholder-header"></slot>
                <i class="edit" @click="editInformation"></i>
            </div>
            <div class="placeholder-editable-content mt-3">
                <slot name="placeholder-editable-content"></slot>
            </div>
        </template>
    </placeholder>
</template>
<script>
import Placeholder from '../general/Placeholder.vue'
export default {
    name: "EditablePlaceholder",
    props: {
        title: String,
    },
    components: {
        Placeholder
    }
}
</script>
<style scoped lang="scss">
.placeholder-heading {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
</style>

<style>
i.edit {
    display: flex;
    cursor: pointer;
    width: 16px;
    height: 16px;
    background-image: url('../../assets/icons/singular/edit.svg');
    background-repeat: no-repeat;
    background-position: center center;
    margin-right: 3px;
}
</style>
