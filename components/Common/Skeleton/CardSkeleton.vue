<script setup lang="ts">
interface Props {
    count?: number;
    cols?: number;
}

const props = withDefaults(defineProps<Props>(), {
    count: 4,
    cols: 4,
});

const skeletonCards = Array.from({ length: props.count }, (_, i) => i);
</script>

<template>
    <div class="grid gap-6" :class="`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-${cols}`">
        <div
            v-for="card in skeletonCards"
            :key="`skeleton-card-${card}`"
            class="card-skeleton"
        >
            <!-- Image skeleton -->
            <div class="skeleton-image h-48 w-full mb-4" />

            <!-- Title skeleton -->
            <div class="skeleton-item h-6 w-3/4 mb-3" />

            <!-- Text skeleton -->
            <div class="skeleton-item h-4 w-full mb-2" />
            <div class="skeleton-item h-4 w-5/6 mb-2" />

            <!-- Price skeleton -->
            <div class="flex justify-between items-center mt-4">
                <div class="skeleton-item h-6 w-20" />
                <div class="skeleton-item h-8 w-24" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-skeleton {
    @apply bg-white dark:bg-dark-secondary p-4 rounded-lg border border-gray-200 dark:border-gray-700;
}

.skeleton-image,
.skeleton-item {
    @apply bg-gray-200 dark:bg-gray-700 rounded animate-pulse;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
