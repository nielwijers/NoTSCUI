const builder = require('botbuilder');
const helpers = require('../helpers');

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
                cData = args;

                if (!helpers.questionAnswered('Hevigheid', cData)) {
                    builder.Prompts.choice(session, "Hoe intens neemt u de hoofdpijn waar?", "1: Mild|2: Aanwezig|3: Heftig|4: Intens", { listStyle: builder.ListStyle.button });
                } else {
                    next();
                }
            },
            (session, args) => {
                if (args.response != undefined) {
                    cData.characteristics.Hevigheid = args.response.entity[0];
                }
                builder.Prompts.text(session, "Wanneer is de hoofdpijn begonnen met opkomen?");
            },
            (session, args, next) => {
                if (!helpers.questionAnswered('Aanwezigheid', cData)) {
                    builder.Prompts.choice(session, "Met welke frequentie komt de hoofdpijn voor?", "Wisselend|Continu", { listStyle: builder.ListStyle.button });
                } else {
                    next();
                }
            },
            (session, args) => {
                session.beginDialog('AdviceDialog', cData);
            }
        ]
    }
}
