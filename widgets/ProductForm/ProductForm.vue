<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Product } from '~/stores/products';
import type { FormInstance, Rule } from 'ant-design-vue';

interface Props {
    product?: Product | null;
    categories?: string[];
}

const props = withDefaults(defineProps<Props>(), {
    product: null,
    categories: () => [],
});

const emit = defineEmits<{
    submit: [formData: Partial<Product>];
}>();

const { t } = useI18n();
const formRef = ref<FormInstance>();

const formData = ref<Partial<Product>>({
    title: '',
    description: '',
    category: '',
    price: 0,
    discountPercentage: 0,
    rating: 5,
    stock: 0,
    tags: [],
    brand: '',
    sku: '',
    weight: 0,
    dimensions: {
        width: 0,
        height: 0,
        depth: 0,
    },
    warrantyInformation: '',
    shippingInformation: '',
    availabilityStatus: 'In Stock',
    returnPolicy: '',
    minimumOrderQuantity: 1,
    images: [],
    thumbnail: '',
});

const availabilityOptions = [
    { label: t('products.form.availability.inStock'), value: 'In Stock' },
    { label: t('products.form.availability.lowStock'), value: 'Low Stock' },
    { label: t('products.form.availability.outOfStock'), value: 'Out of Stock' },
];

const ratingOptions = [1, 2, 3, 4, 5];

