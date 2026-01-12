import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useProductsStore } from './products';
import { useUsersStore } from './users';

export interface SearchResult {
    id: string | number;
    title: string;
    description: string;
    type: 'product' | 'user' | 'page' | 'action';
    path: string;
    icon?: string;
    image?: string;
}

export const useSearchStore = defineStore('search', () => {
    const recentSearches = ref<string[]>([]);
    const searchResults = ref<SearchResult[]>([]);
    const isSearching = ref(false);

    const getRecentSearches = computed(() => recentSearches.value);
    const getSearchResults = computed(() => searchResults.value);
    const isLoading = computed(() => isSearching.value);

    function loadRecentSearches() {
        if (process.client) {
            const stored = localStorage.getItem('recentSearches');
            if (stored) {
                recentSearches.value = JSON.parse(stored);
            }
        }
    }

    function saveRecentSearches() {
        if (process.client) {
            localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value));
        }
    }

    function addToRecentSearches(query: string) {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        recentSearches.value = recentSearches.value.filter(q => q !== trimmedQuery);
        recentSearches.value.unshift(trimmedQuery);

        if (recentSearches.value.length > 10) {
            recentSearches.value = recentSearches.value.slice(0, 10);
        }

        saveRecentSearches();
    }

    function removeRecentSearch(index: number) {
        recentSearches.value.splice(index, 1);
        saveRecentSearches();
    }

    function clearRecentSearches() {
        recentSearches.value = [];
        saveRecentSearches();
    }

    async function performSearch(query: string): Promise<SearchResult[]> {
        const trimmedQuery = query.trim().toLowerCase();
        if (!trimmedQuery) {
            searchResults.value = [];
            return [];
        }

        isSearching.value = true;
        const results: SearchResult[] = [];

        try {
            const productsStore = useProductsStore();
            const products = productsStore.getAllProducts;

            const matchingProducts = products
                .filter(product =>
                    product.title.toLowerCase().includes(trimmedQuery) ||
                    product.description.toLowerCase().includes(trimmedQuery) ||
                    product.category.toLowerCase().includes(trimmedQuery) ||
                    product.brand.toLowerCase().includes(trimmedQuery)
                )
                .slice(0, 5)
                .map(product => ({
                    id: product.id,
                    title: product.title,
                    description: `${product.category} - ${product.brand} - $${product.price}`,
                    type: 'product' as const,
                    path: `/products/${product.id}`,
                    icon: 'products',
                    image: product.thumbnail,
                }));

            results.push(...matchingProducts);

            const usersStore = useUsersStore();
            const users = usersStore.getAllUsers;

            const matchingUsers = users
                .filter(user =>
                    user.firstName.toLowerCase().includes(trimmedQuery) ||
                    user.lastName.toLowerCase().includes(trimmedQuery) ||
                    user.username.toLowerCase().includes(trimmedQuery) ||
                    user.email.toLowerCase().includes(trimmedQuery)
                )
                .slice(0, 5)
                .map(user => ({
                    id: user.id,
                    title: `${user.firstName} ${user.lastName}`,
                    description: `@${user.username} - ${user.email}`,
                    type: 'user' as const,
                    path: `/users`,
                    icon: 'user',
                    image: user.image,
                }));

            results.push(...matchingUsers);

            const pages = [
                { title: 'Dashboard', path: '/', icon: 'dashboard', keywords: ['home', 'overview', 'statistics'] },
                { title: 'Products', path: '/products', icon: 'products', keywords: ['inventory', 'items', 'catalog'] },
                { title: 'Users', path: '/users', icon: 'team', keywords: ['people', 'customers', 'accounts'] },
                { title: 'Favourites', path: '/favourites', icon: 'favourites', keywords: ['favorites', 'wishlist', 'saved'] },
                { title: 'Orders', path: '/orders', icon: 'orderLists', keywords: ['purchases', 'transactions'] },
                { title: 'Stock', path: '/stock', icon: 'productStock', keywords: ['inventory', 'warehouse'] },
                { title: 'Pricing', path: '/pricing', icon: 'pricing', keywords: ['plans', 'subscription'] },
                { title: 'Calendar', path: '/calendar', icon: 'calendar', keywords: ['schedule', 'events'] },
                { title: 'To-Do', path: '/todo', icon: 'todo', keywords: ['tasks', 'checklist'] },
                { title: 'Team', path: '/team', icon: 'team', keywords: ['members', 'staff'] },
                { title: 'Settings', path: '/settings', icon: 'settings', keywords: ['preferences', 'configuration'] },
            ];

            const matchingPages = pages
                .filter(page =>
                    page.title.toLowerCase().includes(trimmedQuery) ||
                    page.keywords.some(keyword => keyword.includes(trimmedQuery))
                )
                .map(page => ({
                    id: page.path,
                    title: page.title,
                    description: `Navigate to ${page.title}`,
                    type: 'page' as const,
                    path: page.path,
                    icon: page.icon,
                }));

            results.push(...matchingPages);

            if (results.length > 0) {
                addToRecentSearches(query);
            }

            searchResults.value = results;
            return results;
        } catch (error) {
            console.error('Search error:', error);
            searchResults.value = [];
            return [];
        } finally {
            isSearching.value = false;
        }
    }

    function getPopularSearches(): string[] {
        return [
            'Dashboard',
            'Products',
            'Users',
            'Orders',
            'Settings',
        ];
    }

    function getQuickLinks() {
        return [
            { title: 'Add Product', icon: 'products', path: '/products', action: 'add' },
            { title: 'Add User', icon: 'team', path: '/users', action: 'add' },
            { title: 'View Analytics', icon: 'line-chart', path: '/' },
            { title: 'Settings', icon: 'settings', path: '/settings' },
        ];
    }

    return {
        recentSearches,
        searchResults,
        isSearching,
        getRecentSearches,
        getSearchResults,
        isLoading,
        loadRecentSearches,
        saveRecentSearches,
        addToRecentSearches,
        removeRecentSearch,
        clearRecentSearches,
        performSearch,
        getPopularSearches,
        getQuickLinks,
    };
});
