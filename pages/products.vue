<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { message, Modal } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useProductsStore, type Product } from '~/stores/products';
import { useFavoritesStore } from '~/stores/favorites';
import ProductsTable from '~/widgets/ProductsTable/ProductsTable.vue';
import ProductModal from '~/widgets/ProductModal/ProductModal.vue';
import { TableSkeleton } from '~/shared/ui';

definePageMeta({
    layout: 'default',
    middleware: ['auth'],
});

const { t } = useI18n();
const productsStore = useProductsStore();
const favoritesStore = useFavoritesStore();

// State
const searchQuery = ref('');
const selectedCategory = ref<string | undefined>(undefined);
const priceRange = ref<[number, number]>([0, 10000]);
const stockStatusFilter = ref<string | undefined>(undefined);
const sortBy = ref<string>('default');
const currentPage = ref(1);
const pageSize = ref(10);
const selectedRowKeys = ref<number[]>([]);
const modalVisible = ref(false);
const currentProduct = ref<Product | null>(null);
const modalLoading = ref(false);
const searchDebounceTimer = ref<NodeJS.Timeout | null>(null);

// Computed
const loading = computed(() => productsStore.loading);
const categories = computed(() => productsStore.categories);

const allProducts = computed(() => productsStore.getAllProducts);

// Apply filters and sorting
const filteredAndSortedProducts = computed(() => {
    let result = [...allProducts.value];

    // Apply category filter
    if (selectedCategory.value) {
        result = result.filter(p => p.category === selectedCategory.value);
    }

    // Apply price range filter
    result = result.filter(p => p.price >= priceRange.value[0] && p.price <= priceRange.value[1]);

    // Apply stock status filter
    if (stockStatusFilter.value) {
        if (stockStatusFilter.value === 'In Stock') {
            result = result.filter(p => p.stock > 20);
        } else if (stockStatusFilter.value === 'Low Stock') {
            result = result.filter(p => p.stock > 0 && p.stock <= 20);
        } else if (stockStatusFilter.value === 'Out of Stock') {
            result = result.filter(p => p.stock === 0);
        }
    }

    // Apply sorting
    if (sortBy.value === 'price-asc') {
        result.sort((a, b) => a.price - b.price);
    } else if (sortBy.value === 'price-desc') {
        result.sort((a, b) => b.price - a.price);
    } else if (sortBy.value === 'rating-asc') {
        result.sort((a, b) => a.rating - b.rating);
    } else if (sortBy.value === 'rating-desc') {
        result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy.value === 'stock-asc') {
        result.sort((a, b) => a.stock - b.stock);
    } else if (sortBy.value === 'stock-desc') {
        result.sort((a, b) => b.stock - a.stock);
    }

    return result;
});

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredAndSortedProducts.value.slice(start, end);
});

const totalProducts = computed(() => filteredAndSortedProducts.value.length);

const pagination = computed(() => ({
    current: currentPage.value,
    pageSize: pageSize.value,
    total: totalProducts.value,
}));

const hasActiveFilters = computed(() => {
    return selectedCategory.value ||
        stockStatusFilter.value ||
        priceRange.value[0] !== 0 ||
        priceRange.value[1] !== 10000 ||
        searchQuery.value;
});

// Stock status options
const stockStatusOptions = [
    { label: t('products.filters.allStock'), value: undefined },
    { label: t('products.filters.inStock'), value: 'In Stock' },
    { label: t('products.filters.lowStock'), value: 'Low Stock' },
    { label: t('products.filters.outOfStock'), value: 'Out of Stock' },
];

// Sort options
const sortOptions = [
    { label: t('products.sort.default'), value: 'default' },
    { label: t('products.sort.priceLowToHigh'), value: 'price-asc' },
    { label: t('products.sort.priceHighToLow'), value: 'price-desc' },
    { label: t('products.sort.ratingLowToHigh'), value: 'rating-asc' },
    { label: t('products.sort.ratingHighToLow'), value: 'rating-desc' },
    { label: t('products.sort.stockLowToHigh'), value: 'stock-asc' },
    { label: t('products.sort.stockHighToLow'), value: 'stock-desc' },
];

onMounted(async () => {
    favoritesStore.loadFavorites();
    await Promise.all([
        productsStore.fetchProducts(100, 0),
        productsStore.fetchCategories(),
    ]);
});

watch(searchQuery, (newValue) => {
    if (searchDebounceTimer.value) {
        clearTimeout(searchDebounceTimer.value);
    }

    searchDebounceTimer.value = setTimeout(async () => {
        if (newValue.trim()) {
            await productsStore.searchProducts(newValue);
        } else {
            await productsStore.fetchProducts(100, 0);
        }
        currentPage.value = 1;
    }, 500);
});

const resetFilters = async () => {
    searchQuery.value = '';
    selectedCategory.value = undefined;
    priceRange.value = [0, 10000];
    stockStatusFilter.value = undefined;
    sortBy.value = 'default';
    currentPage.value = 1;
    await productsStore.fetchProducts(100, 0);
};

