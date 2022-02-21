<template>
    <div class="breadcrumbs-container">
        <template v-for="(item, index) in items" :key="index">
            <span v-if="index < items.length - 1" class="breadcrumb" :class="{ 'active-breadcrumb': index === items.length - 1 }">
                <a :href="item.link">{{ item.title }}</a>
            </span>
          <span v-else class="breadcrumb" :class="{ 'active-breadcrumb': index === items.length - 1 }">{{ item.title }}</span>
          <span class="breadcrumb-separator" v-if="index < items.length - 1">&gt;</span>
        </template>
    </div>
</template>

<script>
export default {
    name: 'Breadcrumbs',
    props: {
        items: {
            type: Array,
            required: true,
        }
    },
}
</script>

<style>

</style>