const rules: Record<string, Rule[]> = {
    title: [
        { required: true, message: t('products.form.validation.titleRequired') },
        { min: 3, message: t('products.form.validation.titleMin') },
    ],
    description: [
        { required: true, message: t('products.form.validation.descriptionRequired') },
        { min: 10, message: t('products.form.validation.descriptionMin') },
    ],
    category: [
        { required: true, message: t('products.form.validation.categoryRequired') },
    ],
    price: [
        { required: true, message: t('products.form.validation.priceRequired') },
        { type: 'number', min: 0, message: t('products.form.validation.priceMin') },
    ],
    stock: [
        { required: true, message: t('products.form.validation.stockRequired') },
        { type: 'number', min: 0, message: t('products.form.validation.stockMin') },
    ],
    availabilityStatus: [
        { required: true, message: t('products.form.validation.availabilityRequired') },
    ],
    discountPercentage: [
        { type: 'number', min: 0, max: 100, message: t('products.form.validation.discountRange') },
    ],
    rating: [
        { type: 'number', min: 1, max: 5, message: t('products.form.validation.ratingRange') },
    ],
};

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
    <a-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        layout="vertical"
        class="product-form"
    >
        <!-- Basic Information -->
        <div class="form-section">
            <h3 class="text-lg font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary">
                {{ t('products.form.sections.basicInfo') }}
            </h3>

            <a-form-item :label="t('products.form.title')" name="title">
                <a-input
                    v-model:value="formData.title"
                    :placeholder="t('products.form.placeholders.title')"
                />
            </a-form-item>

            <a-form-item :label="t('products.form.description')" name="description">
                <a-textarea
                    v-model:value="formData.description"
                    :placeholder="t('products.form.placeholders.description')"
                    :rows="4"
                />
            </a-form-item>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a-form-item :label="t('products.form.category')" name="category">
                    <a-select
                        v-model:value="formData.category"
                        :placeholder="t('products.form.placeholders.category')"
                        show-search
                    >
                        <a-select-option v-for="cat in categories" :key="cat" :value="cat">
                            {{ cat }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item :label="t('products.form.brand')" name="brand">
                    <a-input
                        v-model:value="formData.brand"
                        :placeholder="t('products.form.placeholders.brand')"
                    />
                </a-form-item>
            </div>
        </div>

        <!-- Pricing & Inventory -->
        <div class="form-section">
            <h3 class="text-lg font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary">
                {{ t('products.form.sections.pricingInventory') }}
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a-form-item :label="t('products.form.price')" name="price">
                    <a-input-number
                        v-model:value="formData.price"
                        :min="0"
                        :step="0.01"
                        :precision="2"
                        class="w-full"
                        :placeholder="t('products.form.placeholders.price')"
                    />
                </a-form-item>

                <a-form-item :label="t('products.form.discount')" name="discountPercentage">
                    <a-input-number
                        v-model:value="formData.discountPercentage"
                        :min="0"
                        :max="100"
                        :step="0.1"
                        class="w-full"
                        :placeholder="t('products.form.placeholders.discount')"
                    />
                </a-form-item>

                <a-form-item :label="t('products.form.stock')" name="stock">
                    <a-input-number
                        v-model:value="formData.stock"
                        :min="0"
                        class="w-full"
                        :placeholder="t('products.form.placeholders.stock')"
                    />
                </a-form-item>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a-form-item :label="t('products.form.sku')" name="sku">
                    <a-input
                        v-model:value="formData.sku"
                        :placeholder="t('products.form.placeholders.sku')"
                    />
                </a-form-item>

                <a-form-item :label="t('products.form.availability')" name="availabilityStatus">
                    <a-select
                        v-model:value="formData.availabilityStatus"
                        :placeholder="t('products.form.placeholders.availability')"
                    >
                        <a-select-option
                            v-for="option in availabilityOptions"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item :label="t('products.form.minimumOrder')" name="minimumOrderQuantity">
                    <a-input-number
                        v-model:value="formData.minimumOrderQuantity"
                        :min="1"
                        class="w-full"
                        :placeholder="t('products.form.placeholders.minimumOrder')"
                    />
                </a-form-item>
            </div>
        </div>

        <!-- Rating & Reviews -->
        <div class="form-section">
            <h3 class="text-lg font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary">
                {{ t('products.form.sections.rating') }}
            </h3>

            <a-form-item :label="t('products.form.rating')" name="rating">
                <a-select v-model:value="formData.rating" class="w-full md:w-48">
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

        <!-- Physical Properties -->
        <div class="form-section">
            <h3 class="text-lg font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary">
                {{ t('products.form.sections.physical') }}
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <a-form-item :label="t('products.form.weight')" name="weight">
                    <a-input-number
                        v-model:value="formData.weight"
                        :min="0"
                        :step="0.1"
                        class="w-full"
                        :placeholder="t('products.form.placeholders.weight')"
                    />
                </a-form-item>

                <a-form-item :label="t('products.form.width')" name="['dimensions', 'width']">
                    <a-input-number
                        v-model:value="formData.dimensions!.width"
                        :min="0"
                        :step="0.1"
                        class="w-full"
                        :placeholder="t('products.form.placeholders.width')"
                    />
                </a-form-item>

                <a-form-item :label="t('products.form.height')" name="['dimensions', 'height']">
                    <a-input-number
                        v-model:value="formData.dimensions!.height"
                        :min="0"
                        :step="0.1"
                        class="w-full"
                        :placeholder="t('products.form.placeholders.height')"
                    />
                </a-form-item>

                <a-form-item :label="t('products.form.depth')" name="['dimensions', 'depth']">
                    <a-input-number
                        v-model:value="formData.dimensions!.depth"
                        :min="0"
                        :step="0.1"
                        class="w-full"
                        :placeholder="t('products.form.placeholders.depth')"
                    />
                </a-form-item>
            </div>
        </div>

        <!-- Tags -->
        <div class="form-section">
            <h3 class="text-lg font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary">
                {{ t('products.form.sections.tags') }}
            </h3>

            <div class="flex gap-2 mb-2">
                <a-input
                    v-model:value="newTag"
                    :placeholder="t('products.form.placeholders.addTag')"
                    @press-enter="addTag"
                />
                <a-button type="primary" @click="addTag">
                    {{ t('products.form.addTag') }}
                </a-button>
            </div>

            <div v-if="formData.tags && formData.tags.length > 0" class="flex flex-wrap gap-2 mt-2">
                <a-tag
                    v-for="(tag, index) in formData.tags"
                    :key="index"
                    closable
                    @close="removeTag(index)"
                >
                    {{ tag }}
                </a-tag>
            </div>
        </div>

        <!-- Images -->
        <div class="form-section">
            <h3 class="text-lg font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary">
                {{ t('products.form.sections.images') }}
            </h3>

            <a-form-item :label="t('products.form.thumbnail')" name="thumbnail">
                <a-input
                    v-model:value="formData.thumbnail"
                    :placeholder="t('products.form.placeholders.thumbnail')"
                />
            </a-form-item>

            <div class="mb-2">
                <label class="block text-sm font-medium mb-2 text-light-text-primary dark:text-dark-text-primary">
                    {{ t('products.form.additionalImages') }}
                </label>
                <div class="flex gap-2">
                    <a-input
                        v-model:value="newImageUrl"
                        :placeholder="t('products.form.placeholders.imageUrl')"
                        @press-enter="addImage"
                    />
                    <a-button type="primary" @click="addImage">
                        {{ t('products.form.addImage') }}
                    </a-button>
                </div>
            </div>

            <div v-if="formData.images && formData.images.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                <div
                    v-for="(img, index) in formData.images"
                    :key="index"
                    class="relative group"
                >
                    <img :src="img" :alt="`Image ${index + 1}`" class="w-full h-24 object-cover rounded" />
                    <button
                        type="button"
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        @click="removeImage(index)"
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>

        <!-- Additional Information -->
        <div class="form-section">
            <h3 class="text-lg font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary">
                {{ t('products.form.sections.additional') }}
            </h3>

            <a-form-item :label="t('products.form.warranty')" name="warrantyInformation">
                <a-textarea
                    v-model:value="formData.warrantyInformation"
                    :placeholder="t('products.form.placeholders.warranty')"
                    :rows="2"
                />
            </a-form-item>

            <a-form-item :label="t('products.form.shipping')" name="shippingInformation">
                <a-textarea
                    v-model:value="formData.shippingInformation"
                    :placeholder="t('products.form.placeholders.shipping')"
                    :rows="2"
                />
            </a-form-item>

            <a-form-item :label="t('products.form.returnPolicy')" name="returnPolicy">
                <a-textarea
                    v-model:value="formData.returnPolicy"
                    :placeholder="t('products.form.placeholders.returnPolicy')"
                    :rows="2"
                />
            </a-form-item>
        </div>
    </a-form>
</template>

<style scoped>
.product-form {
    max-height: 70vh;
    overflow-y: auto;
    padding-right: 8px;
}

.form-section {
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.dark .form-section {
    border-bottom-color: rgba(255, 255, 255, 0.06);
}

.form-section:last-child {
    border-bottom: none;
}
</style>
