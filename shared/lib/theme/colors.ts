/**
 * Color Palette for Dashboard
 *
 * This file documents the color system used throughout the application.
 * Colors are configured in both Tailwind (tailwind.config.js) and Ant Design (useTheme.ts)
 */

export const colors = {
    // Primary Colors
    primary: '#4880FF',

    // Status Colors
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

    // Chart Colors
    chart: {
        purple: '#8280FF',
        yellow: '#FEC53D',
        green: '#4AD991',
        orange: '#FF9066',
        pink: '#F93C65',
        teal: '#00B69B',
    },

    // Dark Mode Colors
    dark: {
        primary: '#1B2431',      // Main background
        secondary: '#273142',    // Secondary background (cards, headers)
        tertiary: '#323D4E',     // Tertiary background (items)
        quaternary: '#4B5668',   // Buttons background
        text: {
            primary: '#FFFFFF',
            secondary: 'rgba(255, 255, 255, 0.8)',  // Placeholders
        },
        hover: '#4880FF',        // Button hover background
    },

    // Light Mode Colors
    light: {
        bg: '#F5F6FA',          // Dashboard menu background
        menu: '#FFFFFF',        // Menu background
        text: {
            primary: '#202224',
            secondary: '#434343',   // Placeholders, hints
            tertiary: '#646464',
        },
        button: {
            text: '#FFFFFF',
        },
    },
} as const;

export type ColorPalette = typeof colors;
