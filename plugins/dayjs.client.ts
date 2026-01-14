import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/ru';
import 'dayjs/locale/uz';
import localeData from 'dayjs/plugin/localeData';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import advancedFormat from 'dayjs/plugin/advancedFormat';

export default defineNuxtPlugin(() => {
    dayjs.extend(localeData);
    dayjs.extend(customParseFormat);
    dayjs.extend(advancedFormat);
    dayjs.locale('en');

    return {
        provide: {
            dayjs,
        },
    };
});
