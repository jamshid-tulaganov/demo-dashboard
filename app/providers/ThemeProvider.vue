<script setup lang="ts">
import { ConfigProvider, theme } from 'ant-design-vue';
import { useTheme } from '~/shared/lib/theme';

const { isDark, themeConfig } = useTheme();
</script>

<template>
    <ConfigProvider :theme="themeConfig">
        <div :class="{ dark: isDark }">
            <slot />
        </div>
    </ConfigProvider>
</template>
