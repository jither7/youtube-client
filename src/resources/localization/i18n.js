import i18n from 'i18next';
import {reactI18nextModule} from "react-i18next";
import en from './locals/en/en.json'
import vn from './locals/vn/vn.json'

const resources = {
    en: {
        translation: en
    },
    vi: {
        translation: vn
    },
};

i18n.use(reactI18nextModule)
.init({
    resources,
    lng: "vi",
    fallbackLng: "vi",
    interpolation: {
        escapeValue: false
    }
});

export default i18n;