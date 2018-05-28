const builder = require('botbuilder');
const apiairecognizer = require('api-ai-recognizer');
const fs = require('fs');

const FALLBACK_ANSWER = "Sorry ik heb het niet helemaal begrepen."

/* This is the default template to build a chatbot with*/
class Bot {

    /**
     * Constructs the bot and connects it to the DialogFlow recognizer.
     */
    constructor() {
        this.connector = new builder.ChatConnector({
            appId: process.env.MicrosoftAppId,
            appPassword: process.env.MicrosoftAppPassword
        });

        this.bot = new builder.UniversalBot(this.connector, [
            session => {
                session.send(FALLBACK_ANSWER);
            }
        ]);

        this.intents = new builder.IntentDialog({
            recognizers: [new apiairecognizer("54ae2c103dcd42b5b65c4d4cd120ed25")]
        });
    }
    
    getConnector() {
        return this.connector
    }

    /**
     * Initializes the initial prompt and all separate dialogs in the /Dialogs folder.
     */
    init() {
        this.bot.dialog('/start', this.intents);

        fs.readdir('./Dialogs', (err, files) => {
            files.forEach(file => {
              let dialog = require('../Dialogs/' + file)(this.intents);
              this.bot.dialog(dialog.name, dialog.steps);
            });
        })

        /**
         * Initial dialog. Is triggered when a person enters the chat.
         */
        this.bot.on('conversationUpdate', message => {
            if (message.membersAdded) {
                 message.membersAdded.forEach(identity => {
                     if (identity.id === message.address.bot.id) {
                        let intents = this.intents;
                        this.bot.set(`persistData`, false);
                        this.bot.send(new builder.Message().address(message.address).text('Hallo, als u last heeft van hoofdpijn kan ik u helpen bij het anayleren van de hoofdpijn en daarbij advies geven.'));
                        this.bot.beginDialog(message.address, 'initialDialog', intents);
                        this.bot.beginDialogAction('StopAction', 'StopDialog', { matches: /^stop$/i });
                        this.bot.beginDialogAction('HelpAction', 'HelpDialog', { matches: /^help$/i });
                     }
                 });
             }
         });
    }
}

module.exports.Bot = Bot;
