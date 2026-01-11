<script setup lang="ts">
import PromoSwiper from '~/widgets/PromoSwiper/PromoSwiper.vue';
import ProductCard from '~/widgets/ProductCard/ProductCard.vue';
import { useFavoritesStore } from '~/stores/favorites';
import { useProductsStore } from '~/stores/products';

definePageMeta({
    layout: 'default',
    middleware: ['auth'],
});

const { t } = useI18n();
const productsStore = useProductsStore();
const favoritesStore = useFavoritesStore();

const page = ref(0);
const products = computed(() => productsStore.getAllProducts);
const loading = computed(() => productsStore.isLoading);
const hasMore = computed(() => productsStore.hasMore);
const isLoadingMore = ref(false);

// Initialize products and favorites
onMounted(async () => {
    await productsStore.fetchProducts(20, 0);
    favoritesStore.loadFavorites();
});

// Infinite scroll handler
const loadMore = async () => {
    if (isLoadingMore.value || !hasMore.value) return;

    isLoadingMore.value = true;
    page.value += 1;

    await productsStore.fetchProducts(20, page.value * 20);
    isLoadingMore.value = false;
};

// Intersection observer for infinite scroll
const loadMoreTrigger = ref<HTMLElement | null>(null);

onMounted(() => {
    if (!process.client) return;

    const observer = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting && hasMore.value && !isLoadingMore.value) {
                loadMore();
            }
        },
        {
            threshold: 0.1,
        }
    );

    if (loadMoreTrigger.value) {
        observer.observe(loadMoreTrigger.value);
    }

    onBeforeUnmount(() => {
        observer.disconnect();
    });
});
</script>

<template>
    <div class="space-y-6">
        <!-- Page Title -->
        <h1 class="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
            {{ t('products.title') }}
        </h1>

        <!-- Promo Swiper -->
        <PromoSwiper />

        <!-- Products Grid -->
        <div v-if="loading && products.length === 0" class="text-center py-12">
            <a-spin size="large" />
            <p class="mt-4 text-light-text-secondary dark:text-dark-text-secondary">
                {{ t('products.loading') }}
            </p>
        </div>

        <div v-else>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <ProductCard
                    v-for="product in products"
                    :key="product.id"
                    :product="product"
                />
            </div>

            <!-- Load More Trigger -->
            <div
                v-if="hasMore"
                ref="loadMoreTrigger"
                class="flex justify-center py-8"
            >
                <a-spin v-if="isLoadingMore" />
                <p v-else class="text-light-text-secondary dark:text-dark-text-secondary">
                    {{ t('products.loadMore') }}
                </p>
            </div>

            <!-- End of List -->
            <div
                v-if="!hasMore && products.length > 0"
                class="text-center py-8 text-light-text-secondary dark:text-dark-text-secondary"
            >
                {{ t('common.noData') }}
            </div>
        </div>
    </div>
</template>
