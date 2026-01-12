<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { User } from '~/stores/users';
import type { FormInstance, Rule } from 'ant-design-vue';

interface Props {
    user?: User | null;
    isEditMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    user: null,
    isEditMode: false,
});

const emit = defineEmits<{
    submit: [formData: Partial<User>];
}>();

const { t } = useI18n();
const formRef = ref<FormInstance>();

const formData = ref<Partial<User>>({
    firstName: '',
    lastName: '',
    maidenName: '',
    age: 18,
    gender: 'male',
    email: '',
    phone: '',
    username: '',
    password: '',
    birthDate: '',
    image: '',
    bloodGroup: '',
    height: 0,
    weight: 0,
    eyeColor: '',
    hair: {
        color: '',
        type: '',
    },
    address: {
        address: '',
        city: '',
        state: '',
        stateCode: '',
        postalCode: '',
        country: '',
    },
    university: '',
    company: {
        name: '',
        department: '',
        title: '',
    },
    ein: '',
    ssn: '',
    userAgent: '',
    role: 'user',
    status: 'active',
});

const genderOptions = [
    { label: t('users.form.gender.male'), value: 'male' },
    { label: t('users.form.gender.female'), value: 'female' },
    { label: t('users.form.gender.other'), value: 'other' },
];

const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const eyeColorOptions = ['Brown', 'Blue', 'Green', 'Hazel', 'Gray', 'Amber'];

const hairColorOptions = ['Black', 'Brown', 'Blonde', 'Red', 'Gray', 'White', 'Auburn'];

const hairTypeOptions = [
    { label: t('users.form.hair.straight'), value: 'Straight' },
    { label: t('users.form.hair.wavy'), value: 'Wavy' },
    { label: t('users.form.hair.curly'), value: 'Curly' },
    { label: t('users.form.hair.kinky'), value: 'Kinky' },
];

const roleOptions = [
    { label: t('users.form.role.user'), value: 'user' },
    { label: t('users.form.role.moderator'), value: 'moderator' },
    { label: t('users.form.role.admin'), value: 'admin' },
];

const statusOptions = [
    { label: t('users.status.active'), value: 'active' },
    { label: t('users.status.inactive'), value: 'inactive' },
    { label: t('users.status.suspended'), value: 'suspended' },
];

const rules: Record<string, Rule[]> = {
    firstName: [
        { required: true, message: t('users.form.validation.firstNameRequired') },
        { min: 2, message: t('users.form.validation.firstNameMin') },
    ],
    lastName: [
        { required: true, message: t('users.form.validation.lastNameRequired') },
        { min: 2, message: t('users.form.validation.lastNameMin') },
    ],
    email: [
        { required: true, message: t('users.form.validation.emailRequired') },
        { type: 'email', message: t('users.form.validation.emailInvalid') },
    ],
    username: [
        { required: true, message: t('users.form.validation.usernameRequired') },
        { min: 3, message: t('users.form.validation.usernameMin') },
    ],
    password: props.isEditMode ? [] : [
        { required: true, message: t('users.form.validation.passwordRequired') },
        { min: 6, message: t('users.form.validation.passwordMin') },
    ],
    age: [
        { required: true, message: t('users.form.validation.ageRequired') },
        { type: 'number', min: 18, message: t('users.form.validation.ageMin') },
    ],
    gender: [
        { required: true, message: t('users.form.validation.genderRequired') },
    ],
    role: [
        { required: true, message: t('users.form.validation.roleRequired') },
    ],
    status: [
        { required: true, message: t('users.form.validation.statusRequired') },
    ],
};

