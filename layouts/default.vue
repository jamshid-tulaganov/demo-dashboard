<script setup lang="ts">
import { Header } from '~/widgets/Header';
import { Sidebar } from '~/widgets/Sidebar';
</script>

<template>
    <div class="flex min-h-screen bg-light-background dark:bg-dark-background">
        <Sidebar />
        <div class="flex-1 flex flex-col min-w-0">
            <Header />
            <main class="flex-1 flex-start justify-start p-4 sm:p-6 md:p-8 lg:p-[30px] overflow-auto bg-light-bg dark:bg-dark-primary">
                <div class="w-full max-w-[1920px] 2xl:max-w-[1600px] xl:max-w-[1400px] lg:max-w-[1200px] mx-auto">
                    <slot />
                </div>
            </main>
        </div>
    </div>
</template>
