const builder = require('botbuilder');
const helpers = require('../helpers');

let data;
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
                data = args;

                if (data.cData.characteristics.Kenmerken == undefined) data.cData.characteristics.Kenmerken = [];
                if (data.cData.askedCharacteristics == undefined) data.cData.askedCharacteristics = [];

                characteristics = helpers.getCharacteristics(data.possibilities, data.cData);

                if (characteristics == null) {
                    next();
                }

                let msg = 'Heeft u last van ' + characteristics[0] + '?';
                builder.Prompts.confirm(session, msg);
            },
            (session, args, next) => {
                if (args.response != undefined) {
                    if (args.response) {
                        data.cData.characteristics.Kenmerken.push(characteristics[0]);
                    } else {
                        data.cData.askedCharacteristics.push(characteristics[0]);
                    }
                }

                if (characteristics == null || characteristics.length > 1) {
                    let msg = 'Heeft u last van ' + characteristics[1] + '?';
                    builder.Prompts.confirm(session, msg);
                } else {
                    next();
                }
            },
            (session, args, next) => {
                if (args.response != undefined) {
                    if (args.response) {
                        data.cData.characteristics.Kenmerken.push(characteristics[1]);
                    } else {
                        data.cData.askedCharacteristics.push(characteristics[1]);
                    }
                }

                session.beginDialog('ConclusionDialog', data.cData);
            }
        ]
    }
}
