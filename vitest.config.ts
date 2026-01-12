import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';

export default defineConfig({
    plugins: [vue()],
    test: {
        environment: 'happy-dom',
        globals: true,
        include: ['tests/**/*.{test,spec}.ts'],
        exclude: ['node_modules/**', 'dist/**', '.nuxt/**'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'dist/',
                '.nuxt/',
                '*.config.{js,ts}',
                'scripts/',
            ],
        },
    },
    resolve: {
        alias: [
            { find: '~/shared', replacement: fileURLToPath(new URL('./shared', import.meta.url)) },
            { find: '~/widgets', replacement: fileURLToPath(new URL('./widgets', import.meta.url)) },
            { find: '~/features', replacement: fileURLToPath(new URL('./features', import.meta.url)) },
            { find: '~/entities', replacement: fileURLToPath(new URL('./entities', import.meta.url)) },
            { find: '~/app', replacement: fileURLToPath(new URL('./app', import.meta.url)) },
            { find: '~', replacement: fileURLToPath(new URL('./', import.meta.url)) },
            { find: '@', replacement: fileURLToPath(new URL('./', import.meta.url)) },
        ],
    },
});
