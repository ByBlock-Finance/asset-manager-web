<template>
    <div class="radio-group">
        <RadioButton
            v-for="(option, index) in options"
            :key="`radio-button-${index}`"
            :value="option.value"
            :label="option.title"
            :modelValue="modelValue"
            @update:modelValue="toggle($event)"
            @change="toggle(option.value)"
        ></RadioButton>
    </div>
</template>

<script>
import RadioButton from './RadioButton';

export default {
    name: 'RadioGroup',
    components: { RadioButton },
    props: {
        options: {
            type: Array,
            required: true,
        },
        modelValue: {
            required: true,
        }
    },
    emits: ['change', 'update:modelValue'],
    methods: {
        toggle(value) {
            this.$emit('update:modelValue', value);
            this.$emit('change', value);
        },
    }
}
</script>

<style>

</style>