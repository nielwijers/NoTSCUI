const builder = require('botbuilder');
const helpers = require('../helpers');

module.exports = function (intents) {
    return {
        name: "HelpDialog",
        steps: [
            (session, args) => {
                session.send('HELP: \n Ik assisteer u met het achterhalen van het soort hoofdpijn dat u waarschijnlijk zal hebben. Wanneer u mijn vragen simpelweg beantwoord kan ik zo een conclusie trekken en advies geven!');
                session.endDialog();
            }
        ]
    }
}
