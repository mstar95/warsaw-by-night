const Intences = {getEvents: "intent_Event", getWeather: "intent_Weather", meme: "meme"};
const PurposeIntences = {purpose_accept: "purpose_accept", purpose_decline: "purpose_decline", purpose_proposition: "purpose_proposition"};
const HappinesIntences = {happinnes: "happinnes"};
const GradeIntences = {grade: "grade"};
const PropositionIntences = {proposition_disapprove: "proposition_disapprove", proposition_approve: "proposition_approve"};
const TagsIntences = {tags: "my_tag"};

const sentences = require('./data/sentences');
const memes = require('./data/memes');
const activity = require('./activity');

const {sendTextMessage, sendUrlMessage} = require('./services/messageService');

const translateController = require("./translator");


const userDb = require('./data/userDb')

const users = {};

const randomSentence = (sentences) => {
  return sentences[Math.floor(Math.random()*sentences.length)]
};

exports.tell = (senderId, text, parameters) => {
  let activityData;
  console.log(text);
  switch (text) {
    case Intences.meme:
      const meme = randomSentence(memes);
      sendUrlMessage(senderId, meme, meme, meme);
      break;
    case Intences.getEvents:
      users[senderId] = {tag: "", mood: 0};
      const user = userDb.getUser("111")
      user.lastEvents = []
      sendTextMessage(senderId, randomSentence(sentences.happines_Questions));
      break;
    case Intences.getWeather:
      sendTextMessage(senderId, "Pogoda");
      break;
    case PurposeIntences.purpose_accept:
      if (Math.random() > 0.3) {
        sendTextMessage(senderId, randomSentence(sentences.expressionSentences_OK));
        setTimeout(() =>
          sendTextMessage(senderId, randomSentence(sentences.purpose_1_Questions)), 100)
      } else {
        sendTextMessage(senderId, randomSentence(sentences.purpose_1_Questions));
      }
      break;
    case PurposeIntences.purpose_decline:
      activityData = activity.activity();
      if (Math.random() > 0.5) {
        sendTextMessage(senderId, randomSentence(sentences.expressionSentences_NOK));
        setTimeout(() =>
          sendTextMessage(senderId, sendUrlMessage(senderId, activityData.name, activityData.path, activityData.img)), 100)
      } else {
        sendUrlMessage(senderId, activityData.name, activityData.path, activityData.img);
      }
      break;
    case TagsIntences.tags:
      users[senderId].tag = parameters.tags;
      if (Math.random() > 0.7) {
        sendTextMessage(senderId, randomSentence(sentences.expressionSentences_OK));
      }
      activityData = activity.activity(users[senderId].tag);
      sendTextMessage(senderId, randomSentence(sentences.proposition_Questions));
      sendUrlMessage(senderId, activityData.name, activityData.path, activityData.img);
      break;
    case HappinesIntences.happinnes:
      sendTextMessage(senderId, randomSentence(sentences.purposeQuestions));
      break;
    case PropositionIntences.proposition_approve:
      sendTextMessage(senderId, randomSentence(sentences.after_approve));
      sendTextMessage(senderId, randomSentence(sentences.grade_remind));
      break;
    case PropositionIntences.proposition_disapprove:
      users[senderId].mood = 0;
      activityData = activity.activity(users[senderId].tag);
      sendTextMessage(senderId, randomSentence(sentences.expressionSentences_NOK));
      sendTextMessage(senderId, randomSentence(sentences.proposition_Questions));
      sendUrlMessage(senderId, activityData.name, activityData.path, activityData.img);
      break;
    case GradeIntences.grade:
      sendTextMessage(senderId, randomSentence(sentences.next_Question));
      break;
    default:
      translateController.translateText(text, 'pl', (translateMessage) => {
        sendTextMessage(senderId, translateMessage);
      });
  }
};