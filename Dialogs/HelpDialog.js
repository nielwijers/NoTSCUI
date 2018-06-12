const builder = require('botbuilder');
const helpers = require('../helpers');

/**
 * Gives the user an explanation about how this bot works.
 * @param {object} intents
 */
module.exports = function (intents) {
    return {
        name: "HelpDialog",
        steps: [
            (session, args) => {
                session.send('Ik assisteer u met het achterhalen van de klachten waar u mee zit. Wanneer u mijn vragen beantwoord kan ik zo een conclusie trekken en advies geven./n Wanneer knoppen worden weergegeven onder een vraag, kunt u hierop klikken om antwoord te geven. Wanneer geen knoppen zichtbaar zijn, moet u gebruik maken van het toetsenbord van uw apparaat.');
                session.endDialog();
            }
        ]
    }
}
