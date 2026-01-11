<script setup lang="ts">
import { ref, computed } from 'vue';
import { Icon } from '~/shared/ui';

const props = defineProps<{
    visible: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
}>();

const { t } = useI18n();
const searchQuery = ref('');

// Recent searches from localStorage
const recentSearches = ref<string[]>([
    'Product inventory',
    'Customer analytics',
    'Sales report',
]);

// Popular/Most searched items
const popularSearches = ref<string[]>([
    'Dashboard overview',
    'Monthly revenue',
    'User management',
    'Invoice template',
]);

// Sample quick links
const quickLinks = ref([
    { title: 'Create New Product', icon: 'products', path: '/products/new' },
    { title: 'View Analytics', icon: 'line-chart', path: '/analytics' },
    { title: 'Team Members', icon: 'team', path: '/team' },
    { title: 'Settings', icon: 'settings', path: '/settings' },
]);

const handleClose = () => {
    emit('update:visible', false);
};

const handleSearch = (query: string) => {
    if (query.trim()) {
        // Add to recent searches
        if (!recentSearches.value.includes(query)) {
            recentSearches.value.unshift(query);
            if (recentSearches.value.length > 5) {
                recentSearches.value.pop();
            }
        }
        searchQuery.value = query;
        console.log('Searching for:', query);
        // Implement actual search logic here
    }
};

const removeRecentSearch = (index: number) => {
    recentSearches.value.splice(index, 1);
};

const clearAllRecent = () => {
    recentSearches.value = [];
};
</script>

<template>
    <a-modal
        :open="visible"
        :footer="null"
        :closable="false"
        :width="640"
        @cancel="handleClose"
        wrap-class-name="search-modal"
    >
        <div class="py-2">
            <!-- Search Input -->
            <div class="mb-6">
                <a-input
                    v-model:value="searchQuery"
                    size="large"
                    :placeholder="t('header.search.placeholder')"
                    @pressEnter="handleSearch(searchQuery)"
                    class="rounded-lg"
                    autofocus
                >
                    <template #prefix>
                        <Icon name="search" :size="20" class="text-gray-400" />
                    </template>
                    <template #suffix>
                        <a-button
                            v-if="searchQuery"
                            type="text"
                            size="small"
                            @click="searchQuery = ''"
                        >
                            <span class="text-gray-400">✕</span>
                        </a-button>
                    </template>
                </a-input>
            </div>

            <!-- Recent Searches -->
            <div v-if="recentSearches.length > 0" class="mb-6">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                        {{ t('search.recentSearches') }}
                    </h3>
                    <a-button
                        type="text"
                        size="small"
                        @click="clearAllRecent"
                        class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        {{ t('search.clearAll') }}
                    </a-button>
                </div>
                <div class="space-y-2">
                    <div
                        v-for="(item, index) in recentSearches"
                        :key="index"
                        class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-quaternary cursor-pointer group"
                        @click="handleSearch(item)"
                    >
                        <div class="flex items-center gap-3">
                            <Icon name="reset-time" :size="16" class="text-gray-400" />
                            <span class="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                {{ item }}
                            </span>
                        </div>
                        <a-button
                            type="text"
                            size="small"
                            @click.stop="removeRecentSearch(index)"
                            class="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <span class="text-gray-400">✕</span>
                        </a-button>
                    </div>
                </div>
            </div>

            <!-- Popular Searches -->
            <div class="mb-6">
                <h3 class="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
                    {{ t('search.popular') }}
                </h3>
                <div class="flex flex-wrap gap-2">
                    <a-tag
                        v-for="(item, index) in popularSearches"
                        :key="index"
                        @click="handleSearch(item)"
                        class="cursor-pointer hover:bg-primary hover:text-white transition-colors px-3 py-1"
                    >
                        {{ item }}
                    </a-tag>
                </div>
            </div>

            <!-- Quick Links -->
            <div>
                <h3 class="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
                    {{ t('search.quickLinks') }}
                </h3>
                <div class="grid grid-cols-2 gap-2">
                    <a
                        v-for="(link, index) in quickLinks"
                        :key="index"
                        :href="link.path"
                        class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-dark-quaternary hover:border-primary hover:bg-primary/5 transition-all"
                        @click="handleClose"
                    >
                        <Icon :name="link.icon" :size="20" class="text-primary" />
                        <span class="text-sm text-light-text-primary dark:text-dark-text-primary">
                            {{ link.title }}
                        </span>
                    </a>
                </div>
            </div>

            <!-- Keyboard Shortcuts Hint -->
            <div class="mt-6 pt-4 border-t border-gray-200 dark:border-dark-quaternary">
                <div class="flex items-center justify-center gap-4 text-xs text-gray-400">
                    <span class="flex items-center gap-1">
                        <kbd class="px-2 py-1 bg-gray-100 dark:bg-dark-quaternary rounded">Enter</kbd>
                        {{ t('search.toSearch') }}
                    </span>
                    <span class="flex items-center gap-1">
                        <kbd class="px-2 py-1 bg-gray-100 dark:bg-dark-quaternary rounded">Esc</kbd>
                        {{ t('search.toClose') }}
                    </span>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<style scoped>
:deep(.search-modal .ant-modal-content) {
    border-radius: 12px;
}
</style>
