import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
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

export const useOrdersStore = defineStore('orders', () => {
    const orders = ref<Order[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const selectedMonth = ref(dayjs().format('YYYY-MM'));

    const getAllOrders = computed(() => orders.value);
    const isLoading = computed(() => loading.value);
    const hasError = computed(() => error.value !== null);

    function setSelectedMonth(month: string) {
        selectedMonth.value = month;
        fetchOrders();
    }

    async function fetchOrders() {
        loading.value = true;
        error.value = null;

        try {
            const { client } = useApiClient();

            const [productsRes, usersRes] = await Promise.all([
                client.get<{ products: any[] }>('https://dummyjson.com/products?limit=30'),
                client.get<{ users: any[] }>('https://dummyjson.com/users?limit=10'),
            ]);

            const products = productsRes.products || [];
            const users = usersRes.users || [];

            orders.value = products.map((product: any, index: number) => {
                const user = users[index % users.length];
                const statuses: Array<'pending' | 'delivered' | 'shipped' | 'cancelled' | 'processing'> = [
                    'pending',
                    'delivered',
                    'shipped',
                    'cancelled',
                    'processing',
                ];

                const monthStart = dayjs(selectedMonth.value).startOf('month');
                const monthEnd = dayjs(selectedMonth.value).endOf('month');
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

            orders.value.sort(
                (a, b) =>
                    new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
            );
        } catch (err) {
            error.value = 'Failed to fetch orders';
            console.error('Orders fetch error:', err);
        } finally {
            loading.value = false;
        }
    }

    return {
        orders,
        loading,
        error,
        selectedMonth,
        getAllOrders,
        isLoading,
        hasError,
        setSelectedMonth,
        fetchOrders,
    };
});
