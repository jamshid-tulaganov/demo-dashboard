<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { EyeOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons-vue';
import type { User } from '~/stores/users';
import { LazyImage } from '~/shared/ui';

interface Props {
    users: User[];
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
    view: [user: User];
    edit: [user: User];
    delete: [id: number];
    toggleStatus: [id: number, status: string];
    selectionChange: [selectedKeys: number[]];
    pageChange: [page: number, pageSize: number];
}>();

const { t } = useI18n();

const columns = computed(() => [
    {
        title: t('users.table.avatar'),
        dataIndex: 'image',
        key: 'image',
        width: 80,
        fixed: 'left',
    },
    {
        title: t('users.table.fullName'),
        dataIndex: 'firstName',
        key: 'fullName',
        width: 180,
    },
    {
        title: t('users.table.username'),
        dataIndex: 'username',
        key: 'username',
        width: 150,
    },
    {
        title: t('users.table.email'),
        dataIndex: 'email',
        key: 'email',
        width: 200,
        ellipsis: true,
    },
    {
        title: t('users.table.age'),
        dataIndex: 'age',
        key: 'age',
        width: 80,
        align: 'center',
    },
    {
        title: t('users.table.gender'),
        dataIndex: 'gender',
        key: 'gender',
        width: 100,
    },
    {
        title: t('users.table.role'),
        dataIndex: 'role',
        key: 'role',
        width: 120,
    },
    {
        title: t('users.table.status'),
        dataIndex: 'status',
        key: 'status',
        width: 140,
    },
    {
        title: t('users.table.company'),
        dataIndex: 'company',
        key: 'company',
        width: 180,
        ellipsis: true,
    },
    {
        title: t('users.table.city'),
        dataIndex: 'address',
        key: 'city',
        width: 140,
    },
    {
        title: t('users.table.actions'),
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

const handleView = (user: User) => {
    emit('view', user);
};

const handleEdit = (user: User) => {
    emit('edit', user);
};

const handleDelete = (id: number) => {
    emit('delete', id);
};

const handleStatusToggle = (user: User) => {
    const currentStatus = user.status || 'active';
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    emit('toggleStatus', user.id, newStatus);
};

const handlePageChange = (page: number, pageSize: number) => {
    emit('pageChange', page, pageSize);
};

const getRoleColor = (role?: string): string => {
    if (!role) return 'default';
    if (role === 'admin') return 'red';
    if (role === 'moderator') return 'orange';
    return 'blue';
};

const getStatusColor = (status?: string): string => {
    if (!status) return 'default';
    if (status === 'active') return 'green';
    if (status === 'inactive') return 'gray';
    return 'red';
};

const getGenderIcon = (gender: string): string => {
    if (gender === 'male') return '♂';
    if (gender === 'female') return '♀';
    return '⚥';
};
</script>

<template>
    <div class="users-table">
        <a-table
            :columns="columns"
            :data-source="users"
            :loading="loading"
            :row-key="(record) => record.id"
            :row-selection="rowSelection"
            :pagination="pagination ? {
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showTotal: (total: number, range: [number, number]) =>
                    t('users.table.pagination', { start: range[0], end: range[1], total }),
                onChange: handlePageChange,
                onShowSizeChange: handlePageChange,
            } : false"
            :scroll="{ x: 1600 }"
            class="custom-table"
        >
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'image'">
                    <LazyImage
                        :src="record.image"
                        :alt="record.firstName"
                        class="w-12 h-12 rounded-full object-cover"
                        width="48"
                        height="48"
                    />
                </template>

                <template v-else-if="column.key === 'fullName'">
                    <div class="font-medium text-light-text-primary dark:text-dark-text-primary">
                        {{ record.firstName }} {{ record.lastName }}
                    </div>
                    <div v-if="record.maidenName" class="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                        ({{ record.maidenName }})
                    </div>
                </template>

                <template v-else-if="column.key === 'age'">
                    <span class="font-semibold">{{ record.age }}</span>
                </template>

                <template v-else-if="column.key === 'gender'">
                    <span class="text-lg">
                        {{ getGenderIcon(record.gender) }}
                    </span>
                    <span class="ml-2 capitalize">{{ record.gender }}</span>
                </template>

                <template v-else-if="column.key === 'role'">
                    <a-tag :color="getRoleColor(record.role)" class="capitalize">
                        {{ record.role || 'user' }}
                    </a-tag>
                </template>

                <template v-else-if="column.key === 'status'">
                    <a-switch
                        :checked="record.status === 'active'"
                        :checked-children="t('users.status.active')"
                        :un-checked-children="t('users.status.inactive')"
                        @change="handleStatusToggle(record)"
                    />
                </template>

                <template v-else-if="column.key === 'company'">
                    <div v-if="record.company">
                        <div class="font-medium">{{ record.company.name }}</div>
                        <div class="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                            {{ record.company.title }}
                        </div>
                    </div>
                    <span v-else class="text-gray-400">-</span>
                </template>

                <template v-else-if="column.key === 'city'">
                    <div v-if="record.address">
                        {{ record.address.city }}
                    </div>
                    <span v-else class="text-gray-400">-</span>
                </template>

                <template v-else-if="column.key === 'actions'">
                    <div class="flex justify-center">
                        <a-dropdown placement="bottomRight" :trigger="['click']">
                            <a-button type="text" size="small">
                                <template #icon>
                                    <MoreOutlined class="text-lg" />
                                </template>
                            </a-button>
                            <template #overlay>
                                <a-menu>
                                    <a-menu-item @click="handleView(record)">
                                        <div class="flex items-center gap-2">
                                            <EyeOutlined />
                                            <span>{{ t('users.actions.view') }}</span>
                                        </div>
                                    </a-menu-item>
                                    <a-menu-item @click="handleEdit(record)">
                                        <div class="flex items-center gap-2">
                                            <EditOutlined />
                                            <span>{{ t('common.edit') }}</span>
                                        </div>
                                    </a-menu-item>
                                    <a-menu-item @click="handleDelete(record.id)" class="text-red-500">
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
.users-table :deep(.ant-table) {
    @apply bg-transparent;
}

.users-table :deep(.ant-table-thead > tr > th) {
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply text-light-text-primary dark:text-dark-text-primary;
    @apply font-semibold;
    @apply border-b border-light-text-tertiary/10 dark:border-dark-quaternary/30;
}

.users-table :deep(.ant-table-tbody > tr > td) {
    @apply border-b border-light-text-tertiary/10 dark:border-dark-quaternary/30;
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply text-light-text-primary dark:text-dark-text-primary;
}

.users-table :deep(.ant-table-tbody > tr:hover > td) {
    @apply bg-light-bg dark:bg-dark-tertiary;
}

/* Pagination styling */
.users-table :deep(.ant-pagination) {
    @apply mt-4;
}

.users-table :deep(.ant-pagination-item) {
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply border-light-text-tertiary/20 dark:border-dark-quaternary/30;
}

.users-table :deep(.ant-pagination-item a) {
    @apply text-light-text-primary dark:text-dark-text-primary;
}

.users-table :deep(.ant-pagination-item-active) {
    @apply bg-primary border-primary;
}

.users-table :deep(.ant-pagination-item-active a) {
    @apply text-white;
}

.users-table :deep(.ant-pagination-prev .ant-pagination-item-link),
.users-table :deep(.ant-pagination-next .ant-pagination-item-link) {
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply border-light-text-tertiary/20 dark:border-dark-quaternary/30;
    @apply text-light-text-primary dark:text-dark-text-primary;
}

.users-table :deep(.ant-select-selector) {
    @apply bg-light-menu dark:bg-dark-secondary !important;
    @apply border-light-text-tertiary/20 dark:border-dark-quaternary/30 !important;
    @apply text-light-text-primary dark:text-dark-text-primary !important;
}

.users-table :deep(.ant-select-arrow) {
    @apply text-light-text-primary dark:text-dark-text-primary;
}

.users-table :deep(.ant-pagination-options-quick-jumper input) {
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply border-light-text-tertiary/20 dark:border-dark-quaternary/30;
    @apply text-light-text-primary dark:text-dark-text-primary;
}

/* Checkbox styling */
.users-table :deep(.ant-checkbox-wrapper) {
    @apply text-light-text-primary dark:text-dark-text-primary;
}

.users-table :deep(.ant-checkbox-inner) {
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply border-light-text-tertiary/20 dark:border-dark-quaternary/30;
}

.users-table :deep(.ant-checkbox-checked .ant-checkbox-inner) {
    @apply bg-primary border-primary;
}

/* Empty state */
.users-table :deep(.ant-empty-description) {
    @apply text-light-text-tertiary dark:text-dark-text-secondary;
}

/* Scrollbar styling */
.users-table :deep(.ant-table-body)::-webkit-scrollbar {
    @apply w-2 h-2;
}

.users-table :deep(.ant-table-body)::-webkit-scrollbar-track {
    @apply bg-light-bg dark:bg-dark-primary;
}

.users-table :deep(.ant-table-body)::-webkit-scrollbar-thumb {
    @apply bg-light-text-tertiary/20 dark:bg-dark-text-secondary/20 rounded;
}

.users-table :deep(.ant-table-body)::-webkit-scrollbar-thumb:hover {
    @apply bg-light-text-tertiary/30 dark:bg-dark-text-secondary/30;
}

/* Dropdown menu styling */
.users-table :deep(.ant-dropdown) {
    @apply min-w-[160px];
}

.users-table :deep(.ant-dropdown-menu) {
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply border border-light-text-tertiary/10 dark:border-dark-quaternary/30;
    @apply shadow-lg;
}

.users-table :deep(.ant-dropdown-menu-item) {
    @apply text-light-text-primary dark:text-dark-text-primary;
    @apply hover:bg-light-bg dark:hover:bg-dark-tertiary;
}

.users-table :deep(.ant-dropdown-menu-item:hover) {
    @apply bg-light-bg dark:bg-dark-tertiary;
}
</style>
