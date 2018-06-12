const builder = require('botbuilder');
const helpers = require('../helpers');

let questions;
let index;
let cData;

/**
 * Checks ith the user if the symptoms are intens or not.
 * @param {object} intents
 */
module.exports = function (intents) {
    return {
        name: "IntensityDialog",
        steps: [
            (session, args, next) => {
                if (args.index == undefined || args.index == 0) {
                    let cData = args;
                    let questions = helpers.getIntensityQuestions(cData.characteristics.type);
                    let index = 0;

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
                        session.beginDialog('AdviceDialog', cData);
                    } else {
                        session.beginDialog('IntensityDialog', args);
                    }
                });
            }
        ]
    }
}
