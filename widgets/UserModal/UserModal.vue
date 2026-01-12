<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { User } from '~/stores/users';
import UserForm from '~/widgets/UserForm/UserForm.vue';

interface Props {
    visible: boolean;
    user?: User | null;
    loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    user: null,
    loading: false,
});

const emit = defineEmits<{
    'update:visible': [value: boolean];
    save: [formData: Partial<User>];
}>();

const { t } = useI18n();
const userFormRef = ref<InstanceType<typeof UserForm>>();

const isEditMode = computed(() => !!props.user);

const modalTitle = computed(() =>
    isEditMode.value
        ? t('users.modal.editTitle')
        : t('users.modal.addTitle')
);

const handleCancel = () => {
    emit('update:visible', false);
};

const handleOk = async () => {
    try {
        await userFormRef.value?.handleSubmit();
    } catch (error) {
        console.error('Form submission error:', error);
    }
};

const handleFormSubmit = (formData: Partial<User>) => {
    emit('save', formData);
};
</script>

<template>
    <a-modal
        :visible="visible"
        :title="modalTitle"
        :width="900"
        :confirm-loading="loading"
        @ok="handleOk"
        @cancel="handleCancel"
    >
        <UserForm
            ref="userFormRef"
            :user="user"
            :is-edit-mode="isEditMode"
            @submit="handleFormSubmit"
        />

        <template #footer>
            <a-button @click="handleCancel">
                {{ t('common.cancel') }}
            </a-button>
            <a-button type="primary" :loading="loading" @click="handleOk">
                {{ isEditMode ? t('common.save') : t('users.modal.create') }}
            </a-button>
        </template>
    </a-modal>
</template>
