<script setup lang="ts">
import { useLocale } from '~/shared/lib/i18n';

const { locale, availableLocales, setLocale } = useLocale();
</script>

<template>
    <a-select
        v-model:value="locale"
        style="width: 150px"
        @change="setLocale"
    >
        <a-select-option
            v-for="loc in availableLocales"
            :key="loc.code"
            :value="loc.code"
        >
            {{ loc.flag }} {{ loc.name }}
        </a-select-option>
    </a-select>
</template>
