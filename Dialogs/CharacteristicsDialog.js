const builder = require('botbuilder');
const helpers = require('../helpers');

let characteristics;

//TODO: remove after data from helpers
characteristics = {
    Migraine: [
        'test',
        'test2',
        'test3'
    ]
}

module.exports = function (intents) {
    return {
        name: "CharacteristicsDialog",
        steps: [
            (session, args) => {
                let conclusion = args.type;
                let msg = 'Hoeveel van de onderstaande kenmerken komen bij u voor? (cijfer tussen 0 en ' + characteristics[conclusion].length + ') \n'

                for (let i = 0; i < characteristics[conclusion].length; i++) {
                    msg += '- ' + characteristics[conclusion][i] + '\n';
                }
                builder.Prompts.number(session, msg);
            },
            (session, args, next) => {
                //TODO: update helpers with found information

                session.beginDialog('ConclusionDialog');
            }
        ]
    }
}
