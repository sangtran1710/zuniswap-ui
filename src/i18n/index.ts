// src/i18n/index.ts
import { I18nStrings, LanguageOption } from '../types';
import en from './en';
import vi from './vi';

const i18n: Record<LanguageOption, I18nStrings> = {
  english: en,
  vietnamese: vi
};

export default i18n;