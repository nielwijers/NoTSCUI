const builder = require('botbuilder');
const helpers = require('../helpers');

module.exports = function (intents) {
    return {
        name: "StopDialog",
        steps: [
            (session, args) => {
                builder.Prompts.confirm(session, "Wilt u opnieuw beginnen?", { listStyle: builder.ListStyle.button });
            },
            (session, args, next) => {
                if (args.response) {
                    helpers.deleteUserData(session, () => {
                        session.endConversation();
                        session.beginDialog('initialDialog');
                    });
                } else {
                    session.endDialog();
                }
            }
        ]
    }
}
