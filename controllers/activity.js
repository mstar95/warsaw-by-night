
const activities = require('./data/activity')
const request = require('./data/request')
const userDb = require('./data/userDb')

exports.activity = (req, res) => {

    const user = userDb.getUser("111")
    const userTags = Object.entries(user.tags).map(([key, val]) => ({ [key]: val.val }))
    const query = { ...userTags, ...request }
    // Respond with 200 OK and challenge token from the request
    const results = activities.map(activity => ({ activity, score: scoreActivity(activity.tags, query) }))

    //  res.status(200).send("XD");

};

function scoreActivity (userTags, activityTags) {
    const scores = Object.entries(userTags).map(([tag, val]) => scoreTag(val, activityTags[tag]))
    const avrg = scores.reduce((a, b) => a + b, 0) / scores.length
    return avrg;
}

function scoreTag (userVal, activityVal) {
    return !activityVal ? 0 : 1 - Math.abs(activityVal - userVal)
}

function nBests (data, n) {
    return data.sort((a, b) => a.score > b.score).slice(n)
}
