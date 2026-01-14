<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import dayjs from 'dayjs';

const { t } = useI18n();

const modules = [Autoplay, Pagination, Navigation];

const promoSlides = [
    {
        date: dayjs().format('MMMM D, YYYY'),
        title: t('products.promo.title1'),
        subtitle: t('products.promo.subtitle1'),
        buttonText: t('products.promo.getStarted'),
        bgColor: 'bg-gradient-to-r from-orange/20 to-orange-light',
    },
    {
        date: dayjs().format('MMMM D, YYYY'),
        title: t('products.promo.title2'),
        subtitle: t('products.promo.subtitle2'),
        buttonText: t('products.promo.getStarted'),
        bgColor: 'bg-gradient-to-r from-primary/20 to-purple-light',
    },
    {
        date: dayjs().format('MMMM D, YYYY'),
        title: t('products.promo.title3'),
        subtitle: t('products.promo.subtitle3'),
        buttonText: t('products.promo.getStarted'),
        bgColor: 'bg-gradient-to-r from-green-light to-primary/20',
    },
];
</script>

<template>
    <div class="promo-swiper-container">
        <Swiper
            :modules="modules"
            :slides-per-view="1"
            :space-between="20"
            :loop="true"
            :autoplay="{
                delay: 5000,
                disableOnInteraction: false,
            }"
            :pagination="{
                clickable: true,
            }"
            :navigation="true"
            class="promo-swiper"
        >
            <SwiperSlide v-for="(slide, index) in promoSlides" :key="index">
                <div
                    :class="[
                        'promo-slide rounded-2xl p-8 md:p-12',
                        slide.bgColor,
                    ]"
                >
                    <div class="max-w-2xl">
                        <p
                            class="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-4"
                        >
                            {{ slide.date }}
                        </p>
                        <h2
                            class="text-3xl md:text-5xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4 leading-tight"
                        >
                            {{ slide.title }}
                        </h2>
                        <p
                            class="text-base md:text-lg text-light-text-secondary dark:text-dark-text-secondary mb-6"
                        >
                            {{ slide.subtitle }}
                        </p>
                        <button
                            class="bg-orange hover:bg-orange/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300 flex items-center gap-2"
                        >
                            {{ slide.buttonText }}
                            <Icon name="arrow-right" :size="20" />
                        </button>
                    </div>
                </div>
            </SwiperSlide>
        </Swiper>
    </div>
</template>

<style scoped>
.promo-swiper-container {
    @apply w-full;
}

.promo-swiper {
    @apply w-full h-full;
}

.promo-slide {
    @apply min-h-[300px] md:min-h-[350px] flex items-center;
}

/* Swiper pagination styling */
.promo-swiper :deep(.swiper-pagination) {
    @apply bottom-4;
}

.promo-swiper :deep(.swiper-pagination-bullet) {
    @apply bg-light-text-tertiary dark:bg-dark-text-secondary;
    @apply opacity-50;
    @apply w-2 h-2;
}

.promo-swiper :deep(.swiper-pagination-bullet-active) {
    @apply bg-orange opacity-100;
    @apply w-8;
    @apply rounded-full;
}

/* Swiper navigation styling */
.promo-swiper :deep(.swiper-button-next),
.promo-swiper :deep(.swiper-button-prev) {
    @apply text-light-text-primary dark:text-dark-text-primary;
    @apply w-10 h-10;
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply rounded-full;
    @apply shadow-lg;
}

.promo-swiper :deep(.swiper-button-next):after,
.promo-swiper :deep(.swiper-button-prev):after {
    @apply text-sm;
}

.promo-swiper :deep(.swiper-button-next):hover,
.promo-swiper :deep(.swiper-button-prev):hover {
    @apply bg-orange text-white;
}
</style>
