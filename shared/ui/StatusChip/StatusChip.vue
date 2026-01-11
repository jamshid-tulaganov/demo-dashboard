<script setup lang="ts">
interface StatusChipProps {
    status: 'pending' | 'delivered' | 'shipped' | 'cancelled' | 'processing';
    size?: 'small' | 'medium' | 'large';
}

const props = withDefaults(defineProps<StatusChipProps>(), {
    size: 'medium',
});

const { t } = useI18n();

const statusConfig = computed(() => {
    const configs = {
        pending: {
            color: 'bg-orange-light text-orange border-orange/20',
            label: t('orders.status.pending'),
        },
        processing: {
            color: 'bg-primary/10 text-primary border-primary/20',
            label: t('orders.status.processing'),
        },
        shipped: {
            color: 'bg-purple-light text-purple border-purple/20',
            label: t('orders.status.shipped'),
        },
        delivered: {
            color: 'bg-green-light text-green border-green/20',
            label: t('orders.status.delivered'),
        },
        cancelled: {
            color: 'bg-red-light text-red border-red/20',
            label: t('orders.status.cancelled'),
        },
    };

    return configs[props.status] || configs.pending;
});

const sizeClasses = computed(() => {
    const sizes = {
        small: 'text-xs px-2 py-1',
        medium: 'text-sm px-3 py-1.5',
        large: 'text-base px-4 py-2',
    };
    return sizes[props.size];
});
</script>

<template>
    <span
        :class="[
            'inline-flex items-center justify-center rounded-full font-semibold border',
            statusConfig.color,
            sizeClasses,
        ]"
    >
        {{ statusConfig.label }}
    </span>
</template>
