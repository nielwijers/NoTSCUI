const builder = require('botbuilder');
const fs = require('fs');

/* This is a test to show the different promt options*/
class Bot {
  constructor() {
    this.connector = new builder.ChatConnector({
      appId: process.env.MicrosoftAppId,
      appPassword: process.env.MicrosoftAppPassword
    });

    this.bot = new builder.UniversalBot(this.connector);
  }

  getConnector() {
    return this.connector
  }

  init() {
    this.bot.dialog('/', [
      function(session) {
        session.send("Welkom bij de 'Promt' demo, hier worden de verschillende promt opties getoond");
        session.send("Om te zien hoe deze prompts geprogrammeerd worden kan in de code gekeken worden");
        session.send("Dit is de simpelste prompt, de 'text' promt");
        builder.Prompts.text(session, "Voer uw naam in");
      },
      function (session, results) {
        session.dialogData.name = results.response;
        session.send("Gezellig " + session.dialogData.name + ", we gaan nu naar de volgende prompt")
        session.send("Dit is de 'time' promt, deze werkt alleen in het Engels");
        session.send("Er moet op deze manier een tijd opgegeven worden: June 6th at 5pm");
        session.send("Wanneer dit fout gaat wordt gevraagd om het anders te formuleren");
        builder.Prompts.time(session, "Probeer maar! Vul een tijd in");
      },
      function (session, results) {
        session.dialogData.date = builder.EntityRecognizer.resolveTime([results.response]);
        session.send("We hebben nu een datum! namelijk: " + session.dialogData.date);
        session.send("De volgende promt is de 'confirm' prompt");
        session.send("Bij deze promt kan je ja of nee antwoorden");
        builder.Prompts.confirm(session, "Gebruik je een Mac?");
      },
      function (session, results) {
        session.dialogData.usingMac = results.response;
        session.send("Oke dus je gebruikt " + (session.dialogData.usingMac ? "wel een " : "geen ") + "Mac");
        session.send("We gaan door met de 'number' prompt");
        session.send("Zoals misschien wel duidelijk is moet hier een getal ingevoerd worden")
        builder.Prompts.number(session, "Hoe oud ben je?");
      },
      function (session, results) {
        session.dialogData.age = results.response;
        if (session.dialogData.age <= 49) {
          session.send("Oh, dat is niet zo oud, je bent pas " + session.dialogData.age);
        } else {
          session.send("Ach, je hebt wel veel levenservaring. Of moet ik u zeggen? :p");
        }
        session.send("De volgende prompt is de 'choice' prompt");
        session.send("Deze prompt laat je een keuze maken uit meegegeven opties")
        builder.Prompts.choice(session, "Wat is je favoriete fruit?", "Appel|Banaan|Fruit? Fruit?!?!");
      },
      function (session, results) {
        session.dialogData.favFruit = results.response.entity;
        session.send("Ah, dus " + session.dialogData.favFruit);
        session.send("Tot slot hebben we de 'attachment' prompt, waar een bestand zoals een afbeelding in geupload kan worden")
        builder.Prompts.attachment(session, "Upload een bestand");
      },
      function (session, results) {
        session.dialogData.attachment = results.response[0];
        session.send({
            text: "Je hebt het volgende meegestuurd:",
            attachments: [
                {
                    contentType: session.dialogData.attachment.contentType,
                    contentUrl: session.dialogData.attachment.contentUrl,
                    name: session.dialogData.attachment.name
                }
            ]
        });

        session.send("Nou, dat was hem dan. Ik vond het erg gezellig " + session.dialogData.name + "!")
        session.endDialog();
      }
    ])
  }
}

module.exports.Bot = Bot;
