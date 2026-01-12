<script setup lang="ts">
import StatCard from '~/widgets/DashboardStats/StatCard.vue';
import SalesChart from '~/widgets/DashboardStats/SalesChart.vue';
import OrdersTable from '~/widgets/OrdersTable/OrdersTable.vue';
import { useDashboardStore } from '~/stores/dashboard';

definePageMeta({
    layout: 'default',
    middleware: ['auth'],
});

const { t } = useI18n();
const dashboardStore = useDashboardStore();

const stats = computed(() => dashboardStore.getStats);
const loading = computed(() => dashboardStore.isLoading);

// Fetch stats on mount
onMounted(() => {
    dashboardStore.fetchStats();
});

// Define stat cards configuration
const statCards = computed(() => [
    {
        label: t('dashboard.totalUsers'),
        value: stats.value.totalUsers,
        icon: 'users',
        iconColor: '!text-purple',
        iconBgColor: 'bg-purple-light',
        growth: {
            value: 8.5,
            isPositive: true,
            label: t('dashboard.upFromYesterday'),
        },
    },
    {
        label: t('dashboard.totalOrders'),
        value: stats.value.totalOrders,
        icon: 'product',
        iconColor: '!text-chart-yellow',
        iconBgColor: 'bg-yellow-light',
        growth: {
            value: 5.2,
            isPositive: true,
            label: t('dashboard.upFromYesterday'),
        },
    },
    {
        label: t('dashboard.totalSales'),
        value: `$${stats.value.totalSales.toLocaleString()}`,
        icon: 'line-chart',
        iconColor: '!text-chart-green',
        iconBgColor: '!bg-green-light',
        growth: {
            value: 12.3,
            isPositive: true,
            label: t('dashboard.upFromYesterday'),
        },
    },
    {
        label: t('dashboard.totalPending'),
        value: stats.value.totalPending,
        icon: 'reset-time',
        iconColor: '!text-chart-orange',
        iconBgColor: '!bg-orange-light',
        growth: {
            value: 3.1,
            isPositive: false,
            label: t('dashboard.downFromYesterday'),
        },
    },
]);
</script>

<template>
    <div class="space-y-4 md:space-y-6">
        <!-- Dashboard Title -->
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-light-text-primary dark:text-dark-text-primary">
            {{ t('dashboard.title') }}
        </h1>

        <!-- Statistics Cards -->
        <a-spin :spinning="loading">
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                <StatCard v-for="(card, index) in statCards" :key="index" :label="card.label" :value="card.value"
                    :icon="card.icon" :icon-color="card.iconColor" :icon-bg-color="card.iconBgColor"
                    :growth="card.growth" />
            </div>
        </a-spin>

        <SalesChart class="mb-4" />

        <OrdersTable />
    </div>
</template>