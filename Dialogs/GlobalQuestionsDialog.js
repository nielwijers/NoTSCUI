const builder = require('botbuilder');
const helpers = require('../helpers');

let cData;

module.exports = function (intents) {
    return {
        name: "GlobalQuestionsDialog",
        steps: [
            (session, args, next) => {
                cData = args;

                if (!helpers.questionAnswered('Geslacht', cData)) {
                    builder.Prompts.choice(session, "Wat is uw geslacht?", "Man|Vrouw", { listStyle: builder.ListStyle.button });
                } else {
                    next();
                }
            },
            (session, args, next) => {
                if (args.response != undefined) {
                    cData.characteristics.Geslacht = args.response.entity;
                }

                console.log(helpers.questionAnswered('PijnZeide', cData));

                if (!helpers.questionAnswered('PijnZeide', cData)) {
                    builder.Prompts.choice(session, "Aan welke zeide heeft u hoofdpijn?", "Links|Rechts|Beide", { listStyle: builder.ListStyle.button });
                } else {
                    next();
                }
            },
            (session, args, next) => {
                if (args.response != undefined) {
                    cData.characteristics.PijnZeide = args.response.entity;
                }

                if (!helpers.questionAnswered('PijnPunt', cData)) {
                    builder.Prompts.choice(session, "Aan welk punt heeft u hoofdpijn?", "Slaap|Voorhoofd|Achter het oog|Achter in het hoofd", { listStyle: builder.ListStyle.button });
                } else {
                    next();
                }
            },
            (session, args, next) => {
                if (args.response != undefined) {
                    cData.characteristics.PijnPunt = args.response.entity;
                }

                if (!helpers.questionAnswered('PijnSoort', cData)) {
                    builder.Prompts.choice(session, "Kunt u aangeven hoe de hoofdpijn voelt?", "Drukkend|Dof|Snijdend|Bonzend|Kloppend|Zeurend", { listStyle: builder.ListStyle.button });
                } else {
                    next();
                }
            },
            (session, args, next) => {
                if (args.response != undefined) {
                    cData.characteristics.PijnSoort = args.response.entity;
                }

                helpers.saveConversationData(session, cData, (conversationData) => {
                    session.beginDialog('ConclusionDialog', conversationData);
                });
            },
            (session, args) => {
                session.endDialog();
            }
        ]
    }
}
