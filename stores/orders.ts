import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import { useApiClient } from '~/shared/lib/api/useApiClient';

export interface Order {
    id: number;
    productName: string;
    productImage: string;
    location: string;
    dateTime: string;
    quantity: number;
    price: number;
    status: 'pending' | 'delivered' | 'shipped' | 'cancelled' | 'processing';
    userId: number;
}

export const useOrdersStore = defineStore('orders', {
    state: () => ({
        orders: [] as Order[],
        loading: false,
        error: null as string | null,
        selectedMonth: dayjs().format('YYYY-MM'),
    }),

    getters: {
        getAllOrders: (state) => state.orders,
        isLoading: (state) => state.loading,
        hasError: (state) => state.error !== null,
    },

    actions: {
        setSelectedMonth(month: string) {
            this.selectedMonth = month;
            this.fetchOrders();
        },

        async fetchOrders() {
            this.loading = true;
            this.error = null;

            try {
                const { client } = useApiClient();

                // Fetch products and users data
                const [productsRes, usersRes] = await Promise.all([
                    client.get<{ products: any[] }>('https://dummyjson.com/products?limit=30'),
                    client.get<{ users: any[] }>('https://dummyjson.com/users?limit=10'),
                ]);

                const products = productsRes.products || [];
                const users = usersRes.users || [];

                // Generate orders from products data
                this.orders = products.map((product: any, index: number) => {
                    const user = users[index % users.length];
                    const statuses: Array<'pending' | 'delivered' | 'shipped' | 'cancelled' | 'processing'> = [
                        'pending',
                        'delivered',
                        'shipped',
                        'cancelled',
                        'processing',
                    ];

                    // Generate random date within selected month
                    const monthStart = dayjs(this.selectedMonth).startOf('month');
                    const monthEnd = dayjs(this.selectedMonth).endOf('month');
                    const randomDay = Math.floor(
                        Math.random() * (monthEnd.date() - monthStart.date() + 1)
                    );
                    const orderDate = monthStart.add(randomDay, 'day');

                    return {
                        id: product.id,
                        productName: product.title,
                        productImage: product.thumbnail,
                        location: user?.address?.city
                            ? `${user.address.city}, ${user.address.state}`
                            : 'Unknown Location',
                        dateTime: orderDate.format('YYYY-MM-DD HH:mm:ss'),
                        quantity: Math.floor(Math.random() * 10) + 1,
                        price: product.price,
                        status: statuses[Math.floor(Math.random() * statuses.length)],
                        userId: user?.id || 0,
                    };
                });

                // Sort by date (newest first)
                this.orders.sort(
                    (a, b) =>
                        new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
                );
            } catch (err) {
                this.error = 'Failed to fetch orders';
                console.error('Orders fetch error:', err);
            } finally {
                this.loading = false;
            }
        },
    },
});
