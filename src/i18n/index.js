import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import ur from "./locales/ur.json";
import bn from "./locales/bn.json";
import te from "./locales/te.json";
import mr from "./locales/mr.json";
import ta from "./locales/ta.json";
import gu from "./locales/gu.json";
import kn from "./locales/kn.json";
import ml from "./locales/ml.json";
import or from "./locales/or.json";
import pa from "./locales/pa.json";
import as from "./locales/as.json";
import mai from "./locales/mai.json";
import sat from "./locales/sat.json";
import ks from "./locales/ks.json";
import ne from "./locales/ne.json";
import sd from "./locales/sd.json";
import kok from "./locales/kok.json";
import doi from "./locales/doi.json";
import mni from "./locales/mni.json";
import bodo from "./locales/bodo.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      ur: { translation: ur },
      bn: { translation: bn },
      te: { translation: te },
      mr: { translation: mr },
      ta: { translation: ta },
      gu: { translation: gu },
      kn: { translation: kn },
      ml: { translation: ml },
      or: { translation: or },
      pa: { translation: pa },
      as: { translation: as },
      mai: { translation: mai },
      sat: { translation: sat },
      ks: { translation: ks },
      ne: { translation: ne },
      sd: { translation: sd },
      kok: { translation: kok },
      doi: { translation: doi },
      mni: { translation: mni },
      bodo: { translation: bodo }
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;