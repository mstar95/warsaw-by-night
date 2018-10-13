const API_AI_TOKEN = "f29b5e09eb8147a5b760513faf635c5d";
const apiAiClient = require("apiai")(API_AI_TOKEN);
const FACEBOOK_ACCESS_TOKEN = "EAAEw3sKwE2gBAOmuqaHLZAsLco9lhBAZCLa9wtOnPEh6tumZCc9RbLqH35sb3tv6Ce1hyZBAG5fISskynNgoO8DxCbZC0p4WTkHrktQqhzS5IiJHXn096jmN925bZA4WPvf6QoQYBImHCXBK0wOzZBHXAjeYwiUZAPsbkKMCbwZAKHQZDZD";
const request = require("request");

const sendTextMessage = (senderId, text) => {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: { access_token: FACEBOOK_ACCESS_TOKEN },
  method: "POST",
  json: {
    recipient: { id: senderId },
    message: { text },
  }
});
};

const sendMessageToFlow = (event) => {
  const message = event.message.text;
  const senderId = event.sender.id;
  translateController.translateText(message, (translateMessage) => {
    const apiaiSession = apiAiClient.textRequest(translateMessage, {sessionId: "bogdan_bot"});
    apiaiSession.on("response", (response) => {
      const result = response.result.fulfillment.speech;
      sendTextMessage(senderId, result);
    });
    apiaiSession.on("error", error => console.log(error));
    apiaiSession.end();
  })
};

const translateController = require("./translator");

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