const translate = require('google-translate-api');

exports.translateText = (text, callback) => {
  translate(text, {to: 'en'}).then(res => {
    callback(res.text)
  }).catch(err => {
    console.error(err);
  });
};