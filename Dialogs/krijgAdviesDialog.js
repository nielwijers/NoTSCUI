const builder = require('botbuilder');

module.exports = {
    intentName: "KrijgAdvies",
    dialogSteps: [
        (session,args) => {
            var pijnpunt = builder.EntityRecognizer.findEntity(args.entities,'PijnPunt');
            if (pijnpunt){ 
              builder.Prompts.text(session, "Neem een Asperine");
            }
        },
    ]
}
