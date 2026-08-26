export type TextDirection = 'ltr' | 'rtl';

const RTL_LANGUAGES = new Set(['ar', 'ckb', 'fa', 'he', 'ur']);

export function getLanguageCode(language: string): string {
  return language.trim().toLowerCase().split(/[-_]/, 1)[0] || 'en';
}

export function getTextDirection(language: string): TextDirection {
  return RTL_LANGUAGES.has(getLanguageCode(language)) ? 'rtl' : 'ltr';
}

export function applyDocumentLanguage(language: string): void {
  const normalizedLanguage = language || 'en';
  const root = document.documentElement;

  root.lang = normalizedLanguage;
  root.dir = getTextDirection(normalizedLanguage);
}

