const builder = require('botbuilder');
const helpers = require('../helpers');

module.exports = function (intents) {
    return {
        name: "initialDialog",
        steps: [
            (session, args) => {
                session.send('Hallo, als U last heeft van hoofdpijn kan ik U helpen bij het anayleren van de hoofdpijn en daarbij advies geven.');
                builder.Prompts.text(session, 'Zou U de hoofdpijn kunnen beschrijven?');
            },
            (session, args, next) => {
                // wacht 2 seconden
                helpers.answerQuestionsWithEntities(session, intents, converationData =>
                // if typing: wacht op bericht of wacht tot typen klaar is en wacht 2 seconden.
                    session.beginDialog('GlobalQuestionsDialog', converationData));
            }
        ]
    }
}
