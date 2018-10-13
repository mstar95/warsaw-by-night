const FACEBOOK_ACCESS_TOKEN = "EAAEw3sKwE2gBAOmuqaHLZAsLco9lhBAZCLa9wtOnPEh6tumZCc9RbLqH35sb3tv6Ce1hyZBAG5fISskynNgoO8DxCbZC0p4WTkHrktQqhzS5IiJHXn096jmN925bZA4WPvf6QoQYBImHCXBK0wOzZBHXAjeYwiUZAPsbkKMCbwZAKHQZDZD";
const request = require("request");

const sendMessage = (senderId, message) => {
    const res = request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: "POST",
        json: {
            recipient: { id: senderId },
            message,
        }
    });
    console.log(res)
};

exports.sendUrlMessage = (senderId, text, url) => {
    const struct = urlStruct(text, url)
    console.log(text, url)
    sendMessage(senderId, struct)
};

exports.sendTextMessage = (senderId, text) => {
    sendMessage(senderId, { text })
};

const urlStruct = (text, url) => ({
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "generic",
            "elements": [
                {
                    "title": text,
                    "image_url":"http://www.godominion.com/content/images/feature-img-small-appliance-electronics.png",
                    "default_action": {
                        "type": "web_url",
                        "url": url,
                        "webview_height_ratio": "tall",
                    }
                }
            ]
        }
    }
})

