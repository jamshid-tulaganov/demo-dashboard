import { defineNuxtConfig } from "nuxt/config";
import { resolve } from "path";
// 2026 Fix: Use explicit import for Vue plugin to resolve Nitro parsing errors
import vue from '@vitejs/plugin-vue';

export default defineNuxtConfig({
    compatibilityDate: "2026-01-01",
    srcDir: '.',

    // 1. Nitro: Fixes 'Expression expected' and 'rollup-plugin-inject' errors
    nitro: {
        preset: 'netlify',
        rollupConfig: {
            // @ts-ignore
            plugins: [vue()],
        },
        externals: {
            inline: [
                resolve(__dirname, './shared'),
                resolve(__dirname, './widgets'),
                resolve(__dirname, './features'),
                resolve(__dirname, './entities')
            ]
        },
    },

    // 2. Modules
    modules: [
        "@pinia/nuxt",
        "@nuxtjs/tailwindcss",
        "@ant-design-vue/nuxt",
        "@nuxtjs/i18n"
    ],

    // 3. FSD Aliases
    alias: {
        "shared": resolve(__dirname, "./shared"),
        "widgets": resolve(__dirname, "./widgets"),
        "features": resolve(__dirname, "./features"),
        "entities": resolve(__dirname, "./entities"),
    },

    // 4. Component Scanning
    components: {
        dirs: [
            { path: '~/widgets', pathPrefix: false },
            { path: '~/features', pathPrefix: false },
            { path: '~/entities', pathPrefix: false },
            {
                path: '~/shared/ui',
                pathPrefix: false,
                extensions: ['.vue']
            },
        ],
    },

    // 5. Vite: Critical for parsing .vue files inside custom FSD folders
    vite: {
        optimizeDeps: {
            include: ['ant-design-vue', 'swiper', 'vue'],
        },
        ssr: {
            // Prevents rollup-plugin-inject from failing on .vue files in these folders
            noExternal: [
                /shared/,
                /widgets/,
                /features/,
                /entities/,
                'ant-design-vue',
                'swiper'
            ],
        },
        server: {
            fs: {
                allow: [resolve(__dirname, 'shared')],
            },
        },
    },

    // 6. Build Transpile: Prevents "Expression expected" by processing modern JS/TS
    build: {
        transpile: [
            'ant-design-vue',
            'shared',
            'widgets',
            'features',
            'entities'
        ],
    },

    // 7. i18n Configuration
    i18n: {
        locales: [
            { code: 'en', name: 'English', file: 'en.json' },
            { code: 'ru', name: 'Русский', file: 'ru.json' },
            { code: 'uz', name: "O'zbekcha", file: 'uz.json' },
        ],
        langDir: '.',
        defaultLocale: 'uz',
        strategy: 'prefix_except_default',
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            redirectOn: 'root',
        },
    },

    // 8. Styling and UI
    css: ["ant-design-vue/dist/reset.css"],

    antd: {
        extractStyle: true,
    },

    tailwindcss: {
        cssPath: "~/assets/css/tailwind.css",
        viewer: false,
    },

    // 9. Runtime and Experimental
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

    // 10. Meta Tags
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
                { rel: "stylesheet", href: "fonts.googleapis.com" },
            ],
        },
    },
});
