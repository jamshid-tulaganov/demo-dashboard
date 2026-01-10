// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
    compatibilityDate: "2026-01-10",
    devtools: { enabled: false },

    modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss", "@ant-design-vue/nuxt", "@nuxtjs/i18n"],

    typescript: {
        strict: true,
        typeCheck: false,
    },

    css: ["ant-design-vue/dist/reset.css"],

    antd: {
        extractStyle: true,
    },

    // i18n configuration
    i18n: {
        locales: ['en', 'ru', 'uz'],
        defaultLocale: 'uz',
        vueI18n: './i18n.config.ts',
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
        },
    },
});
