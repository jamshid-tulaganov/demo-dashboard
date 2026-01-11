<script setup lang="ts">
import { ThemeProvider, LocaleProvider } from '~/app/providers';
</script>

<template>
    <ThemeProvider>
        <LocaleProvider>
            <NuxtLayout>
                <NuxtPage />
            </NuxtLayout>
        </LocaleProvider>
    </ThemeProvider>
</template>
