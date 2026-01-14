<script setup lang="ts">
import { computed } from 'vue';

interface LogoProps {
    /** Width of the logo */
    width?: number | string;
    /** Height of the logo */
    height?: number | string;
    /** Additional CSS classes */
    class?: string;
}

const props = withDefaults(defineProps<LogoProps>(), {
    width: 'auto',
    height: 40,
});

const { isDark } = useTheme();

const logoSrc = computed(() => {
    return isDark.value ? '/logo/light.svg' : '/logo/dark.svg';
});

const logoWidth = computed(() => {
    return typeof props.width === 'number' ? `${props.width}px` : props.width;
});

const logoHeight = computed(() => {
    return typeof props.height === 'number' ? `${props.height}px` : props.height;
});
</script>

<template>
    <img
        :src="logoSrc"
        alt="Dashboard Logo"
        :class="['logo', props.class]"
        :style="{
            width: logoWidth,
            height: logoHeight,
        }"
    />
</template>

<style scoped>
.logo {
    object-fit: contain;
    transition: opacity 0.2s ease-in-out;
}
</style>
