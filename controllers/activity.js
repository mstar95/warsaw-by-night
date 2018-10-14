
const activities = require('./data/activity')
//const request = require('./data/request')
const userDb = require('./data/userDb')

const {scoreActivity, train} = require('./services/AI')

exports.activity = (placeTag, date, moodOption) => {

    moodOption = 0;
    const user = userDb.getUser("111")
    const notVisitedActivities = activities.filter(activity => !user.lastEvents.includes(activity.name))
   
    let activitiesWithWantedTags = notVisitedActivities.filter(activity => activity.tags.includes(placeTag))
    if(activitiesWithWantedTags == []) {
        activitiesWithWantedTags = notVisitedActivities
    }
    // Respond with 200 OK and challenge token from the request
    const results = activitiesWithWantedTags.map(activity => ({ activity, score: scoreActivity(activity.options, moodOption) }))
    const bestResult = randomElem(nBests(results, 1))
    const worstResult = randomElem(nWorst(results, 1))
    user.lastEvents.push( bestResult.activity.name)
    user.lastEvent = bestResult.activity.name
    user.lastWorst =  worstResult.activity.name
    return bestResult.activity;

};



exports.reactivity = (placeTag, ok, date, moodOption) => {

    moodOption = 0;
    const user = userDb.getUser("111")
    const lastActivity = activities.find(activity => activity.name === user.lastEvent)
    const worstActivity = activities.find(activity => activity.name === user.lastWorst)
  for(let i = 0; i < 1000; i++) {
    train(lastActivity.options, moodOption, ok)
    train(worstActivity.options, moodOption, !ok)
  }
  const notVisitedActivities = activities.filter(activity => !user.lastEvents.includes(activity.name))
   
    const activitiesWithWantedTags = notVisitedActivities.filter(activity => activity.tags.includes(placeTag))

    // Respond with 200 OK and challenge token from the request
    const results = activitiesWithWantedTags.map(activity => ({ activity, score: scoreActivity(activity.options, moodOption) }))
    const bestResult = randomElem(nBests(results, 1))
    user.lastEvent = bestResult.activity.name
    user.lastEvents.push( bestResult.activity.name)
    return bestResult.activity;

};

const randomElem = (sentences) => {
    return sentences[Math.floor(Math.random() * sentences.length)]
};


function nBests (data, n) {
    return data.sort((a, b) => a.score < b.score).slice(0, n)
}
function nWorst (data, n) {
  return data.sort((a, b) => a.score > b.score).slice(0, n)
}
