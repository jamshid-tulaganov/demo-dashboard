<script setup lang="ts">
import { Header } from '~/widgets/Header';
</script>

<template>
    <a-config-provider>
        <a-layout class="min-h-screen">
            <Header />
            <a-layout-content class="bg-gray-50">
                <NuxtPage />
            </a-layout-content>
        </a-layout>
    </a-config-provider>
</template>
