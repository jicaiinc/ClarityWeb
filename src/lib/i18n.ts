import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from '../locales/en.json';
import zh_CN from '../locales/zh_CN.json';

import { storage, STORAGE_KEYS } from './storage';

// 获取 Chrome 浏览器的语言
const getBrowserLanguage = () => {
  try {
    const browserLang = chrome.i18n?.getUILanguage();
    // 处理 Chrome 特殊的语言代码
    if (browserLang?.startsWith('en')) {
      return 'en';
    }
    if (browserLang?.startsWith('es')) {
      return 'es';
    }
    if (browserLang?.startsWith('pt')) {
      return 'pt';
    }
    return browserLang || 'en';
  } catch {
    return 'en';
  }
};

// 初始化函数
const initI18n = async () => {
  // 如果已经初始化，则不再重复初始化
  if (i18n.isInitialized) {
    return i18n;
  }

  // 从 chrome.storage 获取保存的语言设置
  const savedLang = await storage.get(STORAGE_KEYS.USER_SETTINGS.GENERAL_SETTINGS.LANGUAGE);
  
  await i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      resources: {
        en: { translation: en },
        zh_CN: { translation: zh_CN }
      },
      fallbackLng: 'en',
      lng: savedLang || getBrowserLanguage(),
      interpolation: {
        escapeValue: false
      },
      detection: {
        order: ['storage', 'navigator'],
      },
      react: {
        useSuspense: false
      }
    });

  // 监听 chrome.storage 的变化
  // 任何引用了此i18n实例的组件都会自动更新
  if (chrome.storage && chrome.storage.local) {
    chrome.storage.local.onChanged.addListener((changes) => {
      if (changes[STORAGE_KEYS.USER_SETTINGS.GENERAL_SETTINGS.LANGUAGE]) {
        const newLanguage = changes[STORAGE_KEYS.USER_SETTINGS.GENERAL_SETTINGS.LANGUAGE].newValue;
        console.log('[i18n] Language changed to:', newLanguage);
        i18n.changeLanguage(newLanguage);
      }
    });
  }

  return i18n;
};

// 导出初始化函数和 i18n 实例
export { initI18n };
export default i18n; 