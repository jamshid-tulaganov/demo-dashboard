<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import type { Product } from '~/stores/products';
import ProductForm from '~/widgets/ProductForm/ProductForm.vue';

interface Props {
    visible: boolean;
    product?: Product | null;
    categories?: string[];
    loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    product: null,
    categories: () => [],
    loading: false,
});

const emit = defineEmits<{
    'update:visible': [value: boolean];
    save: [formData: Partial<Product>];
}>();

const { t } = useI18n();
const productFormRef = ref<InstanceType<typeof ProductForm>>();

const isEditMode = computed(() => !!props.product);

const modalTitle = computed(() =>
    isEditMode.value
        ? t('products.modal.editTitle')
        : t('products.modal.addTitle')
);

const handleCancel = () => {
    emit('update:visible', false);
};

const handleOk = async () => {
    try {
        await productFormRef.value?.handleSubmit();
    } catch (error) {
        console.error('Form submission error:', error);
    }
};

const handleFormSubmit = (formData: Partial<Product>) => {
    emit('save', formData);
};
</script>

<template>
    <a-modal
        :visible="visible"
        :title="modalTitle"
        :width="800"
        :confirm-loading="loading"
        @ok="handleOk"
        @cancel="handleCancel"
    >
        <ProductForm
            ref="productFormRef"
            :product="product"
            :categories="categories"
            @submit="handleFormSubmit"
        />

        <template #footer>
            <a-button @click="handleCancel">
                {{ t('common.cancel') }}
            </a-button>
            <a-button type="primary" :loading="loading" @click="handleOk">
                {{ isEditMode ? t('common.save') : t('products.modal.create') }}
            </a-button>
        </template>
    </a-modal>
</template>
