const API_AI_TOKEN = "f29b5e09eb8147a5b760513faf635c5d";
const apiAiClient = require("apiai")(API_AI_TOKEN);

const Intences = {getEvents: "intent_Event", getWeather: "intent_Weather"};
const PurposeIntences = {purpose_accept: "purpose_accept", purpose_decline: "purpose_decline", purpose_proposition: "purpose_proposition"};
const HappinesIntences = {happinnes: "happinnes"};

const sentences = require('./data/sentences');
const activity = require('./activity');

const {sendTextMessage, sendUrlMessage} = require('./services/messageService');

const translateController = require("./translator");

const sendResponse = (senderId, text, date, happinnes) => {
  switch (text) {
    case Intences.getEvents:
      sendTextMessage(senderId, sentences.purposeQuestions[Math.floor(Math.random()*sentences.purposeQuestions.length)]);
      break;
    case Intences.getWeather:
      sendTextMessage(senderId, "Pogoda");
      break;
    case PurposeIntences.purpose_accept:
      if(Math.random() > 0.3) {
        sendTextMessage(senderId, sentences.expressionSentences_OK[Math.floor(Math.random() * sentences.expressionSentences_OK.length)]);
      }
      sendTextMessage(senderId, sentences.purpose_1_Questions[Math.floor(Math.random()*sentences.purpose_1_Questions.length)]);
      break;
    case PurposeIntences.purpose_decline:
      if(Math.random() > 0.5) {
        sendTextMessage(senderId, sentences.expressionSentences_NOK[Math.floor(Math.random() * sentences.expressionSentences_NOK.length)]);
      }
      sendTextMessage(senderId, sentences.purpose_1_Questions[Math.floor(Math.random()*sentences.purpose_1_Questions.length)]);
      break;
    case PurposeIntences.purpose_proposition:
      if(Math.random() > 0.7) {
        sendTextMessage(senderId, sentences.expressionSentences_OK[Math.floor(Math.random() * sentences.expressionSentences_OK.length)]);
      }
      sendTextMessage(senderId, sentences.happines_Questions[Math.floor(Math.random()*sentences.happines_Questions.length)]);
      break;
    case HappinesIntences.happinnes:
      const happy = happinnes;
      const activityData = activity.activity({});
      sendUrlMessage(senderId, activityData.name, activityData.path, activityData.img);
      break;
    default:
      translateController.translateText(text, 'pl', (translateMessage) => {
        sendTextMessage(senderId, translateMessage);
      });
  }
};

const sendMessageToFlow = (event) => {
  const message = event.message.text;
  const senderId = event.sender.id;
  const apiaiSession = apiAiClient.textRequest(message, {sessionId: "bogdan_bot"});
  apiaiSession.on("response", (response) => {
    const result = response.result.fulfillment.speech;
    const date = response.result.parameters.date;
    const happinnes = response.result.parameters.happinnes;
    sendTextMessage(senderId, result);
  });
  apiaiSession.on("error", error => console.log(error));
  apiaiSession.end();
};

exports.message = (req, res) => {

  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Get the webhook event. entry.messaging is an array, but
      // will only ever contain one event, so we get index 0
      let webhook_event = entry.messaging[0];
      sendMessageToFlow(webhook_event);

    });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

};