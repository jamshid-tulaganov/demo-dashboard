import { computed, onMounted, ref } from 'vue';
import { theme } from 'ant-design-vue';

export const useTheme = () => {
    const isDark = ref(false);

    const themeConfig = computed(() => ({
        algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
            // Primary colors
            colorPrimary: '#4880FF',
            colorSuccess: '#00B69B',
            colorWarning: '#FFA756',
            colorError: '#EA0234',
            colorInfo: '#4880FF',

            // Font family
            fontFamily: '"Nunito Sans", ui-sans-serif, system-ui, sans-serif',

            // Dark mode specific tokens
            ...(isDark.value ? {
                colorBgContainer: '#273142',
                colorBgElevated: '#1B2431',
                colorBgLayout: '#1B2431',
                colorBorder: '#4B5668',
                colorText: '#FFFFFF',
                colorTextSecondary: 'rgba(255, 255, 255, 0.8)',
                colorTextTertiary: 'rgba(255, 255, 255, 0.6)',
            } : {
                // Light mode specific tokens
                colorBgContainer: '#FFFFFF',
                colorBgElevated: '#FFFFFF',
                colorBgLayout: '#F5F6FA',
                colorText: '#202224',
                colorTextSecondary: '#434343',
                colorTextTertiary: '#646464',
            }),
        },
    }));

    const toggleTheme = () => {
        isDark.value = !isDark.value;
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
            updateDocumentClass();
        }
    };

    const setTheme = (newTheme: 'light' | 'dark') => {
        isDark.value = newTheme === 'dark';
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', newTheme);
            updateDocumentClass();
        }
    };

    const updateDocumentClass = () => {
        if (typeof window !== 'undefined') {
            if (isDark.value) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    };

    const initTheme = () => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                isDark.value = savedTheme === 'dark';
            } else {
                // Check system preference
                isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
            updateDocumentClass();
        }
    };

    onMounted(() => {
        initTheme();
    });

    return {
        isDark,
        themeConfig,
        toggleTheme,
        setTheme,
    };
};
