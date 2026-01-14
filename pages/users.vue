<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { message, Modal } from 'ant-design-vue';
import { useUsersStore, type User } from '~/stores/users';

definePageMeta({
    layout: 'default',
    middleware: ['auth'],
});

const { t } = useI18n();
const usersStore = useUsersStore();

// State
const searchQuery = ref('');
const ageRange = ref<[number, number]>([18, 100]);
const selectedGender = ref<string | undefined>(undefined);
const selectedRole = ref<string | undefined>(undefined);
const selectedStatus = ref<string | undefined>(undefined);
const sortBy = ref<string>('default');
const currentPage = ref(1);
const pageSize = ref(10);
const selectedRowKeys = ref<number[]>([]);
const modalVisible = ref(false);
const detailModalVisible = ref(false);
const currentUser = ref<User | null>(null);
const viewingUser = ref<User | null>(null);
const modalLoading = ref(false);
const searchDebounceTimer = ref<NodeJS.Timeout | null>(null);

// Computed
const loading = computed(() => usersStore.loading);
const allUsers = computed(() => usersStore.getAllUsers);

// Apply filters and sorting
const filteredAndSortedUsers = computed(() => {
    let result = [...allUsers.value];

    // Apply age range filter
    result = result.filter(u => u.age >= ageRange.value[0] && u.age <= ageRange.value[1]);

    // Apply gender filter
    if (selectedGender.value) {
        result = result.filter(u => u.gender === selectedGender.value);
    }

    // Apply role filter
    if (selectedRole.value) {
        result = result.filter(u => (u.role || 'user') === selectedRole.value);
    }

    // Apply status filter
    if (selectedStatus.value) {
        result = result.filter(u => (u.status || 'active') === selectedStatus.value);
    }

    // Apply sorting
    if (sortBy.value === 'name-asc') {
        result.sort((a, b) => a.firstName.localeCompare(b.firstName));
    } else if (sortBy.value === 'name-desc') {
        result.sort((a, b) => b.firstName.localeCompare(a.firstName));
    } else if (sortBy.value === 'age-asc') {
        result.sort((a, b) => a.age - b.age);
    } else if (sortBy.value === 'age-desc') {
        result.sort((a, b) => b.age - a.age);
    } else if (sortBy.value === 'email-asc') {
        result.sort((a, b) => a.email.localeCompare(b.email));
    } else if (sortBy.value === 'email-desc') {
        result.sort((a, b) => b.email.localeCompare(a.email));
    }

    return result;
});

const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredAndSortedUsers.value.slice(start, end);
});

const totalUsers = computed(() => filteredAndSortedUsers.value.length);

const pagination = computed(() => ({
    current: currentPage.value,
    pageSize: pageSize.value,
    total: totalUsers.value,
}));

const hasActiveFilters = computed(() => {
    return selectedGender.value ||
        selectedRole.value ||
        selectedStatus.value ||
        ageRange.value[0] !== 18 ||
        ageRange.value[1] !== 100 ||
        searchQuery.value;
});

// Filter options
const genderOptions = [
    { label: t('users.filters.allGenders'), value: undefined },
    { label: t('users.form.gender.male'), value: 'male' },
    { label: t('users.form.gender.female'), value: 'female' },
    { label: t('users.form.gender.other'), value: 'other' },
];

const roleOptions = [
    { label: t('users.filters.allRoles'), value: undefined },
    { label: t('users.form.role.user'), value: 'user' },
    { label: t('users.form.role.moderator'), value: 'moderator' },
    { label: t('users.form.role.admin'), value: 'admin' },
];

const statusOptions = [
    { label: t('users.filters.allStatuses'), value: undefined },
    { label: t('users.status.active'), value: 'active' },
    { label: t('users.status.inactive'), value: 'inactive' },
    { label: t('users.status.suspended'), value: 'suspended' },
];

// Sort options
const sortOptions = [
    { label: t('users.sort.default'), value: 'default' },
    { label: t('users.sort.nameAsc'), value: 'name-asc' },
    { label: t('users.sort.nameDesc'), value: 'name-desc' },
    { label: t('users.sort.ageAsc'), value: 'age-asc' },
    { label: t('users.sort.ageDesc'), value: 'age-desc' },
    { label: t('users.sort.emailAsc'), value: 'email-asc' },
    { label: t('users.sort.emailDesc'), value: 'email-desc' },
];

