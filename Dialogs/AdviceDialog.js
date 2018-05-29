const builder = require('botbuilder');
const helpers = require('../helpers');

let cData;

/**
 * Gives advice of the conclusion to the user.
 * @param {object} intents
 */
module.exports = function (intents) {
    return {
        name: "AdviceDialog",
        steps: [
            (session, args) => {
                cData = args;
                let conclusion = helpers.getConclusion(cData);
                let advice = helpers.getAdvice(cData.characteristics.type, conclusion.possibilities[0].name);

                if (helpers.questionAnswered('Hevigheid', cData)) {
                    let hevigheid = cData.characteristics.Hevigheid;
                    if (hevigheid > 2) {
                        advice = advice.Ernstig;
                    } else {
                        advice = advice.Matig;
                    }
                } else {
                    advice = advice.Matig;
                }

                session.send('Het lijkt erop dat u last heeft van ' + conclusion.possibilities[0].name + '. \n Mijn advies hiervoor is: \n ' + advice);
                builder.Prompts.confirm(session, "Wilt u opnieuw beginnen?", { listStyle: builder.ListStyle.button });
            },
            (session, args) => {
                if (args.response == undefined, !args.response) {
                    session.send('Tot ziens!');
                    helpers.deleteUserData(session, () => {
                        session.endConversation();
                    });
                }
                else {
                    helpers.deleteUserData(session, () => {
                        session.beginDialog('initialDialog');
                    });
                }
            }
        ]
    }
}
