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
                console.log(args);
                if (args.index == undefined || args.index == 0) {
                    let cData = args;
                    let questions = helpers.getGlobalQuestions(cData.characteristics.type);
                    let index = 0;

                    session.send('Ik zal een aantal vragen stellen om een goede conclusie te kunnen geven. U kunt gebruik maken van de knoppen.');

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

                // next(args);
            },
            (session, args, next) => {
                if (args.response != undefined) {
                    cData.characteristics[questions[index].name] = args.response.entity;
                }

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
            }
        ]
    }
}

// let calculateGlobalSteps = intents => {
//     let steps = 
//     [
//         (session, args, next) => {
//             cData = args;
//             session.send('Ik zal een aantal vragen stellen om een goede conclusie te kunnen geven. U kunt gebruik maken van de knoppen.');
//         },
//         (session, args, next) => {
//             if (args.response != undefined) {
//                 cData.characteristics.Geslacht = args.response.entity;
//             }

//             if (!helpers.questionAnswered('PijnZijde', cData)) {
//                 builder.Prompts.choice(session, "Aan welke zijde heeft u hoofdpijn?", "Links|Rechts|Beide", { listStyle: builder.ListStyle.button });
//             } else {
//                 next();
//             }
//         },
//         (session, args, next) => {
//             if (args.response != undefined) {
//                 cData.characteristics.PijnZijde = args.response.entity;
//             }

//             if (!helpers.questionAnswered('PijnPunt', cData)) {
//                 builder.Prompts.choice(session, "Op welk punt voelt u de pijn het meest?", "Slaap|Voorhoofd|Achter het oog|Achter in het hoofd", { listStyle: builder.ListStyle.button });
//             } else {
//                 next();
//             }
//         },
//         (session, args, next) => {
//             if (args.response != undefined) {
//                 cData.characteristics.PijnPunt = args.response.entity;
//             }

//             if (!helpers.questionAnswered('PijnSoort', cData)) {
//                 builder.Prompts.choice(session, "Welk van de volgende pijnsoorten komt het meeste overeen met uw hoofdpijn?", "Drukkend|Dof|Snijdend|Bonzend|Kloppend|Zeurend", { listStyle: builder.ListStyle.button });
//             } else {
//                 next();
//             }
//         },
//         (session, args, next) => {
//             if (args.response != undefined) {
//                 cData.characteristics.PijnSoort = args.response.entity;
//             }

//             helpers.saveConversationData(session, cData, (conversationData) => {
//                 session.beginDialog('ConclusionDialog', {conversationData});
//             });
//         },
//         (session, args) => {
//             session.endDialog();
//         }
//     ]
    

//     (session, args, next) => {
//         if (args.response != undefined) cData.characteristics.Geslacht = args.response.entity;

//         if (!helpers.questionAnswered('Geslacht', cData)) {
//             builder.Prompts.choice(session, "Wat is uw geslacht?", "Man|Vrouw", { listStyle: builder.ListStyle.button });
//         } else {
//             next();
//         }
//     }
// }
