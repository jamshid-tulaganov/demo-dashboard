<script setup lang="ts">
import { useFavoritesStore } from '~/stores/favorites';
import { message } from 'ant-design-vue';
import { HeartFilled } from '@ant-design/icons-vue';

definePageMeta({
    layout: 'default',
    middleware: ['auth'],
});

useSeo({
    title: 'Favourites',
    description: 'View and manage your favorite products and items.',
    keywords: 'favourites, favorites, saved items, wishlist',
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

const removeFavorite = (product: any) => {
    favoritesStore.removeFromFavorites(product.id);
    message.success(t('favorites.removedFromFavorites'));
};
</script>

<template>
    <div class="space-y-4 md:space-y-6">
        <!-- Page Title with Count -->
        <div class="flex items-center justify-between">
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-light-text-primary dark:text-dark-text-primary d-flex items-center">
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
                <div v-for="product in favorites" :key="product.id" class="favorite-card-wrapper">
                    <ProductCard :product="product" />
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <a-alert
            v-else
            :message="t('favorites.empty')"
            :description="t('favorites.emptyDescription')"
            type="info"
            show-icon
            class="max-w-2xl"
        />
    </div>
</template>

<style scoped>
.favorite-card-wrapper {
    @apply flex flex-col gap-3;
}

.remove-favorite-btn {
    @apply mt-auto;
}
</style>
