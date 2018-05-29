const builder = require('botbuilder');
const helpers = require('../helpers');

/**
 * The initial dialog asks the user to discribe their symptoms.
 * @param {object} intents 
 */
module.exports = function (intents) {
    return {
        name: "initialDialog",
        steps: [
            (session, args) => {
                builder.Prompts.text(session, 'Kunt u de klachten beschrijven?');
            },
            (session, args, next) => {
                helpers.answerQuestionsWithEntities(session, intents, converationData =>
                    session.beginDialog('GlobalQuestionsDialog', converationData));
            }
        ]
    }
}
