const builder = require('botbuilder');
const apiairecognizer = require('api-ai-recognizer');
const fs = require('fs');

const FALLBACK_ANSWER = "Sorry ik heb het niet helemaal begrepen."

/* This is the default template to build a chatbot with*/
class Bot {
    constructor() {
        this.connector = new builder.ChatConnector({
            appId: process.env.MicrosoftAppId,
            appPassword: process.env.MicrosoftAppPassword
        });

        this.bot = new builder.UniversalBot(this.connector);

        this.intents = new builder.IntentDialog({
            recognizers: [new apiairecognizer("54ae2c103dcd42b5b65c4d4cd120ed25")]
        });
    }

    getConnector() {
        return this.connector
    }

    init() {
        this.bot.dialog('/', this.intents);

        fs.readdir('./Dialogs', (err, files) => {
            files.forEach(file => {
              const dialog = require('../Dialogs/' + file);
              this.intents.matches(dialog.intentName, dialog.dialogSteps);
            });
        })

        this.intents.onDefault(session => {
            session.send(FALLBACK_ANSWER);
        });
    }
}

module.exports.Bot = Bot;
