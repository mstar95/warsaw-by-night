const googleTranslate = require('google-translate')("AIzaSyAdVQBL85b3bdQZlWK9IFpkn8OKVu4ynGo ");

exports.translateText = (text, language, callback) => {
  googleTranslate.translate(text, language, (err, translation) => {
    callback(translation.translatedText)
  });
};