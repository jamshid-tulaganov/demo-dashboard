<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { Logo, Icon } from '~/shared/ui';
import { useSidebarStore } from '~/stores/sidebar';
import { storeToRefs } from 'pinia';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const sidebarStore = useSidebarStore();
const { collapsed, mobileMenuOpen } = storeToRefs(sidebarStore);

interface MenuItem {
    key: string;
    label: string;
    icon: string; // Icon name from /public/icons
    path: string;
}

interface MenuSection {
    title?: string;
    items: MenuItem[];
}

const menuSections: MenuSection[] = [
    {
        items: [
            { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/' },
            { key: 'products', label: 'Products', icon: 'products', path: '/products' },
            { key: 'favourites', label: 'Favourites', icon: 'favourites', path: '/favourites' },
            { key: 'inbox', label: 'Inbox', icon: 'inbox', path: '/inbox' },
            { key: 'order-lists', label: 'Order Lists', icon: 'orderLists', path: '/orders' },
            { key: 'product-stock', label: 'Product Stock', icon: 'productStock', path: '/stock' },
        ],
    },
    {
        title: 'Pages',
        items: [
            { key: 'pricing', label: 'Pricing', icon: 'pricing', path: '/pricing' },
            { key: 'calendar', label: 'Calendar', icon: 'calendar', path: '/calendar' },
            { key: 'todo', label: 'To-Do', icon: 'todo', path: '/todo' },
            { key: 'contact', label: 'Contact', icon: 'contact', path: '/contact' },
            { key: 'invoice', label: 'Invoice', icon: 'invoice', path: '/invoice' },
            { key: 'team', label: 'Team', icon: 'team', path: '/team' },
        ],
    },
];

const bottomItems: MenuItem[] = [
    { key: 'settings', label: 'Settings', icon: 'settings', path: '/settings' },
    { key: 'logout', label: 'Logout', icon: 'logout', path: '/logout' },
];

const isActive = (path: string) => {
    if (path === '/') {
        return route.path === '/';
    }
    return route.path.startsWith(path);
};

const handleNavigation = (item: MenuItem) => {
    if (item.key === 'logout') {
        router.push('/login');
    } else {
        router.push(item.path);
    }
    sidebarStore.closeMobileMenu();
};
</script>

<template>

    <!-- Sidebar -->
    <aside
        :class="[
            'h-screen bg-white dark:bg-dark-secondary transition-all duration-500 ease-in-out flex flex-col',
            'fixed lg:sticky top-0 z-40',
            collapsed ? 'w-20' : 'w-64',
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        ]"
    >
        <div class="px-4 py-6 overflow-hidden">
            <transition
                enter-active-class="transition-all duration-300 ease-in-out"
                leave-active-class="transition-all duration-300 ease-in-out"
                enter-from-class="opacity-0 -translate-x-4"
                enter-to-class="opacity-100 translate-x-0"
                leave-from-class="opacity-100 translate-x-0"
                leave-to-class="opacity-0 -translate-x-4"
                mode="out-in"
            >
                <div v-if="!collapsed" class="flex items-center gap-2">
                    <Logo :height="28" />
                </div>
                <div v-else class="flex justify-center">
                    <Logo :height="28" />
                </div>
            </transition>
        </div>

        <div class="flex-1 overflow-y-auto py-4">
            <div
                v-for="(section, sectionIndex) in menuSections"
                :key="sectionIndex"
                :class="[
                    'mb-4',
                    sectionIndex > 0 ? 'border-t border-gray-200 dark:border-dark-quaternary pt-4' : ''
                ]"
            >
                <transition
                    enter-active-class="transition-all duration-300 ease-in-out"
                    leave-active-class="transition-all duration-200 ease-in-out"
                    enter-from-class="opacity-0 -translate-x-2"
                    enter-to-class="opacity-100 translate-x-0"
                    leave-from-class="opacity-100 translate-x-0"
                    leave-to-class="opacity-0 -translate-x-2"
                >
                    <div
                        v-if="section.title && !collapsed"
                        class="px-4 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                        {{ t(`sidebar.sections.${section.title.toLowerCase()}`) }}
                    </div>
                </transition>

                <!-- Menu Items -->
                <nav class="space-y-1 px-2">
                    <button
                        v-for="item in section.items"
                        :key="item.key"
                        @click="handleNavigation(item)"
                        :class="[
                            'w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-500 ease-in-out relative overflow-hidden',
                            isActive(item.path)
                                ? 'bg-primary text-white font-medium shadow-sm'
                                : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-quaternary hover:text-light-text-primary dark:hover:text-dark-text-primary',
                            collapsed ? 'justify-center gap-0' : 'gap-3'
                        ]"
                        :title="collapsed ? t(`sidebar.menu.${item.key}`) : ''"
                    >
                        <Icon :name="item.icon" :size="20" class="shrink-0" />
                        <span
                            :class="[
                                'text-sm whitespace-nowrap transition-all duration-500 ease-in-out',
                                collapsed ? 'opacity-0 max-w-0 overflow-hidden' : 'opacity-100 max-w-[200px]'
                            ]"
                        >
                            {{ t(`sidebar.menu.${item.key}`) }}
                        </span>
                    </button>
                </nav>
            </div>
        </div>

        <div class="border-t border-gray-200 dark:border-dark-quaternary py-4 px-2 shrink-0">
            <nav class="space-y-1">
                <button
                    v-for="item in bottomItems"
                    :key="item.key"
                    @click="handleNavigation(item)"
                    :class="[
                        'w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-500 ease-in-out relative overflow-hidden',
                        item.key === 'logout'
                            ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                            : isActive(item.path)
                                ? 'bg-primary text-white font-medium shadow-sm'
                                : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-quaternary hover:text-light-text-primary dark:hover:text-dark-text-primary',
                        collapsed ? 'justify-center gap-0' : 'gap-3'
                    ]"
                    :title="collapsed ? t(`sidebar.menu.${item.key}`) : ''"
                >
                    <Icon :name="item.icon" :size="20" class="shrink-0" />
                    <span
                        :class="[
                            'text-sm whitespace-nowrap transition-all duration-500 ease-in-out',
                            collapsed ? 'opacity-0 max-w-0 overflow-hidden' : 'opacity-100 max-w-[200px]'
                        ]"
                    >
                        {{ t(`sidebar.menu.${item.key}`) }}
                    </span>
                </button>
            </nav>
        </div>
    </aside>
</template>
