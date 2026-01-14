import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'path'

export default defineNuxtConfig({
    compatibilityDate: '2026-01-01',
    srcDir: '.',

    /* ----------------------------------------------------
     * NITRO (Static build for Netlify)
     * -------------------------------------------------- */
    nitro: {
        preset: 'netlify-static',
        rollupConfig: {
            plugins: [],
        },
    },

    /* ---------------------------------------------------
     * MODULES
     * -------------------------------------------------- */
    modules: [
        '@pinia/nuxt',
        '@nuxtjs/tailwindcss',
        '@ant-design-vue/nuxt',
        '@nuxtjs/i18n',
    ],

    /* ----------------------------------------------------
     * AUTO COMPONENT REGISTRATION
     * -------------------------------------------------- */
    components: {
        dirs: [
            { path: '~/components', pathPrefix: false },
        ],
    },

    /* ----------------------------------------------------
     * VITE / SSR FIXES (CRITICAL)
     * -------------------------------------------------- */
    vite: {
        ssr: {
            noExternal: [
                'ant-design-vue',
                'swiper'
            ],
        }
    },

    /* ----------------------------------------------------
     * BUILD
     * -------------------------------------------------- */
    build: {
        transpile: ['ant-design-vue'],
    },

    /* ----------------------------------------------------
     * I18N
     * -------------------------------------------------- */
    i18n: {
        locales: [
            { code: 'en', name: 'English', file: 'en.json' },
            { code: 'ru', name: 'Русский', file: 'ru.json' },
            { code: 'uz', name: "O'zbekcha", file: 'uz.json' },
        ],
        defaultLocale: 'uz',
        strategy: 'prefix_except_default',
        langDir: '.',
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            redirectOn: 'root',
        },
    },

    /* ----------------------------------------------------
     * STYLES
     * -------------------------------------------------- */
    css: [
        'ant-design-vue/dist/reset.css',
    ],

    tailwindcss: {
        cssPath: '~/assets/css/tailwind.css',
        viewer: false,
    },

    antd: {
        extractStyle: true,
    },

    /* ----------------------------------------------------
     * RUNTIME CONFIG
     * -------------------------------------------------- */
    runtimeConfig: {
        public: {
            apiBaseUrl: 'https://dummyjson.com',
        },
    },

    /* ----------------------------------------------------
     * TYPESCRIPT
     * -------------------------------------------------- */
    typescript: {
        strict: true,
        typeCheck: false,
    },

    /* ----------------------------------------------------
     * EXPERIMENTAL (SAFE)
     * -------------------------------------------------- */
    experimental: {
        appManifest: false,
    },

    /* ----------------------------------------------------
     * APP META
     * -------------------------------------------------- */
    app: {
        head: {
            title: 'Demo Dashboard',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'referrer', content: 'no-referrer-when-downgrade' },
            ],
            link: [
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
                { rel: 'preconnect', href: 'https://cdn.dummyjson.com' },
            ],
        },
    },
})