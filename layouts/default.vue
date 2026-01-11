<script setup lang="ts">
import { Header } from '~/widgets/Header';
</script>

<template>
    <a-layout class="min-h-screen">
        <Header />
        <a-layout-content class="bg-light-bg dark:bg-dark-primary p-6">
            <slot />
        </a-layout-content>
    </a-layout>
</template>
