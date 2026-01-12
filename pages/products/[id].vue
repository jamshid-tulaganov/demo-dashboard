<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { Icon, LazyImage } from '~/shared/ui';
import { useFavoritesStore } from '~/stores/favorites';
import { useProductsStore } from '~/stores/products';
import EditProductModal from '~/widgets/EditProductModal/EditProductModal.vue';
import type { Product } from '~/stores/products';
import { message } from 'ant-design-vue';

definePageMeta({
    layout: 'default',
    middleware: ['auth'],
});

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const productsStore = useProductsStore();
const favoritesStore = useFavoritesStore();

const product = computed(() => productsStore.currentProduct);
const loading = computed(() => productsStore.isLoading);
const thumbsSwiper = ref<any>(null);
const modules = [Navigation, Pagination, Thumbs];
const showEditModal = ref(false);

const isFavorite = computed(() =>
    product.value ? favoritesStore.isFavorite(product.value.id) : false
);

const toggleFavorite = () => {
    if (product.value) {
        const wasFavorite = favoritesStore.isFavorite(product.value.id);
        favoritesStore.toggleFavorite(product.value);

        // Show toast notification
        if (wasFavorite) {
            message.info(t('favorites.removedFromFavorites'));
        } else {
            message.success(t('favorites.addedToFavorites'));
        }
    }
};

const openEditModal = () => {
    showEditModal.value = true;
};

const handleSaveProduct = (updatedProduct: Product) => {
    productsStore.updateProduct(updatedProduct);
};

const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push('filled');
        } else if (i === fullStars && hasHalfStar) {
            stars.push('half');
        } else {
            stars.push('empty');
        }
    }

    return stars;
};

onMounted(async () => {
    const productId = parseInt(route.params.id as string);
    if (!isNaN(productId)) {
        await productsStore.fetchProductById(productId);
    }
    favoritesStore.loadFavorites();
});
</script>

