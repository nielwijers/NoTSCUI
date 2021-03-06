const builder = require('botbuilder');
const helpers = require('../helpers');

let questions;
let index;
let cData;

/**
 * The GlobalQuestionsDialog will ask common question if these are not already answered.
 * @param {object} intents
 */
module.exports = function (intents) {
    return {
        name: 'GlobalQuestionsDialog',
        steps:  [
            (session, args, next) => {
                if (args.index == undefined || args.index == 0) {
                    let cData = args;
                    let questions = helpers.getGlobalQuestions(cData.characteristics.type);
                    let index = 0;

                    session.send('Ik zal een aantal vragen stellen om een conclusie te trekken en gericht advies te kunnen geven. U kunt gebruik maken van de knoppen.');

                    next({cData, questions, index});
                } else {
                    next(args);
                }
            },
            (session, args, next) => {
                questions = args.questions;
                index = args.index;
                cData = args.cData;

                if (!helpers.questionAnswered(questions[index].name, args.cData)) {
                    builder.Prompts.choice(session, questions[index].question, questions[index].answers, { listStyle: builder.ListStyle.button });
                } else {
                    next();
                }
            },
            (session, args, next) => {
                if (args.response != undefined) {
                    cData.characteristics[questions[index].name] = args.response.entity;
                }

                helpers.saveConversationData(session, cData, () => {
                    index++;

                    args = {
                        index,
                        questions,
                        cData
                    }

                    if (index >= questions.length) {
                        session.beginDialog('ConclusionDialog', {conversationData: cData});
                    } else {
                        session.beginDialog('GlobalQuestionsDialog', args);
                    }
                });
            }
        ]
    }
}
