import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSidebarStore = defineStore('sidebar', () => {
    const collapsed = ref(false);
    const mobileMenuOpen = ref(false);

    function toggleCollapsed() {
        collapsed.value = !collapsed.value;
    }

    function toggleMobileMenu() {
        mobileMenuOpen.value = !mobileMenuOpen.value;
    }

    function closeMobileMenu() {
        mobileMenuOpen.value = false;
    }

    function setCollapsed(value: boolean) {
        collapsed.value = value;
    }

    function setMobileMenuOpen(value: boolean) {
        mobileMenuOpen.value = value;
    }

    return {
        collapsed,
        mobileMenuOpen,
        toggleCollapsed,
        toggleMobileMenu,
        closeMobileMenu,
        setCollapsed,
        setMobileMenuOpen,
    };
});
