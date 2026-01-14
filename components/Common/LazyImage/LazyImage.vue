<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

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

const imageRef = ref<HTMLImageElement | null>(null);
const isLoaded = ref(false);
const hasError = ref(false);
const currentSrc = ref(props.placeholder);

let observer: IntersectionObserver | null = null;

const loadImage = () => {
    if (isLoaded.value || hasError.value || !props.src) return;

    const img = new Image();
    img.onload = () => {
        currentSrc.value = props.src;
        isLoaded.value = true;
    };
    img.onerror = () => {
        hasError.value = true;
    };
    img.src = props.src;
};

const setupObserver = () => {
    if (!imageRef.value) return;

    // Check if IntersectionObserver is supported
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        loadImage();
                        observer?.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '100px',
                threshold: 0,
            }
        );

        observer.observe(imageRef.value);
    } else {
        // Fallback: load immediately
        loadImage();
    }
};

// Watch for src changes
watch(() => props.src, (newSrc) => {
    if (newSrc && newSrc !== currentSrc.value) {
        isLoaded.value = false;
        hasError.value = false;
        currentSrc.value = props.placeholder;
        loadImage();
    }
});

onMounted(() => {
    // Small delay to ensure DOM is ready after hydration
    setTimeout(setupObserver, 0);
});

onBeforeUnmount(() => {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
});
</script>

<template>
    <div class="lazy-image-wrapper relative" :class="props.class">
        <img
            ref="imageRef"
            :src="currentSrc"
            :alt="alt"
            :width="width"
            :height="height"
            :class="[
                'lazy-image',
                { 'loaded': isLoaded, 'loading': !isLoaded && !hasError, 'error': hasError }
            ]"
            loading="lazy"
            referrerpolicy="no-referrer"
        />

        <!-- Loading spinner -->
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
    transition: opacity 0.3s ease-in-out, filter 0.3s ease-in-out;
}

.lazy-image.loading {
    opacity: 0;
    filter: blur(10px);
}

.lazy-image.loaded {
    opacity: 1;
    filter: blur(0);
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