// Initialize data
onMounted(async () => {
    await usersStore.fetchUsers(100, 0);
});

// Search handler with debounce
watch(searchQuery, (newValue) => {
    if (searchDebounceTimer.value) {
        clearTimeout(searchDebounceTimer.value);
    }

    searchDebounceTimer.value = setTimeout(async () => {
        if (newValue.trim()) {
            await usersStore.searchUsers(newValue);
        } else {
            await usersStore.fetchUsers(100, 0);
        }
        currentPage.value = 1;
    }, 500);
});

// Reset filters
const resetFilters = async () => {
    searchQuery.value = '';
    ageRange.value = [18, 100];
    selectedGender.value = undefined;
    selectedRole.value = undefined;
    selectedStatus.value = undefined;
    sortBy.value = 'default';
    currentPage.value = 1;
    await usersStore.fetchUsers(100, 0);
};

// Table handlers
const handleView = (user: User) => {
    viewingUser.value = user;
    detailModalVisible.value = true;
};

const handleEdit = (user: User) => {
    currentUser.value = user;
    modalVisible.value = true;
};

const handleDelete = (id: number) => {
    Modal.confirm({
        title: t('users.delete.confirmTitle'),
        content: t('users.delete.confirmMessage'),
        okText: t('common.yes'),
        okType: 'danger',
        cancelText: t('common.no'),
        onOk: async () => {
            try {
                await usersStore.deleteUser(id);
                message.success(t('users.delete.success'));
                selectedRowKeys.value = selectedRowKeys.value.filter(k => k !== id);
            } catch (error) {
                message.error(t('users.delete.error'));
            }
        },
    });
};

const handleToggleStatus = async (id: number, status: string) => {
    try {
        await usersStore.toggleUserStatus(id, status);
        message.success(t('users.status.toggleSuccess'));
    } catch (error) {
        message.error(t('users.status.toggleError'));
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
        message.warning(t('users.bulkDelete.noSelection'));
        return;
    }

    Modal.confirm({
        title: t('users.bulkDelete.confirmTitle'),
        content: t('users.bulkDelete.confirmMessage', { count: selectedRowKeys.value.length }),
        okText: t('common.yes'),
        okType: 'danger',
        cancelText: t('common.no'),
        onOk: async () => {
            try {
                await usersStore.deleteMultipleUsers(selectedRowKeys.value);
                message.success(t('users.bulkDelete.success', { count: selectedRowKeys.value.length }));
                selectedRowKeys.value = [];
            } catch (error) {
                message.error(t('users.bulkDelete.error'));
            }
        },
    });
};

// Bulk status change
const handleBulkStatusChange = (status: string) => {
    if (selectedRowKeys.value.length === 0) {
        message.warning(t('users.bulkStatus.noSelection'));
        return;
    }

    Modal.confirm({
        title: t('users.bulkStatus.confirmTitle'),
        content: t('users.bulkStatus.confirmMessage', { count: selectedRowKeys.value.length, status }),
        okText: t('common.yes'),
        okType: 'primary',
        cancelText: t('common.no'),
        onOk: async () => {
            try {
                await Promise.all(
                    selectedRowKeys.value.map(id => usersStore.toggleUserStatus(id, status))
                );
                message.success(t('users.bulkStatus.success', { count: selectedRowKeys.value.length }));
                selectedRowKeys.value = [];
            } catch (error) {
                message.error(t('users.bulkStatus.error'));
            }
        },
    });
};

// Bulk role change
const handleBulkRoleChange = (role: string) => {
    if (selectedRowKeys.value.length === 0) {
        message.warning(t('users.bulkRole.noSelection'));
        return;
    }

    Modal.confirm({
        title: t('users.bulkRole.confirmTitle'),
        content: t('users.bulkRole.confirmMessage', { count: selectedRowKeys.value.length, role }),
        okText: t('common.yes'),
        okType: 'primary',
        cancelText: t('common.no'),
        onOk: async () => {
            try {
                await Promise.all(
                    selectedRowKeys.value.map(id => usersStore.updateUserRole(id, role))
                );
                message.success(t('users.bulkRole.success', { count: selectedRowKeys.value.length }));
                selectedRowKeys.value = [];
            } catch (error) {
                message.error(t('users.bulkRole.error'));
            }
        },
    });
};

