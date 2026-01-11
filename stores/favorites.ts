import { defineStore } from 'pinia';
import type { Product } from '~/composables/useProducts';

export const useFavoritesStore = defineStore('favorites', {
    state: () => ({
        favorites: [] as Product[],
    }),

    getters: {
        isFavorite: (state) => (productId: number) => {
            return state.favorites.some((p) => p.id === productId);
        },

        favoritesCount: (state) => state.favorites.length,

        getFavorites: (state) => state.favorites,
    },

    actions: {
        toggleFavorite(product: Product) {
            const index = this.favorites.findIndex((p) => p.id === product.id);

            if (index > -1) {
                this.favorites.splice(index, 1);
            } else {
                this.favorites.push(product);
            }

            // Save to localStorage
            if (process.client) {
                localStorage.setItem('favorites', JSON.stringify(this.favorites));
            }
        },

        addToFavorites(product: Product) {
            if (!this.isFavorite(product.id)) {
                this.favorites.push(product);

                if (process.client) {
                    localStorage.setItem(
                        'favorites',
                        JSON.stringify(this.favorites)
                    );
                }
            }
        },

        removeFromFavorites(productId: number) {
            const index = this.favorites.findIndex((p) => p.id === productId);

            if (index > -1) {
                this.favorites.splice(index, 1);

                if (process.client) {
                    localStorage.setItem(
                        'favorites',
                        JSON.stringify(this.favorites)
                    );
                }
            }
        },

        loadFavorites() {
            if (process.client) {
                const stored = localStorage.getItem('favorites');
                if (stored) {
                    try {
                        this.favorites = JSON.parse(stored);
                    } catch (error) {
                        console.error('Failed to parse favorites:', error);
                        this.favorites = [];
                    }
                }
            }
        },

        clearFavorites() {
            this.favorites = [];
            if (process.client) {
                localStorage.removeItem('favorites');
            }
        },
    },
});
