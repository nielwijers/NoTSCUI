const builder = require('botbuilder');
const helpers = require('../helpers');

let cData;
let possibilitiesIndex = 0;
let characteristicsIndex = 0;

/**
 * ConclusionDialog checks if the final conclusion is known.
 * @param {object} intents
 */
module.exports = function (intents) {
    return {
        name: "ConclusionDialog",
        steps: [
            (session, args) => {
                if (args.posIndex) possibilitiesIndex = posIndex;

                let conclusion = helpers.getConslusion(args.conversationData);

                if (conclusion.final) {
                    if (conclusion.variableIntensity) {
                        session.send('Het lijkt erop dat u ' + conclusion.type + ' heeft. Om te een gericht advies te kunnen geven zal ik nog een aantal vragen moeten stellen.');
                        session.beginDialog('IntensityDialog');
                    } else {
                        session.beginDialog('AdviceDialog');
                    }
                } else {
                    session.beginDialog('CharacteristicsDialog', {conclusion, cData: args.conversationData});
                }
            }
        ]
    }
}
