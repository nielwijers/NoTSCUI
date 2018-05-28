const builder = require('botbuilder');
const helpers = require('../helpers');

let cData;
let possibilities;
let characteristics;

/**
 * Will ask if the user recognizes the given symptom.
 * @param {object} intents
 */
module.exports = function (intents) {
    return {
        name: "CharacteristicsDialog",
        steps: [
            (session, args, next) => {
                cData = args.cData;
                possibilities = args.conclusion.possibilities;

                if (cData.characteristics.Kenmerken == undefined) cData.characteristics.Kenmerken = [];
                if (cData.askedCharacteristics == undefined) cData.askedCharacteristics = [];

                console.log(possibilities, cData);
                characteristics = helpers.getCharacteristics(possibilities, cData);

                if (characteristics == null) {
                    next();
                }

                let msg = 'Heeft u last van ' + characteristics[0] + '?';
                builder.Prompts.confirm(session, msg);
            },
            (session, args, next) => {
                if (args.response != undefined) {
                    if (args.response) {
                        cData.characteristics.Kenmerken.push(characteristics[0]);
                    } else {
                        cData.askedCharacteristics.push(characteristics[0]);
                    }
                }

                if (characteristics != null && characteristics.length > 1) {
                    let msg = 'Heeft u last van ' + characteristics[1] + '?';
                    builder.Prompts.confirm(session, msg);
                } else {
                    next();
                }
            },
            (session, args, next) => {
                if (args.response != undefined) {
                    if (args.response) {
                        cData.characteristics.Kenmerken.push(characteristics[1]);
                    } else {
                        cData.askedCharacteristics.push(characteristics[1]);
                    }
                }

                session.beginDialog('ConclusionDialog', cData);
            }
        ]
    }
}
