const builder = require('botbuilder');
const apiairecognizer = require('api-ai-recognizer');
const fs = require('fs');

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
              const dialog = require('./Dialogs/' + file);
              this.intents.matches(dialog.intentName, dialog.dialogSteps);
            });
        })

        this.intents.onDefault(session => { 
            session.send("Sorry...can you please rephrase?"); 
        }); 
    }

    // krijgAdviesDialog() {
    //     this.intents.matches('KrijgAdvies',[ 
    //         (session,args) => { 
    //           var pijnpunt = builder.EntityRecognizer.findEntity(args.entities,'PijnPunt'); 
    //           if (pijnpunt){ 
    //             builder.Prompts.text(session, "Neem een Asperine"); 
    //           } 
    //         } 
    //     ]); 
    // }

    // defaultDialog() {
        
    // }
    
}

module.exports.Bot = Bot;