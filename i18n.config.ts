import en from './locales/en.json';
import ru from './locales/ru.json';
import uz from './locales/uz.json';

export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'uz',
    fallbackLocale: 'en',
    messages: {
        en,
        ru,
        uz,
    },
}));
