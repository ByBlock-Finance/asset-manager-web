<template>
<dashboard-layout>
    <template v-slot:content>
        <div class="about">
            <h1 class="heading-large-bold">This is an about page</h1>
            <placeholder>
                <template v-slot:placeholder-content>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum aliquid quis quas odit rerum? Harum ea natus fugit accusantium voluptatum. Odio quo minus deserunt, doloribus dolore blanditiis libero assumenda minima.</p>
                    <Button type="primary" class="mr-4" @click="showSignUpModal = true">Show Modal</Button>
                </template>
            </placeholder>
            <editable-placeholder title="Project Description">
                <template v-slot:placeholder-header>
                    <h3 class="heading-x-small-bold text-dimmed">Project Description</h3>
                </template>
                <template v-slot:placeholder-editable-content>
                    <p class="text-small text-dimmed">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem corrupti aut laborum culpa pariatur. Repellat, blanditiis sequi asperiores odio neque ducimus doloremque expedita eligendi, quam aliquam quae, pariatur deleniti. Delectus.</p>
                </template>
            </editable-placeholder>
        </div>
        <sign-up-modal size="small" v-model="showSignUpModal"></sign-up-modal>
    </template>
</dashboard-layout>
</template>

<script>
import SignUpModal from '@/components/dashboard/SignUpModal.vue';
import Placeholder from '@/components/general/Placeholder.vue';
import { Options, Vue } from 'vue-class-component';
import DashboardLayout from "../layouts/DashboardLayout";
import Button from '@/components/general/Button.vue';
import EditablePlaceholder from '@/components/dashboard/EditablePlaceholder.vue';

@Options({
  components: {
    DashboardLayout,
    Placeholder,
    SignUpModal,
    Button,
    EditablePlaceholder,
  },
  data() {
    return {
            showSignUpModal: false,
        };
    },
})
export default class Home extends Vue {}
</script>
