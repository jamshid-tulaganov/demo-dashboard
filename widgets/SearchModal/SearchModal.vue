<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon, LazyImage } from '~/shared/ui';
import { useSearchStore } from '~/stores/search';
import { debounce } from '~/shared/lib';

const props = defineProps<{
    open: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
}>();

const { t } = useI18n();
const router = useRouter();
const searchStore = useSearchStore();

const searchQuery = ref('');
const showResults = ref(false);

onMounted(() => {
    searchStore.loadRecentSearches();
});

const recentSearches = computed(() => searchStore.getRecentSearches);
const searchResults = computed(() => searchStore.getSearchResults);
const isSearching = computed(() => searchStore.isLoading);
const popularSearches = computed(() => searchStore.getPopularSearches());
const quickLinks = computed(() => searchStore.getQuickLinks());

const groupedResults = computed(() => {
    const groups: Record<string, typeof searchResults.value> = {
        products: [],
        users: [],
        pages: [],
    };

    searchResults.value.forEach(result => {
        if (groups[result.type + 's']) {
            groups[result.type + 's'].push(result);
        }
    });

    return groups;
});

const hasResults = computed(() => searchResults.value.length > 0);

const debouncedSearch = debounce(async (query: string) => {
    if (query.trim().length >= 2) {
        await searchStore.performSearch(query);
        showResults.value = true;
    } else {
        showResults.value = false;
        searchStore.searchResults = [];
    }
}, 300);

watch(searchQuery, (newQuery) => {
    debouncedSearch(newQuery);
});

watch(() => props.open, (isVisible) => {
    if (isVisible) {
        searchStore.loadRecentSearches();
    } else {
        setTimeout(() => {
            searchQuery.value = '';
            showResults.value = false;
            searchStore.searchResults = [];
        }, 200);
    }
});

const handleClose = () => {
    emit('update:open', false);
};

const handleSearch = async (query: string) => {
    if (query.trim()) {
        searchQuery.value = query;
        await searchStore.performSearch(query);
        showResults.value = true;
    }
};

const handleResultClick = (result: any) => {
    searchStore.addToRecentSearches(searchQuery.value);
    router.push(result.path);
    handleClose();
};

const handleQuickLinkClick = (link: any) => {
    router.push(link.path);
    handleClose();
};

const removeRecentSearch = (index: number) => {
    searchStore.removeRecentSearch(index);
};

const clearAllRecent = () => {
    searchStore.clearRecentSearches();
};

const getResultTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
        products: t('sidebar.menu.products'),
        users: t('navigation.users'),
        pages: 'Pages',
    };
    return labels[type] || type;
};
</script>

<template>
    <a-modal
        :open="open"
        :footer="null"
        :closable="false"
        :width="680"
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

            <!-- Search Results -->
            <div v-if="showResults && searchQuery" class="mb-6">
                <!-- Loading State -->
                <div v-if="isSearching" class="flex items-center justify-center py-8">
                    <a-spin size="large" />
                </div>

                <!-- Results -->
                <div v-else-if="hasResults" class="space-y-4 max-h-96 overflow-y-auto">
                    <!-- Products -->
                    <div v-if="groupedResults.products.length > 0">
                        <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                            {{ t('sidebar.menu.products') }}
                        </h3>
                        <div class="space-y-1">
                            <div
                                v-for="result in groupedResults.products"
                                :key="`product-${result.id}`"
                                @click="handleResultClick(result)"
                                class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-quaternary cursor-pointer transition-colors"
                            >
                                <LazyImage
                                    v-if="result.image"
                                    :src="result.image"
                                    :alt="result.title"
                                    class="w-12 h-12 object-cover rounded"
                                    width="48"
                                    height="48"
                                />
                                <Icon v-else :name="result.icon || 'products'" :size="20" class="text-primary" />
                                <div class="flex-1 min-w-0">
                                    <div class="font-medium text-sm text-light-text-primary dark:text-dark-text-primary truncate">
                                        {{ result.title }}
                                    </div>
                                    <div class="text-xs text-light-text-secondary dark:text-dark-text-secondary truncate">
                                        {{ result.description }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Users -->
                    <div v-if="groupedResults.users.length > 0">
                        <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                            {{ t('navigation.users') }}
                        </h3>
                        <div class="space-y-1">
                            <div
                                v-for="result in groupedResults.users"
                                :key="`user-${result.id}`"
                                @click="handleResultClick(result)"
                                class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-quaternary cursor-pointer transition-colors"
                            >
                                <LazyImage
                                    v-if="result.image"
                                    :src="result.image"
                                    :alt="result.title"
                                    class="w-10 h-10 object-cover rounded-full"
                                    width="40"
                                    height="40"
                                />
                                <Icon v-else :name="result.icon || 'user'" :size="20" class="text-primary" />
                                <div class="flex-1 min-w-0">
                                    <div class="font-medium text-sm text-light-text-primary dark:text-dark-text-primary truncate">
                                        {{ result.title }}
                                    </div>
                                    <div class="text-xs text-light-text-secondary dark:text-dark-text-secondary truncate">
                                        {{ result.description }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Pages -->
                    <div v-if="groupedResults.pages.length > 0">
                        <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                            Pages
                        </h3>
                        <div class="space-y-1">
                            <div
                                v-for="result in groupedResults.pages"
                                :key="`page-${result.id}`"
                                @click="handleResultClick(result)"
                                class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-quaternary cursor-pointer transition-colors"
                            >
                                <Icon :name="result.icon || 'dashboard'" :size="20" class="text-primary" />
                                <div class="flex-1 min-w-0">
                                    <div class="font-medium text-sm text-light-text-primary dark:text-dark-text-primary truncate">
                                        {{ result.title }}
                                    </div>
                                    <div class="text-xs text-light-text-secondary dark:text-dark-text-secondary truncate">
                                        {{ result.description }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- No Results -->
                <div v-else class="text-center py-8">
                    <Icon name="search" :size="48" class="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p class="text-sm text-gray-500 dark:text-gray-400">No results found for "{{ searchQuery }}"</p>
                </div>
            </div>

            <!-- Default View (when not searching) -->
            <div v-else>
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
                    <div class="space-y-1">
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
                        <div
                            v-for="(link, index) in quickLinks"
                            :key="index"
                            @click="handleQuickLinkClick(link)"
                            class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-dark-quaternary hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                        >
                            <Icon :name="link.icon" :size="20" class="text-primary" />
                            <span class="text-sm text-light-text-primary dark:text-dark-text-primary">
                                {{ link.title }}
                            </span>
                        </div>
                    </div>
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
