<script setup lang="ts">
import { useAuth } from '~/shared/lib';

definePageMeta({
    layout: 'default',
    middleware: ['auth'],
});

const { t } = useI18n();
const { user } = useAuth();
</script>

<template>
    <div class="max-w-7xl mx-auto space-y-6">
        <h1 class="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
            {{ t('header.profile.myProfile') }}
        </h1>

        <a-card :title="t('profile.personalInfo')">
            <div class="space-y-4">
                <div class="flex items-center gap-4">
                    <a-avatar :size="80" class="bg-primary">
                        {{ user?.username?.charAt(0).toUpperCase() || 'U' }}
                    </a-avatar>
                    <div>
                        <h2 class="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
                            {{ user?.username || 'User' }}
                        </h2>
                        <p class="text-light-text-secondary dark:text-dark-text-secondary">
                            {{ user?.email || 'user@example.com' }}
                        </p>
                    </div>
                </div>

                <a-divider />

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                            {{ t('profile.firstName') }}
                        </label>
                        <a-input :value="user?.firstName || 'John'" size="large" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                            {{ t('profile.lastName') }}
                        </label>
                        <a-input :value="user?.lastName || 'Doe'" size="large" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                            {{ t('profile.email') }}
                        </label>
                        <a-input :value="user?.email || 'user@example.com'" size="large" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                            {{ t('profile.phone') }}
                        </label>
                        <a-input value="+1 234 567 890" size="large" />
                    </div>
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <a-button size="large">
                        {{ t('common.cancel') }}
                    </a-button>
                    <a-button type="primary" size="large">
                        {{ t('common.save') }}
                    </a-button>
                </div>
            </div>
        </a-card>

        <a-card :title="t('profile.changePassword')">
            <div class="space-y-4 max-w-md">
                <div>
                    <label class="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                        {{ t('profile.currentPassword') }}
                    </label>
                    <a-input-password size="large" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                        {{ t('profile.newPassword') }}
                    </label>
                    <a-input-password size="large" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                        {{ t('profile.confirmPassword') }}
                    </label>
                    <a-input-password size="large" />
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <a-button size="large">
                        {{ t('common.cancel') }}
                    </a-button>
                    <a-button type="primary" size="large">
                        {{ t('common.save') }}
                    </a-button>
                </div>
            </div>
        </a-card>
    </div>
</template>
