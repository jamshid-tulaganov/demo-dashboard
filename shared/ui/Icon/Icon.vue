<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

interface IconProps {
    name: string;
    size?: number | string;
    class?: string;
    /** Override icon color. Use 'auto' for theme-aware colors */
    color?: string;
}

const props = withDefaults(defineProps<IconProps>(), {
    size: 24,
    color: 'auto',
});

const svgContent = ref<string>('');
const isLoading = ref(true);

const iconSize = computed(() => {
    return typeof props.size === 'number' ? `${props.size}px` : props.size;
});

const iconColor = computed(() => {
    if (props.color === 'auto') {
        return 'currentColor';
    }
    return props.color;
});

// Load SVG content
onMounted(async () => {
    try {
        const response = await fetch(`/icons/${props.name}.svg`);
        if (response.ok) {
            let svg = await response.text();
            // Replace any hardcoded colors with currentColor
            svg = svg.replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"');
            svg = svg.replace(/stroke="(?!none)[^"]*"/g, 'stroke="currentColor"');
            svgContent.value = svg;
        } else {
            console.warn(`Icon "${props.name}" not found`);
            // Load default icon
            const defaultResponse = await fetch('/icons/default.svg');
            svgContent.value = await defaultResponse.text();
        }
    } catch (error) {
        console.error(`Error loading icon "${props.name}":`, error);
    } finally {
        isLoading.value = false;
    }
});
</script>

<template>
    <span
        v-if="!isLoading"
        :class="['icon-wrapper inline-flex items-center justify-center', props.class]"
        :style="{
            width: iconSize,
            height: iconSize,
            color: iconColor,
        }"
        v-html="svgContent"
    />
</template>

<style scoped>
.icon-wrapper {
    flex-shrink: 0;
}

/* Make SVG inherit text color for theme support */
.icon-wrapper :deep(svg) {
    width: 100%;
    height: 100%;
}

/* Override any remaining hardcoded colors */
.icon-wrapper :deep(svg [fill]:not([fill="none"])) {
    fill: currentColor;
}

.icon-wrapper :deep(svg [stroke]:not([stroke="none"])) {
    stroke: currentColor;
}
</style>
