import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import esCommon from "./locales/es/common.json";
import enCommon from "./locales/en/common.json";

import esSidebar from "./locales/es/sidebar.json";
import enSidebar from "./locales/en/sidebar.json";

import esDashboard from "./locales/es/dashboard.json";
import enDashboard from "./locales/en/dashboard.json";

const resources = {
    es: {
        common: esCommon,
        sidebar: esSidebar,
        dashboard: esDashboard,
    },
    en: {
        common: enCommon,
        sidebar: enSidebar,
        dashboard: enDashboard,
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem("lang") || "es",
        fallbackLng: "es",
        interpolation: {
            escapeValue: false,
        },
        ns: ["common", "sidebar", "dashboard"],
        defaultNS: "common",
    });

export default i18n;