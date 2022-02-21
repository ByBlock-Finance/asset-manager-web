<template>
    <div class="dropdown-menu-overlay" tabindex="0" @blur="menuOpened = false">
        <InputField
            class="menu-trigger"
            size="small"
            type="secondary"
            outlined
            @click="menuOpened = !menuOpened"
        >
        </InputField>
        <div class="dropdown-menu">
            <DropdownMenu v-model="menuOpened">
                <DropdownMenuItem>
                    <template v-slot:item-content>
                        <div class="text">Edit</div>
                    </template>
                </DropdownMenuItem>
            </DropdownMenu>
        </div>
    </div>
</template>
<script>
import DropdownMenu from '@/components/general/DropdownMenu.vue';
import DropdownMenuItem from '@/components/general/DropdownMenuItem.vue';
import InputField from '@/components/general/InputField.vue';

export default {
    components: {
        DropdownMenu,
        DropdownMenuItem,
        InputField
    },
    data() {
        return {
            menuOpened: true,
        };
    },
}
</script>