const handleEdit = (product: Product) => {
    currentProduct.value = product;
    modalVisible.value = true;
};

const handleDelete = (id: number) => {
    Modal.confirm({
        title: t('products.delete.confirmTitle'),
        content: t('products.delete.confirmMessage'),
        okText: t('common.yes'),
        okType: 'danger',
        cancelText: t('common.no'),
        onOk: async () => {
            try {
                await productsStore.deleteProduct(id);
                message.success(t('products.delete.success'));
                selectedRowKeys.value = selectedRowKeys.value.filter(k => k !== id);
            } catch (error) {
                message.error(t('products.delete.error'));
            }
        },
    });
};

const handleToggleFavorite = (product: Product) => {
    favoritesStore.toggleFavorite(product);
    if (favoritesStore.isFavorite(product.id)) {
        message.success(t('favorites.addedToFavorites'));
    } else {
        message.success(t('favorites.removedFromFavorites'));
    }
};

const handleSelectionChange = (keys: number[]) => {
    selectedRowKeys.value = keys;
};

const handlePageChange = (page: number, newPageSize: number) => {
    currentPage.value = page;
    pageSize.value = newPageSize;
};

// Bulk delete
const handleBulkDelete = () => {
    if (selectedRowKeys.value.length === 0) {
        message.warning(t('products.bulkDelete.noSelection'));
        return;
    }

    Modal.confirm({
        title: t('products.bulkDelete.confirmTitle'),
        content: t('products.bulkDelete.confirmMessage', { count: selectedRowKeys.value.length }),
        okText: t('common.yes'),
        okType: 'danger',
        cancelText: t('common.no'),
        onOk: async () => {
            try {
                await productsStore.deleteMultipleProducts(selectedRowKeys.value);
                message.success(t('products.bulkDelete.success', { count: selectedRowKeys.value.length }));
                selectedRowKeys.value = [];
            } catch (error) {
                message.error(t('products.bulkDelete.error'));
            }
        },
    });
};

// Add product
const handleAddProduct = () => {
    currentProduct.value = null;
    modalVisible.value = true;
};

// Modal save handler
const getChangedFields = (original: Product, updated: Partial<Product>): Partial<Product> => {
    const changes: Partial<Product> = {};

    Object.keys(updated).forEach((key) => {
        const k = key as keyof Product;
        const originalValue = original[k];
        const updatedValue = updated[k];

        if (typeof updatedValue === 'object' && updatedValue !== null && !Array.isArray(updatedValue)) {
            if (JSON.stringify(originalValue) !== JSON.stringify(updatedValue)) {
                changes[k] = updatedValue as any;
            }
        } else if (Array.isArray(updatedValue)) {
            if (JSON.stringify(originalValue) !== JSON.stringify(updatedValue)) {
                changes[k] = updatedValue as any;
            }
        } else if (originalValue !== updatedValue) {
            changes[k] = updatedValue as any;
        }
    });

    return changes;
};

const handleModalSave = async (formData: Partial<Product>) => {
    modalLoading.value = true;

    try {
        if (currentProduct.value) {
            const changedFields = getChangedFields(currentProduct.value, formData);

            if (Object.keys(changedFields).length > 0) {
                await productsStore.updateProduct(currentProduct.value.id, changedFields);
                message.success(t('products.update.success'));
            } else {
                message.info('No changes detected');
            }
        } else {
            await productsStore.addProduct(formData as Omit<Product, 'id'>);
            message.success(t('products.create.success'));
        }

        modalVisible.value = false;
        currentProduct.value = null;
    } catch (error) {
        message.error(
            currentProduct.value
                ? t('products.update.error')
                : t('products.create.error')
        );
    } finally {
        modalLoading.value = false;
    }
};

watch(modalVisible, (newValue) => {
    if (!newValue) {
        currentProduct.value = null;
    }
});

