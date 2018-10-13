const googleTranslate = require('google-translate')("AIzaSyAdVQBL85b3bdQZlWK9IFpkn8OKVu4ynGo ");

exports.translateText = (text, callback) => {
  googleTranslate.translate(text, 'en', (err, translation) => {
    callback(translation.translatedText)
  });
};