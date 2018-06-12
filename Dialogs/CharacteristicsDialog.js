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
                if (cData.NietAanwezigeKenmerken == undefined) cData.NietAanwezigeKenmerken = [];

                characteristics = helpers.getCharacteristics(possibilities, cData);

                if (characteristics.length == 0) {
                    session.send('Volgens mij heeft u last van aanstelleritus.');
                    helpers.deleteUserData(session, () => {
                        session.beginDialog('initialDialog');
                    });
                } else {
                    let msg = 'Heeft u last van ' + characteristics[0] + '?';
                    builder.Prompts.confirm(session, msg, { listStyle: builder.ListStyle.button });
                }
            },
            (session, args, next) => {
                if (args.response !== undefined) {
                    if (args.response) {
                        cData.characteristics.Kenmerken.push(characteristics[0]);
                    } else {
                        cData.NietAanwezigeKenmerken.push(characteristics[0]);
                    }
                }

                helpers.saveConversationData(session, cData, () => {
                    if  (characteristics.length !== 0 && characteristics.length >= 2) {
                        let msg = 'Heeft u last van ' + characteristics[1] + '?';
                        builder.Prompts.confirm(session, msg, { listStyle: builder.ListStyle.button });
                    } else {
                        next();
                    }
                });
            },
            (session, args, next) => {
                if (args.response !== undefined) {
                    if (args.response) {
                        cData.characteristics.Kenmerken.push(characteristics[1]);
                    } else {
                        cData.NietAanwezigeKenmerken.push(characteristics[1]);
                    }
                }

                helpers.saveConversationData(session, cData, () => {
                    session.beginDialog('ConclusionDialog', {conversationData: cData});
                });
            }
        ]
    }
}
