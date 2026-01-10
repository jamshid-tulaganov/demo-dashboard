import { useI18n } from 'vue-i18n';

export const useLocale = () => {
    const { locale, t } = useI18n();

    const availableLocales = [
        { code: 'uz', name: "O'zbekcha", flag: '🇺🇿' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
    ];

    const setLocale = (newLocale: string) => {
        if (availableLocales.some((l) => l.code === newLocale)) {
            locale.value = newLocale;
            if (process.client) {
                localStorage.setItem('locale', newLocale);
            }
        }
    };

    const getCurrentLocale = () => {
        return availableLocales.find((l) => l.code === locale.value);
    };

    return {
        locale,
        availableLocales,
        setLocale,
        getCurrentLocale,
        t,
    };
};
