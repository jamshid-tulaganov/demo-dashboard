<script setup lang="ts">
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';
import dayjs from 'dayjs';
import { useDashboardStore } from '~/stores/dashboard';

Chart.register(...registerables);

const { t } = useI18n();
const dashboardStore = useDashboardStore();
const stats = computed(() => dashboardStore.getStats);

const selectedMonth = ref(dayjs().format('YYYY-MM'));

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

const generateChartData = (month: string) => {
    const selectedDate = dayjs(month);
    const daysInMonth = selectedDate.daysInMonth();
    const labels = [];
    const ordersData = [];
    const pendingData = [];

    const dataPoints = Math.min(daysInMonth, 30);
    const step = Math.ceil(daysInMonth / Math.min(dataPoints, 10));

    for (let i = 1; i <= daysInMonth; i += step) {
        const date = selectedDate.date(i);
        labels.push(date.format('MMM D'));

        const baseOrders = stats.value.totalOrders / 30;
        const basePending = stats.value.totalPending / 30;

        ordersData.push(Math.floor(baseOrders + Math.random() * (baseOrders * 0.5)));
        pendingData.push(Math.floor(basePending + Math.random() * (basePending * 0.5)));
    }

    return { labels, ordersData, pendingData };
};

const chartDataValues = computed(() => generateChartData(selectedMonth.value));

const chartData = computed(() => ({
    labels: chartDataValues.value.labels,
    datasets: [
        {
            label: t('dashboard.totalOrders'),
            data: chartDataValues.value.ordersData,
            borderColor: '#4880FF',
            backgroundColor: 'rgba(72, 128, 255, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#4880FF',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverBackgroundColor: '#4880FF',
            pointHoverBorderColor: '#fff',
        },
        {
            label: t('dashboard.totalPending'),
            data: chartDataValues.value.pendingData,
            borderColor: '#6226EF',
            backgroundColor: 'rgba(98, 38, 239, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#6226EF',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverBackgroundColor: '#6226EF',
            pointHoverBorderColor: '#fff',
        },
    ],
}));

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'top' as const,
            align: 'end' as const,
            labels: {
                usePointStyle: true,
                boxWidth: 8,
                boxHeight: 8,
                color: isDark.value ? '#FFFFFF' : '#202224',
                font: {
                    size: 12,
                    weight: '600',
                },
            },
        },
        tooltip: {
            backgroundColor: isDark.value ? '#273142' : '#FFFFFF',
            titleColor: isDark.value ? '#FFFFFF' : '#202224',
            bodyColor: isDark.value ? 'rgba(255, 255, 255, 0.8)' : '#434343',
            borderColor: isDark.value ? '#4B5668' : '#E5E7EB',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
                label: (context: any) => {
                    return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
                },
            },
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
            ticks: {
                color: isDark.value ? 'rgba(255, 255, 255, 0.6)' : '#646464',
                font: {
                    size: 11,
                },
            },
            border: {
                display: false,
            },
        },
        y: {
            beginAtZero: true,
            grid: {
                color: isDark.value ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                drawTicks: false,
            },
            ticks: {
                color: isDark.value ? 'rgba(255, 255, 255, 0.6)' : '#646464',
                font: {
                    size: 11,
                },
                padding: 8,
                callback: function (value: any) {
                    return value.toLocaleString();
                },
            },
            border: {
                display: false,
            },
        },
    },
    interaction: {
        intersect: false,
        mode: 'index' as const,
    },
}));

const isDark = computed(() => {
    if (window) {
        return document.documentElement.classList.contains('dark');
    }
    return false;
});
</script>

<template>
    <a-card :bordered="false" class="sales-chart-card !mb-6 pb-6">
        <template #title>
            <div class="flex items-center justify-between flex-wrap gap-4">
                <h3 class="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                    {{ t('dashboard.salesDetails') }}
                </h3>

                <!-- Month Filter -->
                <a-select v-model:value="selectedMonth" :options="monthOptions" class="w-48" size="large">
                    <template #suffixIcon>
                        <Icon name="calendar" :size="16" />
                    </template>
                </a-select>
            </div>
        </template>

        <div class="chart-container !mb-6 pb-6">
            <LineChart :chart-data="chartData" :options="chartOptions" />
        </div>
    </a-card>
</template>

<style scoped>
.sales-chart-card {
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply border-0;
}

.sales-chart-card :deep(.ant-card-head) {
    @apply border-b border-light-text-tertiary/10 dark:border-dark-quaternary/30;
}

.sales-chart-card :deep(.ant-card-body) {
    @apply p-6;
}

.chart-container {
    @apply w-full;
    height: 350px;
}
</style>
