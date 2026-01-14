import { defineNuxtConfig } from "nuxt/config";
import { resolve } from "path";

export default defineNuxtConfig({
    compatibilityDate: "2026-01-01",

    // 1. Nitro: Fixes the 'Expression expected' and 'rollup-plugin-inject' errors
    nitro: {
        preset: 'netlify',
        externals: {
            inline: [resolve(__dirname, './shared'), resolve(__dirname, './widgets')]
        },
    },

    // 2. Modules
    modules: [
        "@pinia/nuxt",
        "@nuxtjs/tailwindcss",
        "@ant-design-vue/nuxt",
        "@nuxtjs/i18n"
    ],

    // 3. FSD Aliases: Ensures imports like 'shared/ui/Button' work
    alias: {
        "shared": resolve(__dirname, "./shared"),
        "widgets": resolve(__dirname, "./widgets"),
        "features": resolve(__dirname, "./features"),
        "entities": resolve(__dirname, "./entities"),
    },

    // 4. Component Scanning: Auto-imports your FSD components
    components: {
        dirs: [
            { path: '~/components', pathPrefix: false },
            { path: '~/widgets', pathPrefix: false },
            {
                path: '~/shared/ui',
                pathPrefix: false,
                extensions: ['.vue']
            },
        ],
    },

    // 5. Vite: Critical for parsing .vue files inside the shared folder
    vite: {
        optimizeDeps: {
            include: ['ant-design-vue', 'swiper'],
        },
        ssr: {
            // Prevents rollup-plugin-inject from parsing .vue files as JS
            noExternal: [/^shared/, 'ant-design-vue', 'swiper'],
        },
        server: {
            fs: {
                allow: [resolve(__dirname, 'shared')],
            },
        },
    },

    // 6. i18n: Configured for your /i18n folder
    i18n: {
        locales: [
            { code: 'en', name: 'English', file: 'en.json' },
            { code: 'ru', name: 'Русский', file: 'ru.json' },
            { code: 'uz', name: "O'zbekcha", file: 'uz.json' },
        ],
        langDir: '',
        defaultLocale: 'uz',
        strategy: 'prefix_except_default',
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            redirectOn: 'root',
        },
    },

    // 7. Styling and UI
    css: ["ant-design-vue/dist/reset.css"],

    antd: {
        extractStyle: true,
    },

    tailwindcss: {
        cssPath: "~/assets/css/tailwind.css",
        viewer: false,
    },

    // 8. Runtime and Experimental
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

    // 9. Meta Tags
    app: {
        head: {
            title: "Demo Dashboard",
            meta: [
                { charset: "utf-8" },
                { name: "viewport", content: "width=device-width, initial-scale=1" },
            ],
            link: [
                { rel: "preconnect", href: "https://fonts.googleapis.com" },
                { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
                { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200..1000&display=swap" },
            ],
        },
    },
});