const Intences = {getEvents: "intent_Event", getWeather: "intent_Weather"};
const PurposeIntences = {purpose_accept: "purpose_accept", purpose_decline: "purpose_decline", purpose_proposition: "purpose_proposition"};
const HappinesIntences = {happinnes: "happinnes"};
const PropositionIntences = {proposition_disapprove: "proposition_disapprove", proposition_approve: "proposition_approve"};
const TagsIntences = {tags: "my_tag"};

const sentences = require('./data/sentences');
const activity = require('./activity');

const {sendTextMessage, sendUrlMessage} = require('./services/messageService');

const translateController = require("./translator");

const users = {};

const randomSentence = (sentences) => {
  return sentences[Math.floor(Math.random()*sentences.length)]
};

exports.tell = (senderId, text, parameters) => {
  let activityData;
  switch (text) {
    case Intences.getEvents:
      users[senderId] = {tag: "", mood: 0};
      sendTextMessage(senderId, randomSentence(sentences.happines_Questions));
      break;
    case Intences.getWeather:
      sendTextMessage(senderId, "Pogoda");
      break;
    case PurposeIntences.purpose_accept:
      if (Math.random() > 0.3) {
        sendTextMessage(senderId, randomSentence(sentences.expressionSentences_OK));
      }
      sendTextMessage(senderId, randomSentence(sentences.purpose_1_Questions));
      break;
    case PurposeIntences.purpose_decline:
      if (Math.random() > 0.5) {
        sendTextMessage(senderId, randomSentence(sentences.expressionSentences_NOK));
      }
      activityData = activity.activity();
      sendUrlMessage(senderId, activityData.name, activityData.path, activityData.img);
      break;
    case TagsIntences.tags:
      if (Math.random() > 0.7) {
        sendTextMessage(senderId, randomSentence(sentences.expressionSentences_OK));
      }
      activityData = activity.activity(users[senderId].tag);
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
    default:
      translateController.translateText(text, 'pl', (translateMessage) => {
        sendTextMessage(senderId, translateMessage);
      });
  }
};