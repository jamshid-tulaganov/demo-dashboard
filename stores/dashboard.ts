import { defineStore } from 'pinia';
import { useApiClient } from '~/shared/lib/api/useApiClient';

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

export const useDashboardStore = defineStore('dashboard', {
    state: () => ({
        stats: {
            totalUsers: 0,
            totalOrders: 0,
            totalSales: 0,
            totalPending: 0,
        } as DashboardStats,
        loading: false,
        error: null as string | null,
    }),

    getters: {
        getStats: (state) => state.stats,
        isLoading: (state) => state.loading,
        hasError: (state) => state.error !== null,
    },

    actions: {
        async fetchStats() {
            this.loading = true;
            this.error = null;

            try {
                const { client } = useApiClient();

                // Fetch all stats in parallel
                const [usersRes, productsRes, postsRes] = await Promise.all([
                    client.get<{ total: number }>('https://dummyjson.com/users?limit=0'),
                    client.get<{ total: number }>('https://dummyjson.com/products?limit=0'),
                    client.get<{ total: number }>('https://dummyjson.com/posts?limit=0'),
                ]);

                // Map API data to dashboard stats
                this.stats = {
                    totalUsers: usersRes.total || 0,
                    totalOrders: productsRes.total || 0,
                    totalSales: Math.floor((productsRes.total || 0) * 1250), // Simulated sales
                    totalPending: Math.floor((postsRes.total || 0) / 2), // Simulated pending
                };
            } catch (err) {
                this.error = 'Failed to fetch dashboard statistics';
                console.error('Dashboard stats error:', err);
            } finally {
                this.loading = false;
            }
        },
    },
});
