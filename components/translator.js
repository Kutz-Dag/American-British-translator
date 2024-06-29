const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
  translate(text, locale) {
    if (text === undefined || text === null || text === '') {
      return { error: 'No text to translate' };
    }
    if (!locale || (locale !== 'american-to-british' && locale !== 'british-to-american')) {
      return { error: 'Invalid value for locale field' };
    }
    if (locale === 'american-to-british') {
      return this.americanToBritish(text);
    } else {
      return this.britishToAmerican(text);
    }
  }

  americanToBritish(text) {
    let translatedText = text;

    translatedText = translatedText.replace(/\b\d{1,2}:\d{2}\b/g, match => `<span class="highlight">${match.replace(':', '.')}</span>`);

    for (const [american, british] of Object.entries(americanToBritishTitles)) {
      const americanRegex = new RegExp(`\\b${american}(?=\\s\\w)`, 'gi');
      translatedText = translatedText.replace(americanRegex, match => `<span class="highlight">${british.charAt(0).toUpperCase() + british.slice(1)}</span>`);
    }

    for (const [american, british] of Object.entries(americanOnly)) {
      const americanRegex = new RegExp(`\\b${american}\\b`, 'gi');
      translatedText = translatedText.replace(americanRegex, `<span class="highlight">${british}</span>`);
    }

    for (const [american, british] of Object.entries(americanToBritishSpelling)) {
      const americanRegex = new RegExp(`\\b${american}\\b`, 'gi');
      translatedText = translatedText.replace(americanRegex, `<span class="highlight">${british}</span>`);
    }

    if (translatedText === text) {
      return { text, translation: "Everything looks good to me!" };
    }
    return { text, translation: translatedText };
  }

  britishToAmerican(text) {
    let translatedText = text;

    translatedText = translatedText.replace(/\b\d{1,2}\.\d{2}\b/g, match => `<span class="highlight">${match.replace('.', ':')}</span>`);

    for (const [british, american] of Object.entries(this.invert(americanToBritishTitles))) {
        const britishRegex = new RegExp(`\\b${british}(?=\\s\\w)`, 'gi');
        translatedText = translatedText.replace(britishRegex, match => `<span class="highlight">${american.charAt(0).toUpperCase() + american.slice(1)}</span>`);
    }

    for (const [british, american] of Object.entries(britishOnly)) {
        const britishRegex = new RegExp(`\\b${british}\\b`, 'gi');
        translatedText = translatedText.replace(britishRegex, `<span class="highlight">${american}</span>`);
    }

    for (const [british, american] of Object.entries(this.invert(americanToBritishSpelling))) {
        const britishRegex = new RegExp(`\\b${british}\\b`, 'gi');
        translatedText = translatedText.replace(britishRegex, `<span class="highlight">${american}</span>`);
    }

    translatedText = translatedText.replace(/<span class="highlight">([^<]*)<span class="highlight">([^<]*)<\/span><\/span>/gi, '<span class="highlight">$2</span>');

    if (translatedText === text) {
        return { text, translation: "Everything looks good to me!" };
    }
    return { text, translation: translatedText };
}

  invert(obj) {
    let ret = {};
    for (let key in obj) {
      ret[obj[key]] = key;
    }
    return ret;
  }

  highlight(text) {
    return `<span class="highlight">${text}</span>`;
  }

  capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}

module.exports = Translator;