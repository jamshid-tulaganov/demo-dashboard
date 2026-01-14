<script setup lang="ts">
</script>

<template>
    <ThemeTransition />
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.2s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: scale(0.8) rotate(-180deg);
}

.fade-leave-to {
    opacity: 0;
    transform: scale(0.8) rotate(180deg);
}
</style>
