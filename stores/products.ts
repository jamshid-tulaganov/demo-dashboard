import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useApiClient } from '~/composables/useApiClient';

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
    tags?: string[];
    sku?: string;
    weight?: number;
    dimensions?: {
        width: number;
        height: number;
        depth: number;
    };
    warrantyInformation?: string;
    shippingInformation?: string;
    availabilityStatus?: string;
    returnPolicy?: string;
    minimumOrderQuantity?: number;
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export interface Category {
    slug: string;
    name: string;
}

export const useProductsStore = defineStore('products', () => {
    const products = ref<Product[]>([]);
    const currentProduct = ref<Product | null>(null);
    const categories = ref<Category[]>([]);
    const total = ref(0);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const newlyCreatedIds = ref<Set<number>>(new Set());

    const getAllProducts = computed(() => products.value);
    const getProductById = computed(() => (id: number) =>
        products.value.find((p) => p.id === id)
    );
    const isLoading = computed(() => loading.value);
    const hasMore = computed(() => products.value.length < total.value);

    async function fetchProducts(limit = 20, skip = 0) {
        loading.value = true;
        error.value = null;

        try {
            const { client } = useApiClient();
            const response = await client.get<ProductsResponse>(
                `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
            );

            if (skip === 0) {
                products.value = response.products;
            } else {
                products.value = [...products.value, ...response.products];
            }

            total.value = response.total;
        } catch (err: any) {
            error.value = 'Failed to fetch products';
            console.error('Products fetch error:', err);
        } finally {
            loading.value = false;
        }
    }

    async function fetchProductById(id: number) {
        loading.value = true;
        error.value = null;

        try {
            const { client } = useApiClient();
            const product = await client.get<Product>(
                `https://dummyjson.com/products/${id}`
            );

            currentProduct.value = product;
            return product;
        } catch (err: any) {
            error.value = 'Failed to fetch product details';
            console.error('Product fetch error:', err);
            return null;
        } finally {
            loading.value = false;
        }
    }

    async function searchProducts(query: string) {
        loading.value = true;
        error.value = null;

        try {
            const { client } = useApiClient();
            const response = await client.get<ProductsResponse>(
                `https://dummyjson.com/products/search?q=${query}`
            );

            products.value = response.products;
            total.value = response.total;
        } catch (err: any) {
            error.value = 'Failed to search products';
            console.error('Products search error:', err);
        } finally {
            loading.value = false;
        }
    }

    async function updateProduct(id: number, productData: Partial<Product>) {
        loading.value = true;
        error.value = null;

        try {
            const index = products.value.findIndex((p) => p.id === id);

            if (newlyCreatedIds.value.has(id)) {
                const currentProductData = products.value[index];
                const updatedProduct = { ...currentProductData, ...productData };

                if (index > -1) {
                    products.value[index] = updatedProduct;
                }
                currentProduct.value = updatedProduct;

                return updatedProduct;
            }

            const { client } = useApiClient();
            const updatedProduct = await client.patch<Product>(
                `https://dummyjson.com/products/${id}`,
                { body: productData }
            );

            const mergedProduct = index > -1
                ? { ...products.value[index], ...updatedProduct }
                : updatedProduct;

            currentProduct.value = mergedProduct;

            if (index > -1) {
                products.value[index] = mergedProduct;
            }

            return mergedProduct;
        } catch (err: any) {
            error.value = 'Failed to update product';
            console.error('Product update error:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function addProduct(productData: Omit<Product, 'id'>) {
        loading.value = true;
        error.value = null;

        try {
            const { client } = useApiClient();
            const newProduct = await client.post<Product>(
                'https://dummyjson.com/products/add',
                { body: productData }
            );

            newlyCreatedIds.value.add(newProduct.id);

            products.value = [newProduct, ...products.value];
            total.value += 1;

            return newProduct;
        } catch (err: any) {
            error.value = 'Failed to add product';
            console.error('Product add error:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteProduct(id: number) {
        loading.value = true;
        error.value = null;

        try {
            if (newlyCreatedIds.value.has(id)) {
                products.value = products.value.filter((p) => p.id !== id);
                total.value -= 1;
                newlyCreatedIds.value.delete(id);

                return true;
            }

            const { client } = useApiClient();
            await client.delete(`https://dummyjson.com/products/${id}`);

            products.value = products.value.filter((p) => p.id !== id);
            total.value -= 1;

            return true;
        } catch (err: any) {
            error.value = 'Failed to delete product';
            console.error('Product delete error:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteMultipleProducts(ids: number[]) {
        loading.value = true;
        error.value = null;

        try {
            const { client } = useApiClient();

            const realProductIds = ids.filter(id => !newlyCreatedIds.value.has(id));
            const newProductIds = ids.filter(id => newlyCreatedIds.value.has(id));

            if (realProductIds.length > 0) {
                await Promise.all(
                    realProductIds.map(id => client.delete(`https://dummyjson.com/products/${id}`))
                );
            }

            newProductIds.forEach(id => newlyCreatedIds.value.delete(id));

            products.value = products.value.filter((p) => !ids.includes(p.id));
            total.value -= ids.length;

            return true;
        } catch (err: any) {
            error.value = 'Failed to delete products';
            console.error('Products bulk delete error:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function fetchCategories() {
        loading.value = true;
        error.value = null;

        try {
            const { client } = useApiClient();
            const categoriesData = await client.get<Array<string | Category>>(
                'https://dummyjson.com/products/categories'
            );

            // Transform to Category objects if they're strings
            categories.value = categoriesData.map(cat => {
                if (typeof cat === 'string') {
                    return {
                        slug: cat,
                        name: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')
                    };
                }
                return cat;
            });

            return categories.value;
        } catch (err: any) {
            error.value = 'Failed to fetch categories';
            console.error('Categories fetch error:', err);
            return [];
        } finally {
            loading.value = false;
        }
    }

    function clearProducts() {
        products.value = [];
        total.value = 0;
    }

    return {
        products,
        currentProduct,
        categories,
        total,
        loading,
        error,
        getAllProducts,
        getProductById,
        isLoading,
        hasMore,
        fetchProducts,
        fetchProductById,
        searchProducts,
        updateProduct,
        addProduct,
        deleteProduct,
        deleteMultipleProducts,
        fetchCategories,
        clearProducts,
    };
});
