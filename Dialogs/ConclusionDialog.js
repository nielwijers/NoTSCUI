const builder = require('botbuilder');
const helpers = require('../helpers');

let cData;

/**
 * ConclusionDialog checks if the final conclusion is known.
 * @param {object} intents
 */
module.exports = function (intents) {
    return {
        name: "ConclusionDialog",
        steps: [
            (session, args) => {
                cData = args.conversationData;

                let conclusion = helpers.getConslusion(cData);

                if (conclusion.final) {
                    if (conclusion.variableIntensity) {
                        session.send('Het lijkt erop dat u ' + conclusion.possibilities[0].name + ' heeft. Om te een gericht advies te kunnen geven zal ik nog een aantal vragen moeten stellen.');
                        session.beginDialog('IntensityDialog', cData);
                    } else {
                        session.beginDialog('AdviceDialog', cData);
                    }
                } else {
                    session.beginDialog('CharacteristicsDialog', {conclusion, cData});
                }
            }
        ]
    }
}
