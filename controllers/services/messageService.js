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
};

exports.sendUrlMessage = (senderId, text, url, img) => {
    const struct = urlStruct(text, url, img)
    sendMessage(senderId, struct)
};

exports.sendTextMessage = (senderId, text) => {
    sendMessage(senderId, { text })
};

const urlStruct = (text, url, img) => ({
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "media",
            "elements": [
                {
                    "template_type": "media",
                    "image_url": img,
                    "buttons": [ {
                        "type": "web_url",
                        "url": url,
                        "webview_height_ratio": "tall",
                        "title": text,
                    }]
                }
            ]
        }
    }
})