<template>
    <div class="space-y-6">
        <!-- Back Button -->
        <button
            @click="router.push('/products')"
            class="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
            <Icon name="arrow-left" :size="20" />
            {{ t('products.detail.backToProducts') }}
        </button>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12">
            <a-spin size="large" />
        </div>

        <!-- Product Detail -->
        <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Image Gallery -->
            <div class="space-y-4">
                <!-- Main Swiper -->
                <Swiper
                    :modules="modules"
                    :slides-per-view="1"
                    :space-between="10"
                    :navigation="true"
                    :pagination="{
                        clickable: true,
                    }"
                    :thumbs="{ swiper: thumbsSwiper }"
                    class="main-swiper rounded-lg overflow-hidden"
                >
                    <SwiperSlide v-for="(image, index) in product.images" :key="index">
                        <LazyImage
                            :src="image"
                            :alt="`${product.title} - ${index + 1}`"
                            class="w-full h-96 object-cover"
                            width="600"
                            height="384"
                        />
                    </SwiperSlide>
                </Swiper>

                <!-- Thumbnail Swiper -->
                <Swiper
                    @swiper="thumbsSwiper = $event"
                    :modules="modules"
                    :slides-per-view="4"
                    :space-between="10"
                    :watch-slides-progress="true"
                    class="thumbs-swiper"
                >
                    <SwiperSlide v-for="(image, index) in product.images" :key="index">
                        <LazyImage
                            :src="image"
                            :alt="`${product.title} thumbnail - ${index + 1}`"
                            class="w-full h-20 object-cover rounded-lg cursor-pointer"
                            width="120"
                            height="80"
                        />
                    </SwiperSlide>
                </Swiper>
            </div>

            <!-- Product Info -->
            <div class="space-y-6">
                <!-- Title and Favorite -->
                <div class="flex items-start justify-between">
                    <h1
                        class="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary"
                    >
                        {{ product.title }}
                    </h1>
                    <button
                        @click="toggleFavorite"
                        class="p-2 rounded-full hover:bg-light-bg dark:hover:bg-dark-tertiary transition-colors"
                    >
                        <Icon
                            :name="isFavorite ? 'filled-like' : 'empty-like'"
                            :size="24"
                            :class="
                                isFavorite
                                    ? 'text-red'
                                    : 'text-light-text-tertiary dark:text-dark-text-secondary'
                            "
                        />
                    </button>
                </div>

                <!-- Price and Rating -->
                <div class="flex items-center gap-6">
                    <div class="text-3xl font-bold text-green">
                        ${{ product.price.toFixed(2) }}
                    </div>
                    <div v-if="product.discountPercentage > 0" class="flex items-center gap-2">
                        <span class="text-lg line-through text-light-text-tertiary dark:text-dark-text-secondary">
                            ${{
                                (
                                    product.price /
                                    (1 - product.discountPercentage / 100)
                                ).toFixed(2)
                            }}
                        </span>
                        <span class="bg-red-light text-red px-2 py-1 rounded-md text-sm font-semibold">
                            -{{ product.discountPercentage }}%
                        </span>
                    </div>
                </div>

                <!-- Rating -->
                <div class="flex items-center gap-2">
                    <div class="flex items-center gap-1">
                        <Icon
                            v-for="(star, index) in renderStars(product.rating)"
                            :key="index"
                            :name="star === 'filled' ? 'filled-star' : 'empty-start'"
                            :size="20"
                            :class="
                                star === 'filled'
                                    ? 'text-orange'
                                    : 'text-light-text-tertiary dark:text-dark-text-secondary'
                            "
                        />
                    </div>
                    <span class="text-light-text-secondary dark:text-dark-text-secondary">
                        {{ product.rating }} {{ t('products.detail.rating') }}
                    </span>
                </div>

                <!-- Product Details -->
                <div class="space-y-3">
                    <div class="flex items-center gap-2">
                        <span class="font-semibold text-light-text-primary dark:text-dark-text-primary">
                            {{ t('products.detail.brand') }}:
                        </span>
                        <span class="text-light-text-secondary dark:text-dark-text-secondary">
                            {{ product.brand }}
                        </span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="font-semibold text-light-text-primary dark:text-dark-text-primary">
                            {{ t('products.detail.category') }}:
                        </span>
                        <span class="text-light-text-secondary dark:text-dark-text-secondary">
                            {{ product.category }}
                        </span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="font-semibold text-light-text-primary dark:text-dark-text-primary">
                            {{ t('products.detail.stock') }}:
                        </span>
                        <span
                            :class="
                                product.stock > 0
                                    ? 'text-green'
                                    : 'text-red'
                            "
                        >
                            {{ product.stock }} {{ t('common.items') }}
                        </span>
                    </div>
                </div>

                <!-- Description -->
                <div>
                    <h3 class="font-semibold text-lg text-light-text-primary dark:text-dark-text-primary mb-2">
                        {{ t('products.detail.description') }}
                    </h3>
                    <p class="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                        {{ product.description }}
                    </p>
                </div>

                <!-- Edit Button -->
                <button
                    @click="openEditModal"
                    class="w-full bg-orange hover:bg-orange/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
                >
                    {{ t('products.editProduct') }}
                    <Icon name="arrow-right" :size="20" />
                </button>
            </div>
        </div>

        <!-- Error State -->
        <div v-else class="text-center py-12">
            <p class="text-red text-lg">{{ t('errors.notFound') }}</p>
        </div>

        <!-- Edit Product Modal -->
        <EditProductModal
            v-model:visible="showEditModal"
            :product="product"
            @save="handleSaveProduct"
        />
    </div>
</template>

<style scoped>
.main-swiper :deep(.swiper-button-next),
.main-swiper :deep(.swiper-button-prev) {
    @apply text-light-text-primary dark:text-dark-text-primary;
    @apply w-10 h-10;
    @apply bg-light-menu/80 dark:bg-dark-secondary/80;
    @apply rounded-full;
}

.main-swiper :deep(.swiper-button-next):after,
.main-swiper :deep(.swiper-button-prev):after {
    @apply text-sm;
}

.main-swiper :deep(.swiper-pagination-bullet) {
    @apply bg-light-text-tertiary dark:bg-dark-text-secondary;
}

.main-swiper :deep(.swiper-pagination-bullet-active) {
    @apply bg-orange;
}

.thumbs-swiper :deep(.swiper-slide) {
    @apply opacity-50 transition-opacity;
}

.thumbs-swiper :deep(.swiper-slide-thumb-active) {
    @apply opacity-100;
}
</style>
