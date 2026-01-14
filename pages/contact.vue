<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: ['auth'],
});

useSeo({
    title: 'Contact',
    description: 'Get in touch with us. View contact information and send messages.',
    keywords: 'contact, support, help, reach us, communication',
});

const { t } = useI18n();
</script>

<template>
    <div class="max-w-7xl mx-auto space-y-6">
        <h1 class="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
            {{ t('sidebar.menu.contact') }}
        </h1>

        <a-card>
            <p class="text-light-text-secondary dark:text-dark-text-secondary">
                Contact page content goes here
            </p>
        </a-card>
    </div>
</template>
