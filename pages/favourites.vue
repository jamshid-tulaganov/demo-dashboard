<script setup lang="ts">
import ProductCard from '~/widgets/ProductCard/ProductCard.vue';
import { useFavoritesStore } from '~/stores/favorites';
import { Icon, CardSkeleton } from '~/shared/ui';

definePageMeta({
    layout: 'default',
    middleware: ['auth'],
});

const { t } = useI18n();
const router = useRouter();
const favoritesStore = useFavoritesStore();
const loading = ref(true);

// Load favorites on mount
onMounted(async () => {
    loading.value = true;
    await favoritesStore.loadFavorites();
    // Small delay to show the skeleton
    setTimeout(() => {
        loading.value = false;
    }, 300);
});

const favorites = computed(() => favoritesStore.getFavorites);
const hasFavorites = computed(() => favorites.value.length > 0);

const goToProducts = () => {
    router.push('/products');
};
</script>

<template>
    <div class="space-y-4 md:space-y-6">
        <!-- Page Title with Count -->
        <div class="flex items-center justify-between">
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-light-text-primary dark:text-dark-text-primary">
                {{ t('sidebar.menu.favourites') }}
                <span
                    v-if="hasFavorites"
                    class="text-lg sm:text-xl text-light-text-secondary dark:text-dark-text-secondary ml-2"
                >
                    ({{ favorites.length }})
                </span>
            </h1>
        </div>

        <!-- Favorites Grid -->
        <CardSkeleton v-if="loading" :count="8" :cols="4" />
        <div v-else-if="hasFavorites">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
                <ProductCard
                    v-for="product in favorites"
                    :key="product.id"
                    :product="product"
                />
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
            <div class="flex flex-col items-center gap-4">
                <Icon name="empty-like" :size="80" class="text-light-text-tertiary dark:text-dark-text-secondary opacity-50" />
                <h3 class="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
                    {{ t('favorites.empty') }}
                </h3>
                <p class="text-light-text-secondary dark:text-dark-text-secondary">
                    {{ t('favorites.emptyDescription') }}
                </p>
                <button
                    @click="goToProducts"
                    class="bg-orange hover:bg-orange/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300 flex items-center gap-2 mt-4"
                >
                    {{ t('favorites.browseProducts') }}
                    <Icon name="arrow-right" :size="20" />
                </button>
            </div>
        </div>
    </div>
</template>
