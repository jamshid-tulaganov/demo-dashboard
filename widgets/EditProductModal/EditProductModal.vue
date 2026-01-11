<script setup lang="ts">
import type { Product } from '~/stores/products';
import { message } from 'ant-design-vue';

interface EditProductModalProps {
    visible: boolean;
    product: Product | null;
}

const props = defineProps<EditProductModalProps>();
const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
    (e: 'save', product: Product): void;
}>();

const { t } = useI18n();

const formData = ref<Product | null>(null);
const saving = ref(false);

watch(
    () => props.product,
    (newProduct) => {
        if (newProduct) {
            formData.value = { ...newProduct };
        }
    },
    { immediate: true }
);

const closeModal = () => {
    emit('update:visible', false);
};

const handleSave = async () => {
    if (!formData.value) return;

    saving.value = true;

    try {
        // Simulate API call (DummyJSON doesn't support PUT, but we'll pretend)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Emit the updated product
        emit('save', formData.value);
        emit('update:visible', false);

        // Show success message
        message.success(t('products.editSuccess'));
    } catch (error) {
        console.error('Failed to update product:', error);
        message.error(t('messages.updateError'));
    } finally {
        saving.value = false;
    }
};
</script>

<template>
    <a-modal
        :open="visible"
        :title="t('products.editProduct')"
        :width="700"
        centered
        @cancel="closeModal"
    >
        <template #footer>
            <a-button @click="closeModal">{{ t('common.cancel') }}</a-button>
            <a-button type="primary" :loading="saving" @click="handleSave">
                {{ t('common.save') }}
            </a-button>
        </template>

        <a-form
            v-if="formData"
            layout="vertical"
            class="space-y-4"
        >
            <!-- Product Title -->
            <a-form-item :label="t('products.detail.productName')">
                <a-input
                    v-model:value="formData.title"
                    :placeholder="t('products.detail.productName')"
                    size="large"
                />
            </a-form-item>

            <!-- Brand and Category -->
            <div class="grid grid-cols-2 gap-4">
                <a-form-item :label="t('products.detail.brand')">
                    <a-input
                        v-model:value="formData.brand"
                        :placeholder="t('products.detail.brand')"
                        size="large"
                    />
                </a-form-item>

                <a-form-item :label="t('products.detail.category')">
                    <a-input
                        v-model:value="formData.category"
                        :placeholder="t('products.detail.category')"
                        size="large"
                    />
                </a-form-item>
            </div>

            <!-- Price and Stock -->
            <div class="grid grid-cols-2 gap-4">
                <a-form-item :label="t('products.detail.price')">
                    <a-input-number
                        v-model:value="formData.price"
                        :min="0"
                        :step="0.01"
                        :precision="2"
                        :placeholder="t('products.detail.price')"
                        size="large"
                        class="w-full"
                    />
                </a-form-item>

                <a-form-item :label="t('products.detail.stock')">
                    <a-input-number
                        v-model:value="formData.stock"
                        :min="0"
                        :placeholder="t('products.detail.stock')"
                        size="large"
                        class="w-full"
                    />
                </a-form-item>
            </div>

            <!-- Discount and Rating -->
            <div class="grid grid-cols-2 gap-4">
                <a-form-item :label="t('products.detail.discount')">
                    <a-input-number
                        v-model:value="formData.discountPercentage"
                        :min="0"
                        :max="100"
                        :step="0.1"
                        :precision="1"
                        :placeholder="t('products.detail.discount')"
                        suffix="%"
                        size="large"
                        class="w-full"
                    />
                </a-form-item>

                <a-form-item :label="t('products.detail.rating')">
                    <a-input-number
                        v-model:value="formData.rating"
                        :min="0"
                        :max="5"
                        :step="0.1"
                        :precision="1"
                        :placeholder="t('products.detail.rating')"
                        size="large"
                        class="w-full"
                    />
                </a-form-item>
            </div>

            <!-- Description -->
            <a-form-item :label="t('products.detail.description')">
                <a-textarea
                    v-model:value="formData.description"
                    :placeholder="t('products.detail.description')"
                    :rows="4"
                    size="large"
                />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<style scoped>
:deep(.ant-modal-content) {
    @apply bg-light-menu dark:bg-dark-secondary;
}

:deep(.ant-modal-header) {
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply border-b border-light-text-tertiary/10 dark:border-dark-quaternary/30;
}

:deep(.ant-modal-title) {
    @apply text-light-text-primary dark:text-dark-text-primary;
}

:deep(.ant-modal-close) {
    @apply text-light-text-primary dark:text-dark-text-primary;
}

:deep(.ant-form-item-label > label) {
    @apply text-light-text-primary dark:text-dark-text-primary;
}

:deep(.ant-input),
:deep(.ant-input-number),
:deep(.ant-textarea) {
    @apply bg-light-bg dark:bg-dark-tertiary;
    @apply text-light-text-primary dark:text-dark-text-primary;
    @apply border-light-text-tertiary/20 dark:border-dark-quaternary/30;
}
</style>
