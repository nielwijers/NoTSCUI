const builder = require('botbuilder');


var intents;

module.exports = {
    name: "initialDialog",
    steps: [
        (session, args) => {
          intents = args;
          session.send('Hallo, als U last heeft van hoofdpijn kan ik U helpen bij het anayleren van de hoofdpijn en daarbij advies geven.');
          builder.Prompts.text(session, 'Zou U de hoofdpijn kunnen beschrijven?');
        },
        (session, args, next) => {
            intents.recognize(session, (nullValue, entities) => {
                console.log(entities);
            });
            session.endDialog();
        }
    ]
}
