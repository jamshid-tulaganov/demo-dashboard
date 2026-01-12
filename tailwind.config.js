/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./widgets/**/*.{js,vue,ts}",
        "./features/**/*.{js,vue,ts}",
        "./entities/**/*.{js,vue,ts}",
        "./shared/**/*.{js,vue,ts}",
        "./app.vue",
        "./error.vue",
    ],
    theme: {
        extend: {
            colors: {
                // Primary colors
                primary: {
                    DEFAULT: '#4880FF',
                    blue: '#4880FF',
                },
                // Status colors
                red: {
                    DEFAULT: '#EA0234',
                    light: 'rgba(234, 2, 52, 0.2)',
                },
                green: {
                    DEFAULT: '#00B69B',
                    light: 'rgba(0, 182, 155, 0.2)',
                },
                purple: {
                    DEFAULT: '#6226EF',
                    light: 'rgba(98, 38, 239, 0.2)',
                },
                orange: {
                    DEFAULT: '#FFA756',
                    light: 'rgba(255, 167, 86, 0.2)',
                },
                pink: {
                    DEFAULT: '#BA29FF',
                    light: 'rgba(186, 41, 255, 0.2)',
                },
                yellow: {
                    DEFAULT: '#FEC53D',
                    light: 'rgba(254, 197, 61, 0.2)',
                },
                // Neutral colors
                // Chart colors
                chart: {
                    purple: '#8280FF',
                    yellow: '#FEC53D',
                    green: '#4AD991',
                    orange: '#FF9066',
                    pink: '#F93C65',
                    teal: '#00B69B',
                    purpleLight: 'rgba(130, 128, 255, 0.2)',
                    yellowLight: 'rgba(254, 197, 61, 0.2)',
                    greenLight: 'rgba(74, 217, 145, 0.2)',
                    orangeLight: 'rgba(255, 144, 102, 0.2)',
                    pinkLight: 'rgba(249, 60, 101, 0.2)',
                    tealLight: 'rgba(0, 182, 155, 0.2)',
                },
                // Dark mode colors
                dark: {
                    primary: '#1B2431',
                    secondary: '#273142',
                    tertiary: '#323D4E',
                    quaternary: '#4B5668',
                    text: {
                        primary: '#FFFFFF',
                        secondary: 'rgba(255, 255, 255, 0.8)',
                    },
                },
                // Light mode colors
                light: {
                    bg: '#F5F6FA',
                    menu: '#FFFFFF',
                    text: {
                        primary: '#202224',
                        secondary: '#434343',
                        tertiary: '#646464',
                    },
                },
            },
            fontFamily: {
                sans: ["Nunito Sans", "ui-sans-serif", "system-ui", "sans-serif"],
            },
        },
    },
    plugins: [],
    // Important: Prevent Tailwind from conflicting with Ant Design
    corePlugins: {
        preflight: true,
    },
};
