<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: ['auth'],
});

useSeo({
    title: 'Product Stock',
    description: 'Monitor and manage your product inventory and stock levels.',
    keywords: 'stock, inventory, product stock, warehouse, levels',
});

const { t } = useI18n();
</script>

<template>
    <div class="max-w-7xl mx-auto space-y-6">
        <h1 class="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
            {{ t('sidebar.menu.product-stock') }}
        </h1>

        <a-card>
            <p class="text-light-text-secondary dark:text-dark-text-secondary">
                Product Stock page content goes here
            </p>
        </a-card>
    </div>
</template>
