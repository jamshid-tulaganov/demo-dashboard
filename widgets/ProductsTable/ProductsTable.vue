<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
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
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    selectedRowKeys: () => [],
});

const emit = defineEmits<{
    edit: [product: Product];
    delete: [id: number];
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
        width: 120,
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
            :row-selection="rowSelection"
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
                    <span v-else class="text-gray-400">-</span>
                </template>

                <template v-else-if="column.key === 'rating'">
                    <div class="flex items-center gap-1">
                        <span
                            v-for="i in 5"
                            :key="i"
                            class="text-base"
                            :class="i <= Math.round(record.rating) ? 'text-yellow-400' : 'text-gray-300'"
                        >
                            ★
                        </span>
                        <span class="ml-1 text-sm text-gray-600 dark:text-gray-400">
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
                    <div class="flex gap-2 justify-center">
                        <a-tooltip :title="t('common.edit')">
                            <a-button
                                type="primary"
                                size="small"
                                @click="handleEdit(record)"
                            >
                                <template #icon>
                                    <EditOutlined />
                                </template>
                            </a-button>
                        </a-tooltip>
                        <a-tooltip :title="t('common.delete')">
                            <a-button
                                danger
                                size="small"
                                @click="handleDelete(record.id)"
                            >
                                <template #icon>
                                    <DeleteOutlined />
                                </template>
                            </a-button>
                        </a-tooltip>
                    </div>
                </template>
            </template>
        </a-table>
    </div>
</template>

<style scoped>
.products-table :deep(.ant-table) {
    background: transparent;
}

.products-table :deep(.ant-table-thead > tr > th) {
    background: var(--bg-light-background-secondary);
    color: var(--text-light-text-primary);
    font-weight: 600;
}

.dark .products-table :deep(.ant-table-thead > tr > th) {
    background: var(--bg-dark-background-secondary);
    color: var(--text-dark-text-primary);
}

.products-table :deep(.ant-table-tbody > tr) {
    background: var(--bg-light-background);
}

.dark .products-table :deep(.ant-table-tbody > tr) {
    background: var(--bg-dark-background);
}

.products-table :deep(.ant-table-tbody > tr:hover) {
    background: var(--bg-light-background-secondary);
}

.dark .products-table :deep(.ant-table-tbody > tr:hover) {
    background: var(--bg-dark-background-secondary);
}

.products-table :deep(.ant-table-tbody > tr > td) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.dark .products-table :deep(.ant-table-tbody > tr > td) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
</style>
