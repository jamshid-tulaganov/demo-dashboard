<script setup lang="ts">
interface Props {
    rows?: number;
    columns?: number;
}

const props = withDefaults(defineProps<Props>(), {
    rows: 5,
    columns: 8,
});

const skeletonRows = Array.from({ length: props.rows }, (_, i) => i);
const skeletonColumns = Array.from({ length: props.columns }, (_, i) => i);
</script>

<template>
    <div class="table-skeleton">
        <div class="skeleton-header mb-4">
            <div class="grid gap-4" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
                <div
                    v-for="col in skeletonColumns"
                    :key="`header-${col}`"
                    class="skeleton-item h-8"
                />
            </div>
        </div>

        <div class="skeleton-body space-y-3">
            <div
                v-for="row in skeletonRows"
                :key="`row-${row}`"
                class="skeleton-row"
            >
                <div class="grid gap-4" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
                    <div
                        v-for="col in skeletonColumns"
                        :key="`cell-${row}-${col}`"
                        class="skeleton-item h-12"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
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
