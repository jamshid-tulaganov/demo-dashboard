<script setup lang="ts">
const { isDark, toggleTheme } = useTheme();

const handleToggle = async (event: MouseEvent) => {
    // 1. Get click coordinates
    const x = event.clientX;
    const y = event.clientY;

    // 2. Calculate the distance to the furthest corner
    const endRadius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y)
    );

    // 3. Fallback for browsers (Safari/Firefox) that don't support View Transitions yet
    if (!document.startViewTransition) {
        toggleTheme();
        return;
    }

    // 4. Start the Transition
    const transition = document.startViewTransition(async () => {
        toggleTheme();
    });

    // 5. Animate the "New" state layer
    transition.ready.then(() => {
        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`,
                ],
            },
            {
                duration: 500,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                // This ensures we are animating the NEW theme layer over the OLD one
                pseudoElement: '::view-transition-new(root)',
            }
        );
    });
};
</script>

<template>
    <button @click="handleToggle" class="theme-btn" aria-label="Toggle Theme">
        <span v-if="isDark" class="icon">🌙</span>
        <span v-else class="icon">☀️</span>
    </button>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
    animation: none;
    mix-blend-mode: normal;
}

::view-transition-old(root) {
    z-index: 1;
}
::view-transition-new(root) {
    z-index: 9999;
}

.dark ::view-transition-old(root) {
    z-index: 1;
}
.dark ::view-transition-new(root) {
    z-index: 9999;
}
</style>

<style scoped>
.theme-btn {
    padding: 10px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.5rem;
    border: none;
    background: transparent;
    transition: transform 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.theme-btn:hover {
    transform: scale(1.1);
}

.icon {
    line-height: 1;
    display: inline-block;
}
</style>