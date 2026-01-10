// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },

    modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss", "@ant-design-vue/nuxt"],

    typescript: {
        strict: true,
        typeCheck: true,
    },

    css: ["ant-design-vue/dist/reset.css"],

    antd: {
        extractStyle: true,
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
                    content:
                        "Dashboard built with Nuxt 3, Tailwind CSS, and Ant Design Vue",
                },
            ],
        },
    },
});
