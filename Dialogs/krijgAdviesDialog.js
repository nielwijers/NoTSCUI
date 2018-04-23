const builder = require('botbuilder');

module.exports = {
    intentName: "KrijgAdvies",
    dialogSteps: [
        (session,args) => {
            var pijnpunt = builder.EntityRecognizer.findEntity(args.entities,'PijnPunt');
            if (pijnpunt){ 
              builder.Prompts.text(session, "Neem een Aspirine");
            } else {
                builder.Prompts.text(session, "Ik kan je hierover geen advies geven.");
            }
        },
    ]
}
