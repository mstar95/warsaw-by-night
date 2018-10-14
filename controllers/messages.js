const API_AI_TOKEN = "f29b5e09eb8147a5b760513faf635c5d";
const apiAiClient = require("apiai")(API_AI_TOKEN);

const activity = require('./activity');

const translateController = require("./translator");
const speakAgent = require("./speakAgent");

const sendResponse = (senderId, text, date, happinnes) => {
  const activityData = activity.activity({});
  speakAgent.tell(senderId, text, activityData);
};

const sendMessageToFlow = (event) => {
  const message = event.message.text;
  const senderId = event.sender.id;
  // translateController.translateText(message, 'en', (translateMessage) => {
  //   const apiaiSession = apiAiClient.textRequest(translateMessage, {sessionId: "bogdan_bot"});
  //   apiaiSession.on("response", (response) => {
  //     const result = response.result.fulfillment.speech;
  //     const date = response.result.parameters.date;
  //     const happinnes = response.result.parameters.happinnes;
  //     sendResponse(senderId, result, date, happinnes);
  //   });
  //   apiaiSession.on("error", error => console.log(error));
  //   apiaiSession.end();
  // })
  //TO fix translates
  const apiaiSession = apiAiClient.textRequest("asd", {sessionId: "bogdan_bot"});
  apiaiSession.on("response", (response) => {
    const result = response.result.fulfillment.speech;
    const date = response.result.parameters.date;
    const happinnes = response.result.parameters.happinnes;
    sendResponse(senderId, "intent_Event", date, happinnes);
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