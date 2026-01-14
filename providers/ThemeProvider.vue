<script setup lang="ts">
import { ConfigProvider, theme } from 'ant-design-vue';

const { isDark, themeConfig } = useTheme();
</script>

<template>
    <ConfigProvider :theme="themeConfig">
        <div :class="{ dark: isDark }">
            <slot />
        </div>
    </ConfigProvider>
</template>
