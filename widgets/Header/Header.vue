<script setup lang="ts">
import { useLocale } from '~/shared/lib/i18n';
import { LanguageSwitcher } from '~/widgets/LanguageSwitcher';

const { t } = useLocale();
</script>

<template>
    <a-layout-header class="bg-white shadow-sm px-6 flex items-center justify-between">
        <div class="text-xl font-bold">
            {{ t('dashboard.title') }}
        </div>
        <div class="flex items-center gap-4">
            <LanguageSwitcher />
        </div>
    </a-layout-header>
</template>
