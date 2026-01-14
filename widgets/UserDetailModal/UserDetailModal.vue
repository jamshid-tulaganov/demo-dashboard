<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { User } from '~/stores/users';

interface Props {
    open: boolean;
    user: User | null;
}

const props = withDefaults(defineProps<Props>(), {
    user: null,
});

const emit = defineEmits<{
    'update:open': [value: boolean];
}>();

const { t } = useI18n();

const handleClose = () => {
    emit('update:open', false);
};

const fullName = computed(() => {
    if (!props.user) return '';
    return `${props.user.firstName} ${props.user.lastName}`;
});

const getRoleColor = (role?: string): string => {
    if (!role) return 'blue';
    if (role === 'admin') return 'red';
    if (role === 'moderator') return 'orange';
    return 'blue';
};

const getStatusColor = (status?: string): string => {
    if (!status) return 'green';
    if (status === 'active') return 'green';
    if (status === 'inactive') return 'gray';
    return 'red';
};
</script>

<template>
    <a-modal
        :open="open"
        :title="t('users.detail.title')"
        :width="800"
        :footer="null"
        @cancel="handleClose"
    >
        <div v-if="user" class="user-detail">
            <!-- Header with Avatar -->
            <div class="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <LazyImage
                    :src="user.image"
                    :alt="fullName"
                    class="w-24 h-24 rounded-full object-cover"
                    width="96"
                    height="96"
                />
                <div class="flex-1">
                    <h2 class="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                        {{ fullName }}
                    </h2>
                    <p v-if="user.maidenName" class="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        ({{ user.maidenName }})
                    </p>
                    <div class="flex gap-2 mt-2">
                        <a-tag :color="getRoleColor(user.role)" class="capitalize">
                            {{ user.role || 'user' }}
                        </a-tag>
                        <a-tag :color="getStatusColor(user.status)" class="capitalize">
                            {{ user.status || 'active' }}
                        </a-tag>
                    </div>
                </div>
            </div>

            <!-- Personal Information -->
            <div class="detail-section">
                <h3 class="text-lg font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
                    {{ t('users.detail.personal') }}
                </h3>
                <div class="grid grid-cols-2 gap-3">
                    <div class="detail-item">
                        <span class="label">{{ t('users.detail.age') }}:</span>
                        <span class="value">{{ user.age }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">{{ t('users.detail.gender') }}:</span>
                        <span class="value capitalize">{{ user.gender }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">{{ t('users.detail.birthDate') }}:</span>
                        <span class="value">{{ user.birthDate }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">{{ t('users.detail.bloodGroup') }}:</span>
                        <span class="value">{{ user.bloodGroup || '-' }}</span>
                    </div>
                </div>
            </div>

            <!-- Contact Information -->
            <div class="detail-section">
                <h3 class="text-lg font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
                    {{ t('users.detail.contact') }}
                </h3>
                <div class="grid grid-cols-1 gap-3">
                    <div class="detail-item">
                        <span class="label">{{ t('users.detail.email') }}:</span>
                        <span class="value">{{ user.email }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">{{ t('users.detail.phone') }}:</span>
                        <span class="value">{{ user.phone }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">{{ t('users.detail.username') }}:</span>
                        <span class="value">{{ user.username }}</span>
                    </div>
                </div>
            </div>

            <!-- Physical Attributes -->
            <div class="detail-section">
                <h3 class="text-lg font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
                    {{ t('users.detail.physical') }}
                </h3>
                <div class="grid grid-cols-2 gap-3">
                    <div class="detail-item">
                        <span class="label">{{ t('users.detail.height') }}:</span>
                        <span class="value">{{ user.height ? `${user.height} cm` : '-' }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">{{ t('users.detail.weight') }}:</span>
                        <span class="value">{{ user.weight ? `${user.weight} kg` : '-' }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">{{ t('users.detail.eyeColor') }}:</span>
                        <span class="value">{{ user.eyeColor || '-' }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">{{ t('users.detail.hair') }}:</span>
                        <span class="value">
                            {{ user.hair ? `${user.hair.color} (${user.hair.type})` : '-' }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Address -->
            <div v-if="user.address" class="detail-section">
                <h3 class="text-lg font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
                    {{ t('users.detail.address') }}
                </h3>
                <div class="grid grid-cols-1 gap-3">
                    <div class="detail-item">
                        <span class="label">{{ t('users.detail.street') }}:</span>
                        <span class="value">{{ user.address.address }}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="detail-item">
                            <span class="label">{{ t('users.detail.city') }}:</span>
                            <span class="value">{{ user.address.city }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">{{ t('users.detail.state') }}:</span>
                            <span class="value">{{ user.address.state }} ({{ user.address.stateCode }})</span>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="detail-item">
                            <span class="label">{{ t('users.detail.postalCode') }}:</span>
                            <span class="value">{{ user.address.postalCode }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">{{ t('users.detail.country') }}:</span>
                            <span class="value">{{ user.address.country }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Professional -->
            <div class="detail-section">
                <h3 class="text-lg font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
                    {{ t('users.detail.professional') }}
                </h3>
                <div class="grid grid-cols-1 gap-3">
                    <div v-if="user.university" class="detail-item">
                        <span class="label">{{ t('users.detail.university') }}:</span>
                        <span class="value">{{ user.university }}</span>
                    </div>
                    <div v-if="user.company" class="detail-item">
                        <span class="label">{{ t('users.detail.company') }}:</span>
                        <span class="value">{{ user.company.name }}</span>
                    </div>
                    <div v-if="user.company" class="grid grid-cols-2 gap-3">
                        <div class="detail-item">
                            <span class="label">{{ t('users.detail.department') }}:</span>
                            <span class="value">{{ user.company.department }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">{{ t('users.detail.jobTitle') }}:</span>
                            <span class="value">{{ user.company.title }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<style scoped>
.user-detail {
    max-height: 70vh;
    overflow-y: auto;
}

.detail-section {
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.dark .detail-section {
    border-bottom-color: rgba(255, 255, 255, 0.06);
}

.detail-section:last-child {
    border-bottom: none;
}

.detail-item {
    display: flex;
    gap: 8px;
}

.detail-item .label {
    font-weight: 500;
    color: var(--text-light-text-secondary);
    min-width: 120px;
}

.dark .detail-item .label {
    color: var(--text-dark-text-secondary);
}

.detail-item .value {
    color: var(--text-light-text-primary);
    flex: 1;
}

.dark .detail-item .value {
    color: var(--text-dark-text-primary);
}
</style>
