'use strict';

// Imports dependencies and set up http server
const
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()); // creates express http server
  

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

const messagesController = require("./controllers/messages");


// Accepts POST requests at /webhook endpoint
app.post('/webhook', messagesController.message);

const verificationController = require("./controllers/verification");

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', verificationController.verfication);

const activityController = require("./controllers/activity");

const feedbackController = require("./controllers/feedback");

app.post('/activity',activityController.activity )
