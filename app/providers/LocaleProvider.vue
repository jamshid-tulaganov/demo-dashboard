<script setup lang="ts">
import { onMounted } from 'vue';
import { useLocale } from '~/shared/lib/i18n';

const { setLocale } = useLocale();

onMounted(() => {
    if (typeof window !== 'undefined') {
        const savedLocale = localStorage.getItem('locale');
        if (savedLocale) {
            setLocale(savedLocale);
        }
    }
});
</script>

<template>
    <slot />
</template>
