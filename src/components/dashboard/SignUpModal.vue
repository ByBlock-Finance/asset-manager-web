<template>
    <Modal :modelValue="modelValue" @update:modelValue="closeModal">
        <template v-slot:modal-header>
            <div>Sign up</div>
        </template>
        <template v-slot:modal-content>
            <div class="sign-up-header">
                <h1 class="heading-large-bold">Don't Lose Progress</h1>
                <p class="text-large text-dimmed">Sign up & Continue</p>
            </div>
            <div class="mt-2">
                <input-field placeholder="Name" />
            </div>
        </template>
        <template v-slot:modal-actions>
            <Button type="primary" size="medium" @click="saveAndProceed">Sign Up</Button>
        </template>
    </Modal>
</template>

<script>
import Button from '../general/Button.vue';
import InputField from '../general/InputField.vue';
import Modal from '../general/Modal.vue';

export default {
    name: 'CreateSystemModal',
    components: {
        Button,
        Modal,
        InputField,
    },
    props: {
        modelValue: Boolean,
    },
    emits: ['update:modelValue'],
    methods: {
        closeModal() {
            this.$emit('update:modelValue', false);
        },
        saveAndProceed() {
            console.log('Poot')
        },
        resetAllData() {
            console.log('Poop')
        },
    },
    watch: {
        modelValue(value) {
            if (!value) {
                return;
            }
        }
    },
}
</script>

<style>
.sign-up-header {
    text-align: center;
}
</style>
