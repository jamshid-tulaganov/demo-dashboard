<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: ['auth'],
});

useSeo({
    title: 'Settings',
    description: 'Configure your application settings and preferences.',
    keywords: 'settings, preferences, configuration, customize',
});

const { t } = useI18n();
</script>

<template>
    <div class="space-y-6">
        <h1 class="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
            {{ t('sidebar.menu.settings') }}
        </h1>

        <a-card>
            <p class="text-light-text-secondary dark:text-dark-text-secondary">
                Settings page content goes here
            </p>
        </a-card>
    </div>
</template>
