import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Product } from '~/composables/useProducts';

export const useFavoritesStore = defineStore('favorites', () => {
    const favorites = ref<Product[]>([]);

    const isFavorite = computed(() => (productId: number) => {
        return favorites.value.some((p) => p.id === productId);
    });

    const favoritesCount = computed(() => favorites.value.length);

    const getFavorites = computed(() => favorites.value);

    function toggleFavorite(product: Product) {
        const index = favorites.value.findIndex((p) => p.id === product.id);

        if (index > -1) {
            favorites.value.splice(index, 1);
        } else {
            favorites.value.push(product);
        }

        if (process.client) {
            localStorage.setItem('favorites', JSON.stringify(favorites.value));
        }
    }

    function addToFavorites(product: Product) {
        if (!isFavorite.value(product.id)) {
            favorites.value.push(product);

            if (process.client) {
                localStorage.setItem('favorites', JSON.stringify(favorites.value));
            }
        }
    }

    function removeFromFavorites(productId: number) {
        const index = favorites.value.findIndex((p) => p.id === productId);

        if (index > -1) {
            favorites.value.splice(index, 1);

            if (process.client) {
                localStorage.setItem('favorites', JSON.stringify(favorites.value));
            }
        }
    }

    function loadFavorites() {
        if (process.client) {
            const stored = localStorage.getItem('favorites');
            if (stored) {
                try {
                    favorites.value = JSON.parse(stored);
                } catch (error) {
                    console.error('Failed to parse favorites:', error);
                    favorites.value = [];
                }
            }
        }
    }

    function clearFavorites() {
        favorites.value = [];
        if (process.client) {
            localStorage.removeItem('favorites');
        }
    }

    return {
        favorites,
        isFavorite,
        favoritesCount,
        getFavorites,
        toggleFavorite,
        addToFavorites,
        removeFromFavorites,
        loadFavorites,
        clearFavorites,
    };
});
