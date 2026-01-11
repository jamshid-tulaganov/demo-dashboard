<script setup lang="ts">
import { Icon } from '~/shared/ui';

definePageMeta({
    layout: 'default',
    middleware: ['auth'],
});

const { t } = useI18n();
</script>

<template>
    <div class="max-w-7xl mx-auto space-y-6">
        <h1 class="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
            {{ t('dashboard.title') }}
        </h1>

        <!-- Welcome Card -->
        <a-card>
            <div class="flex items-center gap-3">
                <Icon name="home" :size="24" class="text-primary" />
                <p class="text-light-text-primary dark:text-dark-text-primary">
                    Welcome to your dashboard
                </p>
            </div>
        </a-card>

        <!-- Icon Examples -->
        <a-card title="Icon Examples">
            <div class="space-y-4">
                <div class="flex items-center gap-4 flex-wrap">
                    <div class="flex items-center gap-2">
                        <Icon name="home" />
                        <span class="text-light-text-secondary dark:text-dark-text-secondary">Home</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Icon name="settings" />
                        <span class="text-light-text-secondary dark:text-dark-text-secondary">Settings</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Icon name="user" />
                        <span class="text-light-text-secondary dark:text-dark-text-secondary">User</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Icon name="chart" />
                        <span class="text-light-text-secondary dark:text-dark-text-secondary">Chart</span>
                    </div>
                </div>

                <div class="border-t pt-4 dark:border-dark-quaternary">
                    <h3 class="font-semibold mb-3 text-light-text-primary dark:text-dark-text-primary">
                        Colored Icons
                    </h3>
                    <div class="flex items-center gap-4 flex-wrap">
                        <Icon name="home" class="text-primary" />
                        <Icon name="settings" class="text-green" />
                        <Icon name="user" class="text-purple" />
                        <Icon name="chart" class="text-orange" />
                    </div>
                </div>
            </div>
        </a-card>
    </div>
</template>