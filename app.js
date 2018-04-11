var builder = require('botbuilder');
var apiairecognizer = require('api-ai-recognizer');
var express = require('express');
var app = express();

app.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log('listening');
});

var connector = new builder.ChatConnector({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword
});
      
var bot = new builder.UniversalBot(connector);
      
var recognizer = new apiairecognizer("54ae2c103dcd42b5b65c4d4cd120ed25");
var intents = new builder.IntentDialog({
  recognizers: [recognizer]
});

app.post('/api/messages', connector.listen());

bot.dialog('/',intents);

intents.matches('KrijgAdvies',[
  function(session,args){
    var pijnpunt = builder.EntityRecognizer.findEntity(args.entities,'PijnPunt');
    if (pijnpunt){
      builder.Prompts.text(session, "Neem een Asperine");
    }
  }
]);
  
intents.onDefault(function(session){
  session.send("Sorry...can you please rephrase?");
});
