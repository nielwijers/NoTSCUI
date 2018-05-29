const builder = require('botbuilder');
const helpers = require('../helpers');

let cData;

/**
 * The GlobalQuestionsDialog will ask common question if these are not already answered.
 * @param {object} intents
 */
module.exports = function (intents) {
    return {
        name: "GlobalQuestionsDialog",
        steps: helpers.calculateGlobalSteps(intents),
    }
}

let calculateGlobalSteps = intents => {
    let steps = 
    [
        (session, args, next) => {
            cData = args;
            session.send('Ik zal een aantal vragen stellen om een goede conclusie te kunnen geven. U kunt gebruik maken van de knoppen.');
        },
        (session, args, next) => {
            if (args.response != undefined) {
                cData.characteristics.Geslacht = args.response.entity;
            }

            if (!helpers.questionAnswered('PijnZijde', cData)) {
                builder.Prompts.choice(session, "Aan welke zijde heeft u hoofdpijn?", "Links|Rechts|Beide", { listStyle: builder.ListStyle.button });
            } else {
                next();
            }
        },
        (session, args, next) => {
            if (args.response != undefined) {
                cData.characteristics.PijnZijde = args.response.entity;
            }

            if (!helpers.questionAnswered('PijnPunt', cData)) {
                builder.Prompts.choice(session, "Op welk punt voelt u de pijn het meest?", "Slaap|Voorhoofd|Achter het oog|Achter in het hoofd", { listStyle: builder.ListStyle.button });
            } else {
                next();
            }
        },
        (session, args, next) => {
            if (args.response != undefined) {
                cData.characteristics.PijnPunt = args.response.entity;
            }

            if (!helpers.questionAnswered('PijnSoort', cData)) {
                builder.Prompts.choice(session, "Welk van de volgende pijnsoorten komt het meeste overeen met uw hoofdpijn?", "Drukkend|Dof|Snijdend|Bonzend|Kloppend|Zeurend", { listStyle: builder.ListStyle.button });
            } else {
                next();
            }
        },
        (session, args, next) => {
            if (args.response != undefined) {
                cData.characteristics.PijnSoort = args.response.entity;
            }

            helpers.saveConversationData(session, cData, (conversationData) => {
                session.beginDialog('ConclusionDialog', {conversationData});
            });
        },
        (session, args) => {
            session.endDialog();
        }
    ]
    

    (session, args, next) => {
        if (args.response != undefined) cData.characteristics.Geslacht = args.response.entity;

        if (!helpers.questionAnswered('Geslacht', cData)) {
            builder.Prompts.choice(session, "Wat is uw geslacht?", "Man|Vrouw", { listStyle: builder.ListStyle.button });
        } else {
            next();
        }
    }
}
