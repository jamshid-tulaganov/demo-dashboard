<script setup lang="ts">
const tokenService = useTokenService()
const isReady = ref(false)

onMounted(() => {
    if (!tokenService.hasAccessToken()) {
        return
    }
    isReady.value = true
})
</script>

<template>
    {{   }}
    <main v-if="isReady">
        <div class="flex min-h-screen bg-light-background dark:bg-dark-background">
            <Sidebar />
            <div class="flex-1 flex flex-col min-w-0">
                <Header />
                <main class="flex-1 flex-start justify-start p-6 overflow-auto bg-light-bg dark:bg-dark-primary">
                    <div class="w-full max-w-[1920px] 2xl:max-w-[1920px] xl:max-w-[1560px] lg:max-w-[1200px]">
                        <slot />
                    </div>
                </main>
            </div>
        </div>
    </main>
    <div v-else class="loading-overlay d-flex items-center justify-center">
        <a-spin size="large" />
    </div>

</template>
