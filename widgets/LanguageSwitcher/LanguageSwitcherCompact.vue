<script setup lang="ts">
const { locale, locales, setLocale } = useI18n();

const localeFlags: Record<string, string> = {
    en: '🇬🇧',
    ru: '🇷🇺',
    uz: '🇺🇿',
};

const availableLocales = computed(() =>
    locales.value.map((loc) => ({
        code: loc.code,
        name: loc.name,
        flag: localeFlags[loc.code] || '🌐',
    })),
);

const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
};
</script>

<template>
    <div class="w-full">
        <div class="grid grid-cols-3 gap-2">
            <button
                v-for="loc in availableLocales"
                :key="loc.code"
                @click="handleLocaleChange(loc.code)"
                :class="[
                    'flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg border transition-all',
                    locale === loc.code
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'border-gray-200 dark:border-dark-quaternary text-light-text-secondary dark:text-dark-text-secondary hover:border-primary'
                ]"
            >
                <span class="text-xl">{{ loc.flag }}</span>
                <span class="text-xs">{{ loc.name }}</span>
            </button>
        </div>
    </div>
</template>
