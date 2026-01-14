// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
import { resolve } from "path";

export default defineNuxtConfig({
    compatibilityDate: "2026-01-10",
    // devtools: { enabled: false },

    modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss", "@ant-design-vue/nuxt", "@nuxtjs/i18n"],

    runtimeConfig: {
        public: {
            apiBaseUrl: 'https://dummyjson.com',
        },
    },

    experimental: {
        appManifest: false,
    },

    typescript: {
        strict: true,
        typeCheck: false,
    },

    // Performance optimizations
    vite: {
        build: {
            modulePreload: false,
            rollupOptions: {
                output: {
                    manualChunks: {
                        'ant-design': ['ant-design-vue'],
                        'swiper': ['swiper'],
                    },
                },
            },
        },
        optimizeDeps: {
            include: ['ant-design-vue', 'swiper'],
        },
        server: {
            fs: {
                // Allow Vite to read the shared folder
                allow: [resolve(__dirname, 'shared')],
            },
        },
        ssr: {
            // Ensure modules from shared are not treated as external by SSR bundling
            noExternal: [/^shared(\/|$)/],
        },
    },

    // Nitro configuration for shared folder
    nitro: {
        externals: {
            inline: [/^shared(\/|$)/],
        },
    },

    // Component auto-import with lazy loading
    components: {
        dirs: [
            {
                path: '~/components',
                pathPrefix: false,
                extensions: ['.vue'],
            },
            {
                path: '~/widgets',
                pathPrefix: false,
                extensions: ['.vue'],
            },
        ],
    },

    css: ["ant-design-vue/dist/reset.css"],

    // @ts-ignore - Ant Design Vue module configuration
    antd: {
        extractStyle: true,
    },

    // i18n configuration
    i18n: {
        locales: [
            { code: 'en', name: 'English', file: 'en.json' },
            { code: 'ru', name: 'Русский', file: 'ru.json' },
            { code: 'uz', name: "O'zbekcha", file: 'uz.json' },
        ],
        langDir: '',
        defaultLocale: 'uz',
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            redirectOn: 'root',
        },
    },

    // Tailwind CSS configuration
    tailwindcss: {
        cssPath: "~/assets/css/tailwind.css",
        configPath: "tailwind.config",
        exposeConfig: false,
        viewer: true,
    },

    // App configuration
    app: {
        head: {
            title: "Demo Dashboard",
            meta: [
                { charset: "utf-8" },
                {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1",
                },
                {
                    name: "description",
                    content: "Frontend Dashboard Application",
                },
            ],
            link: [
                {
                    rel: "preconnect",
                    href: "https://fonts.googleapis.com",
                },
                {
                    rel: "preconnect",
                    href: "https://fonts.gstatic.com",
                    crossorigin: "",
                },
                {
                    rel: "stylesheet",
                    href: "https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap",
                },
            ],
        },
    },

});