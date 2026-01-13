<script setup lang="ts">
import { ThemeProvider, LocaleProvider } from '~/providers';
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

<style>
/* Global thin scrollbar styles for all browsers */

/* Firefox */
* {
    scrollbar-width: thin;
    scrollbar-color: rgba(100, 100, 100, 0.3) transparent;
}

.dark * {
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

/* Webkit browsers (Chrome, Safari, Edge) */
*::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

*::-webkit-scrollbar-track {
    background: transparent;
}

*::-webkit-scrollbar-thumb {
    background-color: rgba(100, 100, 100, 0.3);
    border-radius: 3px;
}

*::-webkit-scrollbar-thumb:hover {
    background-color: rgba(100, 100, 100, 0.5);
}

/* Dark mode scrollbar for Webkit */
.dark *::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
}

.dark *::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.3);
}
</style>
