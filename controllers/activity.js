
const activities = require('./data/activity')
//const request = require('./data/request')
const userDb = require('./data/userDb')

exports.activity = (placeTag, date, moodOption) => {

    moodOption = 0;
    const user = userDb.getUser("111")

    const userOptions = {...user.options, mood: {val: moodOption} }

    const activitiesWithWantedTags = activities.filter(activity => activity.tags.includes(placeTag))

    // Respond with 200 OK and challenge token from the request
    const results = activitiesWithWantedTags.map(activity => ({ activity, score: scoreActivity(userOptions, activity.options) }))
    const bestResult = randomElem(nBests(results, 1))
    user.lastEvent = bestResult.activity.name
    return bestResult.activity;

};

exports.reactivity = (placeTag, date, moodOption) => {

    moodOption = 0;
    const user = userDb.getUser("111")

    const userOptions = {...user.options, mood: {val: moodOption} }
    const notLastActivities = activities.filter(activity => activity.name != user.lastEvent)
    const activitiesWithWantedTags = notLastActivities.filter(activity => activity.tags.includes(placeTag))

    // Respond with 200 OK and challenge token from the request
    const results = activitiesWithWantedTags.map(activity => ({ activity, score: scoreActivity(userOptions, activity.options) }))
    const bestResult = randomElem(nBests(results, 2))
    return bestResult.activity;

};

const randomElem = (sentences) => {
    return sentences[Math.floor(Math.random()*sentences.length)]
  };

function scoreActivity (userTags, activityTags) {
    const scores = Object.entries(userTags).map(([tag, val]) => scoreTag(val.val, activityTags[tag]))
    const avrg = scores.reduce((a, b) => a + b, 0) / scores.length
    return avrg;
}

function scoreTag (userVal, activityVal) {
    return !activityVal ? 0 : 1 - Math.abs(activityVal - userVal)
}

function nBests (data, n) {
    return data.sort((a, b) => a.score > b.score).slice(0, n)
}
