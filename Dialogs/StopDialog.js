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
                    // TODO: fix this mess so it starts the previous dialog over
                    let previousDialog = session.dialogStack()[0].id.split(':')[1];
                    session.pruneDialogStack(session.dialogStack());
                    session.beginDialog(previousDialog);
                } else {
                    session.endDialog();
                }
            }
        ]
    }
}
