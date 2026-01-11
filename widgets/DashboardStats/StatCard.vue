<script setup lang="ts">
import { Icon } from '~/shared/ui';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: string;
    growth?: {
        value: number;
        isPositive: boolean;
        label: string;
    };
    iconColor?: string;
    iconBgColor?: string;
}

const props = withDefaults(defineProps<StatCardProps>(), {
    iconColor: 'text-primary',
    iconBgColor: 'bg-primary/10',
});

const formattedValue = computed(() => {
    if (typeof props.value === 'number') {
        return props.value.toLocaleString();
    }
    return props.value;
});
</script>

<template>
    <a-card
        :bordered="false"
        class="stat-card hover:shadow-lg transition-shadow duration-300"
    >
        <div class="flex items-center justify-between">
            <div class="flex-1">
                <p
                    class="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2"
                >
                    {{ label }}
                </p>
                <h3
                    class="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-3"
                >
                    {{ formattedValue }}
                </h3>

                <!-- Growth indicator -->
                <div v-if="growth" class="flex items-center gap-1">
                    <Icon
                        :name="growth.isPositive ? 'arrow-right' : 'arrow-left'"
                        :size="16"
                        :class="[
                            'transform',
                            growth.isPositive
                                ? 'rotate-[-45deg] text-green'
                                : 'rotate-[45deg] text-red',
                        ]"
                    />
                    <span
                        :class="[
                            'text-sm font-semibold',
                            growth.isPositive ? 'text-green' : 'text-red',
                        ]"
                    >
                        {{ growth.value }}%
                    </span>
                    <span class="text-xs text-light-text-tertiary dark:text-dark-text-secondary">
                        {{ growth.label }}
                    </span>
                </div>
            </div>

            <!-- Icon -->
            <div
                :class="[
                    'w-14 h-14 rounded-xl flex items-center justify-center',
                    iconBgColor,
                ]"
            >
                <Icon :name="icon" :size="28" :class="iconColor" />
            </div>
        </div>
    </a-card>
</template>

<style scoped>
.stat-card {
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply border-0;
}

.stat-card :deep(.ant-card-body) {
    @apply p-6;
}
</style>
