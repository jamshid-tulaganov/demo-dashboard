<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/shared/lib';
import { useSidebarStore } from '~/stores/sidebar';
import LanguageSwitcher from '~/widgets/LanguageSwitcher/LanguageSwitcher.vue';
import ThemeSwitcher from '~/widgets/ThemeSwitcher/ThemeSwitcher.vue';
import LanguageSwitcherCompact from '~/widgets/LanguageSwitcher/LanguageSwitcherCompact.vue';
import ThemeSwitcherCompact from '~/widgets/ThemeSwitcher/ThemeSwitcherCompact.vue';
import { SearchModal } from '~/widgets/SearchModal';
import { Icon } from '~/shared/ui';

const { t } = useI18n();
const { logout, user } = useAuth();
const router = useRouter();
const sidebarStore = useSidebarStore();

const searchModalVisible = ref(false);
const showLogoutModal = ref(false);
const notificationCount = ref(5);

const handleLogout = async () => {
    showLogoutModal.value = false;
    await logout();
};

const openSearchModal = () => {
    searchModalVisible.value = true;
};

const handleProfileMenuClick = (key: string) => {
    if (key === 'profile') {
        router.push('/profile');
    } else if (key === 'settings') {
        router.push('/settings');
    } else if (key === 'logout') {
        showLogoutModal.value = true;
    }
};
</script>

