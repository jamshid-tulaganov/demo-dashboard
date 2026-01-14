import { ref } from 'vue';

const collapsed = ref(false);
const mobileMenuOpen = ref(false);

export const useSidebar = () => {
    const toggleCollapsed = () => {
        collapsed.value = !collapsed.value;
    };

    const toggleMobileMenu = () => {
        mobileMenuOpen.value = !mobileMenuOpen.value;
    };

    const closeMobileMenu = () => {
        mobileMenuOpen.value = false;
    };

    return {
        collapsed,
        mobileMenuOpen,
        toggleCollapsed,
        toggleMobileMenu,
        closeMobileMenu,
    };
};
