<script setup lang="ts">
import { useLocale, useAuth } from '~/shared/lib';
import { LanguageSwitcher } from '~/widgets/LanguageSwitcher';
import { ThemeSwitcher } from '~/widgets/ThemeSwitcher';
import { Logo } from '~/shared/ui';

const { t } = useLocale();
const { logout, user } = useAuth();

const handleLogout = async () => {
    await logout();
};
</script>

<template>
    <a-layout-header class="bg-light-menu dark:bg-dark-secondary shadow-sm px-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
            <Logo :height="36" />
            <div class="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
                {{ t('dashboard.title') }}
            </div>
        </div>
        <div class="flex items-center gap-4">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <a-dropdown>
                <a-button type="text" class="flex items-center gap-2">
                    <a-avatar v-if="user?.image" :src="user.image" :size="32" />
                    <a-avatar v-else :size="32">
                        {{ user?.username?.charAt(0).toUpperCase() }}
                    </a-avatar>
                    <span class="text-light-text-primary dark:text-dark-text-primary">
                        {{ user?.username || 'User' }}
                    </span>
                </a-button>
                <template #overlay>
                    <a-menu>
                        <a-menu-item key="logout" @click="handleLogout">
                            <span class="text-red-500">{{ t('auth.logout.title') }}</span>
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </div>
    </a-layout-header>
</template>
