<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { PlusOutlined } from '@ant-design/icons-vue';
import type { Product, Category } from '~/stores/products';
import type { FormInstance, Rule } from 'ant-design-vue';

interface Props {
    product?: Product | null;
    categories?: Category[];
}

const props = withDefaults(defineProps<Props>(), {
    product: null,
    categories: () => [],
});

const emit = defineEmits<{
    submit: [data: Partial<Product>];
}>();

const { t } = useI18n();
const formRef = ref<FormInstance>();

const formData = ref<Partial<Product>>({
    title: '',
    description: '',
    category: '',
    brand: '',
    price: 0,
    discountPercentage: 0,
    rating: 0,
    stock: 0,
    tags: [],
    sku: '',
    weight: 0,
    dimensions: { width: 0, height: 0, depth: 0 },
    warrantyInformation: '',
    shippingInformation: '',
    availabilityStatus: '',
    returnPolicy: '',
    minimumOrderQuantity: 1,
    images: [],
    thumbnail: '',
});

const rules: Record<string, Rule[]> = {
    title: [
        { required: true, message: t('products.form.validation.titleRequired'), trigger: 'blur' },
    ],
    description: [
        { required: true, message: t('products.form.validation.descriptionRequired'), trigger: 'blur' },
    ],
    category: [
        { required: true, message: t('products.form.validation.categoryRequired'), trigger: 'change' },
    ],
    price: [
        { required: true, message: t('products.form.validation.priceRequired'), trigger: 'blur' },
        { type: 'number', min: 0, message: t('products.form.validation.priceMin'), trigger: 'blur' },
    ],
    stock: [
        { required: true, message: t('products.form.validation.stockRequired'), trigger: 'blur' },
        { type: 'number', min: 0, message: t('products.form.validation.stockMin'), trigger: 'blur' },
    ],
};

const availabilityOptions = [
    { label: t('products.form.availability.inStock'), value: 'In Stock' },
    { label: t('products.form.availability.lowStock'), value: 'Low Stock' },
    { label: t('products.form.availability.outOfStock'), value: 'Out of Stock' },
];

const ratingOptions = [1, 2, 3, 4, 5];

const newImageUrl = ref('');

const addImage = () => {
    if (newImageUrl.value.trim()) {
        if (!formData.value.images) {
            formData.value.images = [];
        }
        formData.value.images.push(newImageUrl.value.trim());
        newImageUrl.value = '';
    }
};

const removeImage = (index: number) => {
    if (formData.value.images) {
        formData.value.images.splice(index, 1);
    }
};

const newTag = ref('');

const addTag = () => {
    if (newTag.value.trim()) {
        if (!formData.value.tags) {
            formData.value.tags = [];
        }
        formData.value.tags.push(newTag.value.trim());
        newTag.value = '';
    }
};

const removeTag = (index: number) => {
    if (formData.value.tags) {
        formData.value.tags.splice(index, 1);
    }
};

watch(
    () => props.product,
    (newProduct) => {
        if (newProduct) {
            formData.value = {
                ...newProduct,
                dimensions: newProduct.dimensions || { width: 0, height: 0, depth: 0 },
                tags: newProduct.tags || [],
                images: newProduct.images || [],
            };
        } else {
            formData.value = {
                title: '',
                description: '',
                category: '',
                brand: '',
                price: 0,
                discountPercentage: 0,
                rating: 0,
                stock: 0,
                tags: [],
                sku: '',
                weight: 0,
                dimensions: { width: 0, height: 0, depth: 0 },
                warrantyInformation: '',
                shippingInformation: '',
                availabilityStatus: '',
                returnPolicy: '',
                minimumOrderQuantity: 1,
                images: [],
                thumbnail: '',
            };
            formRef.value?.resetFields();
        }
    },
    { immediate: true, deep: true }
);

const handleSubmit = async () => {
    try {
        await formRef.value?.validate();
        emit('submit', formData.value);
    } catch (error) {
        console.error('Validation failed:', error);
    }
};

defineExpose({
    handleSubmit,
    resetFields: () => formRef.value?.resetFields(),
});
</script>

