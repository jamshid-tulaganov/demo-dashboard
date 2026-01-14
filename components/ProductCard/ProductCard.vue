<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import type { Product } from '~/stores/products';
import { useFavoritesStore } from '~/stores/favorites';
import { message } from 'ant-design-vue';

interface ProductCardProps {
    product: Product;
}

const props = defineProps<ProductCardProps>();

const { t } = useI18n();
const favoritesStore = useFavoritesStore();
const router = useRouter();

const modules = [Pagination];
const showImageModal = ref(false);
const selectedImageIndex = ref(0);

const isFavorite = computed(() => favoritesStore.isFavorite(props.product.id));

const toggleFavorite = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();

    const wasFavorite = isFavorite.value;
    favoritesStore.toggleFavorite(props.product);

    if (wasFavorite) {
        message.info(t('favorites.removedFromFavorites'));
    } else {
        message.success(t('favorites.addedToFavorites'));
    }
};

const openImageModal = (index: number, e: Event) => {
    e.stopPropagation();
    selectedImageIndex.value = index;
    showImageModal.value = true;
};

const goToProduct = () => {
    router.push(`/products/${props.product.id}`);
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
</script>

<template>
    <a-card :bordered="false" class="product-card" @click="goToProduct">
        <!-- Image Swiper -->
        <div class="product-images relative" @click.stop>
            <Swiper
                :modules="modules"
                :slides-per-view="1"
                :space-between="0"
                :pagination="{
                    clickable: true,
                    dynamicBullets: false,
                }"
                :loop="false"
                :allow-touch-move="true"
                class="product-swiper"
                @click.stop
            >
                <SwiperSlide
                    v-for="(image, index) in product.images"
                    :key="`${product.id}-${index}`"
                >
                    <div
                        class="image-container"
                        @click.stop="openImageModal(index, $event)"
                    >
                        <img
                            :src="image"
                            :alt="`${product.title} - ${index + 1}`"
                            class="w-full h-48 object-cover rounded-t-lg"
                            width="300"
                            height="192"
                            loading="lazy"
                            referrerpolicy="no-referrer"
                        />
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>

        <!-- Product Info -->
        <div class="p-4 space-y-3">
            <!-- Product Name -->
            <div class="flex items-start justify-between gap-2">
                <h3
                    class="text-base font-semibold text-light-text-primary dark:text-dark-text-primary line-clamp-2 flex-1"
                >
                    {{ product.title }}
                </h3>
            </div>

            <!-- Price and Rating -->
            <div class="flex items-center justify-between">
                <span class="text-xl font-bold text-green">
                    ${{ product.price.toFixed(2) }}
                </span>

                <!-- Rating -->
                <div class="flex items-center gap-1">
                    <Icon
                        v-for="(star, index) in renderStars(product.rating)"
                        :key="index"
                        :name="star === 'filled' ? 'filled-star' : 'empty-start'"
                        :size="16"
                        :class="star === 'filled' ? 'text-orange' : 'text-light-text-tertiary dark:text-dark-text-secondary'"
                    />
                    <span class="text-xs text-light-text-secondary dark:text-dark-text-secondary ml-1">
                        ({{ product.rating }})
                    </span>
                </div>
            </div>

            <!-- Dislike/View Product Button -->
            <button
                v-if="isFavorite"
                class="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                @click.stop.prevent="toggleFavorite"
            >
                {{ t('products.removeFromFavorites') }}
            </button>
            <button
                v-else
                class="w-full bg-orange hover:bg-orange/90 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                @click.stop="goToProduct"
            >
                {{ t('common.edit') }}
            </button>
        </div>

        <!-- Image Modal -->
        <ImageModal
            v-model:open="showImageModal"
            :images="product.images"
            :initial-index="selectedImageIndex"
        />
    </a-card>
</template>

<style scoped>
.product-card {
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply border-0;
    @apply cursor-pointer;
    @apply transition-all duration-300;
    @apply hover:shadow-xl;
    @apply hover:scale-[1.02];
}

.product-card :deep(.ant-card-body) {
    @apply p-0;
}

.product-images {
    @apply min-h-[200px] relative;
    @apply overflow-hidden;
}

.product-swiper {
    @apply w-full h-full;
}

.product-swiper :deep(.swiper-wrapper) {
    @apply h-48;
}

.product-swiper :deep(.swiper-slide) {
    @apply h-48;
}

.product-swiper :deep(.swiper-pagination) {
    @apply bottom-3;
    @apply z-10;
    @apply pointer-events-auto;
}

.product-swiper :deep(.swiper-pagination-bullet) {
    @apply bg-white;
    @apply w-2 h-2;
    @apply opacity-70;
    @apply shadow-md;
    @apply cursor-pointer;
    @apply transition-all duration-300;
}

.product-swiper :deep(.swiper-pagination-bullet-active) {
    @apply bg-orange;
    @apply w-6;
    @apply rounded-full;
    @apply opacity-100;
}

.product-swiper :deep(.swiper-pagination-bullet:hover) {
    @apply opacity-100 scale-110;
}

.image-container {
    @apply w-full h-full;
    @apply cursor-zoom-in;
}

.favorite-btn:active {
    @apply scale-95;
}
</style>
