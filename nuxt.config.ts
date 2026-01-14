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
            titleTemplate: '%s | DashStack',
            htmlAttrs: {
                lang: 'en',
            },
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'referrer', content: 'no-referrer-when-downgrade' },
                // SEO Meta Tags
                { name: 'description', content: 'DashStack - A modern admin dashboard for managing users, products, orders, and analytics. Built with Nuxt 3, Vue 3, and Ant Design Vue.' },
                { name: 'keywords', content: 'dashboard, admin panel, analytics, products management, orders, users, vue, nuxt, ant design' },
                { name: 'author', content: 'DashStack Team' },
                { name: 'robots', content: 'index, follow' },
                // Open Graph / Facebook
                { property: 'og:type', content: 'website' },
                { property: 'og:title', content: 'DashStack - Modern Admin Dashboard' },
                { property: 'og:description', content: 'A modern admin dashboard for managing users, products, orders, and analytics.' },
                { property: 'og:image', content: '/logo/dark.png' },
                { property: 'og:site_name', content: 'DashStack' },
                // Twitter Card
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:title', content: 'DashStack - Modern Admin Dashboard' },
                { name: 'twitter:description', content: 'A modern admin dashboard for managing users, products, orders, and analytics.' },
                { name: 'twitter:image', content: '/logo/dark.png' },
                // Performance & Mobile
                { name: 'format-detection', content: 'telephone=no' },
                { name: 'theme-color', content: '#4880FF' },
                { name: 'msapplication-TileColor', content: '#4880FF' },
                // Security
                { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
            ],
            link: [
                // Favicon
                { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
                { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/logo/dark.png' },
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/logo/dark.png' },
                // Preconnect for performance
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
                { rel: 'preconnect', href: 'https://cdn.dummyjson.com' },
                // DNS Prefetch for additional performance
                { rel: 'dns-prefetch', href: 'https://dummyjson.com' },
            ],
        },
    },
})