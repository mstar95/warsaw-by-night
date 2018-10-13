
const activities = require('./data/activity')
const userDb = require('./data/userDb')

exports.feedback = (req, res) => {

    const user = userDb.getUser("111")
    const lastEvent = activities.find(a => a.id == user.lastEventId)
    Object.entries(lastEvent.tags).forEach(([tag, value]) => changeTagValue(tag, value, user, true))
    console.log(user)
    // userDb.saveUser(user)
};

function changeTagValue (tag, tagValue, user, ok) {
    const sign = ok === true ? 1 : -1
    const userTag = user.tags[tag]
    if (!userTag) {
        return
    }
    const tagVal = userTag.val * userTag.rates
    userTag.rates++
    userTag.val = (tagVal + sign * tagValue) / userTag.rates
}

