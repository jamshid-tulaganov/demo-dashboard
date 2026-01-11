<script setup lang="ts">
import { useTheme } from '~/shared/lib/theme';

const { isDark, toggleTheme } = useTheme();
const { t } = useI18n();
</script>

<template>
    <a-button
        @click="toggleTheme"
        :title="t('theme.toggle')"
        size="large"
        class="flex items-center justify-center"
    >
        <span class="text-xl">
            {{ isDark ? '☀️' : '🌙' }}
        </span>
    </a-button>
</template>
