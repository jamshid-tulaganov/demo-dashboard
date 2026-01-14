<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Props {
    src: string;
    alt?: string;
    placeholder?: string;
    class?: string;
    width?: number | string;
    height?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
    alt: '',
    placeholder: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3C/svg%3E',
});

const isLoaded = ref(false);
const hasError = ref(false);

const onLoad = () => {
    isLoaded.value = true;
};

const onError = () => {
    hasError.value = true;
};

// Reset state when src changes
onMounted(() => {
    isLoaded.value = false;
    hasError.value = false;
});
</script>

<template>
    <div class="lazy-image-wrapper relative" :class="props.class">
        <!-- Actual image with native lazy loading -->
        <img
            :src="src"
            :alt="alt"
            :width="width"
            :height="height"
            :class="[
                'lazy-image',
                { 'loaded': isLoaded, 'loading': !isLoaded && !hasError, 'error': hasError }
            ]"
            loading="lazy"
            referrerpolicy="no-referrer"
            @load="onLoad"
            @error="onError"
        />

        <!-- Loading spinner - shows until image loads -->
        <div
            v-if="!isLoaded && !hasError"
            class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800"
        >
            <div class="spinner" />
        </div>

        <!-- Error state -->
        <div
            v-if="hasError"
            class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400"
        >
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
    </div>
</template>

<style scoped>
.lazy-image-wrapper {
    overflow: hidden;
}

.lazy-image {
    transition: opacity 0.3s ease-in-out;
}

.lazy-image.loading {
    opacity: 0;
}

.lazy-image.loaded {
    opacity: 1;
}

.lazy-image.error {
    opacity: 0;
}

.spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