<template>
    <header class="bg-white dark:bg-dark-secondary px-4 lg:px-6 py-3 lg:py-4 sticky top-0 z-30">
        <div class="flex items-center justify-between gap-2 lg:gap-4">
            <!-- Left Side: Burger Menu & Search -->
            <div class="flex items-center gap-2 lg:gap-4 flex-1 min-w-0">
                <!-- Sidebar Toggle (Desktop - Collapse/Expand) -->
                <a-button type="text" size="large" @click="sidebarStore.toggleCollapsed"
                    class="hidden lg:flex items-center justify-center hover:bg-gray-100 dark:hover:bg-dark-quaternary transition-all duration-300 p-2">
                    <Icon name="burger-menu" :size="24"
                        class="text-light-text-secondary dark:text-dark-text-secondary transition-all duration-300" />
                </a-button>

                <!-- Sidebar Toggle (Mobile - Open/Close) -->
                <a-button type="text" size="large" @click="sidebarStore.toggleMobileMenu"
                    class="lg:hidden flex items-center justify-center hover:bg-gray-100 dark:hover:bg-dark-quaternary transition-all duration-300 p-2">
                    <Icon name="burger-menu" :size="24"
                        class="text-light-text-secondary dark:text-dark-text-secondary transition-all duration-300" />
                </a-button>

                <!-- Desktop Search Bar (Click to open modal) -->
                <div class="hidden md:block flex-1 max-w-md">
                    <div @click="openSearchModal"
                        class="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-dark-quaternary hover:border-primary cursor-pointer transition-all bg-gray-50 dark:bg-dark-tertiary">
                        <Icon name="search" :size="18" class="text-gray-400 !dark:text-dark-text-secondary" />
                        <span class="text-sm text-gray-400 dark:text-dark-text-secondary">{{
                            t('header.search.placeholder') }}</span>
                        <div class="ml-auto flex items-center gap-1">
                            <kbd
                                class="hidden lg:inline-block px-2 py-0.5 text-xs bg-white dark:bg-dark-quaternary rounded border border-gray-200 dark:border-dark-quaternary dark:text-dark-text-primary">
                                Ctrl
                            </kbd>
                            <kbd
                                class="hidden lg:inline-block px-2 py-0.5 text-xs bg-white dark:bg-dark-quaternary rounded border border-gray-200 dark:border-dark-quaternary dark:text-dark-text-primary">
                                K
                            </kbd>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-1 lg:gap-2">
                <a-button type="text" size="large" @click="openSearchModal"
                    class="md:hidden flex items-center justify-center p-2">
                    <Icon name="search" :size="20" class="text-light-text-secondary dark:text-dark-text-secondary" />
                </a-button>

                <!-- Notifications -->
                <a-badge :count="notificationCount" :overflow-count="99">
                    <a-button type="text" size="large" class="flex items-center justify-center p-2">
                        <Icon name="notification" :size="20"
                            class="text-light-text-secondary dark:text-dark-text-secondary" />
                    </a-button>
                </a-badge>

                <!-- Desktop Only: Language Switcher -->
                <div class="hidden lg:block">
                    <LanguageSwitcher />
                </div>

                <!-- Desktop Only: Theme Switcher -->
                <div class="hidden lg:block">
                    <ThemeSwitcher />
                </div>

                <!-- Profile Dropdown -->
                <a-dropdown placement="bottomRight" :trigger="['click']">
                    <a-button type="text" size="large" class="flex items-center gap-2 px-2">
                        <a-avatar v-if="user?.image" :src="user.image" :size="32" />
                        <a-avatar v-else :size="32" class="bg-primary">
                            {{ user?.username?.charAt(0).toUpperCase() || 'U' }}
                        </a-avatar>
                        <span class="hidden lg:inline text-light-text-primary dark:text-dark-text-primary font-medium">
                            {{ user?.username || 'User' }}
                        </span>
                    </a-button>
                    <template #overlay>
                        <a-menu @click="({ key }) => handleProfileMenuClick(key)" class="min-w-[220px]">
                            <!-- Profile Info -->
                            <div class="px-4 py-3 border-b border-gray-200 dark:border-dark-quaternary">
                                <div class="flex items-center gap-3">
                                    <a-avatar v-if="user?.image" :src="user.image" :size="40" />
                                    <a-avatar v-else :size="40" class="bg-primary">
                                        {{ user?.username?.charAt(0).toUpperCase() || 'U' }}
                                    </a-avatar>
                                    <div>
                                        <div class="font-medium text-light-text-primary dark:text-dark-text-primary">
                                            {{ user?.username || 'User' }}
                                        </div>
                                        <div class="text-xs text-gray-400">
                                            {{ user?.email || 'user@example.com' }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- My Profile -->
                            <a-menu-item key="profile">
                                <div class="flex items-center gap-3 py-1">
                                    <Icon name="profile" :size="18" />
                                    <span>{{ t('header.profile.myProfile') }}</span>
                                </div>
                            </a-menu-item>

                            <!-- Mobile/Tablet Only: Theme & Language Switchers -->
                            <div class="lg:hidden">
                                <a-menu-divider />

                                <!-- Theme Switcher in Menu (Mobile/Tablet) -->
                                <div class="px-4 py-3">
                                    <div
                                        class="text-xs font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                                        {{ t('header.profile.theme') }}
                                    </div>
                                    <ThemeSwitcherCompact />
                                </div>

                                <!-- Language Switcher in Menu (Mobile/Tablet) -->
                                <div class="px-4 py-3">
                                    <div
                                        class="text-xs font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                                        {{ t('header.profile.language') }}
                                    </div>
                                    <LanguageSwitcherCompact />
                                </div>
                            </div>

                            <a-menu-divider />

                            <!-- Settings -->
                            <a-menu-item key="settings">
                                <div class="flex items-center gap-3 py-1">
                                    <Icon name="settings" :size="18" />
                                    <span>{{ t('sidebar.menu.settings') }}</span>
                                </div>
                            </a-menu-item>

                            <a-menu-divider />

                            <!-- Logout -->
                            <a-menu-item key="logout">
                                <div class="flex items-center gap-3 py-1 text-red-500">
                                    <Icon name="logout" :size="18" />
                                    <span>{{ t('sidebar.menu.logout') }}</span>
                                </div>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
        </div>
    </header>

    <!-- Search Modal -->
    <SearchModal v-model:open="searchModalVisible" />

    <!-- Logout Confirmation Modal -->
    <a-modal v-model:open="showLogoutModal" :title="t('auth.logout.title')" :ok-text="t('common.yes')"
        :cancel-text="t('common.no')" @ok="handleLogout" ok-type="danger">
        <p>{{ t('auth.logout.confirm') }}</p>
    </a-modal>
</template>
