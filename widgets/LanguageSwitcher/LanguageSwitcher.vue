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

const currentLocale = computed(() =>
    availableLocales.value.find((loc) => loc.code === locale.value)
);

const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
};
</script>

<template>
    <a-select
        :value="locale"
        style="width: 170px"
        size="large"
        @change="handleLocaleChange"
    >
        <template #suffixIcon>
            <span class="text-lg">{{ currentLocale?.flag }}</span>
        </template>
        <a-select-option
            v-for="loc in availableLocales"
            :key="loc.code"
            :value="loc.code"
        >
            <div class="flex items-center gap-2">
                <span class="text-lg">{{ loc.flag }}</span>
                <span>{{ loc.name }}</span>
            </div>
        </a-select-option>
    </a-select>
</template>
