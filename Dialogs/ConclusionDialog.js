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
                    if (conclusion.variableIntensity) {
                        session.send('Het lijkt erop dat u ' + conclusion.type + ' heeft.');
                        session.beginDialog('IntensityDialog');
                    } else {
                        session.beginDialog('AdviceDialog');
                    }
                } else {
                    session.send('Het is nog niet helemaal duidelijk, al lijkt het in de richting van ' + conclusion.type + ' te gaan.');
                    session.beginDialog('CharacteristicsDialog', conclusion);
                }
            }
        ]
    }
}
