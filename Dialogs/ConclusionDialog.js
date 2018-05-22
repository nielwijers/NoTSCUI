const builder = require('botbuilder');
const helpers = require('../helpers');

let conclusion;

//TODO: remove after helpers
//Ik ga er vanuit dat altijd een conclusie wordt gegeven, ook al is die niet final (aka nooit null)
conclusion = { type: 'Migraine', final: true, intense: true };

module.exports = function (intents) {
    return {
        name: "ConclusionDialog",
        steps: [
            (session, args) => {
                //TODO: get conlusion from helpers
                //let conlusion = helpers.getConclusion();

                if (conclusion.final) {
                    if (conclusion.intense) {
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
