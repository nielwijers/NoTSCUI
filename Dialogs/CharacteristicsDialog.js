const builder = require('botbuilder');
const helpers = require('../helpers');

module.exports = function (intents) {
    return {
        name: "CharacteristicsDialog",
        steps: [
            (session, args) => {
                //TODO: show a few characteristics and check if they have them yes or no

                let conclusion = args.type;
                let characteristics = helpers.getCharacteristics(conclusion);
                let msg = 'Hoeveel van de onderstaande kenmerken komen bij u voor? (cijfer tussen 0 en ' + characteristics.length + ') \n'

                for (let i = 0; i < characteristics.length; i++) {
                    msg += '- ' + characteristics[i] + '\n';
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
