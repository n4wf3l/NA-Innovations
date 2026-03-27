import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all translations
import en from '../../../lang/en.json';
import fr from '../../../lang/fr.json';
import nl from '../../../lang/nl.json';

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        fr: { translation: fr },
        nl: { translation: nl },
    },
    lng: document.documentElement.lang || 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false, // React already escapes
    },
});

export default i18n;
