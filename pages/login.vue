<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuth } from '~/shared/lib';
import { Logo } from '~/shared/ui';
import { message } from 'ant-design-vue';
import { ThemeSwitcher } from '~/widgets/ThemeSwitcher';

definePageMeta({
    layout: 'auth',
    middleware: ['auth'],
});

const router = useRouter();
const { t, setLocale, locales, locale } = useI18n();
const { login, loading } = useAuth();

const localeFlags: Record<string, string> = {
    en: '🇬🇧',
    ru: '🇷🇺',
    uz: '🇺🇿',
};

const availableLocales = computed(() =>
    locales.value.map((loc) => ({
        code: loc.code,
        name: loc.name,
        flag: localeFlags[loc.code] || '🌐',
    })),
);

const formState = reactive({
    username: '',
    password: '',
    remember: false,
});

const loginError = ref<string | null>(null);

const onFinish = async () => {
    loginError.value = null;
    try {
        await login({
            username: formState.username,
            password: formState.password,
            expiresInMins: formState.remember ? 43200 : 60, // 30 days or 1 hour
        });

        message.success(t('auth.login.success') || 'Login successful!');
        await router.push('/');
    } catch (error: any) {
        console.error('Login failed:', error);
        loginError.value = error.data?.message || 'Invalid username or password';
        message.error(loginError.value);
    }
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};

const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
};
</script>

<template>
    <div class="w-full max-w-md">
        <!-- Theme and Language Switcher -->
        <div class="flex justify-end gap-3 mb-4">
            <ThemeSwitcher />
            <a-select
                :value="locale"
                @change="handleLocaleChange"
                style="width: 170px"
                size="large"
            >
                <a-select-option
                    v-for="loc in availableLocales"
                    :key="loc.code"
                    :value="loc.code"
                >
                    <div class="flex items-center gap-2">
                        <span>{{ loc.flag }}</span>
                        <span>{{ loc.name }}</span>
                    </div>
                </a-select-option>
            </a-select>
        </div>

        <!-- Logo -->
        <div class="flex justify-center mb-6">
            <Logo :height="60" />
        </div>

        <!-- Login Card -->
        <a-card class="shadow-lg">
            <h1 class="text-2xl font-bold text-center mb-2">
                {{ t('auth.login.title') }}
            </h1>
            <p class="text-center text-light-text-secondary dark:text-dark-text-secondary mb-6">
                {{ t('auth.login.subtitle') }}
            </p>

            <!-- Error Alert -->
            <a-alert
                v-if="loginError"
                :message="loginError"
                type="error"
                show-icon
                closable
                class="mb-4"
                @close="loginError = null"
            />

            <!-- Login Form -->
            <a-form
                :model="formState"
                name="login"
                autocomplete="off"
                @finish="onFinish"
                @finishFailed="onFinishFailed"
            >
                <a-form-item
                    :label="t('auth.login.email')"
                    name="username"
                    :rules="[{ required: true, message: 'Please input your username!' }]"
                >
                    <a-input
                        v-model:value="formState.username"
                        :placeholder="t('auth.login.emailPlaceholder')"
                        size="large"
                    />
                </a-form-item>

                <a-form-item
                    :label="t('auth.login.password')"
                    name="password"
                    :rules="[{ required: true, message: 'Please input your password!' }]"
                >
                    <a-input-password
                        v-model:value="formState.password"
                        :placeholder="t('auth.login.passwordPlaceholder')"
                        size="large"
                    />
                </a-form-item>

                <a-form-item name="remember">
                    <a-checkbox v-model:checked="formState.remember">
                        {{ t('auth.login.rememberMe') }}
                    </a-checkbox>
                </a-form-item>

                <a-form-item>
                    <a-button
                        type="primary"
                        html-type="submit"
                        class="w-full"
                        size="large"
                        :loading="loading"
                    >
                        {{ t('auth.login.submit') }}
                    </a-button>
                </a-form-item>
            </a-form>

            <!-- Demo Credentials -->
            <a-alert
                message="Demo Credentials"
                description="Username: emilys | Password: emilyspass"
                type="info"
                show-icon
                class="mt-4"
            />
        </a-card>
    </div>
</template>