<template>
    <a-form ref="formRef" :model="formData" :rules="rules" layout="vertical" class="product-form">
        <a-tabs default-active-key="1" class="product-tabs">
            <!-- Main Data Tab -->
            <a-tab-pane key="1" tab="Main Data">
                <!-- Basic Information -->
                <a-form-item :label="t('products.form.title')" name="title">
                    <a-input v-model:value="formData.title" :placeholder="t('products.form.placeholders.title')" />
                </a-form-item>

                <a-form-item :label="t('products.form.description')" name="description">
                    <a-textarea v-model:value="formData.description"
                        :placeholder="t('products.form.placeholders.description')" :rows="4" />
                </a-form-item>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a-form-item :label="t('products.form.category')" name="category">
                        <a-select v-model:value="formData.category"
                            :placeholder="t('products.form.placeholders.category')" show-search>
                            <a-select-option v-for="cat in categories" :key="cat" :value="cat.slug">
                                {{ cat.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item :label="t('products.form.brand')" name="brand">
                        <a-input v-model:value="formData.brand" :placeholder="t('products.form.placeholders.brand')" />
                    </a-form-item>
                </div>

                <!-- Pricing & Inventory -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a-form-item :label="t('products.form.price')" name="price">
                        <a-input-number v-model:value="formData.price" :min="0" :step="0.01" :precision="2"
                            class="w-full" :placeholder="t('products.form.placeholders.price')" />
                    </a-form-item>

                    <a-form-item :label="t('products.form.discount')" name="discountPercentage">
                        <a-input-number v-model:value="formData.discountPercentage" :min="0" :max="100" :step="0.1"
                            class="w-full" :placeholder="t('products.form.placeholders.discount')" />
                    </a-form-item>

                    <a-form-item :label="t('products.form.stock')" name="stock">
                        <a-input-number v-model:value="formData.stock" :min="0" class="w-full"
                            :placeholder="t('products.form.placeholders.stock')" />
                    </a-form-item>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a-form-item :label="t('products.form.placeholders.availability')" name="availabilityStatus">
                        <a-select v-model:value="formData.availabilityStatus"
                            :placeholder="t('products.form.placeholders.availability')">
                            <a-select-option v-for="option in availabilityOptions" :key="option.value"
                                :value="option.value">
                                {{ option.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item :label="t('products.form.rating')" name="rating">
                        <a-select v-model:value="formData.rating" class="w-full">
                            <a-select-option v-for="r in ratingOptions" :key="r" :value="r">
                                <span class="flex items-center gap-2">
                                    <span v-for="i in r" :key="i" class="text-yellow-400">★</span>
                                    <span v-for="i in (5 - r)" :key="`empty-${i}`" class="text-gray-300">★</span>
                                    <span class="ml-2">{{ r }}.0</span>
                                </span>
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </div>

                <!-- Thumbnail -->
                <a-form-item :label="t('products.form.thumbnail')" name="thumbnail">
                    <a-input v-model:value="formData.thumbnail"
                        :placeholder="t('products.form.placeholders.thumbnail')" />
                </a-form-item>
            </a-tab-pane>

            <!-- Extra Information Tab -->
            <a-tab-pane key="2" tab="Extra Information">
                <!-- SKU and Minimum Order -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a-form-item :label="t('products.form.sku')" name="sku">
                        <a-input v-model:value="formData.sku" :placeholder="t('products.form.placeholders.sku')" />
                    </a-form-item>

                    <a-form-item :label="t('products.form.minimumOrder')" name="minimumOrderQuantity">
                        <a-input-number v-model:value="formData.minimumOrderQuantity" :min="1" class="w-full"
                            :placeholder="t('products.form.placeholders.minimumOrder')" />
                    </a-form-item>
                </div>

                <!-- Physical Properties -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <a-form-item :label="t('products.form.weight')" name="weight">
                        <a-input-number v-model:value="formData.weight" :min="0" :step="0.1" class="w-full"
                            :placeholder="t('products.form.placeholders.weight')" />
                    </a-form-item>

                    <a-form-item :label="t('products.form.width')" name="['dimensions', 'width']">
                        <a-input-number v-model:value="formData.dimensions!.width" :min="0" :step="0.1" class="w-full"
                            :placeholder="t('products.form.placeholders.width')" />
                    </a-form-item>

                    <a-form-item :label="t('products.form.height')" name="['dimensions', 'height']">
                        <a-input-number v-model:value="formData.dimensions!.height" :min="0" :step="0.1" class="w-full"
                            :placeholder="t('products.form.placeholders.height')" />
                    </a-form-item>

                    <a-form-item :label="t('products.form.depth')" name="['dimensions', 'depth']">
                        <a-input-number v-model:value="formData.dimensions!.depth" :min="0" :step="0.1" class="w-full"
                            :placeholder="t('products.form.placeholders.depth')" />
                    </a-form-item>
                </div>

                <!-- Tags -->
                <div class="subsection">
                    <label class="block text-sm font-medium mb-2 text-light-text-primary dark:text-dark-text-primary">
                        {{ t('products.form.sections.tags') }}
                    </label>
                    <div class="flex gap-2 mb-2">
                        <a-input v-model:value="newTag" :placeholder="t('products.form.placeholders.addTag')"
                            @press-enter="addTag" />
                        <a-button type="primary" @click="addTag">
                            {{ t('products.form.addTag') }}
                        </a-button>
                    </div>

                    <div v-if="formData.tags && formData.tags.length > 0" class="flex flex-wrap gap-2 mt-2">
                        <a-tag v-for="(tag, index) in formData.tags" :key="index" closable @close="removeTag(index)">
                            {{ tag }}
                        </a-tag>
                    </div>
                </div>

                <!-- Additional Images -->
                <div class="subsection">
                    <label class="block text-sm font-medium mb-2 text-light-text-primary dark:text-dark-text-primary">
                        {{ t('products.form.additionalImages') }}
                    </label>
                    <div class="flex gap-2 mb-2">
                        <a-input v-model:value="newImageUrl" :placeholder="t('products.form.placeholders.imageUrl')"
                            @press-enter="addImage" />
                        <a-button type="primary" @click="addImage">
                            {{ t('products.form.addImage') }}
                        </a-button>
                    </div>

                    <div v-if="formData.images && formData.images.length > 0"
                        class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        <div v-for="(img, index) in formData.images" :key="index" class="relative group">
                            <img :src="img" :alt="`Image ${index + 1}`" class="w-full h-24 object-cover rounded" referrerpolicy="no-referrer" />
                            <button type="button"
                                class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                @click="removeImage(index)">
                                ×
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Additional Information -->
                <a-form-item :label="t('products.form.warranty')" name="warrantyInformation">
                    <a-textarea v-model:value="formData.warrantyInformation"
                        :placeholder="t('products.form.placeholders.warranty')" :rows="2" />
                </a-form-item>

                <a-form-item :label="t('products.form.shipping')" name="shippingInformation">
                    <a-textarea v-model:value="formData.shippingInformation"
                        :placeholder="t('products.form.placeholders.shipping')" :rows="2" />
                </a-form-item>

                <a-form-item :label="t('products.form.returnPolicy')" name="returnPolicy">
                    <a-textarea v-model:value="formData.returnPolicy"
                        :placeholder="t('products.form.placeholders.returnPolicy')" :rows="2" />
                </a-form-item>
            </a-tab-pane>
        </a-tabs>
    </a-form>
</template>

<style scoped>
.product-form {
    max-height: 70vh;
    overflow-y: auto;
    padding-right: 8px;
}

.product-tabs :deep(.ant-tabs-nav) {
    @apply mb-6;
    @apply border-b border-light-text-tertiary/10 dark:border-dark-quaternary/30;
}

.product-tabs :deep(.ant-tabs-tab) {
    @apply text-light-text-primary dark:text-dark-text-primary;
    @apply font-medium;
}

.product-tabs :deep(.ant-tabs-tab-active) {
    @apply text-primary;
}

.product-tabs :deep(.ant-tabs-ink-bar) {
    @apply bg-primary;
}

.product-tabs :deep(.ant-tabs-content) {
    @apply pt-4;
}

.product-tabs :deep(.ant-form-item-label > label) {
    @apply text-light-text-primary dark:text-dark-text-primary;
}

.product-tabs :deep(.ant-input),
.product-tabs :deep(.ant-input-number),
.product-tabs :deep(.ant-select-selector),
.product-tabs :deep(.ant-input-textarea-show-count textarea) {
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply border-light-text-tertiary/20 dark:border-dark-quaternary/30;
    @apply text-light-text-primary dark:text-dark-text-primary;
}

.product-tabs :deep(.ant-input::placeholder),
.product-tabs :deep(.ant-input-number-input::placeholder),
.product-tabs :deep(textarea::placeholder) {
    @apply text-light-text-tertiary dark:text-dark-text-secondary;
}

.product-tabs :deep(.ant-select-arrow),
.product-tabs :deep(.ant-input-number-handler-wrap) {
    @apply text-light-text-primary dark:text-dark-text-primary;
}

.subsection {
    margin-bottom: 16px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid;
    @apply border-light-text-tertiary/10 dark:border-dark-quaternary/30;
}
</style>
