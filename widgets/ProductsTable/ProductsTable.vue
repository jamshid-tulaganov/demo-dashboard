<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { EditOutlined, DeleteOutlined, MoreOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons-vue';
import type { Product } from '~/stores/products';
import { LazyImage } from '~/shared/ui';

interface Props {
    products: Product[];
    loading?: boolean;
    selectedRowKeys?: number[];
    pagination?: {
        current: number;
        pageSize: number;
        total: number;
    };
    isFavorite?: (productId: number) => boolean;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    selectedRowKeys: () => [],
    isFavorite: () => () => false,
});

const emit = defineEmits<{
    edit: [product: Product];
    delete: [id: number];
    toggleFavorite: [product: Product];
    selectionChange: [selectedKeys: number[]];
    pageChange: [page: number, pageSize: number];
}>();

const { t } = useI18n();

const columns = computed(() => [
    {
        title: t('products.table.id'),
        dataIndex: 'id',
        key: 'id',
        width: 80,
        fixed: 'left',
    },
    {
        title: t('products.table.thumbnail'),
        dataIndex: 'thumbnail',
        key: 'thumbnail',
        width: 100,
    },
    {
        title: t('products.table.title'),
        dataIndex: 'title',
        key: 'title',
        width: 200,
        ellipsis: true,
    },
    {
        title: t('products.table.category'),
        dataIndex: 'category',
        key: 'category',
        width: 150,
    },
    {
        title: t('products.table.brand'),
        dataIndex: 'brand',
        key: 'brand',
        width: 120,
    },
    {
        title: t('products.table.price'),
        dataIndex: 'price',
        key: 'price',
        width: 100,
        align: 'right',
    },
    {
        title: t('products.table.discount'),
        dataIndex: 'discountPercentage',
        key: 'discountPercentage',
        width: 100,
        align: 'right',
    },
    {
        title: t('products.table.rating'),
        dataIndex: 'rating',
        key: 'rating',
        width: 120,
    },
    {
        title: t('products.table.stock'),
        dataIndex: 'stock',
        key: 'stock',
        width: 100,
        align: 'right',
    },
    {
        title: t('products.table.availability'),
        dataIndex: 'availabilityStatus',
        key: 'availabilityStatus',
        width: 150,
    },
    {
        title: t('products.table.actions'),
        key: 'actions',
        width: 150,
        fixed: 'right',
        align: 'center',
    },
]);

const rowSelection = computed(() => ({
    selectedRowKeys: props.selectedRowKeys,
    onChange: (selectedKeys: number[]) => {
        emit('selectionChange', selectedKeys);
    },
}));

const handleEdit = (product: Product) => {
    emit('edit', product);
};

const handleDelete = (id: number) => {
    emit('delete', id);
};

const handleToggleFavorite = (product: Product) => {
    emit('toggleFavorite', product);
};

const handlePageChange = (page: number, pageSize: number) => {
    emit('pageChange', page, pageSize);
};

const getStockStatusColor = (stock: number): string => {
    if (stock === 0) return 'red';
    if (stock < 20) return 'orange';
    return 'green';
};

const getAvailabilityColor = (status?: string): string => {
    if (!status) return 'default';
    if (status === 'In Stock') return 'green';
    if (status === 'Low Stock') return 'orange';
    return 'red';
};
</script>

<template>
    <div class="products-table">
        <a-table
            :columns="columns"
            :data-source="products"
            :loading="loading"
            :row-key="(record) => record.id"
            :selected="rowSelection"
            :pagination="pagination ? {
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showTotal: (total: number, range: [number, number]) =>
                    t('products.table.pagination', { start: range[0], end: range[1], total }),
                onChange: handlePageChange,
                onShowSizeChange: handlePageChange,
            } : false"
            :scroll="{ x: 1400 }"
            class="custom-table"
        >
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'thumbnail'">
                    <LazyImage
                        :src="record.thumbnail"
                        :alt="record.title"
                        class="w-16 h-16 object-cover rounded"
                        width="64"
                        height="64"
                    />
                </template>

                <template v-else-if="column.key === 'price'">
                    <span class="font-semibold text-primary-600 dark:text-primary-400">
                        ${{ record.price.toFixed(2) }}
                    </span>
                </template>

                <template v-else-if="column.key === 'discountPercentage'">
                    <a-tag v-if="record.discountPercentage > 0" color="red">
                        -{{ record.discountPercentage.toFixed(1) }}%
                    </a-tag>
                    <span v-else class="text-gray-400 dark:text-gray-600">-</span>
                </template>

                <template v-else-if="column.key === 'rating'">
                    <div class="flex items-center gap-1">
                        <span
                            v-for="i in 5"
                            :key="i"
                            class="text-base"
                            :class="i <= Math.round(record.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'"
                        >
                            ★
                        </span>
                        <span class="ml-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                            {{ record.rating.toFixed(1) }}
                        </span>
                    </div>
                </template>

                <template v-else-if="column.key === 'stock'">
                    <a-tag :color="getStockStatusColor(record.stock)">
                        {{ record.stock }}
                    </a-tag>
                </template>

                <template v-else-if="column.key === 'availabilityStatus'">
                    <a-tag :color="getAvailabilityColor(record.availabilityStatus)">
                        {{ record.availabilityStatus || t('products.table.notSpecified') }}
                    </a-tag>
                </template>

                <template v-else-if="column.key === 'actions'">
                    <div class="flex justify-center gap-2">
                        <!-- Favorite Button -->
                        <a-button
                            type="text"
                            @click="handleToggleFavorite(record)"
                            class="favorite-btn"
                        >
                            <template #icon>
                                <HeartFilled v-if="isFavorite(record.id)" class="text-red-500" />
                                <HeartOutlined v-else />
                            </template>
                        </a-button>

                        <!-- Actions Dropdown -->
                        <a-dropdown placement="bottomRight" :trigger="['click']">
                            <a-button type="text">
                                <template #icon>
                                    <MoreOutlined />
                                </template>
                            </a-button>
                            <template #overlay>
                                <a-menu>
                                    <a-menu-item @click="handleEdit(record)">
                                        <div class="flex items-center gap-2">
                                            <EditOutlined />
                                            <span>{{ t('common.edit') }}</span>
                                        </div>
                                    </a-menu-item>
                                    <a-menu-item @click="handleDelete(record.id)" class="delete-menu-item">
                                        <div class="flex items-center gap-2">
                                            <DeleteOutlined />
                                            <span>{{ t('common.delete') }}</span>
                                        </div>
                                    </a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </div>
                </template>
            </template>
        </a-table>
    </div>
