import { defineStore } from 'pinia';
import { useApiClient } from '~/shared/lib/api/useApiClient';

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export const useProductsStore = defineStore('products', {
    state: () => ({
        products: [] as Product[],
        currentProduct: null as Product | null,
        total: 0,
        loading: false,
        error: null as string | null,
    }),

    getters: {
        getAllProducts: (state) => state.products,
        getProductById: (state) => (id: number) =>
            state.products.find((p) => p.id === id),
        isLoading: (state) => state.loading,
        hasMore: (state) => state.products.length < state.total,
    },

    actions: {
        async fetchProducts(limit = 20, skip = 0) {
            this.loading = true;
            this.error = null;

            try {
                const { client } = useApiClient();
                const response = await client.get<ProductsResponse>(
                    `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
                );

                if (skip === 0) {
                    this.products = response.products;
                } else {
                    this.products = [...this.products, ...response.products];
                }

                this.total = response.total;
            } catch (err: any) {
                this.error = 'Failed to fetch products';
                console.error('Products fetch error:', err);
            } finally {
                this.loading = false;
            }
        },

        async fetchProductById(id: number) {
            this.loading = true;
            this.error = null;

            try {
                const { client } = useApiClient();
                const product = await client.get<Product>(
                    `https://dummyjson.com/products/${id}`
                );

                this.currentProduct = product;
                return product;
            } catch (err: any) {
                this.error = 'Failed to fetch product details';
                console.error('Product fetch error:', err);
                return null;
            } finally {
                this.loading = false;
            }
        },

        async searchProducts(query: string) {
            this.loading = true;
            this.error = null;

            try {
                const { client } = useApiClient();
                const response = await client.get<ProductsResponse>(
                    `https://dummyjson.com/products/search?q=${query}`
                );

                this.products = response.products;
                this.total = response.total;
            } catch (err: any) {
                this.error = 'Failed to search products';
                console.error('Products search error:', err);
            } finally {
                this.loading = false;
            }
        },

        updateProduct(product: Product) {
            this.currentProduct = product;

            // Update in products list if exists
            const index = this.products.findIndex((p) => p.id === product.id);
            if (index > -1) {
                this.products[index] = product;
            }
        },

        clearProducts() {
            this.products = [];
            this.total = 0;
        },
    },
});
