<script setup lang="ts">
const { isDark, toggleTheme } = useTheme();
const { t } = useI18n();

const themeOptions = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
];

const currentTheme = computed(() => isDark.value ? 'dark' : 'light');

const handleThemeChange = (theme: string) => {
    if ((theme === 'dark' && !isDark.value) || (theme === 'light' && isDark.value)) {
        toggleTheme();
    }
};
</script>

<template>
    <div class="w-full">
        <div class="grid grid-cols-2 gap-2">
            <button
                v-for="option in themeOptions"
                :key="option.value"
                @click="handleThemeChange(option.value)"
                :class="[
                    'flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all',
                    currentTheme === option.value
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'border-gray-200 dark:border-dark-quaternary text-light-text-secondary dark:text-dark-text-secondary hover:border-primary'
                ]"
            >
                <span class="text-lg">{{ option.icon }}</span>
                <span class="text-sm">{{ option.label }}</span>
            </button>
        </div>

        <!-- Water Drop Animation -->
        <ThemeTransition />
    </div>
</template>
