<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { EditOutlined } from '@ant-design/icons-vue';
import type { User } from '~/stores/users';

definePageMeta({
    layout: 'default',
    middleware: ['auth'],
});

useSeo({
    title: 'Profile',
    description: 'View and edit your personal profile information and account settings.',
    keywords: 'profile, account, personal information, settings',
});

const { t } = useI18n();
const { user: authUser, getCurrentUser } = useAuth();
const { client } = useApiClient();

const loading = ref(false);
const currentUser = ref<any>(null);
const editModalVisible = ref(false);
const updateLoading = ref(false);

const fetchUserData = async () => {
    loading.value = true;
    try {
        const userData = await getCurrentUser();
        currentUser.value = userData;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    if (authUser.value) {
        currentUser.value = authUser.value;
    }
    fetchUserData();
});

const getFullName = () => {
    if (!currentUser.value) return 'User';
    const parts = [
        currentUser.value.firstName,
        currentUser.value.lastName
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : currentUser.value.username;
};

const handleEditProfile = () => {
    if (!currentUser.value) {
        message.warning('User data not loaded yet. Please wait.');
        return;
    }
    console.log('Opening edit modal with user:', currentUser.value);
    editModalVisible.value = true;
};

const handleUpdateProfile = async (formData: Partial<User>) => {
    if (!currentUser.value?.id) return;

    updateLoading.value = true;
    try {
        // Use PATCH to send only the updated fields
        const updatedUser = await client.patch<User>(
            `https://dummyjson.com/users/${currentUser.value.id}`,
            { body: formData }
        );

        // Merge the updated data with current user data
        currentUser.value = {
            ...currentUser.value,
            ...updatedUser,
            ...formData
        };

        // Close modal
        editModalVisible.value = false;

        // Show success message
        message.success(t('users.update.success'));

        // Refresh user data from auth
        await fetchUserData();
    } catch (error) {
        console.error('Failed to update profile:', error);
        message.error(t('users.update.error'));
    } finally {
        updateLoading.value = false;
    }
};
</script>

<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <h1 class="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
                {{ t('header.profile.myProfile') }}
            </h1>
            <!-- <div class="flex items-center gap-3">
                <a-spin v-if="loading" />
                <a-button
                    type="primary"
                    size="large"
                    @click="handleEditProfile"
                    :disabled="loading"
                    class="edit-profile-btn"
                >
                    <template #icon>
                        <EditOutlined />
                    </template>
{{ t('common.edit') }}
</a-button>
</div> -->
        </div>

        <!-- Profile Overview Card -->
        <a-card class="profile-card">
            <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
                <!-- Avatar -->
                <div class="flex-shrink-0">
                    <LazyImage v-if="currentUser?.image" :src="currentUser.image" :alt="getFullName()"
                        class="w-32 h-32 rounded-full object-cover border-4 border-primary/20" width="128"
                        height="128" />
                    <a-avatar v-else :size="128" class="bg-primary text-4xl">
                        {{ currentUser?.username?.charAt(0).toUpperCase() || 'U' }}
                    </a-avatar>
                </div>

                <!-- User Info -->
                <div class="flex-1 text-center md:text-left">
                    <h2 class="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                        {{ getFullName() }}
                    </h2>
                    <p class="text-light-text-secondary dark:text-dark-text-secondary mb-1">
                        @{{ currentUser?.username || 'username' }}
                    </p>
                    <p class="text-light-text-secondary dark:text-dark-text-secondary mb-4">
                        {{ currentUser?.email || 'user@example.com' }}
                    </p>

                    <!-- Tags -->
                    <div class="flex flex-wrap gap-2 justify-center md:justify-start">
                        <a-tag v-if="currentUser?.gender" color="blue" class="capitalize">
                            {{ currentUser.gender }}
                        </a-tag>
                        <a-tag v-if="currentUser?.age" color="green">
                            {{ currentUser.age }} years old
                        </a-tag>
                        <a-tag v-if="currentUser?.role" color="purple" class="capitalize">
                            {{ currentUser.role || 'user' }}
                        </a-tag>
                    </div>
                </div>
            </div>
        </a-card>

        <!-- Personal Information -->
        <a-card :title="t('users.detail.personal')">
            <a-spin :spinning="loading">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="info-item">
                        <label class="info-label">{{ t('users.form.firstName') }}</label>
                        <p class="info-value">{{ currentUser?.firstName || '-' }}</p>
                    </div>
                    <div class="info-item">
                        <label class="info-label">{{ t('users.form.lastName') }}</label>
                        <p class="info-value">{{ currentUser?.lastName || '-' }}</p>
                    </div>
                    <div class="info-item">
                        <label class="info-label">{{ t('users.detail.age') }}</label>
                        <p class="info-value">{{ currentUser?.age || '-' }}</p>
                    </div>
                    <div class="info-item">
                        <label class="info-label">{{ t('users.detail.gender') }}</label>
                        <p class="info-value capitalize">{{ currentUser?.gender || '-' }}</p>
                    </div>
                    <div class="info-item">
                        <label class="info-label">{{ t('users.detail.birthDate') }}</label>
                        <p class="info-value">{{ currentUser?.birthDate || '-' }}</p>
                    </div>
                    <div class="info-item">
                        <label class="info-label">{{ t('users.detail.bloodGroup') }}</label>
                        <p class="info-value">{{ currentUser?.bloodGroup || '-' }}</p>
                    </div>
                </div>
            </a-spin>
        </a-card>

        <!-- Contact Information -->
        <a-card :title="t('users.detail.contact')">
            <a-spin :spinning="loading">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="info-item">
                        <label class="info-label">{{ t('users.detail.email') }}</label>
                        <p class="info-value">{{ currentUser?.email || '-' }}</p>
                    </div>
                    <div class="info-item">
                        <label class="info-label">{{ t('users.detail.phone') }}</label>
                        <p class="info-value">{{ currentUser?.phone || '-' }}</p>
                    </div>
                    <div class="info-item">
                        <label class="info-label">{{ t('users.detail.username') }}</label>
                        <p class="info-value">{{ currentUser?.username || '-' }}</p>
                    </div>
                </div>
            </a-spin>
        </a-card>

        <!-- Physical Information -->
        <a-card :title="t('users.detail.physical')"
            v-if="currentUser?.height || currentUser?.weight || currentUser?.eyeColor || currentUser?.hair">
            <a-spin :spinning="loading">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="info-item" v-if="currentUser?.height">
                        <label class="info-label">{{ t('users.detail.height') }}</label>
                        <p class="info-value">{{ currentUser.height }} cm</p>
                    </div>
                    <div class="info-item" v-if="currentUser?.weight">
                        <label class="info-label">{{ t('users.detail.weight') }}</label>
                        <p class="info-value">{{ currentUser.weight }} kg</p>
                    </div>
                    <div class="info-item" v-if="currentUser?.eyeColor">
                        <label class="info-label">{{ t('users.detail.eyeColor') }}</label>
                        <p class="info-value capitalize">{{ currentUser.eyeColor }}</p>
                    </div>
                    <div class="info-item" v-if="currentUser?.hair">
                        <label class="info-label">{{ t('users.detail.hair') }}</label>
                        <p class="info-value capitalize">
                            {{ currentUser.hair.color }} - {{ currentUser.hair.type }}
                        </p>
                    </div>
                </div>
            </a-spin>
        </a-card>

        <!-- Address -->
        <a-card :title="t('users.detail.address')" v-if="currentUser?.address">
            <a-spin :spinning="loading">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="info-item" v-if="currentUser.address.address">
                        <label class="info-label">{{ t('users.detail.street') }}</label>
                        <p class="info-value">{{ currentUser.address.address }}</p>
                    </div>
                    <div class="info-item" v-if="currentUser.address.city">
                        <label class="info-label">{{ t('users.detail.city') }}</label>
                        <p class="info-value">{{ currentUser.address.city }}</p>
                    </div>
                    <div class="info-item" v-if="currentUser.address.state">
                        <label class="info-label">{{ t('users.detail.state') }}</label>
                        <p class="info-value">{{ currentUser.address.state }}</p>
                    </div>
                    <div class="info-item" v-if="currentUser.address.postalCode">
                        <label class="info-label">{{ t('users.detail.postalCode') }}</label>
                        <p class="info-value">{{ currentUser.address.postalCode }}</p>
                    </div>
                    <div class="info-item" v-if="currentUser.address.country">
                        <label class="info-label">{{ t('users.detail.country') }}</label>
                        <p class="info-value">{{ currentUser.address.country }}</p>
                    </div>
                </div>
            </a-spin>
        </a-card>

        <!-- Professional Information -->
        <a-card :title="t('users.detail.professional')" v-if="currentUser?.university || currentUser?.company">
            <a-spin :spinning="loading">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="info-item" v-if="currentUser?.university">
                        <label class="info-label">{{ t('users.detail.university') }}</label>
                        <p class="info-value">{{ currentUser.university }}</p>
                    </div>
                    <div class="info-item" v-if="currentUser?.company?.name">
                        <label class="info-label">{{ t('users.detail.company') }}</label>
                        <p class="info-value">{{ currentUser.company.name }}</p>
                    </div>
                    <div class="info-item" v-if="currentUser?.company?.department">
                        <label class="info-label">{{ t('users.detail.department') }}</label>
                        <p class="info-value">{{ currentUser.company.department }}</p>
                    </div>
                    <div class="info-item" v-if="currentUser?.company?.title">
                        <label class="info-label">{{ t('users.detail.jobTitle') }}</label>
                        <p class="info-value">{{ currentUser.company.title }}</p>
                    </div>
                </div>
            </a-spin>
        </a-card>

        <!-- Edit Profile Modal -->
        <UserModal v-model:open="editModalVisible" :user="currentUser" :loading="updateLoading"
            @save="handleUpdateProfile" />
    </div>
</template>

<style scoped>
.profile-card {
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply border border-light-text-tertiary/10 dark:border-dark-quaternary/30;
}

.profile-card :deep(.ant-card-body) {
    @apply p-6;
}

.info-item {
    @apply space-y-1;
}

.info-label {
    @apply block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary;
}

.info-value {
    @apply text-base font-medium text-light-text-primary dark:text-dark-text-primary;
}

:deep(.ant-card) {
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply border border-light-text-tertiary/10 dark:border-dark-quaternary/30;
}

:deep(.ant-card-head) {
    @apply border-b border-light-text-tertiary/10 dark:border-dark-quaternary/30;
}

:deep(.ant-card-head-title) {
    @apply text-light-text-primary dark:text-dark-text-primary;
    @apply font-semibold;
}

:deep(.ant-spin) {
    @apply text-primary;
}

.edit-profile-btn {
    @apply relative z-10;
}
</style>
