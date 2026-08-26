import { applyDocumentLanguage, getLanguageCode, getTextDirection } from '@/i18n/direction';

describe('document language direction', () => {
  it.each(['fa', 'fa-IR', 'ar-SA', 'he', 'ur-PK', 'ckb-KU'])('uses RTL for %s', (language) => {
    expect(getTextDirection(language)).toBe('rtl');
  });

  it.each(['en', 'en-US', 'fr-FR', 'de-DE'])('uses LTR for %s', (language) => {
    expect(getTextDirection(language)).toBe('ltr');
  });

  it('normalizes locale variants before direction lookup', () => {
    expect(getLanguageCode('FA_ir')).toBe('fa');
  });

  it('updates lang and dir together on the document root', () => {
    applyDocumentLanguage('fa');
    expect(document.documentElement.lang).toBe('fa');
    expect(document.documentElement.dir).toBe('rtl');

    applyDocumentLanguage('en-US');
    expect(document.documentElement.lang).toBe('en-US');
    expect(document.documentElement.dir).toBe('ltr');
  });
});
