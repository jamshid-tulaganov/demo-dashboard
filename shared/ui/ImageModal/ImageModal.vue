<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';

interface ImageModalProps {
    images: string[];
    initialIndex?: number;
    open: boolean;
}

const props = withDefaults(defineProps<ImageModalProps>(), {
    initialIndex: 0,
});

const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
}>();

const modules = [Navigation, Pagination, Zoom];

const closeModal = () => {
    emit('update:open', false);
};
</script>

<template>
    <a-modal
        :open="open"
        :footer="null"
        :width="900"
        centered
        @cancel="closeModal"
        class="image-modal"
    >
        <Swiper
            :modules="modules"
            :slides-per-view="1"
            :space-between="20"
            :navigation="true"
            :pagination="{
                clickable: true,
            }"
            :zoom="true"
            :initial-slide="initialIndex"
            class="image-modal-swiper"
        >
            <SwiperSlide v-for="(image, index) in images" :key="index">
                <div class="swiper-zoom-container">
                    <img
                        :src="image"
                        :alt="`Product image ${index + 1}`"
                        class="w-full h-auto max-h-[70vh] object-contain"
                    />
                </div>
            </SwiperSlide>
        </Swiper>
    </a-modal>
</template>

<style scoped>
.image-modal :deep(.ant-modal-content) {
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply p-4;
}

.image-modal :deep(.ant-modal-close) {
    @apply text-light-text-primary dark:text-dark-text-primary;
}

.image-modal-swiper {
    @apply w-full h-full;
}

.image-modal-swiper :deep(.swiper-button-next),
.image-modal-swiper :deep(.swiper-button-prev) {
    @apply text-light-text-primary dark:text-dark-text-primary;
    @apply w-10 h-10;
    @apply bg-light-menu/80 dark:bg-dark-secondary/80;
    @apply rounded-full;
    @apply shadow-lg;
}

.image-modal-swiper :deep(.swiper-button-next):after,
.image-modal-swiper :deep(.swiper-button-prev):after {
    @apply text-sm;
}

.image-modal-swiper :deep(.swiper-pagination) {
    @apply bottom-2;
}

.image-modal-swiper :deep(.swiper-pagination-bullet) {
    @apply bg-light-text-tertiary dark:bg-dark-text-secondary;
}

.image-modal-swiper :deep(.swiper-pagination-bullet-active) {
    @apply bg-primary;
}
</style>
