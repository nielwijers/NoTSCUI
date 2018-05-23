const builder = require('botbuilder');
const helpers = require('../helpers');

let cData;

module.exports = function (intents) {
    return {
        name: "ConclusionDialog",
        steps: [
            (session, args) => {
                cData = args;

                let conclusion = helpers.getConslusion(cData);

                if (conclusion.final) {
                    if (helpers.hasVariableIntensity(conclusion.possibilities[0].name)) {
                        session.beginDialog('IntensityDialog', cData);
                    } else {
                        session.beginDialog('AdviceDialog');
                    }
                } else {
                    session.beginDialog('CharacteristicsDialog', {
                        possibilities: conclusion.possibilities,
                        cData: cData
                    });
                }
            }
        ]
    }
}
