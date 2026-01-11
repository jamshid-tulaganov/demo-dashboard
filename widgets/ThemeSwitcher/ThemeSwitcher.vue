<script setup lang="ts">
import { SunOutlined, MoonOutlined } from '@ant-design/icons-vue';
import { useTheme } from '~/shared/lib/theme';
import { useLocale } from '~/shared/lib/i18n';

const { isDark, toggleTheme } = useTheme();
const { t } = useLocale();
</script>

<template>
    <a-button @click="toggleTheme" :title="t('theme.toggle')">
        <template #icon>
            <MoonOutlined v-if="!isDark" />
            <SunOutlined v-else />
        </template>
    </a-button>
</template>
