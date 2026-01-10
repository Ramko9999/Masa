import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en.json";
import te from "@/locales/te.json";
import { UserApi } from "@/api/user";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: en,
  },
  te: {
    translation: te,
  },
};

// Initialize i18n with async language detection
const initI18n = async () => {
  const defaultLanguage = await UserApi.getLanguage();

  await i18n.use(initReactI18next).init({
    resources,
    lng: defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
  });
};

// Initialize i18n
initI18n();

export default i18n;
