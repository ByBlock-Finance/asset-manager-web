<template>
<div class="abstract-image-wrapper" @click="toggleDropdown">
    <slot name="main-image" />
    <div class="dropdown">
        <div class="arrow-wrapper">
            <i class="arrow" :class="onDropdownOpen"/>
        </div>
        <div v-if="isDropdownVisible" class="dropdown-items-wrapper">
            <div v-for="imageURL in imgURLs" :key="imageURL" class="dropdown-items">
                <div class="image-box"
                    @click.stop="toggleImageSelection(imageURL)">
                    <img :src="imageURL" alt="Silencer Class Image">
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';

export default {    
    name: "AbstractImageDropdown",
    props: {
        modelValue: {
            type: Boolean,
        }
    },
    computed: {
        ...mapState('silencersModule', ['silencers']),
        ...mapGetters('silencerClassesModule', {
            'imgURLs': 'abstractImageURLs',
        }),
        onDropdownOpen() {
            return {
                'arrow-open': this.isDropdownVisible,
            }
        }
    },
    emits: ["selectAbstracProductImage"],
    methods: {
        toggleDropdown() {
            this.isDropdownVisible = !this.isDropdownVisible;
        },
        toggleImageSelection(url) {
            this.$emit('selectAbstracProductImage', url);
            this.toggleDropdown();
        },
    },
    data() {
        return {
            isDropdownVisible: false,
        }
    }
}
</script>
<style>
.abstract-image-wrapper {
    cursor: pointer;
}

.dropdown {
    position: relative;
}

.dropdown .dropdown-items-wrapper {
    position: absolute;
    z-index: 1;
    right: 0;
    border: 1px solid transparent;
    background-color: #E3E3E3;
    border-radius: 4px;
    max-height: 250px;
    overflow: auto;
    cursor: default;
}

.dropdown .dropdown-items-wrapper .dropdown-items img {
    cursor: pointer;
}

.dropdown .dropdown-items-wrapper::-webkit-scrollbar {
    display: none !important;
}

.arrow-wrapper {
    display: flex;
    padding: 8px;
    justify-content: center;
}

i.arrow {
    display: inline-block;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #c4c4c4;
    transition: all .2s;
}

i.arrow.arrow-open {
    transform: rotate(-180deg);
    transition: all .2s;
}

.image-box {
    background-color: white;
    margin: 4px;
    border-radius: 4px
}

</style>
