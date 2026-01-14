import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useApiClient } from '~/composables/useApiClient';

export interface DashboardStats {
    totalUsers: number;
    totalOrders: number;
    totalSales: number;
    totalPending: number;
}

export interface StatGrowth {
    value: number;
    isPositive: boolean;
    label: string;
}

export const useDashboardStore = defineStore('dashboard', () => {
    const stats = ref<DashboardStats>({
        totalUsers: 0,
        totalOrders: 0,
        totalSales: 0,
        totalPending: 0,
    });
    const loading = ref(false);
    const error = ref<string | null>(null);

    const getStats = computed(() => stats.value);
    const isLoading = computed(() => loading.value);
    const hasError = computed(() => error.value !== null);

    async function fetchStats() {
        loading.value = true;
        error.value = null;

        try {
            const { client } = useApiClient();

            const [usersRes, productsRes, postsRes] = await Promise.all([
                client.get<{ total: number }>('https://dummyjson.com/users?limit=0'),
                client.get<{ total: number }>('https://dummyjson.com/products?limit=0'),
                client.get<{ total: number }>('https://dummyjson.com/posts?limit=0'),
            ]);

            stats.value = {
                totalUsers: usersRes.total || 0,
                totalOrders: productsRes.total || 0,
                totalSales: Math.floor((productsRes.total || 0) * 1250),
                totalPending: Math.floor((postsRes.total || 0) / 2),
            };
        } catch (err) {
            error.value = 'Failed to fetch dashboard statistics';
            console.error('Dashboard stats error:', err);
        } finally {
            loading.value = false;
        }
    }

    return {
        stats,
        loading,
        error,
        getStats,
        isLoading,
        hasError,
        fetchStats,
    };
});