</template>

<style scoped>
/* Table styling */
.products-table :deep(.ant-table) {
    @apply bg-transparent;
}

.products-table :deep(.ant-table-thead > tr > th) {
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply text-light-text-primary dark:text-dark-text-primary;
    @apply font-semibold;
    @apply border-b border-light-text-tertiary/10 dark:border-dark-quaternary/30;
}

.products-table :deep(.ant-table-tbody > tr > td) {
    @apply border-b border-light-text-tertiary/10 dark:border-dark-quaternary/30;
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply text-light-text-primary dark:text-dark-text-primary;
}

.products-table :deep(.ant-table-tbody > tr:hover > td) {
    @apply bg-light-menu dark:bg-dark-secondary;
}

/* Pagination styling */
.products-table :deep(.ant-pagination) {
    @apply mt-4;
}

.products-table :deep(.ant-pagination-item) {
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply border-light-text-tertiary/20 dark:border-dark-quaternary/30;
}

.products-table :deep(.ant-pagination-item a) {
    @apply text-light-text-primary dark:text-dark-text-primary;
}

.products-table :deep(.ant-pagination-item-active) {
    @apply bg-primary border-primary;
}

.products-table :deep(.ant-pagination-item-active a) {
    @apply text-white;
}

.products-table :deep(.ant-pagination-prev .ant-pagination-item-link),
.products-table :deep(.ant-pagination-next .ant-pagination-item-link) {
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply border-light-text-tertiary/20 dark:border-dark-quaternary/30;
    @apply text-light-text-primary dark:text-dark-text-primary;
}

.products-table :deep(.ant-select-selector) {
    @apply bg-light-bg dark:bg-dark-tertiary !important;
    @apply border-light-text-tertiary/20 dark:border-dark-quaternary/30 !important;
    @apply text-light-text-primary dark:text-dark-text-primary !important;
}

.products-table :deep(.ant-select-arrow) {
    @apply text-light-text-primary dark:text-dark-text-primary;
}

.products-table :deep(.ant-pagination-options-quick-jumper input) {
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply border-light-text-tertiary/20 dark:border-dark-quaternary/30;
    @apply text-light-text-primary dark:text-dark-text-primary;
}

/* Checkbox styling */
.products-table :deep(.ant-checkbox-wrapper) {
    @apply text-light-text-primary dark:text-dark-text-primary;
}

.products-table :deep(.ant-checkbox-inner) {
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply border-light-text-tertiary/20 dark:border-dark-quaternary/30;
}

.products-table :deep(.ant-checkbox-checked .ant-checkbox-inner) {
    @apply bg-primary border-primary;
}

/* Empty state */
.products-table :deep(.ant-empty-description) {
    @apply text-light-text-tertiary dark:text-dark-text-secondary;
}

/* Scrollbar styling */
.products-table :deep(.ant-table-body)::-webkit-scrollbar {
    @apply w-2 h-2;
}

.products-table :deep(.ant-table-body)::-webkit-scrollbar-track {
    @apply bg-light-bg dark:bg-dark-primary;
}

.products-table :deep(.ant-table-body)::-webkit-scrollbar-thumb {
    @apply bg-light-text-tertiary/20 dark:bg-dark-text-secondary/20 rounded;
}

.products-table :deep(.ant-table-body)::-webkit-scrollbar-thumb:hover {
    @apply bg-light-text-tertiary/30 dark:bg-dark-text-secondary/30;
}

/* Dropdown menu styling */
.products-table :deep(.ant-dropdown) {
    @apply min-w-[160px];
}

.products-table :deep(.ant-dropdown-menu) {
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply border border-light-text-tertiary/10 dark:border-dark-quaternary/30;
    @apply shadow-lg;
}

.products-table :deep(.ant-dropdown-menu-item) {
    @apply text-light-text-primary dark:text-dark-text-primary;
    @apply hover:bg-light-bg dark:hover:bg-dark-tertiary;
}

.products-table :deep(.ant-dropdown-menu-item:hover) {
    @apply bg-light-bg dark:bg-dark-tertiary;
}

.products-table :deep(.ant-dropdown-menu .delete-menu-item) {
    @apply text-red-500 dark:text-red-400 !important;
}

.products-table :deep(.ant-dropdown-menu .delete-menu-item:hover) {
    @apply bg-red-50 dark:bg-red-950/30 !important;
    @apply text-red-600 dark:text-red-400 !important;
}

.products-table :deep(.ant-dropdown-menu .delete-menu-item .flex) {
    @apply text-red-500 dark:text-red-400;
}

/* Favorite button */
.favorite-btn {
    @apply transition-all duration-200;
}

.favorite-btn:hover :deep(.anticon) {
    @apply scale-110;
}
</style>