watch(
    () => props.user,
    (newUser) => {
        if (newUser) {
            formData.value = {
                ...newUser,
                password: '',
                hair: newUser.hair || { color: '', type: '' },
                address: newUser.address || {
                    address: '',
                    city: '',
                    state: '',
                    stateCode: '',
                    postalCode: '',
                    country: '',
                },
                company: newUser.company || {
                    name: '',
                    department: '',
                    title: '',
                },
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

        const submitData = { ...formData.value };
        if (props.isEditMode && !submitData.password) {
            delete submitData.password;
        }

        emit('submit', submitData);
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
        class="user-form"
    >
        <!-- Account Information -->
        <div class="form-section">
            <h3 class="text-lg font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary">
                {{ t('users.form.sections.account') }}
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a-form-item :label="t('users.form.username')" name="username">
                    <a-input
                        v-model:value="formData.username"
                        :placeholder="t('users.form.placeholders.username')"
                    />
                </a-form-item>

                <a-form-item :label="t('users.form.email')" name="email">
                    <a-input
                        v-model:value="formData.email"
                        type="email"
                        :placeholder="t('users.form.placeholders.email')"
                    />
                </a-form-item>

                <a-form-item :label="t('users.form.password')" name="password">
                    <a-input-password
                        v-model:value="formData.password"
                        :placeholder="isEditMode ? t('users.form.placeholders.passwordEdit') : t('users.form.placeholders.password')"
                    />
                </a-form-item>

                <a-form-item :label="t('users.form.role')" name="role">
                    <a-select v-model:value="formData.role">
                        <a-select-option
                            v-for="option in roleOptions"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item :label="t('users.form.status')" name="status">
                    <a-select v-model:value="formData.status">
                        <a-select-option
                            v-for="option in statusOptions"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item :label="t('users.form.image')" name="image">
                    <a-input
                        v-model:value="formData.image"
                        :placeholder="t('users.form.placeholders.image')"
                    />
                </a-form-item>
            </div>
        </div>

        <!-- Personal Information -->
        <div class="form-section">
            <h3 class="text-lg font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary">
                {{ t('users.form.sections.personal') }}
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <a-form-item :label="t('users.form.firstName')" name="firstName">
                    <a-input
                        v-model:value="formData.firstName"
                        :placeholder="t('users.form.placeholders.firstName')"
                    />
                </a-form-item>

                <a-form-item :label="t('users.form.lastName')" name="lastName">
                    <a-input
                        v-model:value="formData.lastName"
                        :placeholder="t('users.form.placeholders.lastName')"
                    />
                </a-form-item>

                <a-form-item :label="t('users.form.maidenName')" name="maidenName">
                    <a-input
                        v-model:value="formData.maidenName"
                        :placeholder="t('users.form.placeholders.maidenName')"
                    />
                </a-form-item>

                <a-form-item :label="t('users.form.age')" name="age">
                    <a-input-number
                        v-model:value="formData.age"
                        :min="18"
                        :max="120"
                        class="w-full"
                    />
                </a-form-item>

                <a-form-item :label="t('users.form.gender')" name="gender">
                    <a-select v-model:value="formData.gender">
                        <a-select-option
                            v-for="option in genderOptions"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item :label="t('users.form.birthDate')" name="birthDate">
                    <a-date-picker
                        v-model:value="formData.birthDate"
                        class="w-full"
                        :placeholder="t('users.form.placeholders.birthDate')"
                    />
                </a-form-item>

                <a-form-item :label="t('users.form.phone')" name="phone">
                    <a-input
                        v-model:value="formData.phone"
                        :placeholder="t('users.form.placeholders.phone')"
                    />
                </a-form-item>
            </div>
        </div>

        <!-- Physical Attributes -->
        <div class="form-section">
            <h3 class="text-lg font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary">
                {{ t('users.form.sections.physical') }}
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <a-form-item :label="t('users.form.height')" name="height">
                    <a-input-number
                        v-model:value="formData.height"
                        :min="0"
                        :step="0.1"
                        class="w-full"
                        :placeholder="t('users.form.placeholders.height')"
                    />
                </a-form-item>

                <a-form-item :label="t('users.form.weight')" name="weight">
                    <a-input-number
                        v-model:value="formData.weight"
                        :min="0"
                        :step="0.1"
                        class="w-full"
                        :placeholder="t('users.form.placeholders.weight')"
                    />
                </a-form-item>

                <a-form-item :label="t('users.form.bloodGroup')" name="bloodGroup">
                    <a-select v-model:value="formData.bloodGroup">
                        <a-select-option v-for="group in bloodGroupOptions" :key="group" :value="group">
                            {{ group }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item :label="t('users.form.eyeColor')" name="eyeColor">
                    <a-select v-model:value="formData.eyeColor">
                        <a-select-option v-for="color in eyeColorOptions" :key="color" :value="color">
                            {{ color }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item :label="t('users.form.hairColor')" name="['hair', 'color']">
                    <a-select v-model:value="formData.hair!.color">
                        <a-select-option v-for="color in hairColorOptions" :key="color" :value="color">
                            {{ color }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item :label="t('users.form.hairType')" name="['hair', 'type']">
                    <a-select v-model:value="formData.hair!.type">
                        <a-select-option
                            v-for="option in hairTypeOptions"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
        </div>

        <!-- Address -->
        <div class="form-section">
            <h3 class="text-lg font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary">
                {{ t('users.form.sections.address') }}
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <a-form-item :label="t('users.form.street')" name="['address', 'address']" class="md:col-span-2 lg:col-span-3">
                    <a-input
                        v-model:value="formData.address!.address"
                        :placeholder="t('users.form.placeholders.street')"
                    />
                </a-form-item>

                <a-form-item :label="t('users.form.city')" name="['address', 'city']">
                    <a-input
                        v-model:value="formData.address!.city"
                        :placeholder="t('users.form.placeholders.city')"
                    />
                </a-form-item>

                <a-form-item :label="t('users.form.state')" name="['address', 'state']">
                    <a-input
                        v-model:value="formData.address!.state"
                        :placeholder="t('users.form.placeholders.state')"
                    />
                </a-form-item>

                <a-form-item :label="t('users.form.stateCode')" name="['address', 'stateCode']">
                    <a-input
                        v-model:value="formData.address!.stateCode"
                        :placeholder="t('users.form.placeholders.stateCode')"
                    />
                </a-form-item>

                <a-form-item :label="t('users.form.postalCode')" name="['address', 'postalCode']">
                    <a-input
                        v-model:value="formData.address!.postalCode"
                        :placeholder="t('users.form.placeholders.postalCode')"
                    />
                </a-form-item>

                <a-form-item :label="t('users.form.country')" name="['address', 'country']">
                    <a-input
                        v-model:value="formData.address!.country"
                        :placeholder="t('users.form.placeholders.country')"
                    />
                </a-form-item>
            </div>
        </div>

        <!-- Professional -->
        <div class="form-section">
            <h3 class="text-lg font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary">
                {{ t('users.form.sections.professional') }}
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a-form-item :label="t('users.form.university')" name="university">
                    <a-input
                        v-model:value="formData.university"
                        :placeholder="t('users.form.placeholders.university')"
                    />
                </a-form-item>

                <a-form-item :label="t('users.form.companyName')" name="['company', 'name']">
                    <a-input
                        v-model:value="formData.company!.name"
                        :placeholder="t('users.form.placeholders.companyName')"
                    />
                </a-form-item>

                <a-form-item :label="t('users.form.department')" name="['company', 'department']">
                    <a-input
                        v-model:value="formData.company!.department"
                        :placeholder="t('users.form.placeholders.department')"
                    />
                </a-form-item>

                <a-form-item :label="t('users.form.jobTitle')" name="['company', 'title']">
                    <a-input
                        v-model:value="formData.company!.title"
                        :placeholder="t('users.form.placeholders.jobTitle')"
                    />
                </a-form-item>
            </div>
        </div>

        <!-- Additional Information -->
        <div class="form-section">
            <h3 class="text-lg font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary">
                {{ t('users.form.sections.additional') }}
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <a-form-item :label="t('users.form.ein')" name="ein">
                    <a-input
                        v-model:value="formData.ein"
                        :placeholder="t('users.form.placeholders.ein')"
                    />
                </a-form-item>

                <a-form-item :label="t('users.form.ssn')" name="ssn">
                    <a-input
                        v-model:value="formData.ssn"
                        :placeholder="t('users.form.placeholders.ssn')"
                    />
                </a-form-item>

                <a-form-item :label="t('users.form.userAgent')" name="userAgent" class="md:col-span-2 lg:col-span-3">
                    <a-textarea
                        v-model:value="formData.userAgent"
                        :placeholder="t('users.form.placeholders.userAgent')"
                        :rows="2"
                    />
                </a-form-item>
            </div>
        </div>
    </a-form>
</template>

<style scoped>
.user-form {
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
