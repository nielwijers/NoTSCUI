const builder = require('botbuilder');
const helpers = require('../helpers');

let data;

//TODO: remove after data is gotten by helpers
data = {
    PijnIntensiteit: null,
    Opkomst: null,
    Frequentie: null
}

module.exports = function (intents) {
    return {
        name: "IntensityDialog",
        steps: [
            (session, args, next) => {
                //TODO: get information from helpers

                if (data.PijnIntensiteit == null) {
                    builder.Prompts.choice(session, "Hoe intens is de hoofdpijn?", "Mild|Aanwezig|Heftig|Intens", { listStyle: builder.ListStyle.button });
                } else {
                    next();
                }
            },
            (session, args, next) => {
                if (args.response != undefined) {
                    data.PijnIntensiteit = args.response.entity;
                }

                if (data.Opkomst == null) {
                    builder.Prompts.time(session, "Wanneer is de hoofdpijn begonnen?");
                } else {
                    next();
                }
            },
            (session, args, next) => {
                if (args.response != undefined) {
                    data.Opkomst = args.response.entity;
                }

                if (data.Frequentie == null) {
                    builder.Prompts.choice(session, "Met welke frequentie komt de hoofdpijn naar boven?", "Wisselend|Continu", { listStyle: builder.ListStyle.button });
                } else {
                    next();
                }
            },
            (session, args) => {
                if (args.response != undefined) {
                    data.Frequentie = args.response.entity;
                }

                //TODO: send data to helpers

                session.beginDialog('AdviceDialog');
            }
        ]
    }
}
