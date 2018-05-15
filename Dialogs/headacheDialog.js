const builder = require('botbuilder');

module.exports = {
    intentName: "Hoofdpijn",
    dialogSteps: [
        (session,args) => {
          session.send('Dat is erg vervelend');
          console.log(args.entities);
        },
    ]
}
