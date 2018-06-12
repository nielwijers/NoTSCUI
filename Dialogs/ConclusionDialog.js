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

                let conclusion = helpers.getConclusion(cData);

                if (conclusion.final) {
                    if (conclusion.variableIntensity) {
                        session.send('Het lijkt erop dat u last heeft van ' + conclusion.possibilities[0].name.toLowerCase() + '. Om een gericht advies te kunnen geven zal ik nog een aantal vragen moeten stellen.');
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
