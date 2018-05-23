const builder = require('botbuilder');
const helpers = require('../helpers');

let cData;

module.exports = function (intents) {
    return {
        name: "IntensityDialog",
        steps: [
            (session, args, next) => {
                cData = args;

                if (!helpers.questionAnswered('Hevigheid', cData)) {
                    builder.Prompts.choice(session, "Hoe intens is de hoofdpijn?", "1: Mild|2: Aanwezig|3: Heftig|4: Intens", { listStyle: builder.ListStyle.button });
                } else {
                    next();
                }
            },
            (session, args) => {
                if (args.response != undefined) {
                    cData.Hevigheid = args.response.entity[0];
                }

                builder.Prompts.time(session, "Wanneer is de hoofdpijn begonnen?");
            },
            (session, args, next) => {

                if (!helpers.questionAnswered('Aanwezigheid', cData)) {
                    builder.Prompts.choice(session, "Met welke frequentie komt de hoofdpijn naar boven?", "Wisselend|Continu", { listStyle: builder.ListStyle.button });
                } else {
                    next();
                }
            },
            (session, args) => {
                if (args.response != undefined) {
                    cData.Aanwezigheid = args.response.entity;
                }

                session.beginDialog('AdviceDialog', cData);
            }
        ]
    }
}
