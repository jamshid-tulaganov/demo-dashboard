<script setup lang="ts">
const props = defineProps({
    error: {
        type: Object,
        required: true,
    },
});

const { t } = useI18n();

const handleError = () => clearError({ redirect: '/' });

const errorDetails = computed(() => {
    const statusCode = props.error.statusCode || 500;
    const statusMessage = props.error.statusMessage || 'Internal Server Error';

    const errorMap: Record<number, { title: string; description: string; icon: string }> = {
        404: {
            title: t('errors.notFound'),
            description: 'The page you are looking for does not exist or has been moved.',
            icon: '🔍',
        },
        500: {
            title: t('errors.serverError'),
            description: 'Something went wrong on our end. Please try again later.',
            icon: '⚠️',
        },
        403: {
            title: t('errors.forbidden'),
            description: 'You do not have permission to access this resource.',
            icon: '🚫',
        },
        401: {
            title: t('errors.unauthorized'),
            description: 'You need to be logged in to access this page.',
            icon: '🔒',
        },
    };

    return (
        errorMap[statusCode] || {
            title: statusMessage,
            description: 'An unexpected error occurred. Please try again.',
            icon: '❌',
        }
    );
});
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-light-background to-light-surface dark:from-dark-background dark:to-dark-secondary p-4">
        <div class="max-w-2xl w-full">
            <a-card class="shadow-2xl border-0 overflow-hidden">
                <!-- Error Icon and Status Code -->
                <div class="text-center mb-8">
                    <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                        <span class="text-5xl">{{ errorDetails.icon }}</span>
                    </div>
                    <h1 class="text-6xl font-bold text-red-500 mb-2">
                        {{ error.statusCode || 500 }}
                    </h1>
                    <h2 class="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
                        {{ errorDetails.title }}
                    </h2>
                    <p class="text-light-text-secondary dark:text-dark-text-secondary text-lg max-w-md mx-auto">
                        {{ errorDetails.description }}
                    </p>
                </div>

                <!-- Error Details (Development Only) -->
                <div
                    v-if="error.stack && process.dev"
                    class="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
                >
                    <details>
                        <summary class="cursor-pointer font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                            Technical Details
                        </summary>
                        <pre class="text-xs text-light-text-secondary dark:text-dark-text-secondary overflow-x-auto">{{ error.stack }}</pre>
                    </details>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a-button
                        type="primary"
                        size="large"
                        @click="handleError"
                        class="flex items-center justify-center gap-2"
                    >
                        <span>🏠</span>
                        <span>{{ t('common.back') }} to Home</span>
                    </a-button>
                    <a-button
                        size="large"
                        @click="() => window.location.reload()"
                        class="flex items-center justify-center gap-2"
                    >
                        <span>🔄</span>
                        <span>Reload Page</span>
                    </a-button>
                </div>

                <!-- Helpful Links -->
                <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p class="text-center text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
                        Need help? Try these resources:
                    </p>
                    <div class="flex flex-wrap justify-center gap-4 text-sm">
                        <NuxtLink
                            to="/"
                            class="text-primary hover:underline flex items-center gap-1"
                        >
                            <span>🏠</span>
                            <span>Home</span>
                        </NuxtLink>
                        <NuxtLink
                            to="/login"
                            class="text-primary hover:underline flex items-center gap-1"
                        >
                            <span>🔐</span>
                            <span>Login</span>
                        </NuxtLink>
                    </div>
                </div>
            </a-card>

            <!-- Footer Message -->
            <div class="text-center mt-6 text-light-text-secondary dark:text-dark-text-secondary">
                <p class="text-sm">
                    If this problem persists, please contact support.
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.gradient-bg {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