// Add user
const handleAddUser = () => {
    currentUser.value = null;
    modalVisible.value = true;
};

// Modal save handler
const getChangedFields = (original: User, updated: Partial<User>): Partial<User> => {
    const changes: Partial<User> = {};

    Object.keys(updated).forEach((key) => {
        const k = key as keyof User;
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

const handleModalSave = async (formData: Partial<User>) => {
    modalLoading.value = true;

    try {
        if (currentUser.value) {
            const changedFields = getChangedFields(currentUser.value, formData);

            if (Object.keys(changedFields).length > 0) {
                await usersStore.updateUser(currentUser.value.id, changedFields);
                message.success(t('users.update.success'));
            } else {
                message.info('No changes detected');
            }
        } else {
            await usersStore.addUser(formData as Omit<User, 'id'>);
            message.success(t('users.create.success'));
        }

        modalVisible.value = false;
        currentUser.value = null;
    } catch (error) {
        message.error(
            currentUser.value
                ? t('users.update.error')
                : t('users.create.error')
        );
    } finally {
        modalLoading.value = false;
    }
};

// Export to CSV
watch(modalVisible, (newValue) => {
    if (!newValue) {
        currentUser.value = null;
    }
});

const exportToCSV = () => {
    const data = filteredAndSortedUsers.value;

    if (data.length === 0) {
        message.warning(t('users.export.noData'));
        return;
    }

    // CSV headers
    const headers = [
        'ID', 'First Name', 'Last Name', 'Username', 'Email', 'Phone',
        'Age', 'Gender', 'Role', 'Status', 'Company', 'Job Title', 'City', 'Country'
    ];

    // CSV rows
    const rows = data.map(u => [
        u.id,
        `"${u.firstName}"`,
        `"${u.lastName}"`,
        u.username,
        u.email,
        u.phone,
        u.age,
        u.gender,
        u.role || 'user',
        u.status || 'active',
        u.company ? `"${u.company.name}"` : '',
        u.company ? `"${u.company.title}"` : '',
        u.address ? u.address.city : '',
        u.address ? u.address.country : ''
    ]);

    // Create CSV content
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
    link.setAttribute('download', `users_export_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success(t('users.export.success'));
};
</script>

<template>
    <div class="users-page space-y-4 md:space-y-6">
        <!-- Page Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-light-text-primary dark:text-dark-text-primary">
                {{ t('users.title') }}
            </h1>
            <a-button type="primary" size="large" @click="handleAddUser" class="w-full sm:w-auto">
                <div class="d-flex items-center">
                    <PlusOutlined class="mr-1" />
                    {{ t('users.addUser') }}
                </div>
            </a-button>
        </div>

        <!-- Filters Section -->
        <a-card class="bg-light-background dark:bg-dark-background">
            <div class="space-y-4">
                <!-- Search -->
                <a-input-search v-model:value="searchQuery" :placeholder="t('users.search.placeholder')" size="large"
                    allow-clear />

                <!-- Filters Row 1 -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a-select v-model:value="selectedGender" :placeholder="t('users.filters.gender')" size="large"
                        allow-clear>
                        <a-select-option v-for="option in genderOptions" :key="option.value || 'all'"
                            :value="option.value">
                            {{ option.label }}
                        </a-select-option>
                    </a-select>

                    <a-select v-model:value="selectedRole" :placeholder="t('users.filters.role')" size="large"
                        allow-clear>
                        <a-select-option v-for="option in roleOptions" :key="option.value || 'all'"
                            :value="option.value">
                            {{ option.label }}
                        </a-select-option>
                    </a-select>

                    <a-select v-model:value="selectedStatus" :placeholder="t('users.filters.status')" size="large"
                        allow-clear>
                        <a-select-option v-for="option in statusOptions" :key="option.value || 'all'"
                            :value="option.value">
                            {{ option.label }}
                        </a-select-option>
                    </a-select>
                </div>

                <!-- Age Range -->
                <div>
                    <label class="block text-sm font-medium mb-2 text-light-text-primary dark:text-dark-text-primary">
                        {{ t('users.filters.ageRange') }}: {{ ageRange[0] }} - {{ ageRange[1] }}
                    </label>
                    <a-slider v-model:value="ageRange" range :min="18" :max="100" :step="1" />
                </div>

                <!-- Sort and Actions -->
                <div class="flex flex-col lg:flex-row gap-3 lg:gap-4 items-stretch lg:items-center justify-between">
                    <div class="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                        <span class="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                            {{ t('users.sort.label') }}:
                        </span>
                        <a-select v-model:value="sortBy" :placeholder="t('users.sort.placeholder')"
                            class="w-full sm:w-48">
                            <a-select-option v-for="option in sortOptions" :key="option.value" :value="option.value">
                                {{ option.label }}
                            </a-select-option>
                        </a-select>
                    </div>

                    <div class="flex flex-wrap gap-2">
                        <a-button v-if="hasActiveFilters" @click="resetFilters" class="flex-1 sm:flex-none">
                            {{ t('users.filters.reset') }}
                        </a-button>
                        <a-button type="primary" @click="exportToCSV" class="flex-1 sm:flex-none">
                            {{ t('users.export.button') }}
                        </a-button>
                    </div>
                </div>

                <!-- Bulk Actions -->
                <div v-if="selectedRowKeys.length > 0" class="flex flex-col sm:flex-row flex-wrap gap-2">
                    <a-button danger @click="handleBulkDelete">
                        {{ t('users.bulkDelete.button', { count: selectedRowKeys.length }) }}
                    </a-button>

                    <a-dropdown>
                        <a-button>
                            {{ t('users.bulkStatus.button', { count: selectedRowKeys.length }) }}
                        </a-button>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item @click="handleBulkStatusChange('active')">
                                    {{ t('users.status.active') }}
                                </a-menu-item>
                                <a-menu-item @click="handleBulkStatusChange('inactive')">
                                    {{ t('users.status.inactive') }}
                                </a-menu-item>
                                <a-menu-item @click="handleBulkStatusChange('suspended')">
                                    {{ t('users.status.suspended') }}
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>

                    <a-dropdown>
                        <a-button>
                            {{ t('users.bulkRole.button', { count: selectedRowKeys.length }) }}
                        </a-button>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item @click="handleBulkRoleChange('user')">
                                    {{ t('users.form.role.user') }}
                                </a-menu-item>
                                <a-menu-item @click="handleBulkRoleChange('moderator')">
                                    {{ t('users.form.role.moderator') }}
                                </a-menu-item>
                                <a-menu-item @click="handleBulkRoleChange('admin')">
                                    {{ t('users.form.role.admin') }}
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </div>
            </div>
        </a-card>

        <!-- Results Summary -->
        <div class="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            {{ t('users.resultsCount', { count: totalUsers }) }}
        </div>

        <!-- Users Table -->
        <TableSkeleton v-if="loading && paginatedUsers.length === 0" :rows="10" :columns="11" />
        <UsersTable v-else :users="paginatedUsers" :loading="loading" :selected-row-keys="selectedRowKeys"
            :pagination="pagination" @view="handleView" @edit="handleEdit" @delete="handleDelete"
            @toggle-status="handleToggleStatus" @selection-change="handleSelectionChange"
            @page-change="handlePageChange" />

        <!-- User Modal -->
        <UserModal v-model:open="modalVisible" :user="currentUser" :loading="modalLoading" @save="handleModalSave" />

        <!-- User Detail Modal -->
        <UserDetailModal v-model:open="detailModalVisible" :user="viewingUser" />
    </div>
</template>

<style scoped>
.users-page :deep(.ant-card) {
    border-color: rgba(0, 0, 0, 0.06);
}

.dark .users-page :deep(.ant-card) {
    border-color: rgba(255, 255, 255, 0.06);
}
</style>
