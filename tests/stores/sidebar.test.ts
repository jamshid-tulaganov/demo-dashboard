import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSidebarStore } from '~/stores/sidebar';

describe('Sidebar Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('should initialize with default values', () => {
        const store = useSidebarStore();

        expect(store.collapsed).toBe(false);
        expect(store.mobileMenuOpen).toBe(false);
    });

    it('should toggle collapsed state', () => {
        const store = useSidebarStore();

        expect(store.collapsed).toBe(false);

        store.toggleCollapsed();
        expect(store.collapsed).toBe(true);

        store.toggleCollapsed();
        expect(store.collapsed).toBe(false);
    });

    it('should toggle mobile menu state', () => {
        const store = useSidebarStore();

        expect(store.mobileMenuOpen).toBe(false);

        store.toggleMobileMenu();
        expect(store.mobileMenuOpen).toBe(true);

        store.toggleMobileMenu();
        expect(store.mobileMenuOpen).toBe(false);
    });

    it('should close mobile menu', () => {
        const store = useSidebarStore();

        store.setMobileMenuOpen(true);
        expect(store.mobileMenuOpen).toBe(true);

        store.closeMobileMenu();
        expect(store.mobileMenuOpen).toBe(false);
    });

    it('should set collapsed value directly', () => {
        const store = useSidebarStore();

        store.setCollapsed(true);
        expect(store.collapsed).toBe(true);

        store.setCollapsed(false);
        expect(store.collapsed).toBe(false);
    });

    it('should set mobile menu value directly', () => {
        const store = useSidebarStore();

        store.setMobileMenuOpen(true);
        expect(store.mobileMenuOpen).toBe(true);

        store.setMobileMenuOpen(false);
        expect(store.mobileMenuOpen).toBe(false);
    });

    it('should handle multiple toggle operations', () => {
        const store = useSidebarStore();

        // Perform multiple toggles
        store.toggleCollapsed(); // true
        store.toggleCollapsed(); // false
        store.toggleCollapsed(); // true

        expect(store.collapsed).toBe(true);
    });
});