// Export to CSV
const exportToCSV = () => {
    // Export selected products if any are selected, otherwise export all filtered products
    let data = filteredAndSortedProducts.value;

    if (selectedRowKeys.value.length > 0) {
        data = filteredAndSortedProducts.value.filter(p => selectedRowKeys.value.includes(p.id));
    }

    if (data.length === 0) {
        message.warning(t('products.export.noData'));
        return;
    }

    // CSV headers
    const headers = [
        'ID', 'Title', 'Description', 'Category', 'Brand', 'Price',
        'Discount %', 'Rating', 'Stock', 'Availability', 'SKU',
        'Weight', 'Dimensions', 'Tags', 'Thumbnail'
    ];

    // CSV rows
    const rows = data.map(p => [
        p.id,
        `"${p.title}"`,
        `"${p.description}"`,
        p.category,
        p.brand,
        p.price,
        p.discountPercentage,
        p.rating,
        p.stock,
        p.availabilityStatus || '',
        p.sku || '',
        p.weight || '',
        p.dimensions ? `"${p.dimensions.width}x${p.dimensions.height}x${p.dimensions.depth}"` : '',
        p.tags ? `"${p.tags.join(', ')}"` : '',
        p.thumbnail
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().split('T')[0];

    link.setAttribute('href', url);
    link.setAttribute('download', `products_export_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const successMessage = selectedRowKeys.value.length > 0
        ? `${selectedRowKeys.value.length} selected products exported successfully`
        : t('products.export.success');
    message.success(successMessage);
};
</script>

<template>
    <div class="products-page space-y-4 md:space-y-6">
        <!-- Page Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-light-text-primary dark:text-dark-text-primary">
                {{ t('products.title') }}
            </h1>
            <a-button type="primary" size="large" @click="handleAddProduct"
                class="w-full sm:w-auto d-flex items-center justify-center">
                <div class="d-flex items-center">
                    <PlusOutlined class="mr-1" />
                    {{ t('products.addProduct') }}
                </div>
            </a-button>
        </div>

        <a-card class="bg-light-background dark:bg-dark-background">
            <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a-input-search v-model:value="searchQuery" :placeholder="t('products.search.placeholder')"
                        size="large" allow-clear />

                    <a-select v-model:value="selectedCategory" :placeholder="t('products.filters.selectCategory')"
                        size="large" allow-clear show-search>
                        <a-select-option :value="undefined">
                            {{ t('products.filters.allCategories') }}
                        </a-select-option>
                        <a-select-option v-for="cat in categories" :key="cat" :value="cat.slug">
                            {{ cat.name }}
                        </a-select-option>
                    </a-select>
                </div>

                <!-- Price Range and Stock Status -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            class="block text-sm font-medium mb-2 text-light-text-primary dark:text-dark-text-primary">
                            {{ t('products.filters.priceRange') }}: ${{ priceRange[0] }} - ${{ priceRange[1] }}
                        </label>
                        <a-slider v-model:value="priceRange" range :min="0" :max="10000" :step="100" />
                    </div>

                    <a-select v-model:value="stockStatusFilter" :placeholder="t('products.filters.stockStatus')"
                        size="large" allow-clear>
                        <a-select-option v-for="option in stockStatusOptions" :key="option.value || 'all'"
                            :value="option.value">
                            {{ option.label }}
                        </a-select-option>
                    </a-select>
                </div>

                <!-- Sort and Actions -->
                <div class="flex flex-col lg:flex-row gap-3 lg:gap-4 items-stretch lg:items-center justify-between">
                    <div class="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                        <span class="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                            {{ t('products.sort.label') }}:
                        </span>
                        <a-select v-model:value="sortBy" :placeholder="t('products.sort.placeholder')"
                            class="w-full sm:w-48">
                            <a-select-option v-for="option in sortOptions" :key="option.value" :value="option.value">
                                {{ option.label }}
                            </a-select-option>
                        </a-select>
                    </div>

                    <div class="flex flex-wrap gap-2">
                        <a-button v-if="hasActiveFilters" @click="resetFilters" class="flex-1 sm:flex-none">
                            {{ t('products.filters.reset') }}
                        </a-button>
                        <a-button type="primary" @click="exportToCSV" class="flex-1 sm:flex-none">
                            {{ selectedRowKeys.length > 0 ? `Export ${selectedRowKeys.length} Selected` : t('products.export.button') }}
                        </a-button>
                        <a-button v-if="selectedRowKeys.length > 0" danger @click="handleBulkDelete"
                            class="flex-1 sm:flex-none">
                            {{ t('products.bulkDelete.button', { count: selectedRowKeys.length }) }}
                        </a-button>
                    </div>
                </div>
            </div>
        </a-card>

        <!-- Results Summary -->
        <div class="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            {{ t('products.resultsCount', { count: totalProducts }) }}
        </div>

        <!-- Products Table -->
        <TableSkeleton v-if="loading && paginatedProducts.length === 0" :rows="10" :columns="11" />
        <ProductsTable
            v-else
            :products="paginatedProducts"
            :loading="loading"
            :selected-row-keys="selectedRowKeys"
            :pagination="pagination"
            :is-favorite="favoritesStore.isFavorite"
            @edit="handleEdit"
            @delete="handleDelete"
            @toggle-favorite="handleToggleFavorite"
            @selection-change="handleSelectionChange"
            @page-change="handlePageChange"
        />

        <!-- Product Modal -->
        <ProductModal v-model:open="modalVisible" :product="currentProduct" :categories="categories"
            :loading="modalLoading" @save="handleModalSave" />
    </div>
</template>

<style scoped>
.products-page :deep(.ant-card) {
    border-color: rgba(0, 0, 0, 0.06);
}

.dark .products-page :deep(.ant-card) {
    border-color: rgba(255, 255, 255, 0.06);
}
</style>
