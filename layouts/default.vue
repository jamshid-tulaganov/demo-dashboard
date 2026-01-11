<script setup lang="ts">
import { Header } from '~/widgets/Header';
import { Sidebar } from '~/widgets/Sidebar';
</script>

<template>
    <div class="flex min-h-screen bg-light-background dark:bg-dark-background">
        <Sidebar />
        <div class="flex-1 flex flex-col min-w-0">
            <Header />
            <main class="flex-1 flex-start justify-start p-[30px] overflow-auto bg-light-bg dark:bg-dark-primary">
                <slot />
            </main>
        </div>
    </div>
</template>
