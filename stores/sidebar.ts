import { defineStore } from 'pinia';

export const useSidebarStore = defineStore('sidebar', {
    state: () => ({
        collapsed: false,
        mobileMenuOpen: false,
    }),

    actions: {
        toggleCollapsed() {
            this.collapsed = !this.collapsed;
        },

        toggleMobileMenu() {
            this.mobileMenuOpen = !this.mobileMenuOpen;
        },

        closeMobileMenu() {
            this.mobileMenuOpen = false;
        },

        setCollapsed(value: boolean) {
            this.collapsed = value;
        },

        setMobileMenuOpen(value: boolean) {
            this.mobileMenuOpen = value;
        },
    },
});
