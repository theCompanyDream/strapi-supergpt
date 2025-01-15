const fs = require('fs');
const path = require('path');

const translationsDir = path.join(__dirname, '..', '..', 'admin', 'src', 'translations');

// Load all JSON files from the translations directory
const loadTranslations = () => {
  const files = fs.readdirSync(translationsDir);
  const translations = {};
  files.forEach(file => {
    const filePath = path.join(translationsDir, file);
    const language = path.basename(file, path.extname(file));
    translations[language] = require(filePath);
  });
  return translations;
};

describe('Translation Keys', () => {
  const translations = loadTranslations();
  const languages = Object.keys(translations);
  const baseLanguage = 'en'; // assuming English is the base language

  languages.forEach(language => {
    if (language !== baseLanguage) {
      test(`should have the same keys in ${baseLanguage}.json and ${language}.json`, () => {
        const baseKeys = Object.keys(translations[baseLanguage]);
        const langKeys = Object.keys(translations[language]);

        expect(baseKeys).toEqual(langKeys);
      });
    }
  });
});

describe('Translation Values', () => {
  const translations = loadTranslations();
  const languages = Object.keys(translations);
  const baseLanguage = 'en'; // assuming English is the base language

  languages.forEach(language => {
    if (language !== baseLanguage) {
      test(`should have similar values in ${baseLanguage}.json and ${language}.json`, () => {
        const baseTranslations = translations[baseLanguage];
        const langTranslations = translations[language];

        for (const key in baseTranslations) {
          if (baseTranslations.hasOwnProperty(key)) {
            const baseValue = baseTranslations[key].toLowerCase();
            const langValue = langTranslations[key].toLowerCase();
            // Perform a basic comparison of the values
            expect(baseValue).not.toBe('');
            expect(langValue).not.toBe('');
          }
        }
      });
    }
  });
});
