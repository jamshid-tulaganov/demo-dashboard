<script setup lang="ts">
import dayjs from 'dayjs';
import { useOrdersStore } from '~/stores/orders';
import type { Order } from '~/stores/orders';

const { t } = useI18n();
const ordersStore = useOrdersStore();

const monthOptions = computed(() => {
    const months = [];
    for (let i = 0; i < 6; i++) {
        const date = dayjs().subtract(i, 'month');
        months.push({
            value: date.format('YYYY-MM'),
            label: date.format('MMMM YYYY'),
        });
    }
    return months;
});

const orders = computed(() => ordersStore.getAllOrders);
const loading = computed(() => ordersStore.isLoading);
const selectedMonth = computed({
    get: () => ordersStore.selectedMonth,
    set: (value: string) => ordersStore.setSelectedMonth(value),
});

onMounted(() => {
    ordersStore.fetchOrders();
});

const currentPage = ref(1);
const pageSize = ref(10);

const columns = [
    {
        title: t('orders.productName'),
        dataIndex: 'productName',
        key: 'productName',
        width: '25%',
    },
    {
        title: t('orders.location'),
        dataIndex: 'location',
        key: 'location',
        width: '15%',
    },
    {
        title: t('orders.dateTime'),
        dataIndex: 'dateTime',
        key: 'dateTime',
        width: '15%',
    },
    {
        title: t('orders.quantity'),
        dataIndex: 'quantity',
        key: 'quantity',
        width: '10%',
        align: 'center' as const,
    },
    {
        title: t('orders.price'),
        dataIndex: 'price',
        key: 'price',
        width: '12%',
    },
    {
        title: t('orders.status.title'),
        dataIndex: 'status',
        key: 'status',
        width: '13%',
        align: 'center' as const,
    },
];

const formatDate = (dateString: string) => {
    return dayjs(dateString).format('MMM D, YYYY HH:mm');
};

const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
};
</script>

<template>
    <a-card :bordered="false" class="orders-table-card">
        <template #title>
            <div class="flex items-center justify-between flex-wrap gap-4">
                <h3
                    class="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary"
                >
                    {{ t('orders.title') }}
                </h3>

                <!-- Month Filter -->
                <a-select
                    v-model:value="selectedMonth"
                    :options="monthOptions"
                    class="w-48"
                    size="large"
                >
                    <template #suffixIcon>
                        <Icon name="calendar" :size="16" />
                    </template>
                </a-select>
            </div>
        </template>

        <a-table
            :columns="columns"
            :data-source="orders"
            :loading="loading"
            :pagination="{
                current: currentPage,
                pageSize: pageSize,
                total: orders.length,
                showSizeChanger: true,
                showTotal: (total: number) => t('orders.totalItems', { count: total }),
            }"
            :scroll="{ x: 800 }"
            row-key="id"
            @change="
                (pagination: any) => {
                    currentPage = pagination.current;
                    pageSize = pagination.pageSize;
                }
            "
        >
            <!-- Product Name with Image -->
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'productName'">
                    <div class="flex items-center gap-3">
                        <img
                            :src="record.productImage"
                            :alt="record.productName"
                            class="w-10 h-10 rounded-lg object-cover"
                            referrerpolicy="no-referrer"
                        />
                        <span
                            class="font-medium text-light-text-primary dark:text-dark-text-primary"
                        >
                            {{ record.productName }}
                        </span>
                    </div>
                </template>

                <!-- Location -->
                <template v-else-if="column.key === 'location'">
                    <span
                        class="text-light-text-secondary dark:text-dark-text-secondary"
                    >
                        {{ record.location }}
                    </span>
                </template>

                <!-- Date Time -->
                <template v-else-if="column.key === 'dateTime'">
                    <span
                        class="text-light-text-secondary dark:text-dark-text-secondary"
                    >
                        {{ formatDate(record.dateTime) }}
                    </span>
                </template>

                <!-- Quantity -->
                <template v-else-if="column.key === 'quantity'">
                    <span
                        class="font-semibold text-light-text-primary dark:text-dark-text-primary"
                    >
                        {{ record.quantity }}
                    </span>
                </template>

                <!-- Price -->
                <template v-else-if="column.key === 'price'">
                    <span
                        class="font-semibold text-green"
                    >
                        {{ formatPrice(record.price) }}
                    </span>
                </template>

                <!-- Status -->
                <template v-else-if="column.key === 'status'">
                    <StatusChip :status="record.status" size="small" />
                </template>
            </template>
        </a-table>
    </a-card>
</template>

<style scoped>
.orders-table-card {
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply border-0;
}

.orders-table-card :deep(.ant-card-head) {
    @apply border-b border-light-text-tertiary/10 dark:border-dark-quaternary/30;
}

.orders-table-card :deep(.ant-card-body) {
    @apply p-6;
}

/* Table styling */
.orders-table-card :deep(.ant-table) {
    @apply bg-transparent;
}

.orders-table-card :deep(.ant-table-thead > tr > th) {
    @apply bg-light-bg dark:bg-dark-tertiary;
    @apply text-light-text-primary dark:text-dark-text-primary;
    @apply font-semibold;
    @apply border-b border-light-text-tertiary/10 dark:border-dark-quaternary/30;
}

.orders-table-card :deep(.ant-table-tbody > tr > td) {
    @apply border-b border-light-text-tertiary/10 dark:border-dark-quaternary/30;
    @apply bg-transparent;
}

.orders-table-card :deep(.ant-table-tbody > tr:hover > td) {
    @apply bg-light-bg dark:bg-dark-tertiary;
}

.orders-table-card :deep(.ant-pagination) {
    @apply mt-4;
}

.orders-table-card :deep(.ant-pagination-item) {
    @apply bg-light-bg dark:bg-dark-tertiary;
    @apply border-light-text-tertiary/20 dark:border-dark-quaternary/30;
}

.orders-table-card :deep(.ant-pagination-item a) {
    @apply text-light-text-primary dark:text-dark-text-primary;
}

.orders-table-card :deep(.ant-pagination-item-active) {
    @apply bg-primary border-primary;
}

.orders-table-card :deep(.ant-pagination-item-active a) {
    @apply text-white;
}
</style>
