const builder = require('botbuilder');
const helpers = require('../helpers');

let data;

// TODO: remove after implementing getting data via helpers
data = {
    PijnPunt: null,
    PijnSoort: null,
    Geslacht: null,
    PijnZeide: null,

}

module.exports = function (intents) {
    return {
        name: "GlobalQuestionsDialog",
        steps: [
            (session, args, next) => {
                // TODO: implement getting data via helpers
                //data = helpers.getData();

                if (data.Geslacht == null) {
                    builder.Prompts.choice(session, "Wat is uw geslacht?", "Man|Vrouw|Anders", { listStyle: builder.ListStyle.button });
                } else {
                    next();
                }
            },
            (session, args, next) => {
                if (args.response != undefined) {
                    data.Geslacht = args.response.entity;
                }

                if (data.PijnZeide == null) {
                    builder.Prompts.choice(session, "Aan welke zeide heeft u hoofdpijn?", "Links|Rechts|Allebei", { listStyle: builder.ListStyle.button });
                } else {
                    next();
                }
            },
            (session, args, next) => {
                if (args.response != undefined) {
                    data.PijnZeide = args.response.entity;
                }

                if (data.PijnPunt == null) {
                    builder.Prompts.choice(session, "Aan welke zeide heeft u hoofdpijn?", "Slaap|Voorhoofd|Achter het oor|Alle", { listStyle: builder.ListStyle.button });
                } else {
                    next();
                }
            },
            (session, args, next) => {
                if (args.response != undefined) {
                    data.PijnPunt = args.response.entity;
                }

                if (data.PijnSoort == null) {
                    builder.Prompts.choice(session, "Kunt u aangeven hoe de hoofdpijn voelt?", "Drukkend|Dof|Snijdend|Bonzend|Kloppend|Zeurend", { listStyle: builder.ListStyle.button });
                } else {
                    next();
                }
            },
            (session, args, next) => {
                if (args.response != undefined) {
                    data.PijnSoort = args.response.entity;
                }

                session.send(data);
                //TODO: update helpers with data

                session.beginDialog('ConclusionDialog');
            },
            (session, args) => {
                session.endDialog();
            }
        ]
    }
}
