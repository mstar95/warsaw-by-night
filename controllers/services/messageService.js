const sendMessage = (senderId, message) => {
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: "POST",
        json: {
            recipient: { id: senderId },
            message,
        }
    });
};

exports.sendUrlMessage = (senderId, text, url) => {
    sendMessage(senderId, urlStruct(text, url))
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

